**TinyTurtle** is a minimalist [Turtle Graphics][] implementation using
the [Canvas element][], consisting of about 50 lines of JavaScript code.

The library is intended for use in teaching scenarios where learners
have access to a simple HTML editing environment such as [Thimble][] or
[jsbin][]. Learners should have a basic knowledge of HTML, but do
not need any JavaScript experience.

The implementation is kept as minimal as possible so that learners are
encouraged to view its source, understand it, and build upon it.

## Basic Usage

For absolute beginners, the `TinyTurtle` constructor can be applied to
the `window` object so that learners don't need to worry about lots
of typing, dot notation, inheritance, and so forth. Here's a trivial
example of a few squares being drawn:

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

## Instantiation and Chaining

The constructor can also be instantiated to allow for
multiple turtles to co-exist on a page, while also avoiding pollution
of the global namespace. Most methods also return `this` to
support chaining. Here's an equivalent replacement for the JavaScript
in the previous snippet which uses these more advanced techniques:

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

## CoffeeScript

The `TinyTurtle` class can also be extended in [CoffeeScript][], if one
wishes to teach (or learn) it as an alternative to JavaScript. For 
example:

```coffeescript
class MyTurtle extends TinyTurtle
  box: (length) ->
    for i in [1,2,3,4]
      this.forward length
      this.right 90

t = new MyTurtle

t.penStyle = 'purple'
t.box 90
t.left 10
t.box 80
t.left 10
t.box 70
```

  [Turtle Graphics]: http://en.wikipedia.org/wiki/Turtle_graphics
  [Canvas element]: http://en.wikipedia.org/wiki/Canvas_element
  [Thimble]: https://thimble.webmaker.org/
  [jsbin]: http://jsbin.com/
  [CoffeeScript]: http://coffeescript.org/
