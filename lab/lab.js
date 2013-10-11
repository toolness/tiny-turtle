var Lab = (function(Validation, TinyTurtle, PNGBaker) {
  var TURTLE_WIDTH = 10;
  var TURTLE_HEIGHT = 10;
  var RENDER_DELAY_MS = 100;
  var WORKER_TIMEOUT_MS = 2000;

  function Lab(parent, options) {
    options = options || {};
    var $ = parent.querySelector.bind(parent);
    var turtle;
    var worker;
    var source;
    var renderDelayTimeout;
    var workerTimeout;
    var bakedImageURL;
    var defaultContent = options.defaultContent || '';
    var workerURL = options.workerURL || 'worker.js';
    var workerTimeoutMsg = options.workerTimeoutMsg || 'timeout';
    var code = $(".code");
    var canvasImage = $(".canvas");
    var canvas = document.createElement('canvas');
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

    function bakeCanvas() {
      var baker = new PNGBaker(canvas.toDataURL());
      var URL = window.URL || window.webkitURL;
      baker.textChunks['tiny-turtle-source'] = encodeURIComponent(source);
      if (bakedImageURL) URL.revokeObjectURL(bakedImageURL);
      canvasImage.src = bakedImageURL = URL.createObjectURL(baker.toBlob());
    }

    function drawCmds(cmds) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      cmds.forEach(function(cmd) {
        if (cmd.msg == 'turtle-propset')
          Validation.setProperty(turtle, cmd.property, cmd.value);
        else if (cmd.msg == 'turtle-methodcall')
          Validation.callMethod(turtle, cmd.method, cmd.args);
      });
    }

    function finishWorker(cmds, err) {
      killWorker();
      if (err) {
        error.classList.add("shown");
        error.textContent = (err.lineno ? "Line " + err.lineno + ": " : '') +
                            err.message;
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
      drawCmds(cmds);
      bakeCanvas();
    }

    function render() {
      var cmds = [];

      if (code.value == source) return;
      source = code.value;
      killWorker();
      turtle = new TinyTurtle(canvas);
      worker = new Worker(workerURL);
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
        finishWorker(cmds, new Error(workerTimeoutMsg));
      }, WORKER_TIMEOUT_MS);
    }

    function onDragEvent(e) {
      if (e.type == 'drop') {
        if (e.dataTransfer.files.length) {
          var file = e.dataTransfer.files[0];
          if (file.type == 'image/png') {
            var reader = new FileReader();
            reader.onloadend = function() {
              var baker = new PNGBaker(reader.result);
              var bakedSource = baker.textChunks['tiny-turtle-source'];
              if (bakedSource) {
                code.value = decodeURIComponent(bakedSource);
                render();
              }
            };
            reader.readAsArrayBuffer(file);
            e.stopPropagation();
            e.preventDefault();
          }
        }
        return;
      } else {
        e.stopPropagation();
        e.preventDefault();
      }
    }

    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(function(type) {
      parent.addEventListener(type, onDragEvent);
    });
    canvas.width = canvasImage.width; canvas.height = canvasImage.height;
    if (!code.value) code.value = defaultContent;
    render();
    code.addEventListener('keyup', queueRendering, false);
    code.addEventListener('change', queueRendering, false);
  }

  return Lab;
})(Validation, TinyTurtle, PNGBaker);
