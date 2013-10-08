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
  var move = function(distance) {
    var radians = 2 * Math.PI * (rotation / 360);
    position.x += Math.cos(radians) * distance;
    position.y += Math.sin(radians) * distance;
  };

  self.canvas = canvas;
  self.penStyle = 'black';
  self.penWidth = 1;
  self.penUp = function() { isPenDown = false; return self; };
  self.penDown = function() { isPenDown = true; return self; };
  self.forward = self.fd = function(distance) {
    if (!isPenDown) { move(distance); return self; }
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = self.penStyle;
    ctx.lineWidth = self.penWidth;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    move(distance);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
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
