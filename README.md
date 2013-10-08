**TinyTurtle** is a minimalist [Turtle Graphics][] implementation using
the [Canvas element][], consisting of about 50 lines of JavaScript code.

The library is intended for use in teaching scenarios where learners
have access to a simple HTML editing environment such as [Thimble][] or
[jsbin][]. Learners should have a basic knowledge of HTML, but do
not need any JavaScript experience.

For absolute beginners, the `TinyTurtle` constructor can be applied to
the `window` object so that learners don't need to worry about lots
of typing, dot notation, inheritance, and so forth. Here's a trivial
example of a square being drawn:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>TinyTurtle Box Example</title>
<canvas width="300" height="300"></canvas>
<script src="tiny-turtle.js"></script>
<script>
// Without any arguments, TinyTurtle uses the first canvas on the page.
TinyTurtle.apply(window);

function box(length) {
  for (var i = 0; i < 4; i++) {
    forward(length);
    right(90);
  }
}

penStyle = 'purple';
box(90);
left(10);
box(80);
left(10);
box(70);
</script>
```

However, the constructor can also be instantiated to allow for
multiple turtles to co-exist on a page. And most methods return `this` to
support chaining. Here's an equivalent replacement for the JavaScript
in the above snippet which uses these more advanced techniques:

```javascript
var t = new TinyTurtle();

t.box = function box(length) {
  for (var i = 0; i < 4; i++) this.forward(length).right(90);
  return this;
};

t.penStyle = 'purple';
t.box(90).left(10).box(80).left(10).box(70);
```

This hopefully allows learners to start doing interesting things in an
incremental way.

The implementation is kept to around 50 lines so that learners are
encouraged to view its source, understand it, and build upon it.

  [Turtle Graphics]: http://en.wikipedia.org/wiki/Turtle_graphics
  [Canvas element]: http://en.wikipedia.org/wiki/Canvas_element
  [Thimble]: https://thimble.webmaker.org/
  [jsbin]: http://jsbin.com/
