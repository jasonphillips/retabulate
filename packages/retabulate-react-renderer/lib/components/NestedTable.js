'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _buildGroups = require('./buildGroups');

var _buildGroups2 = _interopRequireDefault(_buildGroups);

var _buildRows = require('./buildRows');

var _buildRows2 = _interopRequireDefault(_buildRows);

var _reactstrap = require('reactstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActiveCell = function (_React$Component) {
  _inherits(ActiveCell, _React$Component);

  function ActiveCell(props) {
    _classCallCheck(this, ActiveCell);

    var _this = _possibleConstructorReturn(this, (ActiveCell.__proto__ || Object.getPrototypeOf(ActiveCell)).call(this, props));

    _this.state = { tooltip: false };
    return _this;
  }

  _createClass(ActiveCell, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$cell = _props.cell,
          value = _props$cell.value,
          queries = _props$cell.queries,
          variable = _props$cell.variable,
          agg = _props$cell.agg,
          cellID = _props.cellID;
      var tooltip = this.state.tooltip;


      return _react2.default.createElement(
        'td',
        { id: cellID },
        value,
        _react2.default.createElement(
          _reactstrap.Tooltip,
          { target: cellID, isOpen: tooltip,
            toggle: function toggle() {
              return _this2.setState({ tooltip: !tooltip });
            },
            delay: { show: 500, hide: 250 } },
          _react2.default.createElement(
            'h4',
            null,
            variable ? variable + ' | ' + agg : agg
          ),
          queries.map(function (_ref) {
            var key = _ref.key,
                value = _ref.value;
            return _react2.default.createElement(
              'div',
              { key: key },
              _react2.default.createElement(
                'b',
                null,
                key,
                ': '
              ),
              ' ',
              value
            );
          })
        )
      );
    }
  }]);

  return ActiveCell;
}(_react2.default.Component);

var NestedTable = function (_React$PureComponent) {
  _inherits(NestedTable, _React$PureComponent);

  function NestedTable() {
    _classCallCheck(this, NestedTable);

    return _possibleConstructorReturn(this, (NestedTable.__proto__ || Object.getPrototypeOf(NestedTable)).apply(this, arguments));
  }

  _createClass(NestedTable, [{
    key: 'render',
    value: function render() {
      var tabulated = this.props.tabulated;


      var top = _dotObject2.default.dot(tabulated.top);
      var left = _dotObject2.default.dot(tabulated.left);

      var topGrouped = (0, _buildGroups2.default)(top);
      var leftGrouped = (0, _buildGroups2.default)(left);

      var topRows = (0, _buildRows2.default)(topGrouped);
      var leftRows = (0, _buildRows2.default)(leftGrouped, true);

      return _react2.default.createElement(
        'table',
        { className: 'table table-bordered', style: { margin: '1em' } },
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
                return _react2.default.createElement(
                  'th',
                  { key: j, colSpan: cell.colSpan },
                  (cell.label || '').replace('_', ' ')
                );
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
                return row[i] && _react2.default.createElement(
                  'th',
                  { key: j, rowSpan: row[i].rowSpan },
                  (row[i].label || '').replace('_', ' ')
                );
              }),
              tabulated.rows[i].cells.map(function (cell, j) {
                return _react2.default.createElement(ActiveCell, { key: '' + i + j, cellID: 'cell-' + i + j, cell: cell });
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