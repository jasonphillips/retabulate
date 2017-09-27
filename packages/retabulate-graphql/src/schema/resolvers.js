import _ from 'lodash';
import gauss from 'gauss';
import DataCollection from 'data-collection';

// gauss library has terrible import strategy on client
const Vector = typeof(window!=='undefined') ? window.gauss.Vector : gauss.Vector;
const concat = (arr, val) => val ? arr.concat([val]) : arr;
// distribute filter args if array
const filterAny = (collection, filters) => Object.keys(filters).reduce((filtered, key) => 
  filters[key].map 
    ? filtered.filter.apply(filtered, filters[key].map(v => ({[key]:v})))
    : filtered.filter({[key]: filters[key]})
, collection)

const generateLeaf = (data, context) => {
  const {_aggIndex, _renderIds, _query, _exclude, _variable, _value, _agg, _diff, _over, _fmt, _grid, _axis, _detransposes} = data;
  context.tabulate.iterator++;
  const id = ('00000000' + context.tabulate.iterator).slice(-8) + 't';
  if (!_grid[_axis]) _grid[_axis] = [];

  _grid[_axis].push({
      id,
      index: _aggIndex,
      query: {..._query},
      exclude: _exclude,
      detransposes: _detransposes,
      variable: _variable,
      agg: _agg,
      diff: _diff,
      over: _over,
      fmt: _fmt,
      value: _value,
      renderIds: _renderIds
  })
  return id;
}

const applyAggregations = (aggs, diff, diffOver) => {
  // diff option: calculate each, return difference, % difference
  if (diff) return (series, key, over) => {
    const b = aggregations[aggs](series, key, over);
    const a = aggregations[aggs](diff, key, diffOver);

    return {
      diff: b - a,
      diff_pct: (b - a) / a,
    }
  }
  // single method
  if (!aggs.map) return aggregations[aggs];
  // mutliple: return as key => value
  return (series, variable, over) => aggs.reduce((combined, agg) => 
    ({...combined, [agg]: aggregations[agg](series, variable, over)})
  , {});
}

const aggregations = {
  distribution: (series, key) => new Vector(series.exclude({[key]:''}).values(key)).distribution(),
  distributionRatio: (series, key) => new Vector(series.exclude({[key]:''}).values(key)).distribution('relative'),
  n: (series, key) => series.exclude({[key]:''}).count() || 0,
  pctn: (series, key, over) => series.exclude({[key]:''}).count() / over.exclude({[key]:''}).count() * 100,
  mean: (series, key) => series.count() ? series.exclude({[key]:''}).avg(key) : undefined,
  median: (series, key) => new Vector(series.values(key)).median(),
  mode: (series, key) => series.mode(key),
  stdev: (series, key) => new Vector(series.exclude({[key]:''}).values(key)).stdev(),
  min: (series, key) => series.exclude({[key]:''}).min(key),
  max: (series, key) => series.max(key),
  range: (series) => series.range(),
  sum: (series, key) => series.sum(key) || 0,
}

