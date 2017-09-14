'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildGroups;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildGroups(nestedObject) {
  var dotted = _dotObject2.default.dot(nestedObject);
  var groups = [];

  var _extractLabels = extractLabels(dotted),
      labels = _extractLabels.labels,
      transforms = _extractLabels.transforms;

  _lodash2.default.forEach(_lodash2.default.filter(_lodash2.default.keys(dotted), function (p) {
    return p.split('.').slice(-1) == 'leaf';
  }), function (paths) {
    var pathArray = paths.split('.');
    groups.push(_lodash2.default.filter(pathArray, function (p) {
      return !p.match(/^(node)$/);
    }).slice(0, -1));
  });

  applyTransforms(groups, transforms);

  // strip levels beginning with __
  return { labels: labels, groups: groups.map(function (group) {
      return _lodash2.default.filter(group, function (item) {
        return item.slice(0, 2) !== '__';
      });
    }) };
}

function extractLabels(dotted) {
  var labels = {};
  var transforms = {};

  _lodash2.default.forEach(_lodash2.default.filter(_lodash2.default.keys(dotted), function (p) {
    return p.split('.').slice(-1) == 'label';
  }), function (paths, index) {
    var renderId = dotted[paths.split('.').slice(0, -1).concat(['renderId']).join('.')];

    labels['_' + renderId + '|' + index] = dotted[paths];
    transforms[paths.split('.').slice(0, -1).join('.')] = '_' + renderId + '|' + index;
  });

  return { labels: labels, transforms: transforms };
}

function applyTransforms(groups, transforms) {
  _lodash2.default.forEach(groups, function (g) {
    var toLabel = {};
    for (var ind = 0; ind < g.length; ind++) {
      var pathPart = g.slice(0, ind + 1).join('.');
      if (transforms[pathPart]) toLabel[ind] = transforms[pathPart];
    }
    _lodash2.default.forEach(_lodash2.default.keys(toLabel), function (labelIndex) {
      return g[labelIndex] = toLabel[labelIndex];
    });
  });
}