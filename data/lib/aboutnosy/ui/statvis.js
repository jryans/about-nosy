/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 *
 **/

define(
  [
    'wmsy/wmsy',
    'wmsy/opc/d3',
    'text!./statvis.css',
    'exports'
  ],
  function(
    $wmsy,
    $d3,
    $_css,
    exports
  ) {

var wy = exports.wy =
  new $wmsy.WmsyDomain({id: 'statvis', domain: 'nosy', css: $_css});

wy.defineIdSpace('statvis', function(tab) { return tab.id; });

wy.defineWidget({
  name: 'barvis',
  constraint: {
    type: 'barvis',
  },
  structure: {
  },
  idspaces: ['statvis'],
  impl: {
    postInit: function() {
      this._width = 4 * this.obj.statKing.numPoints;
      this._height = 30;
      this._x = null;
      this._y = null;
      this._makeVis();
    },
    _makeVis: function() {
      var statlog = this.obj, stats = statlog.stats;
      const w = 4, h = this._height;

      var x = this._x = $d3.scale.linear()
        .domain([0, 1])
        .range([0, w]);
      var y = this._y = $d3.scale.linear()
        .domain([0, statlog.statKing.chartMax])
        .rangeRound([0, h]);

      var vis = this.vis = $d3.select(this.domNode).append("svg")
        .attr("width", this._width)
        .attr("height", this._height);

      this.yFunc = function(d) { return h - y(d); };

      var rectClass = this.__cssClassBaseName + "rect";

      vis.selectAll("rect")
          .data(stats)
        .enter().append("rect")
          .attr("class", rectClass)
          .attr("x", function(d, i) { return x(i); })
          .attr("y", this.yFunc)
          .attr("width", w - 1)
          .attr("height", y);
    },
    _updateVis: function() {
      var statlog = this.obj, y = this._y;
      // refresh y-axis scale
      y.domain([0, statlog.statKing.chartMax]);
      console.log("update, y: domain", y.domain(), "range", y.range());

      this.vis.selectAll("rect")
        .data(statlog.stats)
        .attr("y", this.yFunc)
        .attr("height", y);
    },
    update: function(recursive) {
      this._updateVis();
      this.__update(recursive);
    },
  },
});

}); // end define
