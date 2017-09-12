'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _buildGroups = require('../utils/buildGroups');

var _buildGroups2 = _interopRequireDefault(_buildGroups);

var _buildRows = require('../utils/buildRows');

var _buildRows2 = _interopRequireDefault(_buildRows);

var _getRenderers = require('../utils/getRenderers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasicCell = function BasicCell(_ref) {
  var _ref$cell = _ref.cell,
      value = _ref$cell.value,
      queries = _ref$cell.queries,
      variable = _ref$cell.variable,
      agg = _ref$cell.agg,
      cellID = _ref.cellID,
      cellProps = _ref.cellProps;
  return _react2.default.createElement(
    'td',
    _extends({ id: cellID }, cellProps),
    value
  );
};

var Th = function Th(_ref2) {
  var cellProps = _ref2.cellProps,
      data = _ref2.data;
  return _react2.default.createElement(
    'th',
    cellProps,
    data.label
  );
};

var NestedTable = function (_React$PureComponent) {
  _inherits(NestedTable, _React$PureComponent);

  function NestedTable() {
    _classCallCheck(this, NestedTable);

    return _possibleConstructorReturn(this, (NestedTable.__proto__ || Object.getPrototypeOf(NestedTable)).apply(this, arguments));
  }

  _createClass(NestedTable, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          tabulated = _props.tabulated,
          renderers = _props.renderers,
          labels = _props.labels;


      var topGrouped = (0, _buildGroups2.default)(tabulated.top);
      var leftGrouped = (0, _buildGroups2.default)(tabulated.left);

      Object.assign(labels, topGrouped.labels);
      Object.assign(labels, leftGrouped.labels);

      var topRows = (0, _buildRows2.default)(topGrouped.groups);
      var leftRows = (0, _buildRows2.default)(leftGrouped.groups, true);

      return _react2.default.createElement(
        'table',
        { className: 'table table-bordered' },
        _react2.default.createElement(
          'thead',
          null,
          topRows.map(function (row, i) {
            return _react2.default.createElement(
              'tr',
              { key: i },
              i === 0 && _react2.default.createElement(
                'td',
                { rowSpan: topRows.length,
                  colSpan: leftRows.length,
                  className: 'corner' },
                ' '
              ),
              row.map(function (cell, j) {
                var cellProps = _lodash2.default.pick(cell, 'colSpan');
                var renderId = cell.label.split('|')[0];

                var mergedProps = (0, _getRenderers.mergeCellRenderers)(renderId, cellProps, renderers, true);
                var LabelRenderer = (0, _getRenderers.getLabelRenderer)(renderId, renderers);

                return _react2.default.createElement(LabelRenderer || Th, {
                  key: j,
                  cellProps: mergedProps,
                  data: _extends({}, cell, { label: labels[cell.label] || cell.label })
                });
              })
            );
          })
        ),
        _react2.default.createElement(
          'tbody',
          null,
          _lodash2.default.range(0, leftRows[0].length).map(function (i) {
            return _react2.default.createElement(
              'tr',
              { key: i },
              leftRows.map(function (row, j) {
                if (!row[i]) return;

                var cell = row[i];
                var renderId = cell.label.split('|')[0];

                var cellProps = _lodash2.default.pick(cell, 'rowSpan');
                var mergedProps = (0, _getRenderers.mergeCellRenderers)(renderId, cellProps, renderers, true);
                var LabelRenderer = (0, _getRenderers.getLabelRenderer)(renderId, renderers);

                return _react2.default.createElement(LabelRenderer || Th, {
                  key: j,
                  cellProps: mergedProps,
                  data: _extends({}, cell, { label: labels[cell.label] || cell.label })
                });
              }),
              tabulated.rows[i].cells.map(function (cell, j) {
                var mergedProps = (0, _getRenderers.mergeCellRenderers)(cell.renderIds, { value: cell.value }, renderers);
                var CellRenderer = (0, _getRenderers.getRenderer)(cell, renderers) || BasicCell;
                // value is the one non-cell prop that can be overwritten
                if (typeof mergedProps.value !== 'undefined') {
                  cell = Object.assign({}, cell, { value: JSON.parse(mergedProps.value) });
                  delete mergedProps.value;
                }

                return _react2.default.createElement(CellRenderer, {
                  key: '' + i + j,
                  cellID: 'cell-' + i + j,
                  cellProps: mergedProps,
                  cell: cell
                }, labels[cell.label] || cell.label);
              })
            );
          })
        )
      );
    }
  }]);

  return NestedTable;
}(_react2.default.PureComponent);

exports.default = NestedTable;