**TinyTurtle** is a minimalist [Turtle Graphics][] implementation using
the [Canvas element][], consisting of about 60 lines of JavaScript code.

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
    for i in [1..4]
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

## API

The `TinyTurtle` constructor takes only one optional argument, which is
the [HTMLCanvasElement][] to draw on. If not present, the first canvas
element on the page is used.

### Methods

**forward(amount)**

Move the turtle forward by the given number of pixels. If the pen is
down, a line is drawn from its previous position to its new position.

The `fd` method can be used as shorthand for this.

**left(degrees)**

Rotate the turtle to its left by the given number of degrees.

The `lt` method can be used as shorthand for this.

**right(degrees)**

Rotate the turtle to its right by the given number of degrees.

The `rt` method can be used as shorthand for this.

**stamp()**

Draw the turtle as a triangle that represents its current state in the
following ways:

* The triangle is drawn at the turtle's current position.
* The triangle is pointing in the direction that the turtle is currently
  oriented towards.
* If the pen is up, the triangle is drawn as an outline; otherwise, it's
  filled.
* The color and outline of the triangle is drawn using the current pen
  style and pen width.

**penUp()**

Put the pen up, so that movements by the turtle don't draw anything on
the canvas.

**penDown()**

Put the pen down, so that movements by the turtle draw a path on the canvas.

### Properties

**penStyle** (read/write)

A string describing the style that the turtle's path is drawn in. This
can be represented as any one of:

* A hexadecimal color like `#00FF00`
* A [RGBA][] quad like `rgba(0, 255, 0, 0.5)`
* A [HSLA][] quad like `hsla(50, 100%, 50%, 0.5)`
* A [CSS color name][] like `red`.

**penWidth** (read/write)

The width of the turtle's path, in pixels.

**canvas** (read-only)

The [HTMLCanvasElement][] the turtle is drawing on.

**rotation** (read-only)

The current rotation of the turtle, in degrees.

**position** (read-only)

The current position of the turtle, as an object with `x` and `y` 
properties.

**pen** (read-only)

The string `up` or `down` indicating the current state of the turtle's
pen.

## Supported Browsers

This code has been tested on Internet Explorer 10,
Safari 6 (desktop and iOS), Chrome 30, Opera 17, and Firefox 24.

## License

Public Domain [CC0 1.0 Universal][cczero].

  [Turtle Graphics]: http://en.wikipedia.org/wiki/Turtle_graphics
  [Canvas element]: http://en.wikipedia.org/wiki/Canvas_element
  [Thimble]: https://thimble.webmaker.org/
  [jsbin]: http://jsbin.com/
  [CoffeeScript]: http://coffeescript.org/
  [HTMLCanvasElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
  [RGBA]: http://www.w3.org/TR/css3-color/#rgba-color
  [HSLA]: http://www.w3.org/TR/css3-color/#hsla-color
  [CSS color name]: http://www.w3.org/TR/css3-color/#svg-color
  [cczero]: http://creativecommons.org/publicdomain/zero/1.0/
