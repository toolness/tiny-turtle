var evaluate = function(code) { eval(code); };

// The above code should always be the very first line of this file, as
// exceptions thrown from the code evaluated in it will be relative to
// the line the eval statement is on (in some browsers, at least).

var Validation = {
  properties: ['penStyle', 'penWidth'],
  methods: ['penUp', 'penDown', 'forward', 'fd', 'left', 'lt',
            'right', 'rt', 'stamp'],
  isValidType: function(value) {
    return ~['string', 'number'].indexOf(typeof(value));
  },
  setProperty: function(obj, property, val) {
    if (!~this.properties.indexOf(property)) return;
    if (!this.isValidType(val)) return;
    obj[property] = val;
  },
  callMethod: function(obj, method, args) {
    if (!~this.methods.indexOf(method)) return;
    for (var i = 0; i < args.length; i++)
      if (!this.isValidType(args[i])) return;
    obj[method].apply(obj, args);
  }
};

if (typeof(window) == 'undefined') (function startInWebWorker() {
  importScripts('tiny-turtle.js');

  function interceptProperties(obj) {
    Validation.properties.forEach(function(propName) {
      var value = obj[propName];
      Object.defineProperty(obj, propName, {
        get: function() { return value; },
        set: function(newValue) {
          value = newValue;
          postMessage({
            msg: 'turtle-propset',
            property: propName,
            value: value
          });
          return value;
        }
      });
    });
  }

  function interceptMethods(obj) {
    Validation.methods.forEach(function(methodName) {
      var method = obj[methodName];
      obj[methodName] = function() {
        var retval = method.apply(this, arguments);
        postMessage({
          msg: 'turtle-methodcall',
          method: methodName,
          args: [].slice.call(arguments)
        });
        return retval;
      };
    });
  }

  onmessage = function(e) {
    var noop = function() {} 
    var fakeCanvas = {
      width: e.data.width,
      height: e.data.height,
      getContext: function() { return this; },
      beginPath: noop,
      moveTo: noop,
      lineTo: noop,
      stroke: noop,
      save: noop,
      restore: noop,
      fill: noop,
      translate: noop,
      rotate: noop,
      closePath: noop
    };
    TinyTurtle.call(self, fakeCanvas);
    interceptMethods(self);
    interceptProperties(self);
    evaluate(e.data.source);
    postMessage({msg: 'done'});
  };
})(); else (function startInWebPage() {
  var $ = document.querySelector.bind(document);

  var TURTLE_WIDTH = 10;
  var TURTLE_HEIGHT = 10;
  var RENDER_DELAY_MS = 100;
  var WORKER_TIMEOUT_MS = 2000;
  var WORKER_TIMEOUT_MSG = $("#timeout-msg").textContent;
  var SAMPLE_JS = $("#sample").textContent.trim();

  function Lab(parent, defaultContent) {
    var $ = parent.querySelector.bind(parent);
    var turtle;
    var worker;
    var source;
    var renderDelayTimeout;
    var workerTimeout;
    var code = $(".code");
    var canvas = $(".canvas");
    var error = $(".error");

    function queueRendering() {
      clearTimeout(renderDelayTimeout);
      renderDelayTimeout = setTimeout(render, RENDER_DELAY_MS);
    }

    function killWorker() {
      if (!worker) return;
      clearTimeout(workerTimeout);
      worker.terminate();
      worker = null;
    }

    function finishWorker(cmds, err) {
      killWorker();
      if (err) {
        error.classList.add("shown");
        error.textContent = "Line " + err.lineno + ": " + err.message;
        // If nothing was displayed, don't draw an empty canvas, b/c we don't
        // want to unnecessarily distract the user if they're in the middle
        // of typing.
        if (!cmds.length) return;
        // Otherwise, show what was drawn before the error as a debugging
        // aid.
      } else {
        // Note that we would just use classList.toggle() with !!err as
        // the second arg, but it appears to be broken in IE10.
        error.classList.remove("shown");
      }
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      cmds.forEach(function(cmd) {
        if (cmd.msg == 'turtle-propset')
          Validation.setProperty(turtle, cmd.property, cmd.value);
        else if (cmd.msg == 'turtle-methodcall')
          Validation.callMethod(turtle, cmd.method, cmd.args);
      });
    }

    function render() {
      var cmds = [];

      if (code.value == source) return;
      source = code.value;
      killWorker();
      turtle = new TinyTurtle(canvas);
      worker = new Worker("index.js");
      worker.onmessage = function(e) {
        if (e.data.msg == 'done')
          finishWorker(cmds, null);
        else
          cmds.push(e.data);
      };
      worker.onerror = finishWorker.bind(null, cmds);
      worker.postMessage({
        source: code.value,
        height: canvas.height,
        width: canvas.width
      });
      workerTimeout = setTimeout(function() {
        finishWorker(cmds, new Error(WORKER_TIMEOUT_MSG));
      }, WORKER_TIMEOUT_MS);
    }

    if (!code.value) code.value = defaultContent;
    render();
    code.addEventListener('keyup', queueRendering, false);
    code.addEventListener('change', queueRendering, false);
  }

  Lab($("#lab"), SAMPLE_JS);
})();
