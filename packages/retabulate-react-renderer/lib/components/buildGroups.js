'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildGroups;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildGroups(dotted) {
  var groups = [];

  _lodash2.default.forEach(_lodash2.default.filter(_lodash2.default.keys(dotted), function (p) {
    return p.split('.').slice(-1) == 'leaf';
  }), function (paths) {
    var pathArray = paths.split('.');
    groups.push(_lodash2.default.filter(pathArray, function (p) {
      return !p.match(/^(node)$/);
    }).slice(0, -1));
  });

  var labels = _lodash2.default.fromPairs(_lodash2.default.map(_lodash2.default.filter(_lodash2.default.keys(dotted), function (p) {
    return p.split('.').slice(-1) == 'label';
  }), function (paths) {
    return [_lodash2.default.filter(paths.split('.'), function (p) {
      return !p.match(/^(node)$/);
    }).slice(0, -1).join('.'), dotted[paths]];
  }));

  applyLabels(groups, labels);
  // strip labels beginning with _
  return groups.map(function (group) {
    return _lodash2.default.filter(group, function (item) {
      return item[0] !== '_';
    });
  });
}

function applyLabels(groups, labels) {
  _lodash2.default.forEach(groups, function (g) {
    var toLabel = {};
    for (var ind = 0; ind < g.length; ind++) {
      var pathPart = g.slice(0, ind + 1).join('.');
      if (labels[pathPart]) toLabel[ind] = labels[pathPart];
    }
    _lodash2.default.forEach(_lodash2.default.keys(toLabel), function (labelIndex) {
      return g[labelIndex] = toLabel[labelIndex];
    });
  });
}