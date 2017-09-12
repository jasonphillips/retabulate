import _ from 'lodash';
import gauss from 'gauss';
import DataCollection from 'data-collection';

// gauss library has terrible import strategy on client
const Vector = typeof(window!=='undefined') ? window.gauss.Vector : gauss.Vector;
const concat = (arr, val) => val ? arr.concat([val]) : arr;

const generateLeaf = (data, context) => {
  const {_aggIndex, _renderIds, _query, _variable, _agg, _over, _fmt, _grid, _axis, _detransposes} = data;
  context.tabulate.iterator++;
  const id = `t${context.tabulate.iterator}`;
  if (!_grid[_axis]) _grid[_axis] = [];

  _grid[_axis].push({
      id,
      index: _aggIndex,
      query: {..._query},
      detransposes: _detransposes,
      variable: _variable,
      agg: _agg,
      over: _over,
      fmt: _fmt,
      renderIds: _renderIds
  })
  return id;
}

const makeSeries = (query, variable, rows) =>
  rows.filter(query).values(variable)

const applyAggregation = {
  distribution: (series, key) => new Vector(series.values(key)).distribution(),
  distributionRatio: (series, key) => new Vector(series.values(key)).distribution('relative'),
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

const resolvers = {
  Query: {
    table (root, {set, where}, context) {
      return new Promise((resolve, reject) => {
        context.getDataset(set).then((data) => {

          if (!data) {
            throw new Error(`dataset ${set} not found`);
          }

          context.tabulate = {iterator: 0};
          const collection = new DataCollection(data).query();

          if (where) {
            const filter = {}
            _.forEach(where, ({key, value}) => { filter[key] = value })
            return  {
              _rows:collection.filter(filter), 
              _query:{},
              _transposes:{},
              _detransposes:{},
              _grid:{}, 
              _aggIndex:0
            }
          }

          resolve({_rows:collection, _query:{}, _grid:{}, _renderIds:[], _transposes:{}, _detransposes:{}, _aggIndex:0});
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
    classes: (data, {key, all, total, orderBy, renderId}) => {
      data._aggIndex++;

      // total never groups again, just descends
      if (data._isTotal) {
        return [{...data, key: '_', _aggIndex:data._aggIndex, _isTotal: true}];
      }

      let dataKey = data._detransposes[key] || key;

      let value = data._rows.distinct(dataKey).map((groupValue) => ({
        ...data,
        key: groupValue,
        _rows:data._rows.filter({[dataKey]:groupValue}),
        _aggIndex:data._aggIndex,
        _query:{...data._query, [dataKey]:groupValue},
        _renderIds: concat(data._renderIds, renderId),
        renderId
      }))

      if (orderBy) value = _.sortBy(value, (v) => v._rows.first()[orderBy]);

      if (all) value.push(
        {...data, key:all, _aggIndex:data._aggIndex, renderIds: concat(data._renderIds, renderId), renderId}
      )

      if (total) value.push(
        {...data, key:total, _aggIndex:data._aggIndex, _isTotal: total}
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
    all: (data, {label}) => { data._aggIndex++; return {...data, label, key:label}},
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
    aggregation: (data, {method, over, renderId}) => ({
      ...data, _agg:method, _over:over, method, _renderIds: concat(data._renderIds, renderId)
    }),
    statistic: (data, {method, over, renderId}) => ({
      ...data, _agg:method, _over:over, method, _renderIds: concat(data._renderIds, renderId)
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
      const query = {...y.query, ...x.query};
      const agg = y.agg || x.agg || 'n';
      const over = y.over || x.over || null;
      const overQuery = over ? _.omit(query, over) : null;
      const detransposes = {...x.detransposes, ...y.detransposes};

      return {
        query: query,
        variable: detransposes[y.variable] || y.variable || detransposes[x.variable] || x.variable || null,
        agg: agg,
        detransposes,
        colID: x.id,
        rowID: y.id,
        rows: y._rows.filter(x.query),
        over: over ? y._all.filter(overQuery).count() : null,
        fmt: y.fmt || x.fmt || '',
        renderIds: x.renderIds.concat(y.renderIds),
      }
    }),
  },
  Cell: {
    value: ({query, detransposes, variable, agg, over, rows, fmt}, {missing}) => {
      return JSON.stringify(applyAggregation[agg](rows, detransposes[variable] || variable, over));
    },
    queries: ({query}) => _.map(_.keys(query), (key) => ({key, value: query[key]})),
  },
  QueryCondition: {},
}

export default resolvers;
