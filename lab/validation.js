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
