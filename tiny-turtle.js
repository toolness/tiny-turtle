function TinyTurtle(canvas) {
  canvas = canvas || document.querySelector('canvas');

  var self = this;
  var rotation = 270;
  var position = {
    // See http://diveintohtml5.info/canvas.html#pixel-madness for
    // details on why we're offsetting by 0.5.
    x: canvas.width / 2 + 0.5,
    y: canvas.height / 2 + 0.5
  };
  var isPenDown = true;
  var rotate = function(deg) {
    rotation = (rotation + deg) % 360;
    if (rotation < 0) rotation += 360;
  };

  self.canvas = canvas;
  self.penStyle = 'black';
  self.penWidth = 1;
  self.penUp = function() { isPenDown = false; return self; };
  self.penDown = function() { isPenDown = true; return self; };
  self.forward = self.fd = function(distance) {
    var origX = position.x, origY = position.y;
    var radians = 2 * Math.PI * (rotation / 360);
    position.x += Math.cos(radians) * distance;
    position.y += Math.sin(radians) * distance;
    if (isPenDown) TinyTurtle.drawLine(canvas, self.penStyle, self.penWidth,
                                       origX, origY, position.x, position.y);
    return self;
  };
  self.left = self.lt = function(deg) { rotate(-deg); return self; };
  self.right = self.rt = function(deg) { rotate(deg); return self; };

  Object.defineProperties(self, {
    rotation: {get: function() { return rotation; }},
    position: {get: function() { return {x: position.x, y: position.y}; }},
    pen: {get: function() { return isPenDown ? 'down' : 'up'; }}
  });

  return self;
}

TinyTurtle.drawLine = function(canvas, style, width, x1, y1, x2, y2) {
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};
