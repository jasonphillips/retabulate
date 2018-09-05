'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const d3A = require('d3-array');
const d3C = require('d3-collection');

// memoized, chainable container for descending into data by groups
class CollectionMap {
    constructor(data) {
        this.data = data || [];
        this.columnFlags = {};
        this.length = this.data.length;
        if (!this._groups) this._groups = {};
    }
    descend(col, flags) {
        if (this._groups[col]) return this._groups[col];

        // keep the flags for downstream use
        if (flags) this.columnFlags[col] = flags;

        const groups = groupBy(this.data, col, flags || this.columnFlags[col]);
        const groupKeys = Object.keys(groups);
        const memo = {};

        this._groups[col] = {
            keys: keys => {
                if (!keys) return groupKeys;
                const memoKey = keys.map ? keys.sort().join('||') : keys;
                if (!memo[memoKey]) {
                    const rows = keys.map ? keys.reduce((rows, key) => groups.hasOwnProperty(key) ? rows.concat(groups[key]) : rows, []) : groups[keys];

                    memo[memoKey] = new CollectionMap(rows);
                }
                return memo[memoKey];
            }
        };

        return this._groups[col];
    }
    filterAny(filters) {
        if (!Object.keys(filters).length) return this;

        const rows = this.data;
        const remaining = Object.assign({}, filters);
        let useFilter;

        for (let filter of Object.keys(filters)) {
            if (this._groups[filter]) {
                useFilter = filter;
                break;
            }
        }

        if (!useFilter) useFilter = Object.keys(filters)[0];

        const applied = this.descend(useFilter).keys(filters[useFilter]);
        delete remaining[useFilter];

        if (!Object.keys(remaining).length) return new CollectionMap(applied.data);
        return applied.filterAny(remaining);
    }
}

exports.CollectionMap = CollectionMap;
const groupBy = exports.groupBy = (rows, col, flags) => flags && flags.delimiter ? d3C.nest().key(row => row[`_${col}`]).object(rows.reduce((all, r) => r[col] ? all.concat(r[col] && r[col].split ? r[col].split(flags.delimiter).map(val => Object.assign({}, r, { [`_${col}`]: val })) : []) : all, [])) : d3C.nest().key(row => row[col]).object(rows);

const colValues = exports.colValues = (rows, col, excludeEmpty) => rows.map(r => r[col]).filter(r => excludeEmpty ? r !== '' && r !== false && r !== null && typeof r !== 'undefined' : r);

const distribution = exports.distribution = data => d3C.nest().key(d => d).rollup(v => v.length).object(data);

const distributionRatio = exports.distributionRatio = data => d3C.nest().key(d => d).rollup(v => v.length / data.length).object(data);

const concat = exports.concat = (arr, val) => val ? arr.concat([val]) : arr;

const omit = exports.omit = (obj, omitProps) => Object.keys(obj).filter(key => omitProps.indexOf(key) === -1).reduce((returnObj, key) => Object.assign({}, returnObj, {
    [key]: obj[key]
}), {});

const addFilters = exports.addFilters = (objA, key, values) => Object.assign({}, objA, {
    [key]: objA[key] ? (objA[key].map ? objA[key] : [objA[key]]).concat(values) : values
});

const generateLeaf = exports.generateLeaf = (data, context) => {
    const {
        _aggIndex,
        _renderIds,
        _query,
        _variable,
        _value,
        _agg,
        _diff,
        _over,
        _fmt,
        _grid,
        _axis,
        _detransposes,
        _redacted
    } = data;
    context.tabulate.iterator++;

    const id = ('00000000' + context.tabulate.iterator).slice(-8) + 't';
    if (!_grid[_axis]) _grid[_axis] = [];

    _grid[_axis].push({
        id,
        index: _aggIndex,
        query: Object.assign({}, _query),
        detransposes: _detransposes,
        variable: _variable,
        agg: _agg,
        diff: _diff,
        over: _over,
        fmt: _fmt,
        value: _value,
        redacted: !!_redacted,
        renderIds: _renderIds
    });
    return id;
};

const applyAggregations = exports.applyAggregations = aggs => {
    // single method
    if (!aggs.map) return aggregations[aggs];
    // mutliple: return as key => value
    return (series, variable, over) => aggs.reduce((combined, agg) => Object.assign({}, combined, { [agg]: aggregations[agg](series, variable, over) }), {});
};

const aggregations = exports.aggregations = {
    distribution: (series, key) => distribution(colValues(series, key, true)),
    distributionRatio: (series, key) => distributionRatio(colValues(series, key, true)),
    n: (series, key) => colValues(series, key, true).length || 0,
    pctn: (series, key, over) => colValues(series, key, true).length / colValues(over, key, true).length * 100,
    pctsum: (series, key, over) => d3A.sum(colValues(series, key, true)) / d3A.sum(colValues(over, key, true)) * 100,
    mean: (series, key) => series.length ? d3A.mean(colValues(series, key, true)) : undefined,
    median: (series, key) => d3A.median(series.values(key)),
    mode: (series, key) => d3A.mode(colValues(series, key)),
    stdev: (series, key) => d3A.deviation(colValues(series, key)),
    min: (series, key) => d3A.min(colValues(series, key)),
    max: (series, key) => d3A.max(colValues(series, key)),
    range: series => d3A.range(colValues(series, key)),
    sum: (series, key) => d3A.sum(colValues(series, key)) || 0
};