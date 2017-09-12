"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var mergeCellRenderers = exports.mergeCellRenderers = function mergeCellRenderers(idOrIds, props, renderers, isHeader) {
  // headers are targeted by label or by renderId key; cells by renderIds array
  var renderIds = isHeader ? [idOrIds] : idOrIds;
  // pass through all prop modifier functions
  var mergedProps = renderIds.reduce(function (builtProps, rid) {
    return renderers[rid] ? renderers[rid].props(builtProps) : builtProps;
  }, props);
  // pass through style modifiers
  var mergedStyles = renderIds.reduce(function (styles, rid) {
    return renderers[rid] ? Object.assign(styles, renderers[rid].styles(mergedProps)) : styles;
  }, {});

  delete mergedStyles.value;
  return _extends({}, mergedProps, { style: mergedStyles });
};

var getRenderer = exports.getRenderer = function getRenderer(cell, renderers) {
  // find deepest possible cell renderer
  var cellRenderer = cell.renderIds.reduce(function (last, next) {
    return renderers[next] && renderers[next].cellRenderer ? renderers[next].cellRenderer : last;
  }, false);
  return cellRenderer;
};

var getLabelRenderer = exports.getLabelRenderer = function getLabelRenderer(id, renderers) {
  return renderers[id] && renderers[id].labelRenderer && renderers[id].labelRenderer;
};