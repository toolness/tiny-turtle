importScripts('tiny-turtle.js');

TinyTurtle.drawLine = function(canvas, style, width, x1, y1, x2, y2) {
  postMessage([style, width, x1, y1, x2, y2]);
};

onmessage = function(e) {
  TinyTurtle.call(self, {width: e.data.width, height: e.data.height});
  eval(e.data.source);
};
