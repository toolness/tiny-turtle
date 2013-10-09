importScripts('tiny-turtle.js');

function FakeCanvas(width, height) {
  this.width = width;
  this.height = height;
}

FakeCanvas.prototype = {
  getContext: function() { return this; },
  beginPath: function() {},
  moveTo: function(x, y) { this._start = {x: x, y: y}; },
  lineTo: function(x, y) { this._end = {x: x, y: y}; },
  stroke: function() {
    postMessage({
      start: this._start,
      end: this._end,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth
    });
  }
};

onmessage = function(e) {
  TinyTurtle.call(self, new FakeCanvas(e.data.width, e.data.height));
  eval(e.data.source);
};