const resolvers = {
  Query: {
    table (root, {set, where}, context) {
      return new Promise((resolve, reject) => {
        context.getDataset(set).then((data) => {

          if (!data) {
            throw new Error(`dataset ${set} not found`);
          }

          context.tabulate = {iterator: 0};
          let collection = new DataCollection(data).query();

          if (where) collection = filterAny(
            collection, where.reduce((all, {key, values}) => ({...all, [key]: values}), {})
          );

          resolve({
            _rows: collection, 
            _query:{}, _grid:{}, _renderIds:[], _transposes:{}, _detransposes:{}, _exclude:[], _aggIndex:0});
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
          _.map(_.sortBy(_grid.y, 'id'), (y) => ({
            ...y,
            _grid,
            _rows: filterAny(_rows, y.query),
            _all: _rows
          }))
        )
      })
    ),
  },
  Axis: {
    label: ({key}) => key,
    length: ({_rows}) => _rows.count(),
    classes: (data, {key, all, total, orderBy, renderId, mapping, ordering}) => {
      data._aggIndex++;

      // total never groups again, just descends
      if (data._isTotal) {
        return [{...data, key: '_', _aggIndex:data._aggIndex, _isTotal: true}];
      }

      let dataKey = data._detransposes[key] || key;
      let value;
      const cumulative = mapping.reduce((all,next) => next.values ? all.concat(next.values) : all, []);

      if (mapping) {
        value = mapping.map(({label, values}) => {
          const rows = values
            // filter 
            ? data._rows.filter.apply(data._rows, values.map(v => ({[dataKey]:v})))
            // unfiltered remaining rows
            : cumulative.reduce((remaining, filter) => remaining.exclude({[dataKey]:filter}), data._rows);

          return {
            ...data,
            key: label,
            _rows: rows,
            _aggIndex: data._aggIndex,
            _query: values ? {...data._query, [dataKey]: values} : data.query,
            _exclude: values ? data._exclude : [...data._exclude, ...cumulative.map(v => ({[dataKey]:v}))],
            _renderIds: concat(data._renderIds, renderId),
            renderId
          }
        })
      } else {
        const valuesSet = ordering ? ordering : data._rows.distinct(dataKey);
        value = valuesSet.map((groupValue) => ({
          ...data,
          key: groupValue,
          _rows: data._rows.filter({[dataKey]:groupValue}),
          _aggIndex: data._aggIndex,
          _query: {...data._query, [dataKey]:groupValue},
          _renderIds: concat(data._renderIds, renderId),
          renderId
        }))
      }

      if (orderBy) value = _.sortBy(value, (v) => v._rows.first()[orderBy]);

      if (all || total) value.push(
        {...data, key:all, _aggIndex:data._aggIndex, renderIds: concat(data._renderIds, renderId), renderId}
      )

      return value;
    },
    transpose: (data, {keys, asKey, renderId}) => {
      data._aggIndex++;

      return keys.map(inKey => ({
        ...data, 
        key: inKey,
        _rows:data._rows,
        _transposes:{...data._transposes, [inKey]:asKey},
        _detransposes: {...data._detransposes, [asKey]:inKey},
        _renderIds: concat(data._renderIds, renderId),
        renderId
      }));
    },
    all: (data, {label, renderId}) => ({
      ...data, 
      label, key:label, 
      renderId, _renderIds: concat(data._renderIds, renderId),
      _aggIndex: data._aggIndex + 1,
    }),
    renderIds: ({_renderIds}) => _renderIds,
    node: (data) => data,
    leaf: (data, args, context) => generateLeaf(data, context),
    variable: (data, {key, keys, renderId}) => ({
      ...data, _variable: keys || key, key, _renderIds: concat(data._renderIds, renderId
      )}),
  },
  Node: {
    leaf: (data, args, context) => generateLeaf(data, context),
    node: (data) => data,
  },
  Variable: {
    value: (data, {value, values, renderId}) => ({
      ...data, _value: value || values, _renderIds: concat(data._renderIds, renderId)
    }),
    aggregation: (data, {method, methods, diff, over, renderId}) => ({
      ...data, _agg: method || methods, _over: over, _diff: diff, method, _renderIds: concat(data._renderIds, renderId)
    }),
    statistic: (data, {method, methods, diff, over, renderId}) => ({
      ...data, _agg: method || methods, _over: over, _diff: diff, method, _renderIds: concat(data._renderIds, renderId)
    }),
    renderIds: ({_renderIds}) => _renderIds,
    leaf: (data, args, context) => generateLeaf(data, context),
    node: (data) => data,
  },
  Aggregation: {
    renderIds: ({_renderIds}) => _renderIds,
    leaf: (data, args, context) => generateLeaf(data, context),
    node: (data) => data,
  },
  Row: {
    cells: (y, args) => _.map(y._grid.x, (x) => {
      const detransposes = {...x.detransposes, ...y.detransposes};
      const variable = detransposes[y.variable] || y.variable || detransposes[x.variable] || x.variable || null;
      const value = y.value || x.value || null;
      const exclude = (y.exclude.length || x.exclude.length) ? [...y.exclude, ...x.exclude] : null;

      let query = {...y.query, ...x.query};
      let cellFilter = x.query;
      let diffRows;
      let diffOver;

      if (variable && value!==null) {
        cellFilter = {...cellFilter, [variable]: value};
        query = {...query, [variable]: value};
      }

      const agg = y.agg || x.agg || 'n';
      const over = detransposes[y.over] || y.over || detransposes[x.over] || x.over || null;
      const overQuery = over ? _.omit(query, over) : null;

      const rows = filterAny(y._rows, cellFilter);

      if (y.diff || x.diff) {
        const diff = x.diff || y.diff;
        diffRows = filterAny(y._all, _.omit(query, diff.key));
        diffOver = filterAny(y._all, _.omit(query, [diff.key, over]));

        if (diff.values) {
          diffRows = filterAny(diffRows, {[diff.key]: diff.values});
          diffOver = filterAny(diffOver, {[diff.key]: diff.values});
        }
      }
      
      return {
        query: query,
        variable,
        agg: agg,
        detransposes,
        colID: x.id,
        rowID: y.id,
        rows: exclude ? exclude.reduce((r,e) => r.exclude(e), rows) : rows,
        over: over ? filterAny(y._all, overQuery) : null,
        diff: diffRows,
        diffOver: diffOver,
        fmt: y.fmt || x.fmt || '',
        renderIds: x.renderIds.concat(y.renderIds),
      }
    }),
  },
  Cell: {
    value: ({query, detransposes, variable, agg, diff, diffOver, over, rows, fmt}, {missing}) => {
      return JSON.stringify(applyAggregations(agg, diff, diffOver)(rows, detransposes[variable] || variable, over));
    },
    queries: ({query}) => _.map(_.keys(query), (key) => ({key, value: query[key]})),
  },
  QueryCondition: {},
}

export default resolvers;
