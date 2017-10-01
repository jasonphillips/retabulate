import _ from 'lodash';
const d3A = require('d3-array');
const d3C = require('d3-collection');

const groupBy = (rows, col) => d3C.nest()
  .key(row => row[col])
  .entries(rows)
  .reduce((all, {key, value}) => Object.assign(all, {[key]: value}), {});

const colValues = (rows, col, excludeEmpty) => rows
  .map(r => r[col])
  .filter(r => excludeEmpty ? (r!=='' && r!==false && r!==null) : r);

const distribution = (data) => d3C.nest()
  .key(d => d)
  .rollup(v => v.length)
  .entries(data)
  .reduce((all, {key, value}) => Object.assign(all, {[key]: value}), {});

const distributionRatio = (data) => d3C.nest()
  .key(d => d)
  .rollup(v => v.length / data.length)
  .entries(data)
  .reduce((all, {key, value}) => Object.assign(all, {[key]: value}), {});

const concat = (arr, val) => val ? arr.concat([val]) : arr;

const addFilters = (objA, key, values) => ({
  ...objA,
  [key]: objA[key] 
    ? (objA[key].map ? objA[key] : [objA[key]]).concat(values)
    : values
});

const filterAny = (collection, filters, invert) => collection.filter(row => {
  const test = Object.keys(filters).reduce((passes,key) => {
    if (!passes) return false;

    return filters[key].map 
      ? filters[key].indexOf(row[key]) > -1 
      : row[key]===filters[key];
  }, true);

  return invert ? !test : test;
});

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
  // single method
  if (!aggs.map) return aggregations[aggs];
  // mutliple: return as key => value
  return (series, variable, over) => aggs.reduce((combined, agg) => 
    ({...combined, [agg]: aggregations[agg](series, variable, over)})
  , {});
}

const aggregations = {
  distribution: (series, key) => distribution(colValues(series, key, true)),
  distributionRatio: (series, key) => distributionRatio(colValues(series, key, true)),
  n: (series, key) => colValues(series, key, true).length || 0,
  pctn: (series, key, over) => colValues(series, key, true).length / colValues(over, key, true).length * 100,
  mean: (series, key) => series.length ? d3A.mean(colValues(series, key, true)) : undefined,
  median: (series, key) => d3A.median(series.values(key)),
  mode: (series, key) => d3A.mode(colValues(series, key)),
  stdev: (series, key) => d3A.deviation(series.values(key)),
  min: (series, key) => d3A.min(colValues(series, key)),
  max: (series, key) => d3A.max(colValues(series, key)),
  range: (series) => d3A.range(colValues(series, key)),
  sum: (series, key) => d3A.sum(colValues(series, key)) || 0,
}

const resolvers = {
  Query: {
    table (root, {set, where}, context) {
      return new Promise((resolve, reject) => {
        context.getDataset(set).then((collection) => {

          if (!collection) {
            throw new Error(`dataset ${set} not found`);
          }

          context.tabulate = {iterator: 0};
          // let collection = new DataCollection(data).query();

          if (where) collection = filterAny(
            collection, where.reduce((all, {key, values}) => ({...all, [key]: values}), {})
          );

          resolve({
            _rows: collection, 
            _query:{}, _grid:{}, _renderIds:[], _transposes:{}, _detransposes:{}, _exclude:{}, _aggIndex:0});
        });
      });
    },
  },
  Table: {
    length: ({_rows}) => _rows.length,
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
    length: ({_rows}) => _rows.length,
    classes: (data, {key, all, total, orderBy, renderId, mapping, ordering}) => {
      data._aggIndex++;
      // total never groups again, just descends
      if (data._isTotal) {
        return [{...data, key: '_', _aggIndex:data._aggIndex, _isTotal: true}];
      }

      const dataKey = data._detransposes[key] || key;
      const groups = groupBy(data._rows, dataKey);
      let value;

      if (mapping) {
        // build list of possible values, to track umapped / remainder
        const allGroups = Object.keys(groups).reduce((all,k) => ({...all, [k]:true}), {});
        // iterate over mappings
        value = mapping.map(({label, values}) => {

          const basics = {
            ...data,
            key: label,
            _aggIndex: data._aggIndex,
            _renderIds: concat(data._renderIds, renderId),
            renderId
          };

          if (values) {
            const rows = values.reduce((combined, val) => {
              allGroups[val] = false;
              return combined.concat(groups[val]);
            }, []);

            return {
              ...basics, 
              _rows: rows, 
              _query: {...data._query, [dataKey]: values}
            };
          } 

          // if no values, assume "group all remaining"
          const remainingValues = Object.keys(allGroups).filter(k => allGroups[k]);
          const coveredValues = Object.keys(allGroups).filter(k => !allGroups[k]);

          return {
            ...basics, 
            _rows: remainingValues ? remainingValues.reduce((all,v) => all.concat(groups[v]), []): [],
            _exclude: addFilters(data._exclude, dataKey, coveredValues),
          };
        });

      } else {
        // no explicit mapping passed, group all, unless 'ordering' list passed
        const valuesSet = ordering ? ordering : Object.keys(groups);

        value = valuesSet.map((groupValue) => ({
          ...data,
          key: groupValue,
          _rows: groups[groupValue],
          _aggIndex: data._aggIndex,
          _query: {...data._query, [dataKey]:groupValue},
          _renderIds: concat(data._renderIds, renderId),
          renderId
        }))
      }

      // apply optional ordering by another column
      if (orderBy) value = _.sortBy(value, (v) => v._rows[0][orderBy]);

      // add in the total group if all / total requested
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
    all: (data, {label, renderId}) => ({
      ...data, 
      renderId,
      label,
      _renderIds: concat(data._renderIds, renderId),
      _aggIndex: data._aggIndex + 1,
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
      const exclude = {...x.exclude, ...y.exclude};

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
        rows: Object.keys(exclude).length ? filterAny(rows, exclude, true) : rows,
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
      return JSON.stringify(diff
        // if diff: calculate this group, diff group
        ? {
            group: applyAggregations(agg)(rows, detransposes[variable] || variable, over),
            diff: applyAggregations(agg)(diff, detransposes[variable] || variable, diffOver)
          }
        : applyAggregations(agg, diff, diffOver)(rows, detransposes[variable] || variable, over)
      );
    },
    queries: ({query}) => _.map(_.keys(query), (key) => ({key, value: query[key]})),
  },
  QueryCondition: {},
}

export default resolvers;
