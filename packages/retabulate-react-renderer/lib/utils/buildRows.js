'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buildRows;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function buildRows(groups, pivoted) {
    var maxDepth = _lodash2.default.max(groups.map(function (g) {
        return g.length;
    }));
    var pathTo = function pathTo(group, depth) {
        return group.slice(0, depth).join('.');
    };
    var rows = [];
    var spanKey = pivoted ? 'rowSpan' : 'colSpan';

    // for each level

    var _loop = function _loop(i) {
        var cells = [];

        // gather each unique parent path
        var parentPaths = _lodash2.default.uniq(_lodash2.default.map(groups, function (group) {
            return pathTo(group, i);
        }));

        // for each parent path, gather unique items
        _lodash2.default.map(parentPaths, function (parentPath) {
            var matchingGroups = _lodash2.default.filter(groups, function (g) {
                return pathTo(g, i) === parentPath;
            });
            var uniqValues = _lodash2.default.uniq(_lodash2.default.map(matchingGroups, function (group) {
                return group[i];
            }));

            // for each unique item, create a cell
            _lodash2.default.forEach(uniqValues, function (value) {
                var span = _lodash2.default.filter(matchingGroups, function (group) {
                    return group[i] === value;
                }).length;

                cells.push(_defineProperty({
                    path: parentPath,
                    label: value
                }, spanKey, span));

                if (pivoted) _lodash2.default.range(1, span).forEach(function (i) {
                    return cells.push(null);
                });
            });
        });

        rows.push(cells);
    };

    for (var i = 0; i < maxDepth; i++) {
        _loop(i);
    }

    return rows;
}