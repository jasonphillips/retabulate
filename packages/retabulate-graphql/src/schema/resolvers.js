import _ from 'lodash';
import gauss from 'gauss';
import DataCollection from 'data-collection';
import crypto from 'crypto';

// gauss library has terrible import strategy on client
const Vector = typeof(window!=='undefined') ? window.gauss.Vector : gauss.Vector;

const md5 = (val) => {
   const c= crypto.createHash('md5')
   c.update(val)
   return c.digest('hex')
}

const generateLeaf = ({_aggIndex, _query, _variable, _agg, _over, _fmt, _grid, _axis}) => {
  const id = md5(JSON.stringify(_query) + _variable + _agg);
  if (!_grid[_axis]) _grid[_axis] = [];
  _grid[_axis].push({
      id,
      index: _aggIndex,
      query: {..._query},
      variable: _variable,
      agg: _agg,
      over: _over,
      fmt: _fmt
  })
  return id;
}

const makeSeries = (query, variable, rows) =>
  rows.filter(query).values(variable)

const applyAggregation = {
  n: (series, key) => series.count() || 0,
  pctn: (series, key, over) => series.count() / over * 100,
  mean: (series, key) => series.count() ? series.exclude({[key]:''}).avg(key) : undefined,
  median: (series, key) => new Vector(series.values(key)).median(),
  mode: (series, key) => series.mode(key),
  stdev: (series, key) => new Vector(series.exclude({[key]:''}).values(key)).stdev(),
  min: (series, key) => series.exclude({[key]:''}).min(key),
  max: (series, key) => series.max(key),
  range: (series) => series.range(),
  sum: (series, key) => series.sum(key) || 0,
}

const applyFormat = (fmt, missing) => {
  const undefCheck = (n) => (n===undefined ? missing : false)
  const SASparts = fmt.match(/^([A-Z]+)?(\d+)\.(\d*)$/);
  // SAS-like {precision}.{fixed}
  if (SASparts) {
    const prefix = SASparts[1];
    const precision = parseInt(SASparts[2]);
    const fixed = parseInt(SASparts[3] || '0');

    let applyPrefix = (out) => out;
    if (prefix=='COMMA') applyPrefix = (out) => parseFloat(out).toLocaleString();
    if (prefix=='DOLLAR') applyPrefix = (out) => '$'+parseFloat(out).toLocaleString();

    if (!fixed) {
      return (n) => undefCheck(n) || applyPrefix(parseInt(n.toPrecision(precision)).toString());
    }
    return (n) => (undefCheck(n) || 
        applyPrefix(parseFloat(n.toPrecision(precision-1)).toFixed(fixed))
    );
  }
  // commas
  if (fmt==='comma') return (n) => undefCheck(n) || n.toLocaleString()
  // precision
  if (fmt.slice(0,10)==='precision|') {
    return (n) => undefCheck(n) || n.toPrecision(parseInt(fmt.slice(10)))
  }
  // fixed
  if (fmt.slice(0,6)==='fixed|') {
    return (n) => undefCheck(n) || n.toFixed(parseInt(fmt.slice(6)))
  }
  // default non-format
  return (n) => undefCheck(n) || n;
}

const resolvers = {
  Query: {
    table (root, {set, where}, context) {
      return new Promise((resolve, reject) => {
        context.getDataset(set).then((data) => {

          if (!data) {
            throw new Error(`dataset ${set} not found`);
          }

          const collection = new DataCollection(data).query();

          if (where) {
            const filter = {}
            _.forEach(where, ({key, value}) => { filter[key] = value })
            return  {_rows:collection.filter(filter), _query:{}, _grid:{}, _aggIndex:0}
          }

          resolve({_rows:collection, _query:{}, _grid:{}, _aggIndex:0});
        });
      });
    },
  },
  Table: {
    length: ({_rows}) => _rows.count(),
    top: (data, args) => ({...data, key:null, _axis:'x'}),
    left: (data, args) => ({...data, key:null, _axis:'y'}),
    // after delay of other resolvers, process cells grid
    rows: ({_rows, _grid}) => new Promise(
      (resolve, rej) => process.nextTick(() => {
        resolve(
          _.map(_.sortBy(_grid.y, 'index'), (y) => ({
            ...y,
            _grid,
            _rows: _rows.filter(y.query),
            _all: _rows
          }))
        )
      })
    ),
  },
  Axis: {
    label: ({key}) => key,
    length: ({_rows}) => _rows.count(),
    classes: (data, {key, all, total, orderBy}) => {
      data._aggIndex++;

      // total never groups again, just descends
      if (data._isTotal) {
        return [{...data, key: '_', _aggIndex:data._aggIndex, _isTotal: true}];
      }

      let value = data._rows.distinct(key).map((groupValue) => ({
        ...data,
        key: groupValue,
        _rows:data._rows.filter({[key]:groupValue}),
        _aggIndex:data._aggIndex,
        _query:{...data._query, [key]:groupValue}
      }))

      if (orderBy) value = _.sortBy(value, (v) => v._rows.first()[orderBy]);

      if (all) value.push(
        {...data, key:all, _aggIndex:data._aggIndex}
      )

      if (total) value.push(
        {...data, key:total, _aggIndex:data._aggIndex, _isTotal: total}
      )

      return value;
    },
    all: (data, {label}) => { data._aggIndex++; return {...data, label, key:label}},
    node: (data) => data,
    leaf: (data) => generateLeaf(data),
    variable: (data, {key}) => ({...data, _variable:key, key}),
  },
  Node: {
    leaf: (data) => generateLeaf(data),
    node: (data) => data,
  },
  Variable: {
    aggregation: (data, {method, over, format}) => ({...data, _agg:method, _over:over, _fmt:format, method}),
    leaf: (data) => generateLeaf(data),
    node: (data) => data,
  },
  Aggregation: {
    leaf: (data) => generateLeaf(data),
    node: (data) => data,
  },
  Row: {
    cells: (y, args) => _.map(y._grid.x, (x) => {
      const query = {...y.query, ...x.query};
      const agg = y.agg || x.agg || 'n';
      const over = y.over || x.over || null;
      const overQuery = over ? _.omit(query, over) : null;

      return {
        query: query,
        variable: y.variable || x.variable || null,
        agg: agg,
        colID: x.id,
        rowID: y.id,
        rows: y._rows.filter(x.query),
        over: over ? y._all.filter(overQuery).count() : null,
        fmt: y.fmt || x.fmt || '',
      }
    }),
  },
  Cell: {
    value: ({query, variable, agg, over, rows, fmt}, {missing}) => {
      const aggregated = applyAggregation[agg](rows, variable, over);
      return applyFormat(fmt, missing || '.')(aggregated);
    },
    queries: ({query}) => _.map(_.keys(query), (key) => ({key, value: query[key]})),
  },
  QueryCondition: {},
}

export default resolvers;
