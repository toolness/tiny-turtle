function TinyTurtle(canvas) {
  var rotation = 270;
  var position = {
    // See http://diveintohtml5.info/canvas.html#pixel-madness for
    // details on why we're offsetting by 0.5.
    x: canvas.width / 2 + 0.5,
    y: canvas.height / 2 + 0.5
  };
  var isPenDown = true;
  var rotate = function(degrees) {
    rotation = (rotation + degrees) % 360;
    if (rotation < 0) rotation += 360;
  };
  var move = function(distance) {
    var radians = 2 * Math.PI * (rotation / 360);
    position.x += Math.cos(radians) * distance;
    position.y += Math.sin(radians) * distance;
  };
  var self = {
    penStyle: 'black',
    penWidth: 1,
    get rotation() { return rotation; },
    get position() { return {x: position.x, y: position.y}; },
    get pen() { return isPenDown ? 'down' : 'up'; },
    penUp: function() { isPenDown = false; },
    penDown: function() { isPenDown = true; },
    forward: function(distance) {
      if (!isPenDown) return move(distance);
      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = self.penStyle;
      ctx.lineWidth = self.penWidth;
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      move(distance);
      ctx.lineTo(position.x, position.y);
      ctx.stroke();
    },
    left: function(degrees) { rotate(-degrees); },
    right: function(degrees) { rotate(degrees); }
  };

  self.fd = self.forward; self.lt = self.left; self.rt = self.right;

  return self;
}
