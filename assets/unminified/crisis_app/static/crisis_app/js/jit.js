/*
Copyright (c) 2011 Sencha Inc. - Author: Nicolas Garcia Belmonte (http://philogb.github.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function () { 

/*
 * File: Core.js
 */

/*
 Object: $jit
 
 Defines the namespace for all library Classes and Objects. 
 This variable is the *only* global variable defined in the Toolkit. 
 There are also other interesting properties attached to this variable described below.
 */
window.$jit = function(w) {
  w = w || window;
  for(var k in $jit) {
    if($jit[k].$extend) {
      w[k] = $jit[k];
    }
  }
};

$jit.version = '2.0.1';
/*
  Object: $jit.id
  
  Works just like *document.getElementById*
  
  Example:
  (start code js)
  var element = $jit.id('elementId');
  (end code)

*/

/*
 Object: $jit.util
 
 Contains utility functions.
 
 Some of the utility functions and the Class system were based in the MooTools Framework 
 <http://mootools.net>. Copyright (c) 2006-2010 Valerio Proietti, <http://mad4milk.net/>. 
 MIT license <http://mootools.net/license.txt>.
 
 These methods are generally also implemented in DOM manipulation frameworks like JQuery, MooTools and Prototype.
 I'd suggest you to use the functions from those libraries instead of using these, since their functions 
 are widely used and tested in many different platforms/browsers. Use these functions only if you have to.
 
 */
var $ = function(d) {
  return document.getElementById(d);
};

$.empty = function() {
};

/*
  Method: extend
  
  Augment an object by appending another object's properties.
  
  Parameters:
  
  original - (object) The object to be extended.
  extended - (object) An object which properties are going to be appended to the original object.
  
  Example:
  (start code js)
  $jit.util.extend({ 'a': 1, 'b': 2 }, { 'b': 3, 'c': 4 }); //{ 'a':1, 'b': 3, 'c': 4 }
  (end code)
*/
$.extend = function(original, extended) {
  for ( var key in (extended || {}))
    original[key] = extended[key];
  return original;
};

$.lambda = function(value) {
  return (typeof value == 'function') ? value : function() {
    return value;
  };
};

$.time = Date.now || function() {
  return +new Date;
};

/*
  Method: splat
  
  Returns an array wrapping *obj* if *obj* is not an array. Returns *obj* otherwise.
  
  Parameters:
  
  obj - (mixed) The object to be wrapped in an array.
  
  Example:
  (start code js)
  $jit.util.splat(3);   //[3]
  $jit.util.splat([3]); //[3]
  (end code)
*/
$.splat = function(obj) {
  var type = $.type(obj);
  return type ? ((type != 'array') ? [ obj ] : obj) : [];
};

$.type = function(elem) {
  var type = $.type.s.call(elem).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
  if(type != 'object') return type;
  if(elem && elem.$$family) return elem.$$family;
  return (elem && elem.nodeName && elem.nodeType == 1)? 'element' : type;
};
$.type.s = Object.prototype.toString;

/*
  Method: each
  
  Iterates through an iterable applying *f*.
  
  Parameters:
  
  iterable - (array) The original array.
  fn - (function) The function to apply to the array elements.
  
  Example:
  (start code js)
  $jit.util.each([3, 4, 5], function(n) { alert('number ' + n); });
  (end code)
*/
$.each = function(iterable, fn) {
  var type = $.type(iterable);
  if (type == 'object') {
    for ( var key in iterable)
      fn(iterable[key], key);
  } else {
    for ( var i = 0, l = iterable.length; i < l; i++)
      fn(iterable[i], i);
  }
};

$.indexOf = function(array, item) {
  if(Array.indexOf) return array.indexOf(item);
  for(var i=0,l=array.length; i<l; i++) {
    if(array[i] === item) return i;
  }
  return -1;
};

/*
  Method: map
  
  Maps or collects an array by applying *f*.
  
  Parameters:
  
  array - (array) The original array.
  f - (function) The function to apply to the array elements.
  
  Example:
  (start code js)
  $jit.util.map([3, 4, 5], function(n) { return n*n; }); //[9, 16, 25]
  (end code)
*/
$.map = function(array, f) {
  var ans = [];
  $.each(array, function(elem, i) {
    ans.push(f(elem, i));
  });
  return ans;
};

/*
  Method: reduce
  
  Iteratively applies the binary function *f* storing the result in an accumulator.
  
  Parameters:
  
  array - (array) The original array.
  f - (function) The function to apply to the array elements.
  opt - (optional|mixed) The starting value for the acumulator.
  
  Example:
  (start code js)
  $jit.util.reduce([3, 4, 5], function(x, y) { return x + y; }, 0); //12
  (end code)
*/
$.reduce = function(array, f, opt) {
  var l = array.length;
  if(l==0) return opt;
  var acum = arguments.length == 3? opt : array[--l];
  while(l--) {
    acum = f(acum, array[l]);
  }
  return acum;
};

/*
  Method: merge
  
  Merges n-objects and their sub-objects creating a new, fresh object.
  
  Parameters:
  
  An arbitrary number of objects.
  
  Example:
  (start code js)
  $jit.util.merge({ 'a': 1, 'b': 2 }, { 'b': 3, 'c': 4 }); //{ 'a':1, 'b': 3, 'c': 4 }
  (end code)
*/
$.merge = function() {
  var mix = {};
  for ( var i = 0, l = arguments.length; i < l; i++) {
    var object = arguments[i];
    if ($.type(object) != 'object')
      continue;
    for ( var key in object) {
      var op = object[key], mp = mix[key];
      mix[key] = (mp && $.type(op) == 'object' && $.type(mp) == 'object') ? $
          .merge(mp, op) : $.unlink(op);
    }
  }
  return mix;
};

$.unlink = function(object) {
  var unlinked;
  switch ($.type(object)) {
  case 'object':
    unlinked = {};
    for ( var p in object)
      unlinked[p] = $.unlink(object[p]);
    break;
  case 'array':
    unlinked = [];
    for ( var i = 0, l = object.length; i < l; i++)
      unlinked[i] = $.unlink(object[i]);
    break;
  default:
    return object;
  }
  return unlinked;
};

$.zip = function() {
  if(arguments.length === 0) return [];
  for(var j=0, ans=[], l=arguments.length, ml=arguments[0].length; j<ml; j++) {
    for(var i=0, row=[]; i<l; i++) {
      row.push(arguments[i][j]);
    }
    ans.push(row);
  }
  return ans;
};

/*
  Method: rgbToHex
  
  Converts an RGB array into a Hex string.
  
  Parameters:
  
  srcArray - (array) An array with R, G and B values
  
  Example:
  (start code js)
  $jit.util.rgbToHex([255, 255, 255]); //'#ffffff'
  (end code)
*/
$.rgbToHex = function(srcArray, array) {
  if (srcArray.length < 3)
    return null;
  if (srcArray.length == 4 && srcArray[3] == 0 && !array)
    return 'transparent';
  var hex = [];
  for ( var i = 0; i < 3; i++) {
    var bit = (srcArray[i] - 0).toString(16);
    hex.push(bit.length == 1 ? '0' + bit : bit);
  }
  return array ? hex : '#' + hex.join('');
};

/*
  Method: hexToRgb
  
  Converts an Hex color string into an RGB array.
  
  Parameters:
  
  hex - (string) A color hex string.
  
  Example:
  (start code js)
  $jit.util.hexToRgb('#fff'); //[255, 255, 255]
  (end code)
*/
$.hexToRgb = function(hex) {
  if (hex.length != 7) {
    hex = hex.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
    hex.shift();
    if (hex.length != 3)
      return null;
    var rgb = [];
    for ( var i = 0; i < 3; i++) {
      var value = hex[i];
      if (value.length == 1)
        value += value;
      rgb.push(parseInt(value, 16));
    }
    return rgb;
  } else {
    hex = parseInt(hex.slice(1), 16);
    return [ hex >> 16, hex >> 8 & 0xff, hex & 0xff ];
  }
};

$.destroy = function(elem) {
  $.clean(elem);
  if (elem.parentNode)
    elem.parentNode.removeChild(elem);
  if (elem.clearAttributes)
    elem.clearAttributes();
};

$.clean = function(elem) {
  for (var ch = elem.childNodes, i = 0, l = ch.length; i < l; i++) {
    $.destroy(ch[i]);
  }
};

/*
  Method: addEvent
  
  Cross-browser add event listener.
  
  Parameters:
  
  obj - (obj) The Element to attach the listener to.
  type - (string) The listener type. For example 'click', or 'mousemove'.
  fn - (function) The callback function to be used when the event is fired.
  
  Example:
  (start code js)
  $jit.util.addEvent(elem, 'click', function(){ alert('hello'); });
  (end code)
*/
$.addEvent = function(obj, type, fn) {
  if (obj.addEventListener)
    obj.addEventListener(type, fn, false);
  else
    obj.attachEvent('on' + type, fn);
};

$.addEvents = function(obj, typeObj) {
  for(var type in typeObj) {
    $.addEvent(obj, type, typeObj[type]);
  }
};

$.hasClass = function(obj, klass) {
  return (' ' + obj.className + ' ').indexOf(' ' + klass + ' ') > -1;
};

$.addClass = function(obj, klass) {
  if (!$.hasClass(obj, klass))
    obj.className = (obj.className + " " + klass);
};

$.removeClass = function(obj, klass) {
  obj.className = obj.className.replace(new RegExp(
      '(^|\\s)' + klass + '(?:\\s|$)'), '$1');
};

$.getPos = function(elem) {
  var offset = getOffsets(elem);
  var scroll = getScrolls(elem);
  return {
    x: offset.x - scroll.x,
    y: offset.y - scroll.y
  };

  function getOffsets(elem) {
    var position = {
      x: 0,
      y: 0
    };
    while (elem && !isBody(elem)) {
      position.x += elem.offsetLeft;
      position.y += elem.offsetTop;
      elem = elem.offsetParent;
    }
    return position;
  }

  function getScrolls(elem) {
    var position = {
      x: 0,
      y: 0
    };
    while (elem && !isBody(elem)) {
      position.x += elem.scrollLeft;
      position.y += elem.scrollTop;
      elem = elem.parentNode;
    }
    return position;
  }

  function isBody(element) {
    return (/^(?:body|html)$/i).test(element.tagName);
  }
};

$.event = {
  get: function(e, win) {
    win = win || window;
    return e || win.event;
  },
  getWheel: function(e) {
    return e.wheelDelta? e.wheelDelta / 120 : -(e.detail || 0) / 3;
  },
  isRightClick: function(e) {
    return (e.which == 3 || e.button == 2);
  },
  getPos: function(e, win) {
    // get mouse position
    win = win || window;
    e = e || win.event;
    var doc = win.document;
    doc = doc.documentElement || doc.body;
    //TODO(nico): make touch event handling better
    if(e.touches && e.touches.length) {
      e = e.touches[0];
    }
    var page = {
      x: e.pageX || (e.clientX + doc.scrollLeft),
      y: e.pageY || (e.clientY + doc.scrollTop)
    };
    return page;
  },
  stop: function(e) {
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  }
};

$jit.util = $jit.id = $;

var Class = function(properties) {
  properties = properties || {};
  var klass = function() {
    for ( var key in this) {
      if (typeof this[key] != 'function')
        this[key] = $.unlink(this[key]);
    }
    this.constructor = klass;
    if (Class.prototyping)
      return this;
    var instance = this.initialize ? this.initialize.apply(this, arguments)
        : this;
    //typize
    this.$$family = 'class';
    return instance;
  };

  for ( var mutator in Class.Mutators) {
    if (!properties[mutator])
      continue;
    properties = Class.Mutators[mutator](properties, properties[mutator]);
    delete properties[mutator];
  }

  $.extend(klass, this);
  klass.constructor = Class;
  klass.prototype = properties;
  return klass;
};

Class.Mutators = {

  Implements: function(self, klasses) {
    $.each($.splat(klasses), function(klass) {
      Class.prototyping = klass;
      var instance = (typeof klass == 'function') ? new klass : klass;
      for ( var prop in instance) {
        if (!(prop in self)) {
          self[prop] = instance[prop];
        }
      }
      delete Class.prototyping;
    });
    return self;
  }

};

$.extend(Class, {

  inherit: function(object, properties) {
    for ( var key in properties) {
      var override = properties[key];
      var previous = object[key];
      var type = $.type(override);
      if (previous && type == 'function') {
        if (override != previous) {
          Class.override(object, key, override);
        }
      } else if (type == 'object') {
        object[key] = $.merge(previous, override);
      } else {
        object[key] = override;
      }
    }
    return object;
  },

  override: function(object, name, method) {
    var parent = Class.prototyping;
    if (parent && object[name] != parent[name])
      parent = null;
    var override = function() {
      var previous = this.parent;
      this.parent = parent ? parent[name] : object[name];
      var value = method.apply(this, arguments);
      this.parent = previous;
      return value;
    };
    object[name] = override;
  }

});

Class.prototype.implement = function() {
  var proto = this.prototype;
  $.each(Array.prototype.slice.call(arguments || []), function(properties) {
    Class.inherit(proto, properties);
  });
  return this;
};

$jit.Class = Class;

/*
     An object containing multiple type of transformations. 
*/

$jit.Trans = {
  $extend: true,
  
  linear: function(p){
    return p;
  }
};

var Trans = $jit.Trans;

(function(){

  var makeTrans = function(transition, params){
    params = $.splat(params);
    return $.extend(transition, {
      easeIn: function(pos){
        return transition(pos, params);
      },
      easeOut: function(pos){
        return 1 - transition(1 - pos, params);
      },
      easeInOut: function(pos){
        return (pos <= 0.5)? transition(2 * pos, params) / 2 : (2 - transition(
            2 * (1 - pos), params)) / 2;
      }
    });
  };

  var transitions = {

    Pow: function(p, x){
      return Math.pow(p, x[0] || 6);
    },

    Expo: function(p){
      return Math.pow(2, 8 * (p - 1));
    },

    Circ: function(p){
      return 1 - Math.sin(Math.acos(p));
    },

    Sine: function(p){
      return 1 - Math.sin((1 - p) * Math.PI / 2);
    },

    Back: function(p, x){
      x = x[0] || 1.618;
      return Math.pow(p, 2) * ((x + 1) * p - x);
    },

    Bounce: function(p){
      var value;
      for ( var a = 0, b = 1; 1; a += b, b /= 2) {
        if (p >= (7 - 4 * a) / 11) {
          value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
          break;
        }
      }
      return value;
    },

    Elastic: function(p, x){
      return Math.pow(2, 10 * --p)
          * Math.cos(20 * p * Math.PI * (x[0] || 1) / 3);
    }

  };

  $.each(transitions, function(val, key){
    Trans[key] = makeTrans(val);
  });

  $.each( [
      'Quad', 'Cubic', 'Quart', 'Quint'
  ], function(elem, i){
    Trans[elem] = makeTrans(function(p){
      return Math.pow(p, [
        i + 2
      ]);
    });
  });

})();

/*
   A Class that can perform animations for generic objects.

   If you are looking for animation transitions please take a look at the <Trans> object.

   Used by:

   <Graph.Plot>
   
   Based on:
   
   The Animation class is based in the MooTools Framework <http://mootools.net>. Copyright (c) 2006-2009 Valerio Proietti, <http://mad4milk.net/>. MIT license <http://mootools.net/license.txt>.

*/

var Animation = new Class( {

  initialize: function(options){
    this.setOptions(options);
  },

  setOptions: function(options){
    var opt = {
      duration: 2500,
      fps: 40,
      transition: Trans.Quart.easeInOut,
      compute: $.empty,
      complete: $.empty,
      link: 'ignore'
    };
    this.opt = $.merge(opt, options || {});
    return this;
  },

  step: function(){
    var time = $.time(), opt = this.opt;
    if (time < this.time + opt.duration) {
      var delta = opt.transition((time - this.time) / opt.duration);
      opt.compute(delta);
    } else {
      this.timer = clearInterval(this.timer);
      opt.compute(1);
      opt.complete();
    }
  },

  start: function(){
    if (!this.check())
      return this;
    this.time = 0;
    this.startTimer();
    return this;
  },

  startTimer: function(){
    var that = this, fps = this.opt.fps;
    if (this.timer)
      return false;
    this.time = $.time() - this.time;
    this.timer = setInterval((function(){
      that.step();
    }), Math.round(1000 / fps));
    return true;
  },

  pause: function(){
    this.stopTimer();
    return this;
  },

  resume: function(){
    this.startTimer();
    return this;
  },

  stopTimer: function(){
    if (!this.timer)
      return false;
    this.time = $.time() - this.time;
    this.timer = clearInterval(this.timer);
    return true;
  },

  check: function(){
    if (!this.timer)
      return true;
    if (this.opt.link == 'cancel') {
      this.stopTimer();
      return true;
    }
    return false;
  }
});


var Options = function() {
  var args = arguments;
  for(var i=0, l=args.length, ans={}; i<l; i++) {
    var opt = Options[args[i]];
    if(opt.$extend) {
      $.extend(ans, opt);
    } else {
      ans[args[i]] = opt;  
    }
  }
  return ans;
};

/*
 * File: Options.Canvas.js
 *
*/

/*
  Object: Options.Canvas
  
  These are Canvas general options, like where to append it in the DOM, its dimensions, background, 
  and other more advanced options.
  
  Syntax:
  
  (start code js)

  Options.Canvas = {
    injectInto: 'id',
    type: '2D', //'3D'
    width: false,
    height: false,
    useCanvas: false,
    withLabels: true,
    background: false
  };  
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    injectInto: 'someContainerId',
    width: 500,
    height: 700
  });
  (end code)
  
  Parameters:
  
  injectInto - *required* (string|element) The id of the DOM container for the visualization. It can also be an Element provided that it has an id.
  type - (string) Context type. Default's 2D but can be 3D for webGL enabled browsers.
  width - (number) Default's to the *container's offsetWidth*. The width of the canvas.
  height - (number) Default's to the *container's offsetHeight*. The height of the canvas.
  useCanvas - (boolean|object) Default's *false*. You can pass another <Canvas> instance to be used by the visualization.
  withLabels - (boolean) Default's *true*. Whether to use a label container for the visualization.
  background - (boolean|object) Default's *false*. An object containing information about the rendering of a background canvas.
*/

Options.Canvas = {
    $extend: true,
    
    injectInto: 'id',
    type: '2D',
    width: false,
    height: false,
    useCanvas: false,
    withLabels: true,
    background: false,
    
    Scene: {
      Lighting: {
        enable: false,
        ambient: [1, 1, 1],
        directional: {
          direction: { x: -100, y: -100, z: -100 },
          color: [0.5, 0.3, 0.1]
        }
      }
    }
};

/*
 * File: Options.Node.js
 *
*/

/*
  Object: Options.Node

  Provides Node rendering options for Tree and Graph based visualizations.

  Syntax:
    
  (start code js)
  Options.Node = {
    overridable: false,
    type: 'circle',
    color: '#ccb',
    alpha: 1,
    dim: 3,
    height: 20,
    width: 90,
    autoHeight: false,
    autoWidth: false,
    lineWidth: 1,
    transform: true,
    align: "center",
    angularWidth:1,
    span:1,
    CanvasStyles: {}
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Node: {
      overridable: true,
      width: 30,
      autoHeight: true,
      type: 'rectangle'
    }
  });
  (end code)
  
  Parameters:

  overridable - (boolean) Default's *false*. Determine whether or not general node properties can be overridden by a particular <Graph.Node>.
  type - (string) Default's *circle*. Node's shape. Node built-in types include 'circle', 'rectangle', 'square', 'ellipse', 'triangle', 'star'. The default Node type might vary in each visualization. You can also implement (non built-in) custom Node types into your visualizations.
  color - (string) Default's *#ccb*. Node color.
  alpha - (number) Default's *1*. The Node's alpha value. *1* is for full opacity.
  dim - (number) Default's *3*. An extra parameter used by 'circle', 'square', 'triangle' and 'star' node types. Depending on each shape, this parameter can set the radius of a circle, half the length of the side of a square, half the base and half the height of a triangle or the length of a side of a star (concave decagon).
  height - (number) Default's *20*. Used by 'rectangle' and 'ellipse' node types. The height of the node shape.
  width - (number) Default's *90*. Used by 'rectangle' and 'ellipse' node types. The width of the node shape.
  autoHeight - (boolean) Default's *false*. Whether to set an auto height for the node depending on the content of the Node's label.
  autoWidth - (boolean) Default's *false*. Whether to set an auto width for the node depending on the content of the Node's label.
  lineWidth - (number) Default's *1*. Used only by some Node shapes. The line width of the strokes of a node.
  transform - (boolean) Default's *true*. Only used by the <Hypertree> visualization. Whether to scale the nodes according to the moebius transformation.
  align - (string) Default's *center*. Possible values are 'center', 'left' or 'right'. Used only by the <ST> visualization, these parameters are used for aligning nodes when some of they dimensions vary.
  angularWidth - (number) Default's *1*. Used in radial layouts (like <RGraph> or <Sunburst> visualizations). The amount of relative 'space' set for a node.
  span - (number) Default's *1*. Used in radial layouts (like <RGraph> or <Sunburst> visualizations). The angle span amount set for a node.
  CanvasStyles - (object) Default's an empty object (i.e. {}). Attach any other canvas specific property that you'd set to the canvas context before plotting a Node.

*/
Options.Node = {
  $extend: false,
  
  overridable: false,
  type: 'circle',
  color: '#ccb',
  alpha: 1,
  dim: 3,
  height: 20,
  width: 90,
  autoHeight: false,
  autoWidth: false,
  lineWidth: 1,
  transform: true,
  align: "center",
  angularWidth:1,
  span:1,
  //Raw canvas styles to be
  //applied to the context instance
  //before plotting a node
  CanvasStyles: {}
};


/*
 * File: Options.Edge.js
 *
*/

/*
  Object: Options.Edge

  Provides Edge rendering options for Tree and Graph based visualizations.

  Syntax:
    
  (start code js)
  Options.Edge = {
    overridable: false,
    type: 'line',
    color: '#ccb',
    lineWidth: 1,
    dim:15,
    alpha: 1,
    CanvasStyles: {}
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Edge: {
      overridable: true,
      type: 'line',
      color: '#fff',
      CanvasStyles: {
        shadowColor: '#ccc',
        shadowBlur: 10
      }
    }
  });
  (end code)
  
  Parameters:
    
   overridable - (boolean) Default's *false*. Determine whether or not general edges properties can be overridden by a particular <Graph.Adjacence>.
   type - (string) Default's 'line'. Edge styles include 'line', 'hyperline', 'arrow'. The default Edge type might vary in each visualization. You can also implement custom Edge types.
   color - (string) Default's '#ccb'. Edge color.
   lineWidth - (number) Default's *1*. Line/Edge width.
   alpha - (number) Default's *1*. The Edge's alpha value. *1* is for full opacity.
   dim - (number) Default's *15*. An extra parameter used by other complex shapes such as quadratic, bezier or arrow, to determine the shape's diameter.
   epsilon - (number) Default's *7*. Only used when using *enableForEdges* in <Options.Events>. This dimension is used to create an area for the line where the contains method for the edge returns *true*.
   CanvasStyles - (object) Default's an empty object (i.e. {}). Attach any other canvas specific property that you'd set to the canvas context before plotting an Edge.

  See also:
   
   If you want to know more about how to customize Node/Edge data per element, in the JSON or programmatically, take a look at this article.
*/
Options.Edge = {
  $extend: false,
  
  overridable: false,
  type: 'line',
  color: '#ccb',
  lineWidth: 1,
  dim:15,
  alpha: 1,
  epsilon: 7,

  //Raw canvas styles to be
  //applied to the context instance
  //before plotting an edge
  CanvasStyles: {}
};


/*
 * File: Options.Fx.js
 *
*/

/*
  Object: Options.Fx

  Provides animation options like duration of the animations, frames per second and animation transitions.  

  Syntax:
  
  (start code js)
    Options.Fx = {
      fps:40,
      duration: 2500,
      transition: $jit.Trans.Quart.easeInOut,
      clearCanvas: true
    };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    duration: 1000,
    fps: 35,
    transition: $jit.Trans.linear
  });
  (end code)
  
  Parameters:
  
  clearCanvas - (boolean) Default's *true*. Whether to clear the frame/canvas when the viz is plotted or animated.
  duration - (number) Default's *2500*. Duration of the animation in milliseconds.
  fps - (number) Default's *40*. Frames per second.
  transition - (object) Default's *$jit.Trans.Quart.easeInOut*. The transition used for the animations. See below for a more detailed explanation.
  
  Object: $jit.Trans
  
  This object is used for specifying different animation transitions in all visualizations.

  There are many different type of animation transitions.

  linear:

  Displays a linear transition

  >Trans.linear
  
  (see Linear.png)

  Quad:

  Displays a Quadratic transition.

  >Trans.Quad.easeIn
  >Trans.Quad.easeOut
  >Trans.Quad.easeInOut
  
 (see Quad.png)

 Cubic:

 Displays a Cubic transition.

 >Trans.Cubic.easeIn
 >Trans.Cubic.easeOut
 >Trans.Cubic.easeInOut

 (see Cubic.png)

 Quart:

 Displays a Quartetic transition.

 >Trans.Quart.easeIn
 >Trans.Quart.easeOut
 >Trans.Quart.easeInOut

 (see Quart.png)

 Quint:

 Displays a Quintic transition.

 >Trans.Quint.easeIn
 >Trans.Quint.easeOut
 >Trans.Quint.easeInOut

 (see Quint.png)

 Expo:

 Displays an Exponential transition.

 >Trans.Expo.easeIn
 >Trans.Expo.easeOut
 >Trans.Expo.easeInOut

 (see Expo.png)

 Circ:

 Displays a Circular transition.

 >Trans.Circ.easeIn
 >Trans.Circ.easeOut
 >Trans.Circ.easeInOut

 (see Circ.png)

 Sine:

 Displays a Sineousidal transition.

 >Trans.Sine.easeIn
 >Trans.Sine.easeOut
 >Trans.Sine.easeInOut

 (see Sine.png)

 Back:

 >Trans.Back.easeIn
 >Trans.Back.easeOut
 >Trans.Back.easeInOut

 (see Back.png)

 Bounce:

 Bouncy transition.

 >Trans.Bounce.easeIn
 >Trans.Bounce.easeOut
 >Trans.Bounce.easeInOut

 (see Bounce.png)

 Elastic:

 Elastic curve.

 >Trans.Elastic.easeIn
 >Trans.Elastic.easeOut
 >Trans.Elastic.easeInOut

 (see Elastic.png)
 
 Based on:
     
 Easing and Transition animation methods are based in the MooTools Framework <http://mootools.net>. Copyright (c) 2006-2010 Valerio Proietti, <http://mad4milk.net/>. MIT license <http://mootools.net/license.txt>.


*/
Options.Fx = {
  $extend: true,
  
  fps:40,
  duration: 2500,
  transition: $jit.Trans.Quart.easeInOut,
  clearCanvas: true
};

/*
 * File: Options.Label.js
 *
*/
/*
  Object: Options.Label

  Provides styling for Labels such as font size, family, etc. Also sets Node labels as HTML, SVG or Native canvas elements.  

  Syntax:
  
  (start code js)
    Options.Label = {
      overridable: false,
      type: 'HTML', //'SVG', 'Native'
      style: ' ',
      size: 10,
      family: 'sans-serif',
      textAlign: 'center',
      textBaseline: 'alphabetic',
      color: '#fff'
    };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Label: {
      type: 'Native',
      size: 11,
      color: '#ccc'
    }
  });
  (end code)
  
  Parameters:
    
  overridable - (boolean) Default's *false*. Determine whether or not general label properties can be overridden by a particular <Graph.Node>.
  type - (string) Default's *HTML*. The type for the labels. Can be 'HTML', 'SVG' or 'Native' canvas labels.
  style - (string) Default's *empty string*. Can be 'italic' or 'bold'. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  size - (number) Default's *10*. The font's size. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  family - (string) Default's *sans-serif*. The font's family. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  color - (string) Default's *#fff*. The font's color. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
*/
Options.Label = {
  $extend: false,
  
  overridable: false,
  type: 'HTML', //'SVG', 'Native'
  style: ' ',
  size: 10,
  family: 'sans-serif',
  textAlign: 'center',
  textBaseline: 'alphabetic',
  color: '#fff'
};


/*
 * File: Options.Tips.js
 *
 */

/*
  Object: Options.Tips
  
  Tips options
  
  Syntax:
    
  (start code js)
  Options.Tips = {
    enable: false,
    type: 'auto',
    offsetX: 20,
    offsetY: 20,
    onShow: $.empty,
    onHide: $.empty
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Tips: {
      enable: true,
      type: 'Native',
      offsetX: 10,
      offsetY: 10,
      onShow: function(tip, node) {
        tip.innerHTML = node.name;
      }
    }
  });
  (end code)

  Parameters:

  enable - (boolean) Default's *false*. If *true*, a tooltip will be shown when a node is hovered. The tooltip is a div DOM element having "tip" as CSS class. 
  type - (string) Default's *auto*. Defines where to attach the MouseEnter/Leave tooltip events. Possible values are 'Native' to attach them to the canvas or 'HTML' to attach them to DOM label elements (if defined). 'auto' sets this property to the value of <Options.Label>'s *type* property.
  offsetX - (number) Default's *20*. An offset added to the current tooltip x-position (which is the same as the current mouse position). Default's 20.
  offsetY - (number) Default's *20*. An offset added to the current tooltip y-position (which is the same as the current mouse position). Default's 20.
  onShow(tip, node) - This callack is used right before displaying a tooltip. The first formal parameter is the tip itself (which is a DivElement). The second parameter may be a <Graph.Node> for graph based visualizations or an object with label, value properties for charts.
  onHide() - This callack is used when hiding a tooltip.

*/
Options.Tips = {
  $extend: false,
  
  enable: false,
  type: 'auto',
  offsetX: 20,
  offsetY: 20,
  force: false,
  onShow: $.empty,
  onHide: $.empty
};


/*
 * File: Options.NodeStyles.js
 *
 */

/*
  Object: Options.NodeStyles
  
  Apply different styles when a node is hovered or selected.
  
  Syntax:
    
  (start code js)
  Options.NodeStyles = {
    enable: false,
    type: 'auto',
    stylesHover: false,
    stylesClick: false
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    NodeStyles: {
      enable: true,
      type: 'Native',
      stylesHover: {
        dim: 30,
        color: '#fcc'
      },
      duration: 600
    }
  });
  (end code)

  Parameters:
  
  enable - (boolean) Default's *false*. Whether to enable this option.
  type - (string) Default's *auto*. Use this to attach the hover/click events in the nodes or the nodes labels (if they have been defined as DOM elements: 'HTML' or 'SVG', see <Options.Label> for more details). The default 'auto' value will set NodeStyles to the same type defined for <Options.Label>.
  stylesHover - (boolean|object) Default's *false*. An object with node styles just like the ones defined for <Options.Node> or *false* otherwise.
  stylesClick - (boolean|object) Default's *false*. An object with node styles just like the ones defined for <Options.Node> or *false* otherwise.
*/

Options.NodeStyles = {
  $extend: false,
  
  enable: false,
  type: 'auto',
  stylesHover: false,
  stylesClick: false
};


/*
 * File: Options.Events.js
 *
*/

/*
  Object: Options.Events
  
  Configuration for adding mouse/touch event handlers to Nodes.
  
  Syntax:
  
  (start code js)
  Options.Events = {
    enable: false,
    enableForEdges: false,
    type: 'auto',
    onClick: $.empty,
    onRightClick: $.empty,
    onMouseMove: $.empty,
    onMouseEnter: $.empty,
    onMouseLeave: $.empty,
    onDragStart: $.empty,
    onDragMove: $.empty,
    onDragCancel: $.empty,
    onDragEnd: $.empty,
    onTouchStart: $.empty,
    onTouchMove: $.empty,
    onTouchEnd: $.empty,
    onTouchCancel: $.empty,
    onMouseWheel: $.empty
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Events: {
      enable: true,
      onClick: function(node, eventInfo, e) {
        viz.doSomething();
      },
      onMouseEnter: function(node, eventInfo, e) {
        viz.canvas.getElement().style.cursor = 'pointer';
      },
      onMouseLeave: function(node, eventInfo, e) {
        viz.canvas.getElement().style.cursor = '';
      }
    }
  });
  (end code)
  
  Parameters:
  
  enable - (boolean) Default's *false*. Whether to enable the Event system.
  enableForEdges - (boolean) Default's *false*. Whether to track events also in arcs. If *true* the same callbacks -described below- are used for nodes *and* edges. A simple duck type check for edges is to check for *node.nodeFrom*.
  type - (string) Default's 'auto'. Whether to attach the events onto the HTML labels (via event delegation) or to use the custom 'Native' canvas Event System of the library. 'auto' is set when you let the <Options.Label> *type* parameter decide this.
  onClick(node, eventInfo, e) - Triggered when a user performs a click in the canvas. *node* is the <Graph.Node> clicked or false if no node has been clicked. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onRightClick(node, eventInfo, e) - Triggered when a user performs a right click in the canvas. *node* is the <Graph.Node> right clicked or false if no node has been clicked. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onMouseMove(node, eventInfo, e) - Triggered when the user moves the mouse. *node* is the <Graph.Node> under the cursor as it's moving over the canvas or false if no node has been clicked. *e* is the grabbed event (should return the native event in a cross-browser manner).  *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas.
  onMouseEnter(node, eventInfo, e) - Triggered when a user moves the mouse over a node. *node* is the <Graph.Node> that the mouse just entered. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onMouseLeave(node, eventInfo, e) - Triggered when the user mouse-outs a node. *node* is the <Graph.Node> 'mouse-outed'. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragStart(node, eventInfo, e) - Triggered when the user mouse-downs over a node. *node* is the <Graph.Node> being pressed. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragMove(node, eventInfo, e) - Triggered when a user, after pressing the mouse button over a node, moves the mouse around. *node* is the <Graph.Node> being dragged. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragEnd(node, eventInfo, e) - Triggered when a user finished dragging a node. *node* is the <Graph.Node> being dragged. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragCancel(node, eventInfo, e) - Triggered when the user releases the mouse button over a <Graph.Node> that wasn't dragged (i.e. the user didn't perform any mouse movement after pressing the mouse button). *node* is the <Graph.Node> being dragged. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onTouchStart(node, eventInfo, e) - Behaves just like onDragStart. 
  onTouchMove(node, eventInfo, e) - Behaves just like onDragMove. 
  onTouchEnd(node, eventInfo, e) - Behaves just like onDragEnd. 
  onTouchCancel(node, eventInfo, e) - Behaves just like onDragCancel.
  onMouseWheel(delta, e) - Triggered when the user uses the mouse scroll over the canvas. *delta* is 1 or -1 depending on the sense of the mouse scroll.
*/

Options.Events = {
  $extend: false,
  
  enable: false,
  enableForEdges: false,
  type: 'auto',
  onClick: $.empty,
  onRightClick: $.empty,
  onMouseMove: $.empty,
  onMouseEnter: $.empty,
  onMouseLeave: $.empty,
  onDragStart: $.empty,
  onDragMove: $.empty,
  onDragCancel: $.empty,
  onDragEnd: $.empty,
  onTouchStart: $.empty,
  onTouchMove: $.empty,
  onTouchEnd: $.empty,
  onMouseWheel: $.empty
};

/*
 * File: Options.Navigation.js
 *
*/

/*
  Object: Options.Navigation
  
  Panning and zooming options for Graph/Tree based visualizations. These options are implemented 
  by all visualizations except charts (<AreaChart>, <BarChart> and <PieChart>).
  
  Syntax:
  
  (start code js)

  Options.Navigation = {
    enable: false,
    type: 'auto',
    panning: false, //true, 'avoid nodes'
    zooming: false
  };
  
  (end code)
  
  Example:
    
  (start code js)
  var viz = new $jit.Viz({
    Navigation: {
      enable: true,
      panning: 'avoid nodes',
      zooming: 20
    }
  });
  (end code)
  
  Parameters:
  
  enable - (boolean) Default's *false*. Whether to enable Navigation capabilities.
  type - (string) Default's 'auto'. Whether to attach the navigation events onto the HTML labels (via event delegation) or to use the custom 'Native' canvas Event System of the library. When 'auto' set when you let the <Options.Label> *type* parameter decide this.
  panning - (boolean|string) Default's *false*. Set this property to *true* if you want to add Drag and Drop panning support to the visualization. You can also set this parameter to 'avoid nodes' to enable DnD panning but disable it if the DnD is taking place over a node. This is useful when some other events like Drag & Drop for nodes are added to <Graph.Nodes>.
  zooming - (boolean|number) Default's *false*. Set this property to a numeric value to turn mouse-scroll zooming on. The number will be proportional to the mouse-scroll sensitivity.
  
*/

Options.Navigation = {
  $extend: false,
  
  enable: false,
  type: 'auto',
  panning: false, //true | 'avoid nodes'
  zooming: false
};

/*
 * File: Options.Controller.js
 *
*/

/*
  Object: Options.Controller
  
  Provides controller methods. Controller methods are callback functions that get called at different stages 
  of the animation, computing or plotting of the visualization.
  
  Implemented by:
    
  All visualizations except charts (<AreaChart>, <BarChart> and <PieChart>).
  
  Syntax:
  
  (start code js)

  Options.Controller = {
    onBeforeCompute: $.empty,
    onAfterCompute:  $.empty,
    onCreateLabel:   $.empty,
    onPlaceLabel:    $.empty,
    onComplete:      $.empty,
    onBeforePlotLine:$.empty,
    onAfterPlotLine: $.empty,
    onBeforePlotNode:$.empty,
    onAfterPlotNode: $.empty,
    request:         false
  };
  
  (end code)
  
  Example:
    
  (start code js)
  var viz = new $jit.Viz({
    onBeforePlotNode: function(node) {
      if(node.selected) {
        node.setData('color', '#ffc');
      } else {
        node.removeData('color');
      }
    },
    onBeforePlotLine: function(adj) {
      if(adj.nodeFrom.selected && adj.nodeTo.selected) {
        adj.setData('color', '#ffc');
      } else {
        adj.removeData('color');
      }
    },
    onAfterCompute: function() {
      alert("computed!");
    }
  });
  (end code)
  
  Parameters:

   onBeforeCompute(node) - This method is called right before performing all computations and animations. The selected <Graph.Node> is passed as parameter.
   onAfterCompute() - This method is triggered after all animations or computations ended.
   onCreateLabel(domElement, node) - This method receives a new label DIV element as first parameter, and the corresponding <Graph.Node> as second parameter. This method will only be called once for each label. This method is useful when adding events or styles to the labels used by the JIT.
   onPlaceLabel(domElement, node) - This method receives a label DIV element as first parameter and the corresponding <Graph.Node> as second parameter. This method is called each time a label has been placed in the visualization, for example at each step of an animation, and thus it allows you to update the labels properties, such as size or position. Note that onPlaceLabel will be triggered after updating the labels positions. That means that, for example, the left and top css properties are already updated to match the nodes positions. Width and height properties are not set however.
   onBeforePlotNode(node) - This method is triggered right before plotting each <Graph.Node>. This method is useful for changing a node style right before plotting it.
   onAfterPlotNode(node) - This method is triggered right after plotting each <Graph.Node>.
   onBeforePlotLine(adj) - This method is triggered right before plotting a <Graph.Adjacence>. This method is useful for adding some styles to a particular edge before being plotted.
   onAfterPlotLine(adj) - This method is triggered right after plotting a <Graph.Adjacence>.

    *Used in <ST>, <TM.Base> and <Icicle> visualizations*
    
    request(nodeId, level, onComplete) - This method is used for buffering information into the visualization. When clicking on an empty node, the visualization will make a request for this node's subtrees, specifying a given level for this subtree (defined by _levelsToShow_). Once the request is completed, the onComplete callback should be called with the given result. This is useful to provide on-demand information into the visualizations withought having to load the entire information from start. The parameters used by this method are _nodeId_, which is the id of the root of the subtree to request, _level_ which is the depth of the subtree to be requested (0 would mean just the root node). _onComplete_ is an object having the callback method _onComplete.onComplete(json)_ that should be called once the json has been retrieved.  
 
 */
Options.Controller = {
  $extend: true,
  
  onBeforeCompute: $.empty,
  onAfterCompute:  $.empty,
  onCreateLabel:   $.empty,
  onPlaceLabel:    $.empty,
  onComplete:      $.empty,
  onBeforePlotLine:$.empty,
  onAfterPlotLine: $.empty,
  onBeforePlotNode:$.empty,
  onAfterPlotNode: $.empty,
  request:         false
};


/*
 * File: Extras.js
 * 
 * Provides Extras such as Tips and Style Effects.
 * 
 * Description:
 * 
 * Provides the <Tips> and <NodeStyles> classes and functions.
 *
 */

/*
 * Manager for mouse events (clicking and mouse moving).
 * 
 * This class is used for registering objects implementing onClick
 * and onMousemove methods. These methods are called when clicking or
 * moving the mouse around  the Canvas.
 * For now, <Tips> and <NodeStyles> are classes implementing these methods.
 * 
 */
var ExtrasInitializer = {
  initialize: function(className, viz) {
    this.viz = viz;
    this.canvas = viz.canvas;
    this.config = viz.config[className];
    this.nodeTypes = viz.fx.nodeTypes;
    var type = this.config.type;
    this.dom = type == 'auto'? (viz.config.Label.type != 'Native') : (type != 'Native');
    this.labelContainer = this.dom && viz.labels.getLabelContainer();
    this.isEnabled() && this.initializePost();
  },
  initializePost: $.empty,
  setAsProperty: $.lambda(false),
  isEnabled: function() {
    return this.config.enable;
  },
  isLabel: function(e, win, group) {
    e = $.event.get(e, win);
    var labelContainer = this.labelContainer,
        target = e.target || e.srcElement,
        related = e.relatedTarget;
    if(group) {
      return related && related == this.viz.canvas.getCtx().canvas 
          && !!target && this.isDescendantOf(target, labelContainer);
    } else {
      return this.isDescendantOf(target, labelContainer);
    }
  },
  isDescendantOf: function(elem, par) {
    while(elem && elem.parentNode) {
      if(elem.parentNode == par)
        return elem;
      elem = elem.parentNode;
    }
    return false;
  }
};

var EventsInterface = {
  onMouseUp: $.empty,
  onMouseDown: $.empty,
  onMouseMove: $.empty,
  onMouseOver: $.empty,
  onMouseOut: $.empty,
  onMouseWheel: $.empty,
  onTouchStart: $.empty,
  onTouchMove: $.empty,
  onTouchEnd: $.empty,
  onTouchCancel: $.empty
};

var MouseEventsManager = new Class({
  initialize: function(viz) {
    this.viz = viz;
    this.canvas = viz.canvas;
    this.node = false;
    this.edge = false;
    this.registeredObjects = [];
    this.attachEvents();
  },
  
  attachEvents: function() {
    var htmlCanvas = this.canvas.getElement(), 
        that = this;
    htmlCanvas.oncontextmenu = $.lambda(false);
    $.addEvents(htmlCanvas, {
      'mouseup': function(e, win) {
        var event = $.event.get(e, win);
        that.handleEvent('MouseUp', e, win, 
            that.makeEventObject(e, win), 
            $.event.isRightClick(event));
      },
      'mousedown': function(e, win) {
        var event = $.event.get(e, win);
        that.handleEvent('MouseDown', e, win, that.makeEventObject(e, win), 
            $.event.isRightClick(event));
      },
      'mousemove': function(e, win) {
        that.handleEvent('MouseMove', e, win, that.makeEventObject(e, win));
      },
      'mouseover': function(e, win) {
        that.handleEvent('MouseOver', e, win, that.makeEventObject(e, win));
      },
      'mouseout': function(e, win) {
        that.handleEvent('MouseOut', e, win, that.makeEventObject(e, win));
      },
      'touchstart': function(e, win) {
        that.handleEvent('TouchStart', e, win, that.makeEventObject(e, win));
      },
      'touchmove': function(e, win) {
        that.handleEvent('TouchMove', e, win, that.makeEventObject(e, win));
      },
      'touchend': function(e, win) {
        that.handleEvent('TouchEnd', e, win, that.makeEventObject(e, win));
      }
    });
    //attach mousewheel event
    var handleMouseWheel = function(e, win) {
      var event = $.event.get(e, win);
      var wheel = $.event.getWheel(event);
      that.handleEvent('MouseWheel', e, win, wheel);
    };
    //TODO(nico): this is a horrible check for non-gecko browsers!
    if(!document.getBoxObjectFor && window.mozInnerScreenX == null) {
      $.addEvent(htmlCanvas, 'mousewheel', handleMouseWheel);
    } else {
      htmlCanvas.addEventListener('DOMMouseScroll', handleMouseWheel, false);
    }
  },
  
  register: function(obj) {
    this.registeredObjects.push(obj);
  },
  
  handleEvent: function() {
    var args = Array.prototype.slice.call(arguments),
        type = args.shift();
    for(var i=0, regs=this.registeredObjects, l=regs.length; i<l; i++) {
      regs[i]['on' + type].apply(regs[i], args);
    }
  },
  
  makeEventObject: function(e, win) {
    var that = this,
        graph = this.viz.graph,
        fx = this.viz.fx,
        ntypes = fx.nodeTypes,
        etypes = fx.edgeTypes;
    return {
      pos: false,
      node: false,
      edge: false,
      contains: false,
      getNodeCalled: false,
      getEdgeCalled: false,
      getPos: function() {
        //TODO(nico): check why this can't be cache anymore when using edge detection
        //if(this.pos) return this.pos;
        var canvas = that.viz.canvas,
            s = canvas.getSize(),
            p = canvas.getPos(),
            ox = canvas.translateOffsetX,
            oy = canvas.translateOffsetY,
            sx = canvas.scaleOffsetX,
            sy = canvas.scaleOffsetY,
            pos = $.event.getPos(e, win);
        this.pos = {
          x: (pos.x - p.x - s.width/2 - ox) * 1/sx,
          y: (pos.y - p.y - s.height/2 - oy) * 1/sy
        };
        return this.pos;
      },
      getNode: function() {
        if(this.getNodeCalled) return this.node;
        this.getNodeCalled = true;
        for(var id in graph.nodes) {
          var n = graph.nodes[id],
              geom = n && ntypes[n.getData('type')],
              contains = geom && geom.contains && geom.contains.call(fx, n, this.getPos());
          if(contains) {
            this.contains = contains;
            return that.node = this.node = n;
          }
        }
        return that.node = this.node = false;
      },
      getEdge: function() {
        if(this.getEdgeCalled) return this.edge;
        this.getEdgeCalled = true;
        var hashset = {};
        for(var id in graph.edges) {
          var edgeFrom = graph.edges[id];
          hashset[id] = true;
          for(var edgeId in edgeFrom) {
            if(edgeId in hashset) continue;
            var e = edgeFrom[edgeId],
                geom = e && etypes[e.getData('type')],
                contains = geom && geom.contains && geom.contains.call(fx, e, this.getPos());
            if(contains) {
              this.contains = contains;
              return that.edge = this.edge = e;
            }
          }
        }
        return that.edge = this.edge = false;
      },
      getContains: function() {
        if(this.getNodeCalled) return this.contains;
        this.getNode();
        return this.contains;
      }
    };
  }
});

/* 
 * Provides the initialization function for <NodeStyles> and <Tips> implemented 
 * by all main visualizations.
 *
 */
var Extras = {
  initializeExtras: function() {
    var mem = new MouseEventsManager(this), that = this;
    $.each(['NodeStyles', 'Tips', 'Navigation', 'Events'], function(k) {
      var obj = new Extras.Classes[k](k, that);
      if(obj.isEnabled()) {
        mem.register(obj);
      }
      if(obj.setAsProperty()) {
        that[k.toLowerCase()] = obj;
      }
    });
  }   
};

Extras.Classes = {};
/*
  Class: Events
   
  This class defines an Event API to be accessed by the user.
  The methods implemented are the ones defined in the <Options.Events> object.
*/

Extras.Classes.Events = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    this.fx = this.viz.fx;
    this.ntypes = this.viz.fx.nodeTypes;
    this.etypes = this.viz.fx.edgeTypes;
    
    this.hovered = false;
    this.pressed = false;
    this.touched = false;

    this.touchMoved = false;
    this.moved = false;
    
  },
  
  setAsProperty: $.lambda(true),
  
  onMouseUp: function(e, win, event, isRightClick) {
    var evt = $.event.get(e, win);
    if(!this.moved) {
      if(isRightClick) {
        this.config.onRightClick(this.hovered, event, evt);
      } else {
        this.config.onClick(this.pressed, event, evt);
      }
    }
    if(this.pressed) {
      if(this.moved) {
        this.config.onDragEnd(this.pressed, event, evt);
      } else {
        this.config.onDragCancel(this.pressed, event, evt);
      }
      this.pressed = this.moved = false;
    }
  },

  onMouseOut: function(e, win, event) {
   //mouseout a label
   var evt = $.event.get(e, win), label;
   if(this.dom && (label = this.isLabel(e, win, true))) {
     this.config.onMouseLeave(this.viz.graph.getNode(label.id),
                              event, evt);
     this.hovered = false;
     return;
   }
   //mouseout canvas
   var rt = evt.relatedTarget,
       canvasWidget = this.canvas.getElement();
   while(rt && rt.parentNode) {
     if(canvasWidget == rt.parentNode) return;
     rt = rt.parentNode;
   }
   if(this.hovered) {
     this.config.onMouseLeave(this.hovered,
         event, evt);
     this.hovered = false;
   }
  },
  
  onMouseOver: function(e, win, event) {
    //mouseover a label
    var evt = $.event.get(e, win), label;
    if(this.dom && (label = this.isLabel(e, win, true))) {
      this.hovered = this.viz.graph.getNode(label.id);
      this.config.onMouseEnter(this.hovered,
                               event, evt);
    }
  },
  
  onMouseMove: function(e, win, event) {
   var label, evt = $.event.get(e, win);
   if(this.pressed) {
     this.moved = true;
     this.config.onDragMove(this.pressed, event, evt);
     return;
   }
   if(this.dom) {
     this.config.onMouseMove(this.hovered,
         event, evt);
   } else {
     if(this.hovered) {
       var hn = this.hovered;
       var geom = hn.nodeFrom? this.etypes[hn.getData('type')] : this.ntypes[hn.getData('type')];
       var contains = geom && geom.contains 
         && geom.contains.call(this.fx, hn, event.getPos());
       if(contains) {
         this.config.onMouseMove(hn, event, evt);
         return;
       } else {
         this.config.onMouseLeave(hn, event, evt);
         this.hovered = false;
       }
     }
     if(this.hovered = (event.getNode() || (this.config.enableForEdges && event.getEdge()))) {
       this.config.onMouseEnter(this.hovered, event, evt);
     } else {
       this.config.onMouseMove(false, event, evt);
     }
   }
  },
  
  onMouseWheel: function(e, win, delta) {
    this.config.onMouseWheel(delta, $.event.get(e, win));
  },
  
  onMouseDown: function(e, win, event) {
    var evt = $.event.get(e, win), label;
    if(this.dom) {
      if(label = this.isLabel(e, win)) {
        this.pressed = this.viz.graph.getNode(label.id);
      }
    } else {
      this.pressed = event.getNode() || (this.config.enableForEdges && event.getEdge());
    }
    this.pressed && this.config.onDragStart(this.pressed, event, evt);
  },
  
  onTouchStart: function(e, win, event) {
    var evt = $.event.get(e, win), label;
    if(this.dom && (label = this.isLabel(e, win))) {
      this.touched = this.viz.graph.getNode(label.id);
    } else {
      this.touched = event.getNode() || (this.config.enableForEdges && event.getEdge());
    }
    this.touched && this.config.onTouchStart(this.touched, event, evt);
  },
  
  onTouchMove: function(e, win, event) {
    var evt = $.event.get(e, win);
    if(this.touched) {
      this.touchMoved = true;
      this.config.onTouchMove(this.touched, event, evt);
    }
  },
  
  onTouchEnd: function(e, win, event) {
    var evt = $.event.get(e, win);
    if(this.touched) {
      if(this.touchMoved) {
        this.config.onTouchEnd(this.touched, event, evt);
      } else {
        this.config.onTouchCancel(this.touched, event, evt);
      }
      this.touched = this.touchMoved = false;
    }
  }
});

/*
   Class: Tips
    
   A class containing tip related functions. This class is used internally.
   
   Used by:
   
   <ST>, <Sunburst>, <Hypertree>, <RGraph>, <TM>, <ForceDirected>, <Icicle>
   
   See also:
   
   <Options.Tips>
*/

Extras.Classes.Tips = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    //add DOM tooltip
    if(document.body) {
      var tip = $('_tooltip') || document.createElement('div');
      tip.id = '_tooltip';
      tip.className = 'tip';
      $.extend(tip.style, {
        position: 'absolute',
        display: 'none',
        zIndex: 13000
      });
      document.body.appendChild(tip);
      this.tip = tip;
      this.node = false;
    }
  },
  
  setAsProperty: $.lambda(true),
  
  onMouseOut: function(e, win) {
    //mouseout a label
    var evt = $.event.get(e, win);
    if(this.dom && this.isLabel(e, win, true)) {
      this.hide(true);
      return;
    }
    //mouseout canvas
    var rt = e.relatedTarget,
        canvasWidget = this.canvas.getElement();
    while(rt && rt.parentNode) {
      if(canvasWidget == rt.parentNode) return;
      rt = rt.parentNode;
    }
    this.hide(false);
  },
  
  onMouseOver: function(e, win) {
    //mouseover a label
    var label;
    if(this.dom && (label = this.isLabel(e, win, false))) {
      this.node = this.viz.graph.getNode(label.id);
      this.config.onShow(this.tip, this.node, label);
    }
  },
  
  onMouseMove: function(e, win, opt) {
    if(this.dom && this.isLabel(e, win)) {
      this.setTooltipPosition($.event.getPos(e, win));
    }
    if(!this.dom) {
      var node = opt.getNode();
      if(!node) {
        this.hide(true);
        return;
      }
      if(this.config.force || !this.node || this.node.id != node.id) {
        this.node = node;
        this.config.onShow(this.tip, node, opt.getContains());
      }
      this.setTooltipPosition($.event.getPos(e, win));
    }
  },
  
  setTooltipPosition: function(pos) {
    var tip = this.tip, 
        style = tip.style, 
        cont = this.config;
    style.display = '';
    //get window dimensions
    var win = {
      'height': document.body.clientHeight,
      'width': document.body.clientWidth
    };
    //get tooltip dimensions
    var obj = {
      'width': tip.offsetWidth,
      'height': tip.offsetHeight  
    };
    //set tooltip position
    var x = cont.offsetX, y = cont.offsetY;
    style.top = ((pos.y + y + obj.height > win.height)?  
        (pos.y - obj.height - y) : pos.y + y) + 'px';
    style.left = ((pos.x + obj.width + x > win.width)? 
        (pos.x - obj.width - x) : pos.x + x) + 'px';
  },
  
  hide: function(triggerCallback) {
    this.tip.style.display = 'none';
    triggerCallback && this.config.onHide();
  }
});

/*
  Class: NodeStyles
   
  Change node styles when clicking or hovering a node. This class is used internally.
  
  Used by:
  
  <ST>, <Sunburst>, <Hypertree>, <RGraph>, <TM>, <ForceDirected>, <Icicle>
  
  See also:
  
  <Options.NodeStyles>
*/
Extras.Classes.NodeStyles = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    this.fx = this.viz.fx;
    this.types = this.viz.fx.nodeTypes;
    this.nStyles = this.config;
    this.nodeStylesOnHover = this.nStyles.stylesHover;
    this.nodeStylesOnClick = this.nStyles.stylesClick;
    this.hoveredNode = false;
    this.fx.nodeFxAnimation = new Animation();
    
    this.down = false;
    this.move = false;
  },
  
  onMouseOut: function(e, win) {
    this.down = this.move = false;
    if(!this.hoveredNode) return;
    //mouseout a label
    if(this.dom && this.isLabel(e, win, true)) {
      this.toggleStylesOnHover(this.hoveredNode, false);
    }
    //mouseout canvas
    var rt = e.relatedTarget,
        canvasWidget = this.canvas.getElement();
    while(rt && rt.parentNode) {
      if(canvasWidget == rt.parentNode) return;
      rt = rt.parentNode;
    }
    this.toggleStylesOnHover(this.hoveredNode, false);
    this.hoveredNode = false;
  },
  
  onMouseOver: function(e, win) {
    //mouseover a label
    var label;
    if(this.dom && (label = this.isLabel(e, win, true))) {
      var node = this.viz.graph.getNode(label.id);
      if(node.selected) return;
      this.hoveredNode = node;
      this.toggleStylesOnHover(this.hoveredNode, true);
    }
  },
  
  onMouseDown: function(e, win, event, isRightClick) {
    if(isRightClick) return;
    var label;
    if(this.dom && (label = this.isLabel(e, win))) {
      this.down = this.viz.graph.getNode(label.id);
    } else if(!this.dom) {
      this.down = event.getNode();
    }
    this.move = false;
  },
  
  onMouseUp: function(e, win, event, isRightClick) {
    if(isRightClick) return;
    if(!this.move) {
      this.onClick(event.getNode());
    }
    this.down = this.move = false;
  },
  
  getRestoredStyles: function(node, type) {
    var restoredStyles = {}, 
        nStyles = this['nodeStylesOn' + type];
    for(var prop in nStyles) {
      restoredStyles[prop] = node.styles['$' + prop];
    }
    return restoredStyles;
  },
  
  toggleStylesOnHover: function(node, set) {
    if(this.nodeStylesOnHover) {
      this.toggleStylesOn('Hover', node, set);
    }
  },

  toggleStylesOnClick: function(node, set) {
    if(this.nodeStylesOnClick) {
      this.toggleStylesOn('Click', node, set);
    }
  },
  
  toggleStylesOn: function(type, node, set) {
    var viz = this.viz;
    var nStyles = this.nStyles;
    if(set) {
      var that = this;
      if(!node.styles) {
        node.styles = $.merge(node.data, {});
      }
      for(var s in this['nodeStylesOn' + type]) {
        var $s = '$' + s;
        if(!($s in node.styles)) {
            node.styles[$s] = node.getData(s); 
        }
      }
      viz.fx.nodeFx($.extend({
        'elements': {
          'id': node.id,
          'properties': that['nodeStylesOn' + type]
         },
         transition: Trans.Quart.easeOut,
         duration:300,
         fps:40
      }, this.config));
    } else {
      var restoredStyles = this.getRestoredStyles(node, type);
      viz.fx.nodeFx($.extend({
        'elements': {
          'id': node.id,
          'properties': restoredStyles
         },
         transition: Trans.Quart.easeOut,
         duration:300,
         fps:40
      }, this.config));
    }
  },

  onClick: function(node) {
    if(!node) return;
    var nStyles = this.nodeStylesOnClick;
    if(!nStyles) return;
    //if the node is selected then unselect it
    if(node.selected) {
      this.toggleStylesOnClick(node, false);
      delete node.selected;
    } else {
      //unselect all selected nodes...
      this.viz.graph.eachNode(function(n) {
        if(n.selected) {
          for(var s in nStyles) {
            n.setData(s, n.styles['$' + s], 'end');
          }
          delete n.selected;
        }
      });
      //select clicked node
      this.toggleStylesOnClick(node, true);
      node.selected = true;
      delete node.hovered;
      this.hoveredNode = false;
    }
  },
  
  onMouseMove: function(e, win, event) {
    //if mouse button is down and moving set move=true
    if(this.down) this.move = true;
    //already handled by mouseover/out
    if(this.dom && this.isLabel(e, win)) return;
    var nStyles = this.nodeStylesOnHover;
    if(!nStyles) return;
    
    if(!this.dom) {
      if(this.hoveredNode) {
        var geom = this.types[this.hoveredNode.getData('type')];
        var contains = geom && geom.contains && geom.contains.call(this.fx, 
            this.hoveredNode, event.getPos());
        if(contains) return;
      }
      var node = event.getNode();
      //if no node is being hovered then just exit
      if(!this.hoveredNode && !node) return;
      //if the node is hovered then exit
      if(node.hovered) return;
      //select hovered node
      if(node && !node.selected) {
        //check if an animation is running and exit it
        this.fx.nodeFxAnimation.stopTimer();
        //unselect all hovered nodes...
        this.viz.graph.eachNode(function(n) {
          if(n.hovered && !n.selected) {
            for(var s in nStyles) {
              n.setData(s, n.styles['$' + s], 'end');
            }
            delete n.hovered;
          }
        });
        //select hovered node
        node.hovered = true;
        this.hoveredNode = node;
        this.toggleStylesOnHover(node, true);
      } else if(this.hoveredNode && !this.hoveredNode.selected) {
        //check if an animation is running and exit it
        this.fx.nodeFxAnimation.stopTimer();
        //unselect hovered node
        this.toggleStylesOnHover(this.hoveredNode, false);
        delete this.hoveredNode.hovered;
        this.hoveredNode = false;
      }
    }
  }
});

Extras.Classes.Navigation = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    this.pos = false;
    this.pressed = false;
  },
  
  onMouseWheel: function(e, win, scroll) {
    if(!this.config.zooming) return;
    $.event.stop($.event.get(e, win));
    var val = this.config.zooming / 1000,
        ans = 1 + scroll * val;
    this.canvas.scale(ans, ans);
  },
  
  onMouseDown: function(e, win, eventInfo) {
    if(!this.config.panning) return;
    if(this.config.panning == 'avoid nodes' && (this.dom? this.isLabel(e, win) : eventInfo.getNode())) return;
    this.pressed = true;
    this.pos = eventInfo.getPos();
    var canvas = this.canvas,
        ox = canvas.translateOffsetX,
        oy = canvas.translateOffsetY,
        sx = canvas.scaleOffsetX,
        sy = canvas.scaleOffsetY;
    this.pos.x *= sx;
    this.pos.x += ox;
    this.pos.y *= sy;
    this.pos.y += oy;
  },
  
  onMouseMove: function(e, win, eventInfo) {
    if(!this.config.panning) return;
    if(!this.pressed) return;
    if(this.config.panning == 'avoid nodes' && (this.dom? this.isLabel(e, win) : eventInfo.getNode())) return;
    var thispos = this.pos, 
        currentPos = eventInfo.getPos(),
        canvas = this.canvas,
        ox = canvas.translateOffsetX,
        oy = canvas.translateOffsetY,
        sx = canvas.scaleOffsetX,
        sy = canvas.scaleOffsetY;
    currentPos.x *= sx;
    currentPos.y *= sy;
    currentPos.x += ox;
    currentPos.y += oy;
    var x = currentPos.x - thispos.x,
        y = currentPos.y - thispos.y;
    this.pos = currentPos;
    this.canvas.translate(x * 1/sx, y * 1/sy);
  },
  
  onMouseUp: function(e, win, eventInfo, isRightClick) {
    if(!this.config.panning) return;
    this.pressed = false;
  }
});


/*
 * File: Canvas.js
 *
 */

/*
 Class: Canvas
 
 	A canvas widget used by all visualizations. The canvas object can be accessed by doing *viz.canvas*. If you want to 
 	know more about <Canvas> options take a look at <Options.Canvas>.
 
 A canvas widget is a set of DOM elements that wrap the native canvas DOM Element providing a consistent API and behavior 
 across all browsers. It can also include Elements to add DOM (SVG or HTML) label support to all visualizations.
 
 Example:
 
 Suppose we have this HTML
 
 (start code xml)
 	<div id="infovis"></div>
 (end code)
 
 Now we create a new Visualization
 
 (start code js)
 	var viz = new $jit.Viz({
 		//Where to inject the canvas. Any div container will do.
 		'injectInto':'infovis',
		 //width and height for canvas. 
		 //Default's to the container offsetWidth and Height.
		 'width': 900,
		 'height':500
	 });
 (end code)

 The generated HTML will look like this
 
 (start code xml)
 <div id="infovis">
 	<div id="infovis-canvaswidget" style="position:relative;">
 	<canvas id="infovis-canvas" width=900 height=500
 	style="position:absolute; top:0; left:0; width:900px; height:500px;" />
 	<div id="infovis-label"
 	style="overflow:visible; position:absolute; top:0; left:0; width:900px; height:0px">
 	</div>
 	</div>
 </div>
 (end code)
 
 As you can see, the generated HTML consists of a canvas DOM Element of id *infovis-canvas* and a div label container
 of id *infovis-label*, wrapped in a main div container of id *infovis-canvaswidget*.
 */

var Canvas;
(function() {
  //check for native canvas support
  var canvasType = typeof HTMLCanvasElement,
      supportsCanvas = (canvasType == 'object' || canvasType == 'function');
  //create element function
  function $E(tag, props) {
    var elem = document.createElement(tag);
    for(var p in props) {
      if(typeof props[p] == "object") {
        $.extend(elem[p], props[p]);
      } else {
        elem[p] = props[p];
      }
    }
    if (tag == "canvas" && !supportsCanvas && G_vmlCanvasManager) {
      elem = G_vmlCanvasManager.initElement(document.body.appendChild(elem));
    }
    return elem;
  }
  //canvas widget which we will call just Canvas
  $jit.Canvas = Canvas = new Class({
    canvases: [],
    pos: false,
    element: false,
    labelContainer: false,
    translateOffsetX: 0,
    translateOffsetY: 0,
    scaleOffsetX: 1,
    scaleOffsetY: 1,
    
    initialize: function(viz, opt) {
      this.viz = viz;
      this.opt = this.config = opt;
      var id = $.type(opt.injectInto) == 'string'? 
          opt.injectInto:opt.injectInto.id,
          type = opt.type,
          idLabel = id + "-label", 
          wrapper = $(id),
          width = opt.width || wrapper.offsetWidth,
          height = opt.height || wrapper.offsetHeight;
      this.id = id;
      //canvas options
      var canvasOptions = {
        injectInto: id,
        width: width,
        height: height
      };
      //create main wrapper
      this.element = $E('div', {
        'id': id + '-canvaswidget',
        'style': {
          'position': 'relative',
          'width': width + 'px',
          'height': height + 'px'
        }
      });
      //create label container
      this.labelContainer = this.createLabelContainer(opt.Label.type, 
          idLabel, canvasOptions);
      //create primary canvas
      this.canvases.push(new Canvas.Base[type]({
        config: $.extend({idSuffix: '-canvas'}, canvasOptions),
        plot: function(base) {
          viz.fx.plot();
        },
        resize: function() {
          viz.refresh();
        }
      }));
      //create secondary canvas
      var back = opt.background;
      if(back) {
        var backCanvas = new Canvas.Background[back.type](viz, $.extend(back, canvasOptions));
        this.canvases.push(new Canvas.Base[type](backCanvas));
      }
      //insert canvases
      var len = this.canvases.length;
      while(len--) {
        this.element.appendChild(this.canvases[len].canvas);
        if(len > 0) {
          this.canvases[len].plot();
        }
      }
      this.element.appendChild(this.labelContainer);
      wrapper.appendChild(this.element);
      //Update canvas position when the page is scrolled.
      var timer = null, that = this;
      $.addEvent(window, 'scroll', function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          that.getPos(true); //update canvas position
        }, 500);
      });
    },
    /*
      Method: getCtx
      
      Returns the main canvas context object
      
      Example:
      
      (start code js)
       var ctx = canvas.getCtx();
       //Now I can use the native canvas context
       //and for example change some canvas styles
       ctx.globalAlpha = 1;
      (end code)
    */
    getCtx: function(i) {
      return this.canvases[i || 0].getCtx();
    },
    /*
      Method: getConfig
      
      Returns the current Configuration for this Canvas Widget.
      
      Example:
      
      (start code js)
       var config = canvas.getConfig();
      (end code)
    */
    getConfig: function() {
      return this.opt;
    },
    /*
      Method: getElement

      Returns the main Canvas DOM wrapper
      
      Example:
      
      (start code js)
       var wrapper = canvas.getElement();
       //Returns <div id="infovis-canvaswidget" ... >...</div> as element
      (end code)
    */
    getElement: function() {
      return this.element;
    },
    /*
      Method: getSize
      
      Returns canvas dimensions.
      
      Returns:
      
      An object with *width* and *height* properties.
      
      Example:
      (start code js)
      canvas.getSize(); //returns { width: 900, height: 500 }
      (end code)
    */
    getSize: function(i) {
      return this.canvases[i || 0].getSize();
    },
    /*
      Method: resize
      
      Resizes the canvas.
      
      Parameters:
      
      width - New canvas width.
      height - New canvas height.
      
      Example:
      
      (start code js)
       canvas.resize(width, height);
      (end code)
    
    */
    resize: function(width, height) {
      this.getPos(true);
      this.translateOffsetX = this.translateOffsetY = 0;
      this.scaleOffsetX = this.scaleOffsetY = 1;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].resize(width, height);
      }
      var style = this.element.style;
      style.width = width + 'px';
      style.height = height + 'px';
      if(this.labelContainer)
        this.labelContainer.style.width = width + 'px';
    },
    /*
      Method: translate
      
      Applies a translation to the canvas.
      
      Parameters:
      
      x - (number) x offset.
      y - (number) y offset.
      disablePlot - (boolean) Default's *false*. Set this to *true* if you don't want to refresh the visualization.
      
      Example:
      
      (start code js)
       canvas.translate(30, 30);
      (end code)
    
    */
    translate: function(x, y, disablePlot) {
      this.translateOffsetX += x*this.scaleOffsetX;
      this.translateOffsetY += y*this.scaleOffsetY;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].translate(x, y, disablePlot);
      }
    },
    /*
      Method: scale
      
      Scales the canvas.
      
      Parameters:
      
      x - (number) scale value.
      y - (number) scale value.
      disablePlot - (boolean) Default's *false*. Set this to *true* if you don't want to refresh the visualization.
      
      Example:
      
      (start code js)
       canvas.scale(0.5, 0.5);
      (end code)
    
    */
    scale: function(x, y, disablePlot) {
      var px = this.scaleOffsetX * x,
          py = this.scaleOffsetY * y;
      var dx = this.translateOffsetX * (x -1) / px,
          dy = this.translateOffsetY * (y -1) / py;
      this.scaleOffsetX = px;
      this.scaleOffsetY = py;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].scale(x, y, true);
      }
      this.translate(dx, dy, false);
    },
    /*
      Method: getPos
      
      Returns the canvas position as an *x, y* object.
      
      Parameters:
      
      force - (boolean) Default's *false*. Set this to *true* if you want to recalculate the position without using any cache information.
      
      Returns:
      
      An object with *x* and *y* properties.
      
      Example:
      (start code js)
      canvas.getPos(true); //returns { x: 900, y: 500 }
      (end code)
    */
    getPos: function(force){
      if(force || !this.pos) {
        return this.pos = $.getPos(this.getElement());
      }
      return this.pos;
    },
    /*
       Method: clear
       
       Clears the canvas.
    */
    clear: function(i){
      this.canvases[i||0].clear();
    },
    
    path: function(type, action){
      var ctx = this.canvases[0].getCtx();
      ctx.beginPath();
      action(ctx);
      ctx[type]();
      ctx.closePath();
    },
    
    createLabelContainer: function(type, idLabel, dim) {
      var NS = 'http://www.w3.org/2000/svg';
      if(type == 'HTML' || type == 'Native') {
        return $E('div', {
          'id': idLabel,
          'style': {
            'overflow': 'visible',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': dim.width + 'px',
            'height': 0
          }
        });
      } else if(type == 'SVG') {
        var svgContainer = document.createElementNS(NS, 'svg:svg');
        svgContainer.setAttribute("width", dim.width);
        svgContainer.setAttribute('height', dim.height);
        var style = svgContainer.style;
        style.position = 'absolute';
        style.left = style.top = '0px';
        var labelContainer = document.createElementNS(NS, 'svg:g');
        labelContainer.setAttribute('width', dim.width);
        labelContainer.setAttribute('height', dim.height);
        labelContainer.setAttribute('x', 0);
        labelContainer.setAttribute('y', 0);
        labelContainer.setAttribute('id', idLabel);
        svgContainer.appendChild(labelContainer);
        return svgContainer;
      }
    }
  });
  //base canvas wrapper
  Canvas.Base = {};
  Canvas.Base['2D'] = new Class({
    translateOffsetX: 0,
    translateOffsetY: 0,
    scaleOffsetX: 1,
    scaleOffsetY: 1,

    initialize: function(viz) {
      this.viz = viz;
      this.opt = viz.config;
      this.size = false;
      this.createCanvas();
      this.translateToCenter();
    },
    createCanvas: function() {
      var opt = this.opt,
          width = opt.width,
          height = opt.height;
      this.canvas = $E('canvas', {
        'id': opt.injectInto + opt.idSuffix,
        'width': width,
        'height': height,
        'style': {
          'position': 'absolute',
          'top': 0,
          'left': 0,
          'width': width + 'px',
          'height': height + 'px'
        }
      });
    },
    getCtx: function() {
      if(!this.ctx) 
        return this.ctx = this.canvas.getContext('2d');
      return this.ctx;
    },
    getSize: function() {
      if(this.size) return this.size;
      var canvas = this.canvas;
      return this.size = {
        width: canvas.width,
        height: canvas.height
      };
    },
    translateToCenter: function(ps) {
      var size = this.getSize(),
          width = ps? (size.width - ps.width - this.translateOffsetX*2) : size.width;
          height = ps? (size.height - ps.height - this.translateOffsetY*2) : size.height;
      var ctx = this.getCtx();
      ps && ctx.scale(1/this.scaleOffsetX, 1/this.scaleOffsetY);
      ctx.translate(width/2, height/2);
    },
    resize: function(width, height) {
      var size = this.getSize(),
          canvas = this.canvas,
          styles = canvas.style;
      this.size = false;
      canvas.width = width;
      canvas.height = height;
      styles.width = width + "px";
      styles.height = height + "px";
      //small ExCanvas fix
      if(!supportsCanvas) {
        this.translateToCenter(size);
      } else {
        this.translateToCenter();
      }
      this.translateOffsetX =
        this.translateOffsetY = 0;
      this.scaleOffsetX = 
        this.scaleOffsetY = 1;
      this.clear();
      this.viz.resize(width, height, this);
    },
    translate: function(x, y, disablePlot) {
      var sx = this.scaleOffsetX,
          sy = this.scaleOffsetY;
      this.translateOffsetX += x*sx;
      this.translateOffsetY += y*sy;
      this.getCtx().translate(x, y);
      !disablePlot && this.plot();
    },
    scale: function(x, y, disablePlot) {
      this.scaleOffsetX *= x;
      this.scaleOffsetY *= y;
      this.getCtx().scale(x, y);
      !disablePlot && this.plot();
    },
    clear: function(){
      var size = this.getSize(),
          ox = this.translateOffsetX,
          oy = this.translateOffsetY,
          sx = this.scaleOffsetX,
          sy = this.scaleOffsetY;
      this.getCtx().clearRect((-size.width / 2 - ox) * 1/sx, 
                              (-size.height / 2 - oy) * 1/sy, 
                              size.width * 1/sx, size.height * 1/sy);
    },
    plot: function() {
      this.clear();
      this.viz.plot(this);
    }
  });
  //background canvases
  //TODO(nico): document this!
  Canvas.Background = {};
  Canvas.Background.Circles = new Class({
    initialize: function(viz, options) {
      this.viz = viz;
      this.config = $.merge({
        idSuffix: '-bkcanvas',
        levelDistance: 100,
        numberOfCircles: 6,
        CanvasStyles: {},
        offset: 0
      }, options);
    },
    resize: function(width, height, base) {
      this.plot(base);
    },
    plot: function(base) {
      var canvas = base.canvas,
          ctx = base.getCtx(),
          conf = this.config,
          styles = conf.CanvasStyles;
      //set canvas styles
      for(var s in styles) ctx[s] = styles[s];
      var n = conf.numberOfCircles,
          rho = conf.levelDistance;
      for(var i=1; i<=n; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, rho * i, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
      }
      //TODO(nico): print labels too!
    }
  });
})();


/*
 * File: Complex.js
 * 
 * Defines the <Complex> class.
 *
 * Description:
 *
 * The <Complex> class, just like the <Polar> class, is used by the <Hypertree>, <ST> and <RGraph> as a 2D point representation.
 *
 * See also:
 *
 * <http://en.wikipedia.org/wiki/Complex_number>
 *
*/

/*
   Class: Complex
    
   A multi-purpose Complex Class with common methods.
 
   Description:
 
   The <Complex> class, just like the <Polar> class, is used by the <Hypertree>, <ST> and <RGraph> as a 2D point representation.
 
   See also:
 
   <http://en.wikipedia.org/wiki/Complex_number>

   Parameters:

   x - _optional_ A Complex number real part.
   y - _optional_ A Complex number imaginary part.
 
*/

var Complex = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

$jit.Complex = Complex;

Complex.prototype = {
    /*
       Method: getc
    
       Returns a complex number.
    
       Returns:
    
          A complex number.
    */
    getc: function() {
        return this;
    },

    /*
       Method: getp
    
       Returns a <Polar> representation of this number.
    
       Parameters:

       simple - _optional_ If *true*, this method will return only an object holding theta and rho properties and not a <Polar> instance. Default's *false*.

       Returns:
    
          A variable in <Polar> coordinates.
    */
    getp: function(simple) {
        return this.toPolar(simple);
    },


    /*
       Method: set
    
       Sets a number.

       Parameters:

       c - A <Complex> or <Polar> instance.
    
    */
    set: function(c) {
      c = c.getc(true);
      this.x = c.x; 
      this.y = c.y;
    },

    /*
       Method: setc
    
       Sets a complex number.

       Parameters:

       x - A <Complex> number Real part.
       y - A <Complex> number Imaginary part.
    
    */
    setc: function(x, y) {
        this.x = x; 
        this.y = y;
    },

    /*
       Method: setp
    
       Sets a polar number.

       Parameters:

       theta - A <Polar> number theta property.
       rho - A <Polar> number rho property.
    
    */
    setp: function(theta, rho) {
        this.x = Math.cos(theta) * rho;
        this.y = Math.sin(theta) * rho;
    },

    /*
       Method: clone
    
       Returns a copy of the current object.
    
       Returns:
    
          A copy of the real object.
    */
    clone: function() {
        return new Complex(this.x, this.y);
    },

    /*
       Method: toPolar
    
       Transforms cartesian to polar coordinates.
    
       Parameters:

       simple - _optional_ If *true* this method will only return an object with theta and rho properties (and not the whole <Polar> instance). Default's *false*.
       
       Returns:
    
          A new <Polar> instance.
    */
    
    toPolar: function(simple) {
        var rho = this.norm();
        var atan = Math.atan2(this.y, this.x);
        if(atan < 0) atan += Math.PI * 2;
        if(simple) return { 'theta': atan, 'rho': rho };
        return new Polar(atan, rho);
    },
    /*
       Method: norm
    
       Calculates a <Complex> number norm.
    
       Returns:
    
          A real number representing the complex norm.
    */
    norm: function () {
        return Math.sqrt(this.squaredNorm());
    },
    
    /*
       Method: squaredNorm
    
       Calculates a <Complex> number squared norm.
    
       Returns:
    
          A real number representing the complex squared norm.
    */
    squaredNorm: function () {
        return this.x*this.x + this.y*this.y;
    },

    /*
       Method: add
    
       Returns the result of adding two complex numbers.
       
       Does not alter the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of adding two complex numbers.
    */
    add: function(pos) {
        return new Complex(this.x + pos.x, this.y + pos.y);
    },

    /*
       Method: prod
    
       Returns the result of multiplying two <Complex> numbers.
       
       Does not alter the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of multiplying two complex numbers.
    */
    prod: function(pos) {
        return new Complex(this.x*pos.x - this.y*pos.y, this.y*pos.x + this.x*pos.y);
    },

    /*
       Method: conjugate
    
       Returns the conjugate of this <Complex> number.

       Does not alter the original object.

       Returns:
    
         The conjugate of this <Complex> number.
    */
    conjugate: function() {
        return new Complex(this.x, -this.y);
    },


    /*
       Method: scale
    
       Returns the result of scaling a <Complex> instance.
       
       Does not alter the original object.

       Parameters:
    
          factor - A scale factor.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    scale: function(factor) {
        return new Complex(this.x * factor, this.y * factor);
    },

    /*
       Method: equals
    
       Comparison method.

       Returns *true* if both real and imaginary parts are equal.

       Parameters:

       c - A <Complex> instance.

       Returns:

       A boolean instance indicating if both <Complex> numbers are equal.
    */
    equals: function(c) {
        return this.x == c.x && this.y == c.y;
    },

    /*
       Method: $add
    
       Returns the result of adding two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of adding two complex numbers.
    */
    $add: function(pos) {
        this.x += pos.x; this.y += pos.y;
        return this;    
    },
    
    /*
       Method: $prod
    
       Returns the result of multiplying two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of multiplying two complex numbers.
    */
    $prod:function(pos) {
        var x = this.x, y = this.y;
        this.x = x*pos.x - y*pos.y;
        this.y = y*pos.x + x*pos.y;
        return this;
    },
    
    /*
       Method: $conjugate
    
       Returns the conjugate for this <Complex>.
       
       Alters the original object.

       Returns:
    
         The conjugate for this complex.
    */
    $conjugate: function() {
        this.y = -this.y;
        return this;
    },
    
    /*
       Method: $scale
    
       Returns the result of scaling a <Complex> instance.
       
       Alters the original object.

       Parameters:
    
          factor - A scale factor.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    $scale: function(factor) {
        this.x *= factor; this.y *= factor;
        return this;
    },
    
    /*
       Method: $div
    
       Returns the division of two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> number.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    $div: function(pos) {
        var x = this.x, y = this.y;
        var sq = pos.squaredNorm();
        this.x = x * pos.x + y * pos.y; this.y = y * pos.x - x * pos.y;
        return this.$scale(1 / sq);
    },

    /*
      Method: isZero
   
      Returns *true* if the number is zero.
   
   */
    isZero: function () {
      var almostZero = 0.0001, abs = Math.abs;
      return abs(this.x) < almostZero && abs(this.y) < almostZero;
    }
};

var $C = function(a, b) { return new Complex(a, b); };

Complex.KER = $C(0, 0);



/*
 * File: Graph.js
 *
*/

/*
 Class: Graph

 A Graph Class that provides useful manipulation functions. You can find more manipulation methods in the <Graph.Util> object.

 An instance of this class can be accessed by using the *graph* parameter of any tree or graph visualization.
 
 Example:

 (start code js)
   //create new visualization
   var viz = new $jit.Viz(options);
   //load JSON data
   viz.loadJSON(json);
   //access model
   viz.graph; //<Graph> instance
 (end code)
 
 Implements:
 
 The following <Graph.Util> methods are implemented in <Graph>
 
  - <Graph.Util.getNode>
  - <Graph.Util.eachNode>
  - <Graph.Util.computeLevels>
  - <Graph.Util.eachBFS>
  - <Graph.Util.clean>
  - <Graph.Util.getClosestNodeToPos>
  - <Graph.Util.getClosestNodeToOrigin>
 
*/  

$jit.Graph = new Class({

  initialize: function(opt, Node, Edge, Label) {
    var innerOptions = {
    'klass': Complex,
    'Node': {}
    };
    this.Node = Node;
    this.Edge = Edge;
    this.Label = Label;
    this.opt = $.merge(innerOptions, opt || {});
    this.nodes = {};
    this.edges = {};
    
    //add nodeList methods
    var that = this;
    this.nodeList = {};
    for(var p in Accessors) {
      that.nodeList[p] = (function(p) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          that.eachNode(function(n) {
            n[p].apply(n, args);
          });
        };
      })(p);
    }

 },

/*
     Method: getNode
    
     Returns a <Graph.Node> by *id*.

     Parameters:

     id - (string) A <Graph.Node> id.

     Example:

     (start code js)
       var node = graph.getNode('nodeId');
     (end code)
*/  
 getNode: function(id) {
    if(this.hasNode(id)) return this.nodes[id];
    return false;
 },

 /*
     Method: get
    
     An alias for <Graph.Util.getNode>. Returns a node by *id*.
    
     Parameters:
    
     id - (string) A <Graph.Node> id.
    
     Example:
    
     (start code js)
       var node = graph.get('nodeId');
     (end code)
*/  
  get: function(id) {
    return this.getNode(id);
  },

 /*
   Method: getByName
  
   Returns a <Graph.Node> by *name*.
  
   Parameters:
  
   name - (string) A <Graph.Node> name.
  
   Example:
  
   (start code js)
     var node = graph.getByName('someName');
   (end code)
  */  
  getByName: function(name) {
    for(var id in this.nodes) {
      var n = this.nodes[id];
      if(n.name == name) return n;
    }
    return false;
  },

/*
   Method: getAdjacence
  
   Returns a <Graph.Adjacence> object connecting nodes with ids *id* and *id2*.

   Parameters:

   id - (string) A <Graph.Node> id.
   id2 - (string) A <Graph.Node> id.
*/  
  getAdjacence: function (id, id2) {
    if(id in this.edges) {
      return this.edges[id][id2];
    }
    return false;
 },

    /*
     Method: addNode
    
     Adds a node.
     
     Parameters:
    
      obj - An object with the properties described below

      id - (string) A node id
      name - (string) A node's name
      data - (object) A node's data hash

    See also:
    <Graph.Node>

  */  
  addNode: function(obj) { 
   if(!this.nodes[obj.id]) {  
     var edges = this.edges[obj.id] = {};
     this.nodes[obj.id] = new Graph.Node($.extend({
        'id': obj.id,
        'name': obj.name,
        'data': $.merge(obj.data || {}, {}),
        'adjacencies': edges 
      }, this.opt.Node), 
      this.opt.klass, 
      this.Node, 
      this.Edge,
      this.Label);
    }
    return this.nodes[obj.id];
  },
  
    /*
     Method: addAdjacence
    
     Connects nodes specified by *obj* and *obj2*. If not found, nodes are created.
     
     Parameters:
    
      obj - (object) A <Graph.Node> object.
      obj2 - (object) Another <Graph.Node> object.
      data - (object) A data object. Used to store some extra information in the <Graph.Adjacence> object created.

    See also:

    <Graph.Node>, <Graph.Adjacence>
    */  
  addAdjacence: function (obj, obj2, data) {
    if(!this.hasNode(obj.id)) { this.addNode(obj); }
    if(!this.hasNode(obj2.id)) { this.addNode(obj2); }
    obj = this.nodes[obj.id]; obj2 = this.nodes[obj2.id];
    if(!obj.adjacentTo(obj2)) {
      var adjsObj = this.edges[obj.id] = this.edges[obj.id] || {};
      var adjsObj2 = this.edges[obj2.id] = this.edges[obj2.id] || {};
      adjsObj[obj2.id] = adjsObj2[obj.id] = new Graph.Adjacence(obj, obj2, data, this.Edge, this.Label);
      return adjsObj[obj2.id];
    }
    return this.edges[obj.id][obj2.id];
 },

    /*
     Method: removeNode
    
     Removes a <Graph.Node> matching the specified *id*.

     Parameters:

     id - (string) A node's id.

    */  
  removeNode: function(id) {
    if(this.hasNode(id)) {
      delete this.nodes[id];
      var adjs = this.edges[id];
      for(var to in adjs) {
        delete this.edges[to][id];
      }
      delete this.edges[id];
    }
  },
  
/*
     Method: removeAdjacence
    
     Removes a <Graph.Adjacence> matching *id1* and *id2*.

     Parameters:

     id1 - (string) A <Graph.Node> id.
     id2 - (string) A <Graph.Node> id.
*/  
  removeAdjacence: function(id1, id2) {
    delete this.edges[id1][id2];
    delete this.edges[id2][id1];
  },

   /*
     Method: hasNode
    
     Returns a boolean indicating if the node belongs to the <Graph> or not.
     
     Parameters:
    
        id - (string) Node id.
   */  
  hasNode: function(id) {
    return id in this.nodes;
  },
  
  /*
    Method: empty

    Empties the Graph

  */
  empty: function() { this.nodes = {}; this.edges = {};}

});

var Graph = $jit.Graph;

/*
 Object: Accessors
 
 Defines a set of methods for data, canvas and label styles manipulation implemented by <Graph.Node> and <Graph.Adjacence> instances.
 
 */
var Accessors;

(function () {
  var getDataInternal = function(prefix, prop, type, force, prefixConfig) {
    var data;
    type = type || 'current';
    prefix = "$" + (prefix ? prefix + "-" : "");

    if(type == 'current') {
      data = this.data;
    } else if(type == 'start') {
      data = this.startData;
    } else if(type == 'end') {
      data = this.endData;
    }

    var dollar = prefix + prop;

    if(force) {
      return data[dollar];
    }

    if(!this.Config.overridable)
      return prefixConfig[prop] || 0;

    return (dollar in data) ?
      data[dollar] : ((dollar in this.data) ? this.data[dollar] : (prefixConfig[prop] || 0));
  }

  var setDataInternal = function(prefix, prop, value, type) {
    type = type || 'current';
    prefix = '$' + (prefix ? prefix + '-' : '');

    var data;

    if(type == 'current') {
      data = this.data;
    } else if(type == 'start') {
      data = this.startData;
    } else if(type == 'end') {
      data = this.endData;
    }

    data[prefix + prop] = value;
  }

  var removeDataInternal = function(prefix, properties) {
    prefix = '$' + (prefix ? prefix + '-' : '');
    var that = this;
    $.each(properties, function(prop) {
      var pref = prefix + prop;
      delete that.data[pref];
      delete that.endData[pref];
      delete that.startData[pref];
    });
  }

  Accessors = {
    /*
    Method: getData

    Returns the specified data value property.
    This is useful for querying special/reserved <Graph.Node> data properties
    (i.e dollar prefixed properties).

    Parameters:

      prop  - (string) The name of the property. The dollar sign is not needed. For
              example *getData(width)* will return *data.$width*.
      type  - (string) The type of the data property queried. Default's "current". You can access *start* and *end* 
              data properties also. These properties are used when making animations.
      force - (boolean) Whether to obtain the true value of the property (equivalent to
              *data.$prop*) or to check for *node.overridable = true* first.

    Returns:

      The value of the dollar prefixed property or the global Node/Edge property
      value if *overridable=false*

    Example:
    (start code js)
     node.getData('width'); //will return node.data.$width if Node.overridable=true;
    (end code)
    */
    getData: function(prop, type, force) {
      return getDataInternal.call(this, "", prop, type, force, this.Config);
    },


    /*
    Method: setData

    Sets the current data property with some specific value.
    This method is only useful for reserved (dollar prefixed) properties.

    Parameters:

      prop  - (string) The name of the property. The dollar sign is not necessary. For
              example *setData(width)* will set *data.$width*.
      value - (mixed) The value to store.
      type  - (string) The type of the data property to store. Default's "current" but
              can also be "start" or "end".

    Example:
    
    (start code js)
     node.setData('width', 30);
    (end code)
    
    If we were to make an animation of a node/edge width then we could do
    
    (start code js)
      var node = viz.getNode('nodeId');
      //set start and end values
      node.setData('width', 10, 'start');
      node.setData('width', 30, 'end');
      //will animate nodes width property
      viz.fx.animate({
        modes: ['node-property:width'],
        duration: 1000
      });
    (end code)
    */
    setData: function(prop, value, type) {
      setDataInternal.call(this, "", prop, value, type);
    },

    /*
    Method: setDataset

    Convenience method to set multiple data values at once.
    
    Parameters:
    
    types - (array|string) A set of 'current', 'end' or 'start' values.
    obj - (object) A hash containing the names and values of the properties to be altered.

    Example:
    (start code js)
      node.setDataset(['current', 'end'], {
        'width': [100, 5],
        'color': ['#fff', '#ccc']
      });
      //...or also
      node.setDataset('end', {
        'width': 5,
        'color': '#ccc'
      });
    (end code)
    
    See also: 
    
    <Accessors.setData>
    
    */
    setDataset: function(types, obj) {
      types = $.splat(types);
      for(var attr in obj) {
        for(var i=0, val = $.splat(obj[attr]), l=types.length; i<l; i++) {
          this.setData(attr, val[i], types[i]);
        }
      }
    },
    
    /*
    Method: removeData

    Remove data properties.

    Parameters:

    One or more property names as arguments. The dollar sign is not needed.

    Example:
    (start code js)
    node.removeData('width'); //now the default width value is returned
    (end code)
    */
    removeData: function() {
      removeDataInternal.call(this, "", Array.prototype.slice.call(arguments));
    },

    /*
    Method: getCanvasStyle

    Returns the specified canvas style data value property. This is useful for
    querying special/reserved <Graph.Node> canvas style data properties (i.e.
    dollar prefixed properties that match with $canvas-<name of canvas style>).

    Parameters:

      prop  - (string) The name of the property. The dollar sign is not needed. For
              example *getCanvasStyle(shadowBlur)* will return *data[$canvas-shadowBlur]*.
      type  - (string) The type of the data property queried. Default's *current*. You can access *start* and *end* 
              data properties also.
              
    Example:
    (start code js)
      node.getCanvasStyle('shadowBlur');
    (end code)
    
    See also:
    
    <Accessors.getData>
    */
    getCanvasStyle: function(prop, type, force) {
      return getDataInternal.call(
          this, 'canvas', prop, type, force, this.Config.CanvasStyles);
    },

    /*
    Method: setCanvasStyle

    Sets the canvas style data property with some specific value.
    This method is only useful for reserved (dollar prefixed) properties.
    
    Parameters:
    
    prop - (string) Name of the property. Can be any canvas property like 'shadowBlur', 'shadowColor', 'strokeStyle', etc.
    value - (mixed) The value to set to the property.
    type - (string) Default's *current*. Whether to set *start*, *current* or *end* type properties.
    
    Example:
    
    (start code js)
     node.setCanvasStyle('shadowBlur', 30);
    (end code)
    
    If we were to make an animation of a node/edge shadowBlur canvas style then we could do
    
    (start code js)
      var node = viz.getNode('nodeId');
      //set start and end values
      node.setCanvasStyle('shadowBlur', 10, 'start');
      node.setCanvasStyle('shadowBlur', 30, 'end');
      //will animate nodes canvas style property for nodes
      viz.fx.animate({
        modes: ['node-style:shadowBlur'],
        duration: 1000
      });
    (end code)
    
    See also:
    
    <Accessors.setData>.
    */
    setCanvasStyle: function(prop, value, type) {
      setDataInternal.call(this, 'canvas', prop, value, type);
    },

    /*
    Method: setCanvasStyles

    Convenience method to set multiple styles at once.

    Parameters:
    
    types - (array|string) A set of 'current', 'end' or 'start' values.
    obj - (object) A hash containing the names and values of the properties to be altered.

    See also:
    
    <Accessors.setDataset>.
    */
    setCanvasStyles: function(types, obj) {
      types = $.splat(types);
      for(var attr in obj) {
        for(var i=0, val = $.splat(obj[attr]), l=types.length; i<l; i++) {
          this.setCanvasStyle(attr, val[i], types[i]);
        }
      }
    },

    /*
    Method: removeCanvasStyle

    Remove canvas style properties from data.

    Parameters:
    
    A variable number of canvas style strings.

    See also:
    
    <Accessors.removeData>.
    */
    removeCanvasStyle: function() {
      removeDataInternal.call(this, 'canvas', Array.prototype.slice.call(arguments));
    },

    /*
    Method: getLabelData

    Returns the specified label data value property. This is useful for
    querying special/reserved <Graph.Node> label options (i.e.
    dollar prefixed properties that match with $label-<name of label style>).

    Parameters:

      prop  - (string) The name of the property. The dollar sign prefix is not needed. For
              example *getLabelData(size)* will return *data[$label-size]*.
      type  - (string) The type of the data property queried. Default's *current*. You can access *start* and *end* 
              data properties also.
              
    See also:
    
    <Accessors.getData>.
    */
    getLabelData: function(prop, type, force) {
      return getDataInternal.call(
          this, 'label', prop, type, force, this.Label);
    },

    /*
    Method: setLabelData

    Sets the current label data with some specific value.
    This method is only useful for reserved (dollar prefixed) properties.

    Parameters:
    
    prop - (string) Name of the property. Can be any canvas property like 'shadowBlur', 'shadowColor', 'strokeStyle', etc.
    value - (mixed) The value to set to the property.
    type - (string) Default's *current*. Whether to set *start*, *current* or *end* type properties.
    
    Example:
    
    (start code js)
     node.setLabelData('size', 30);
    (end code)
    
    If we were to make an animation of a node label size then we could do
    
    (start code js)
      var node = viz.getNode('nodeId');
      //set start and end values
      node.setLabelData('size', 10, 'start');
      node.setLabelData('size', 30, 'end');
      //will animate nodes label size
      viz.fx.animate({
        modes: ['label-property:size'],
        duration: 1000
      });
    (end code)
    
    See also:
    
    <Accessors.setData>.
    */
    setLabelData: function(prop, value, type) {
      setDataInternal.call(this, 'label', prop, value, type);
    },

    /*
    Method: setLabelDataset

    Convenience function to set multiple label data at once.

    Parameters:
    
    types - (array|string) A set of 'current', 'end' or 'start' values.
    obj - (object) A hash containing the names and values of the properties to be altered.

    See also:
    
    <Accessors.setDataset>.
    */
    setLabelDataset: function(types, obj) {
      types = $.splat(types);
      for(var attr in obj) {
        for(var i=0, val = $.splat(obj[attr]), l=types.length; i<l; i++) {
          this.setLabelData(attr, val[i], types[i]);
        }
      }
    },

    /*
    Method: removeLabelData

    Remove label properties from data.
    
    Parameters:
    
    A variable number of label property strings.

    See also:
    
    <Accessors.removeData>.
    */
    removeLabelData: function() {
      removeDataInternal.call(this, 'label', Array.prototype.slice.call(arguments));
    }
  };
})();

/*
     Class: Graph.Node

     A <Graph> node.
     
     Implements:
     
     <Accessors> methods.
     
     The following <Graph.Util> methods are implemented by <Graph.Node>
     
    - <Graph.Util.eachAdjacency>
    - <Graph.Util.eachLevel>
    - <Graph.Util.eachSubgraph>
    - <Graph.Util.eachSubnode>
    - <Graph.Util.anySubnode>
    - <Graph.Util.getSubnodes>
    - <Graph.Util.getParents>
    - <Graph.Util.isDescendantOf>     
*/
Graph.Node = new Class({
    
  initialize: function(opt, klass, Node, Edge, Label) {
    var innerOptions = {
      'id': '',
      'name': '',
      'data': {},
      'startData': {},
      'endData': {},
      'adjacencies': {},

      'selected': false,
      'drawn': false,
      'exist': false,

      'angleSpan': {
        'begin': 0,
        'end' : 0
      },

      'pos': new klass,
      'startPos': new klass,
      'endPos': new klass
    };
    
    $.extend(this, $.extend(innerOptions, opt));
    this.Config = this.Node = Node;
    this.Edge = Edge;
    this.Label = Label;
  },

    /*
       Method: adjacentTo
    
       Indicates if the node is adjacent to the node specified by id

       Parameters:
    
          id - (string) A node id.
    
       Example:
       (start code js)
        node.adjacentTo('nodeId') == true;
       (end code)
    */
    adjacentTo: function(node) {
        return node.id in this.adjacencies;
    },

    /*
       Method: getAdjacency
    
       Returns a <Graph.Adjacence> object connecting the current <Graph.Node> and the node having *id* as id.

       Parameters:
    
          id - (string) A node id.
    */  
    getAdjacency: function(id) {
        return this.adjacencies[id];
    },

    /*
      Method: getPos
   
      Returns the position of the node.
  
      Parameters:
   
         type - (string) Default's *current*. Possible values are "start", "end" or "current".
   
      Returns:
   
        A <Complex> or <Polar> instance.
  
      Example:
      (start code js)
       var pos = node.getPos('end');
      (end code)
   */
   getPos: function(type) {
       type = type || "current";
       if(type == "current") {
         return this.pos;
       } else if(type == "end") {
         return this.endPos;
       } else if(type == "start") {
         return this.startPos;
       }
   },
   /*
     Method: setPos
  
     Sets the node's position.
  
     Parameters:
  
        value - (object) A <Complex> or <Polar> instance.
        type - (string) Default's *current*. Possible values are "start", "end" or "current".
  
     Example:
     (start code js)
      node.setPos(new $jit.Complex(0, 0), 'end');
     (end code)
  */
  setPos: function(value, type) {
      type = type || "current";
      var pos;
      if(type == "current") {
        pos = this.pos;
      } else if(type == "end") {
        pos = this.endPos;
      } else if(type == "start") {
        pos = this.startPos;
      }
      pos.set(value);
  }
});

Graph.Node.implement(Accessors);

/*
     Class: Graph.Adjacence

     A <Graph> adjacence (or edge) connecting two <Graph.Nodes>.
     
     Implements:
     
     <Accessors> methods.

     See also:

     <Graph>, <Graph.Node>

     Properties:
     
      nodeFrom - A <Graph.Node> connected by this edge.
      nodeTo - Another  <Graph.Node> connected by this edge.
      data - Node data property containing a hash (i.e {}) with custom options.
*/
Graph.Adjacence = new Class({
  
  initialize: function(nodeFrom, nodeTo, data, Edge, Label) {
    this.nodeFrom = nodeFrom;
    this.nodeTo = nodeTo;
    this.data = data || {};
    this.startData = {};
    this.endData = {};
    this.Config = this.Edge = Edge;
    this.Label = Label;
  }
});

Graph.Adjacence.implement(Accessors);

/*
   Object: Graph.Util

   <Graph> traversal and processing utility object.
   
   Note:
   
   For your convenience some of these methods have also been appended to <Graph> and <Graph.Node> classes.
*/
Graph.Util = {
    /*
       filter
    
       For internal use only. Provides a filtering function based on flags.
    */
    filter: function(param) {
        if(!param || !($.type(param) == 'string')) return function() { return true; };
        var props = param.split(" ");
        return function(elem) {
            for(var i=0; i<props.length; i++) { 
              if(elem[props[i]]) { 
                return false; 
              }
            }
            return true;
        };
    },
    /*
       Method: getNode
    
       Returns a <Graph.Node> by *id*.
       
       Also implemented by:
       
       <Graph>

       Parameters:

       graph - (object) A <Graph> instance.
       id - (string) A <Graph.Node> id.

       Example:

       (start code js)
         $jit.Graph.Util.getNode(graph, 'nodeid');
         //or...
         graph.getNode('nodeid');
       (end code)
    */
    getNode: function(graph, id) {
        return graph.nodes[id];
    },
    
    /*
       Method: eachNode
    
       Iterates over <Graph> nodes performing an *action*.
       
       Also implemented by:
       
       <Graph>.

       Parameters:

       graph - (object) A <Graph> instance.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachNode(graph, function(node) {
          alert(node.name);
         });
         //or...
         graph.eachNode(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachNode: function(graph, action, flags) {
        var filter = this.filter(flags);
        for(var i in graph.nodes) {
          if(filter(graph.nodes[i])) action(graph.nodes[i]);
        } 
    },
    
    /*
      Method: each
   
      Iterates over <Graph> nodes performing an *action*. It's an alias for <Graph.Util.eachNode>.
      
      Also implemented by:
      
      <Graph>.
  
      Parameters:
  
      graph - (object) A <Graph> instance.
      action - (function) A callback function having a <Graph.Node> as first formal parameter.
  
      Example:
      (start code js)
        $jit.Graph.Util.each(graph, function(node) {
         alert(node.name);
        });
        //or...
        graph.each(function(node) {
          alert(node.name);
        });
      (end code)
   */
   each: function(graph, action, flags) {
      this.eachNode(graph, action, flags); 
   },

 /*
       Method: eachAdjacency
    
       Iterates over <Graph.Node> adjacencies applying the *action* function.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:

       node - (object) A <Graph.Node>.
       action - (function) A callback function having <Graph.Adjacence> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachAdjacency(node, function(adj) {
          alert(adj.nodeTo.name);
         });
         //or...
         node.eachAdjacency(function(adj) {
           alert(adj.nodeTo.name);
         });
       (end code)
    */
    eachAdjacency: function(node, action, flags) {
        var adj = node.adjacencies, filter = this.filter(flags);
        for(var id in adj) {
          var a = adj[id];
          if(filter(a)) {
            if(a.nodeFrom != node) {
              var tmp = a.nodeFrom;
              a.nodeFrom = a.nodeTo;
              a.nodeTo = tmp;
            }
            action(a, id);
          }
        }
    },

     /*
       Method: computeLevels
    
       Performs a BFS traversal setting the correct depth for each node.
        
       Also implemented by:
       
       <Graph>.
       
       Note:
       
       The depth of each node can then be accessed by 
       >node._depth

       Parameters:

       graph - (object) A <Graph>.
       id - (string) A starting node id for the BFS traversal.
       startDepth - (optional|number) A minimum depth value. Default's 0.

    */
    computeLevels: function(graph, id, startDepth, flags) {
        startDepth = startDepth || 0;
        var filter = this.filter(flags);
        this.eachNode(graph, function(elem) {
            elem._flag = false;
            elem._depth = -1;
        }, flags);
        var root = graph.getNode(id);
        root._depth = startDepth;
        var queue = [root];
        while(queue.length != 0) {
            var node = queue.pop();
            node._flag = true;
            this.eachAdjacency(node, function(adj) {
                var n = adj.nodeTo;
                if(n._flag == false && filter(n)) {
                    if(n._depth < 0) n._depth = node._depth + 1 + startDepth;
                    queue.unshift(n);
                }
            }, flags);
        }
    },

    /*
       Method: eachBFS
    
       Performs a BFS traversal applying *action* to each <Graph.Node>.
       
       Also implemented by:
       
       <Graph>.

       Parameters:

       graph - (object) A <Graph>.
       id - (string) A starting node id for the BFS traversal.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachBFS(graph, 'mynodeid', function(node) {
          alert(node.name);
         });
         //or...
         graph.eachBFS('mynodeid', function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachBFS: function(graph, id, action, flags) {
        var filter = this.filter(flags);
        this.clean(graph);
        var queue = [graph.getNode(id)];
        while(queue.length != 0) {
            var node = queue.pop();
            node._flag = true;
            action(node, node._depth);
            this.eachAdjacency(node, function(adj) {
                var n = adj.nodeTo;
                if(n._flag == false && filter(n)) {
                    n._flag = true;
                    queue.unshift(n);
                }
            }, flags);
        }
    },
    
    /*
       Method: eachLevel
    
       Iterates over a node's subgraph applying *action* to the nodes of relative depth between *levelBegin* and *levelEnd*.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       
       node - (object) A <Graph.Node>.
       levelBegin - (number) A relative level value.
       levelEnd - (number) A relative level value.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

    */
    eachLevel: function(node, levelBegin, levelEnd, action, flags) {
        var d = node._depth, filter = this.filter(flags), that = this;
        levelEnd = levelEnd === false? Number.MAX_VALUE -d : levelEnd;
        (function loopLevel(node, levelBegin, levelEnd) {
            var d = node._depth;
            if(d >= levelBegin && d <= levelEnd && filter(node)) action(node, d);
            if(d < levelEnd) {
                that.eachAdjacency(node, function(adj) {
                    var n = adj.nodeTo;
                    if(n._depth > d) loopLevel(n, levelBegin, levelEnd);
                });
            }
        })(node, levelBegin + d, levelEnd + d);      
    },

    /*
       Method: eachSubgraph
    
       Iterates over a node's children recursively.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachSubgraph(node, function(node) {
           alert(node.name);
         });
         //or...
         node.eachSubgraph(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachSubgraph: function(node, action, flags) {
      this.eachLevel(node, 0, false, action, flags);
    },

    /*
       Method: eachSubnode
    
       Iterates over a node's children (without deeper recursion).
       
       Also implemented by:
       
       <Graph.Node>.
       
       Parameters:
       node - (object) A <Graph.Node>.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachSubnode(node, function(node) {
          alert(node.name);
         });
         //or...
         node.eachSubnode(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachSubnode: function(node, action, flags) {
        this.eachLevel(node, 1, 1, action, flags);
    },

    /*
       Method: anySubnode
    
       Returns *true* if any subnode matches the given condition.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       cond - (function) A callback function returning a Boolean instance. This function has as first formal parameter a <Graph.Node>.

       Example:
       (start code js)
         $jit.Graph.Util.anySubnode(node, function(node) { return node.name == "mynodename"; });
         //or...
         node.anySubnode(function(node) { return node.name == 'mynodename'; });
       (end code)
    */
    anySubnode: function(node, cond, flags) {
      var flag = false;
      cond = cond || $.lambda(true);
      var c = $.type(cond) == 'string'? function(n) { return n[cond]; } : cond;
      this.eachSubnode(node, function(elem) {
        if(c(elem)) flag = true;
      }, flags);
      return flag;
    },
  
    /*
       Method: getSubnodes
    
       Collects all subnodes for a specified node. 
       The *level* parameter filters nodes having relative depth of *level* from the root node. 
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       level - (optional|number) Default's *0*. A starting relative depth for collecting nodes.

       Returns:
       An array of nodes.

    */
    getSubnodes: function(node, level, flags) {
        var ans = [], that = this;
        level = level || 0;
        var levelStart, levelEnd;
        if($.type(level) == 'array') {
            levelStart = level[0];
            levelEnd = level[1];
        } else {
            levelStart = level;
            levelEnd = Number.MAX_VALUE - node._depth;
        }
        this.eachLevel(node, levelStart, levelEnd, function(n) {
            ans.push(n);
        }, flags);
        return ans;
    },
  
  
    /*
       Method: getParents
    
       Returns an Array of <Graph.Nodes> which are parents of the given node.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.

       Returns:
       An Array of <Graph.Nodes>.

       Example:
       (start code js)
         var pars = $jit.Graph.Util.getParents(node);
         //or...
         var pars = node.getParents();
         
         if(pars.length > 0) {
           //do stuff with parents
         }
       (end code)
    */
    getParents: function(node) {
        var ans = [];
        this.eachAdjacency(node, function(adj) {
            var n = adj.nodeTo;
            if(n._depth < node._depth) ans.push(n);
        });
        return ans;
    },
    
    /*
    Method: isDescendantOf
 
    Returns a boolean indicating if some node is descendant of the node with the given id. 

    Also implemented by:
    
    <Graph.Node>.
    
    
    Parameters:
    node - (object) A <Graph.Node>.
    id - (string) A <Graph.Node> id.

    Example:
    (start code js)
      $jit.Graph.Util.isDescendantOf(node, "nodeid"); //true|false
      //or...
      node.isDescendantOf('nodeid');//true|false
    (end code)
 */
 isDescendantOf: function(node, id) {
    if(node.id == id) return true;
    var pars = this.getParents(node), ans = false;
    for ( var i = 0; !ans && i < pars.length; i++) {
    ans = ans || this.isDescendantOf(pars[i], id);
  }
    return ans;
 },

 /*
     Method: clean
  
     Cleans flags from nodes.

     Also implemented by:
     
     <Graph>.
     
     Parameters:
     graph - A <Graph> instance.
  */
  clean: function(graph) { this.eachNode(graph, function(elem) { elem._flag = false; }); },
  
  /* 
    Method: getClosestNodeToOrigin 
  
    Returns the closest node to the center of canvas.
  
    Also implemented by:
    
    <Graph>.
    
    Parameters:
   
     graph - (object) A <Graph> instance.
     prop - (optional|string) Default's 'current'. A <Graph.Node> position property. Possible properties are 'start', 'current' or 'end'.
  
  */
  getClosestNodeToOrigin: function(graph, prop, flags) {
   return this.getClosestNodeToPos(graph, Polar.KER, prop, flags);
  },
  
  /* 
    Method: getClosestNodeToPos
  
    Returns the closest node to the given position.
  
    Also implemented by:
    
    <Graph>.
    
    Parameters:
   
     graph - (object) A <Graph> instance.
     pos - (object) A <Complex> or <Polar> instance.
     prop - (optional|string) Default's *current*. A <Graph.Node> position property. Possible properties are 'start', 'current' or 'end'.
  
  */
  getClosestNodeToPos: function(graph, pos, prop, flags) {
   var node = null;
   prop = prop || 'current';
   pos = pos && pos.getc(true) || Complex.KER;
   var distance = function(a, b) {
     var d1 = a.x - b.x, d2 = a.y - b.y;
     return d1 * d1 + d2 * d2;
   };
   this.eachNode(graph, function(elem) {
     node = (node == null || distance(elem.getPos(prop).getc(true), pos) < distance(
         node.getPos(prop).getc(true), pos)) ? elem : node;
   }, flags);
   return node;
  } 
};

//Append graph methods to <Graph>
$.each(['get', 'getNode', 'each', 'eachNode', 'computeLevels', 'eachBFS', 'clean', 'getClosestNodeToPos', 'getClosestNodeToOrigin'], function(m) {
  Graph.prototype[m] = function() {
    return Graph.Util[m].apply(Graph.Util, [this].concat(Array.prototype.slice.call(arguments)));
  };
});

//Append node methods to <Graph.Node>
$.each(['eachAdjacency', 'eachLevel', 'eachSubgraph', 'eachSubnode', 'anySubnode', 'getSubnodes', 'getParents', 'isDescendantOf'], function(m) {
  Graph.Node.prototype[m] = function() {
    return Graph.Util[m].apply(Graph.Util, [this].concat(Array.prototype.slice.call(arguments)));
  };
});

/*
 * File: Helpers.js
 
   Helpers are objects that contain rendering primitives (like rectangles, ellipses, etc), for plotting nodes and edges.
   Helpers also contain implementations of the *contains* method, a method returning a boolean indicating whether the mouse
   position is over the rendered shape.
   
   Helpers are very useful when implementing new NodeTypes, since you can access them through *this.nodeHelper* and 
   *this.edgeHelper* <Graph.Plot> properties, providing you with simple primitives and mouse-position check functions.
   
   Example:
   (start code js)
   //implement a new node type
   $jit.Viz.Plot.NodeTypes.implement({
     'customNodeType': {
       'render': function(node, canvas) {
         this.nodeHelper.circle.render ...
       },
       'contains': function(node, pos) {
         this.nodeHelper.circle.contains ...
       }
     }
   });
   //implement an edge type
   $jit.Viz.Plot.EdgeTypes.implement({
     'customNodeType': {
       'render': function(node, canvas) {
         this.edgeHelper.circle.render ...
       },
       //optional
       'contains': function(node, pos) {
         this.edgeHelper.circle.contains ...
       }
     }
   });
   (end code)

*/

/*
   Object: NodeHelper
   
   Contains rendering and other type of primitives for simple shapes.
 */
var NodeHelper = {
  'none': {
    'render': $.empty,
    'contains': $.lambda(false)
  },
  /*
   Object: NodeHelper.circle
   */
  'circle': {
    /*
     Method: render
     
     Renders a circle into the canvas.
     
     Parameters:
     
     type - (string) Possible options are 'fill' or 'stroke'.
     pos - (object) An *x*, *y* object with the position of the center of the circle.
     radius - (number) The radius of the circle to be rendered.
     canvas - (object) A <Canvas> instance.
     
     Example:
     (start code js)
     NodeHelper.circle.render('fill', { x: 10, y: 30 }, 30, viz.canvas);
     (end code)
     */
    'render': function(type, pos, radius, canvas){
      var ctx = canvas.getCtx();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx[type]();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    radius - (number) The radius of the rendered circle.
    
    Example:
    (start code js)
    NodeHelper.circle.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30); //true
    (end code)
    */
    'contains': function(npos, pos, radius){
      var diffx = npos.x - pos.x, 
          diffy = npos.y - pos.y, 
          diff = diffx * diffx + diffy * diffy;
      return diff <= radius * radius;
    }
  },
  /*
  Object: NodeHelper.ellipse
  */
  'ellipse': {
    /*
    Method: render
    
    Renders an ellipse into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the ellipse.
    width - (number) The width of the ellipse.
    height - (number) The height of the ellipse.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.ellipse.render('fill', { x: 10, y: 30 }, 30, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, width, height, canvas){
      var ctx = canvas.getCtx(),
          scalex = 1,
          scaley = 1,
          scaleposx = 1,
          scaleposy = 1,
          radius = 0;

      if (width > height) {
          radius = width / 2;
          scaley = height / width;
          scaleposy = width / height;
      } else {
          radius = height / 2;
          scalex = width / height;
          scaleposx = height / width;
      }

      ctx.save();
      ctx.scale(scalex, scaley);
      ctx.beginPath();
      ctx.arc(pos.x * scaleposx, pos.y * scaleposy, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx[type]();
      ctx.restore();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    width - (number) The width of the rendered ellipse.
    height - (number) The height of the rendered ellipse.
    
    Example:
    (start code js)
    NodeHelper.ellipse.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30, 40);
    (end code)
    */
    'contains': function(npos, pos, width, height){
      var radius = 0,
          scalex = 1,
          scaley = 1,
          diffx = 0,
          diffy = 0,
          diff = 0;

      if (width > height) {
	      radius = width / 2;
	      scaley = height / width;
      } else {
          radius = height / 2;
          scalex = width / height;
      }

      diffx = (npos.x - pos.x) * (1 / scalex);
      diffy = (npos.y - pos.y) * (1 / scaley);
      diff = diffx * diffx + diffy * diffy;
      return diff <= radius * radius;
    }
  },
  /*
  Object: NodeHelper.square
  */
  'square': {
    /*
    Method: render
    
    Renders a square into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the square.
    dim - (number) The radius (or half-diameter) of the square.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.square.render('stroke', { x: 10, y: 30 }, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, dim, canvas){
      canvas.getCtx()[type + "Rect"](pos.x - dim, pos.y - dim, 2*dim, 2*dim);
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    dim - (number) The radius (or half-diameter) of the square.
    
    Example:
    (start code js)
    NodeHelper.square.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(npos, pos, dim){
      return Math.abs(pos.x - npos.x) <= dim && Math.abs(pos.y - npos.y) <= dim;
    }
  },
  /*
  Object: NodeHelper.rectangle
  */
  'rectangle': {
    /*
    Method: render
    
    Renders a rectangle into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the rectangle.
    width - (number) The width of the rectangle.
    height - (number) The height of the rectangle.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.rectangle.render('fill', { x: 10, y: 30 }, 30, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, width, height, canvas){
      canvas.getCtx()[type + "Rect"](pos.x - width / 2, pos.y - height / 2, 
                                      width, height);
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    width - (number) The width of the rendered rectangle.
    height - (number) The height of the rendered rectangle.
    
    Example:
    (start code js)
    NodeHelper.rectangle.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30, 40);
    (end code)
    */
    'contains': function(npos, pos, width, height){
      return Math.abs(pos.x - npos.x) <= width / 2
          && Math.abs(pos.y - npos.y) <= height / 2;
    }
  },
  /*
  Object: NodeHelper.triangle
  */
  'triangle': {
    /*
    Method: render
    
    Renders a triangle into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the triangle.
    dim - (number) Half the base and half the height of the triangle.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.triangle.render('stroke', { x: 10, y: 30 }, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, dim, canvas){
      var ctx = canvas.getCtx(), 
          c1x = pos.x, 
          c1y = pos.y - dim, 
          c2x = c1x - dim, 
          c2y = pos.y + dim, 
          c3x = c1x + dim, 
          c3y = c2y;
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c2x, c2y);
      ctx.lineTo(c3x, c3y);
      ctx.closePath();
      ctx[type]();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    dim - (number) Half the base and half the height of the triangle.
    
    Example:
    (start code js)
    NodeHelper.triangle.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(npos, pos, dim) {
      return NodeHelper.circle.contains(npos, pos, dim);
    }
  },
  /*
  Object: NodeHelper.star
  */
  'star': {
    /*
    Method: render
    
    Renders a star (concave decagon) into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the star.
    dim - (number) The length of a side of a concave decagon.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.star.render('stroke', { x: 10, y: 30 }, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, dim, canvas){
      var ctx = canvas.getCtx(), 
          pi5 = Math.PI / 5;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.beginPath();
      ctx.moveTo(dim, 0);
      for (var i = 0; i < 9; i++) {
        ctx.rotate(pi5);
        if (i % 2 == 0) {
          ctx.lineTo((dim / 0.525731) * 0.200811, 0);
        } else {
          ctx.lineTo(dim, 0);
        }
      }
      ctx.closePath();
      ctx[type]();
      ctx.restore();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    dim - (number) The length of a side of a concave decagon.
    
    Example:
    (start code js)
    NodeHelper.star.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(npos, pos, dim) {
      return NodeHelper.circle.contains(npos, pos, dim);
    }
  }
};

/*
  Object: EdgeHelper
  
  Contains rendering primitives for simple edge shapes.
*/
var EdgeHelper = {
  /*
    Object: EdgeHelper.line
  */
  'line': {
      /*
      Method: render
      
      Renders a line into the canvas.
      
      Parameters:
      
      from - (object) An *x*, *y* object with the starting position of the line.
      to - (object) An *x*, *y* object with the ending position of the line.
      canvas - (object) A <Canvas> instance.
      
      Example:
      (start code js)
      EdgeHelper.line.render({ x: 10, y: 30 }, { x: 10, y: 50 }, viz.canvas);
      (end code)
      */
      'render': function(from, to, canvas){
        var ctx = canvas.getCtx();
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      },
      /*
      Method: contains
      
      Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
      
      Parameters:
      
      posFrom - (object) An *x*, *y* object with a <Graph.Node> position.
      posTo - (object) An *x*, *y* object with a <Graph.Node> position.
      pos - (object) An *x*, *y* object with the position to check.
      epsilon - (number) The dimension of the shape.
      
      Example:
      (start code js)
      EdgeHelper.line.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, { x: 15, y: 35 }, 30);
      (end code)
      */
      'contains': function(posFrom, posTo, pos, epsilon) {
        var min = Math.min, 
            max = Math.max,
            minPosX = min(posFrom.x, posTo.x),
            maxPosX = max(posFrom.x, posTo.x),
            minPosY = min(posFrom.y, posTo.y),
            maxPosY = max(posFrom.y, posTo.y);
        
        if(pos.x >= minPosX && pos.x <= maxPosX 
            && pos.y >= minPosY && pos.y <= maxPosY) {
          if(Math.abs(posTo.x - posFrom.x) <= epsilon) {
            return true;
          }
          var dist = (posTo.y - posFrom.y) / (posTo.x - posFrom.x) * (pos.x - posFrom.x) + posFrom.y;
          return Math.abs(dist - pos.y) <= epsilon;
        }
        return false;
      }
    },
  /*
    Object: EdgeHelper.arrow
  */
  'arrow': {
      /*
      Method: render
      
      Renders an arrow into the canvas.
      
      Parameters:
      
      from - (object) An *x*, *y* object with the starting position of the arrow.
      to - (object) An *x*, *y* object with the ending position of the arrow.
      dim - (number) The dimension of the arrow.
      swap - (boolean) Whether to set the arrow pointing to the starting position or the ending position.
      canvas - (object) A <Canvas> instance.
      
      Example:
      (start code js)
      EdgeHelper.arrow.render({ x: 10, y: 30 }, { x: 10, y: 50 }, 13, false, viz.canvas);
      (end code)
      */
    'render': function(from, to, dim, swap, canvas){
        var ctx = canvas.getCtx();
        // invert edge direction
        if (swap) {
          var tmp = from;
          from = to;
          to = tmp;
        }
        var vect = new Complex(to.x - from.x, to.y - from.y);
        vect.$scale(dim / vect.norm());
        var intermediatePoint = new Complex(to.x - vect.x, to.y - vect.y),
            normal = new Complex(-vect.y / 2, vect.x / 2),
            v1 = intermediatePoint.add(normal), 
            v2 = intermediatePoint.$add(normal.$scale(-1));
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(to.x, to.y);
        ctx.closePath();
        ctx.fill();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    posFrom - (object) An *x*, *y* object with a <Graph.Node> position.
    posTo - (object) An *x*, *y* object with a <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    epsilon - (number) The dimension of the shape.
    
    Example:
    (start code js)
    EdgeHelper.arrow.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(posFrom, posTo, pos, epsilon) {
      return EdgeHelper.line.contains(posFrom, posTo, pos, epsilon);
    }
  }
};


/*
 * File: Graph.Plot.js
 */

/*
   Object: Graph.Plot

   <Graph> rendering and animation methods.
   
   Properties:
   
   nodeHelper - <NodeHelper> object.
   edgeHelper - <EdgeHelper> object.
*/
Graph.Plot = {
    //Default initializer
    initialize: function(viz, klass){
      this.viz = viz;
      this.config = viz.config;
      this.node = viz.config.Node;
      this.edge = viz.config.Edge;
      this.animation = new Animation;
      this.nodeTypes = new klass.Plot.NodeTypes;
      this.edgeTypes = new klass.Plot.EdgeTypes;
      this.labels = viz.labels;
   },

    //Add helpers
    nodeHelper: NodeHelper,
    edgeHelper: EdgeHelper,
    
    Interpolator: {
        //node/edge property parsers
        'map': {
          'border': 'color',
          'color': 'color',
          'width': 'number',
          'height': 'number',
          'dim': 'number',
          'alpha': 'number',
          'lineWidth': 'number',
          'angularWidth':'number',
          'span':'number',
          'valueArray':'array-number',
          'dimArray':'array-number'
          //'colorArray':'array-color'
        },
        
        //canvas specific parsers
        'canvas': {
          'globalAlpha': 'number',
          'fillStyle': 'color',
          'strokeStyle': 'color',
          'lineWidth': 'number',
          'shadowBlur': 'number',
          'shadowColor': 'color',
          'shadowOffsetX': 'number',
          'shadowOffsetY': 'number',
          'miterLimit': 'number'
        },
  
        //label parsers
        'label': {
          'size': 'number',
          'color': 'color'
        },
  
        //Number interpolator
        'compute': function(from, to, delta) {
          return from + (to - from) * delta;
        },
        
        //Position interpolators
        'moebius': function(elem, props, delta, vector) {
          var v = vector.scale(-delta);  
          if(v.norm() < 1) {
              var x = v.x, y = v.y;
              var ans = elem.startPos
                .getc().moebiusTransformation(v);
              elem.pos.setc(ans.x, ans.y);
              v.x = x; v.y = y;
            }           
        },

        'linear': function(elem, props, delta) {
            var from = elem.startPos.getc(true);
            var to = elem.endPos.getc(true);
            elem.pos.setc(this.compute(from.x, to.x, delta), 
                          this.compute(from.y, to.y, delta));
        },

        'polar': function(elem, props, delta) {
          var from = elem.startPos.getp(true);
          var to = elem.endPos.getp();
          var ans = to.interpolate(from, delta);
          elem.pos.setp(ans.theta, ans.rho);
        },
        
        //Graph's Node/Edge interpolators
        'number': function(elem, prop, delta, getter, setter) {
          var from = elem[getter](prop, 'start');
          var to = elem[getter](prop, 'end');
          elem[setter](prop, this.compute(from, to, delta));
        },

        'color': function(elem, prop, delta, getter, setter) {
          var from = $.hexToRgb(elem[getter](prop, 'start'));
          var to = $.hexToRgb(elem[getter](prop, 'end'));
          var comp = this.compute;
          var val = $.rgbToHex([parseInt(comp(from[0], to[0], delta)),
                                parseInt(comp(from[1], to[1], delta)),
                                parseInt(comp(from[2], to[2], delta))]);
          
          elem[setter](prop, val);
        },
        
        'array-number': function(elem, prop, delta, getter, setter) {
          var from = elem[getter](prop, 'start'),
              to = elem[getter](prop, 'end'),
              cur = [];
          for(var i=0, l=from.length; i<l; i++) {
            var fromi = from[i], toi = to[i];
            if(fromi.length) {
              for(var j=0, len=fromi.length, curi=[]; j<len; j++) {
                curi.push(this.compute(fromi[j], toi[j], delta));
              }
              cur.push(curi);
            } else {
              cur.push(this.compute(fromi, toi, delta));
            }
          }
          elem[setter](prop, cur);
        },
        
        'node': function(elem, props, delta, map, getter, setter) {
          map = this[map];
          if(props) {
            var len = props.length;
            for(var i=0; i<len; i++) {
              var pi = props[i];
              this[map[pi]](elem, pi, delta, getter, setter);
            }
          } else {
            for(var pi in map) {
              this[map[pi]](elem, pi, delta, getter, setter);
            }
          }
        },
        
        'edge': function(elem, props, delta, mapKey, getter, setter) {
            var adjs = elem.adjacencies;
            for(var id in adjs) this['node'](adjs[id], props, delta, mapKey, getter, setter);
        },
        
        'node-property': function(elem, props, delta) {
          this['node'](elem, props, delta, 'map', 'getData', 'setData');
        },
        
        'edge-property': function(elem, props, delta) {
          this['edge'](elem, props, delta, 'map', 'getData', 'setData');  
        },

        'label-property': function(elem, props, delta) {
          this['node'](elem, props, delta, 'label', 'getLabelData', 'setLabelData');
        },
        
        'node-style': function(elem, props, delta) {
          this['node'](elem, props, delta, 'canvas', 'getCanvasStyle', 'setCanvasStyle');
        },
        
        'edge-style': function(elem, props, delta) {
          this['edge'](elem, props, delta, 'canvas', 'getCanvasStyle', 'setCanvasStyle');  
        }
    },
    
    
    /*
      prepare
 
      Prepare graph position and other attribute values before performing an Animation. 
      This method is used internally by the Toolkit.
      
      See also:
       
       <Animation>, <Graph.Plot.animate>

    */
    prepare: function(modes) {
      var graph = this.viz.graph,
          accessors = {
            'node-property': {
              'getter': 'getData',
              'setter': 'setData'
            },
            'edge-property': {
              'getter': 'getData',
              'setter': 'setData'
            },
            'node-style': {
              'getter': 'getCanvasStyle',
              'setter': 'setCanvasStyle'
            },
            'edge-style': {
              'getter': 'getCanvasStyle',
              'setter': 'setCanvasStyle'
            }
          };

      //parse modes
      var m = {};
      if($.type(modes) == 'array') {
        for(var i=0, len=modes.length; i < len; i++) {
          var elems = modes[i].split(':');
          m[elems.shift()] = elems;
        }
      } else {
        for(var p in modes) {
          if(p == 'position') {
            m[modes.position] = [];
          } else {
            m[p] = $.splat(modes[p]);
          }
        }
      }
      
      graph.eachNode(function(node) { 
        node.startPos.set(node.pos);
        $.each(['node-property', 'node-style'], function(p) {
          if(p in m) {
            var prop = m[p];
            for(var i=0, l=prop.length; i < l; i++) {
              node[accessors[p].setter](prop[i], node[accessors[p].getter](prop[i]), 'start');
            }
          }
        });
        $.each(['edge-property', 'edge-style'], function(p) {
          if(p in m) {
            var prop = m[p];
            node.eachAdjacency(function(adj) {
              for(var i=0, l=prop.length; i < l; i++) {
                adj[accessors[p].setter](prop[i], adj[accessors[p].getter](prop[i]), 'start');
              }
            });
          }
        });
      });
      return m;
    },
    
    /*
       Method: animate
    
       Animates a <Graph> by interpolating some <Graph.Node>, <Graph.Adjacence> or <Graph.Label> properties.

       Parameters:

       opt - (object) Animation options. The object properties are described below
       duration - (optional) Described in <Options.Fx>.
       fps - (optional) Described in <Options.Fx>.
       hideLabels - (optional|boolean) Whether to hide labels during the animation.
       modes - (required|object) An object with animation modes (described below).

       Animation modes:
       
       Animation modes are strings representing different node/edge and graph properties that you'd like to animate. 
       They are represented by an object that has as keys main categories of properties to animate and as values a list 
       of these specific properties. The properties are described below
       
       position - Describes the way nodes' positions must be interpolated. Possible values are 'linear', 'polar' or 'moebius'.
       node-property - Describes which Node properties will be interpolated. These properties can be any of the ones defined in <Options.Node>.
       edge-property - Describes which Edge properties will be interpolated. These properties can be any the ones defined in <Options.Edge>.
       label-property - Describes which Label properties will be interpolated. These properties can be any of the ones defined in <Options.Label> like color or size.
       node-style - Describes which Node Canvas Styles will be interpolated. These are specific canvas properties like fillStyle, strokeStyle, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, etc.
       edge-style - Describes which Edge Canvas Styles will be interpolated. These are specific canvas properties like fillStyle, strokeStyle, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, etc.

       Example:
       (start code js)
       var viz = new $jit.Viz(options);
       //...tweak some Data, CanvasStyles or LabelData properties...
       viz.fx.animate({
         modes: {
           'position': 'linear',
           'node-property': ['width', 'height'],
           'node-style': 'shadowColor',
           'label-property': 'size'
         },
         hideLabels: false
       });
       //...can also be written like this...
       viz.fx.animate({
         modes: ['linear',
                 'node-property:width:height',
                 'node-style:shadowColor',
                 'label-property:size'],
         hideLabels: false
       });
       (end code)
    */
    animate: function(opt, versor) {
      opt = $.merge(this.viz.config, opt || {});
      var that = this,
          viz = this.viz,
          graph  = viz.graph,
          interp = this.Interpolator,
          animation =  opt.type === 'nodefx'? this.nodeFxAnimation : this.animation;
      //prepare graph values
      var m = this.prepare(opt.modes);
      
      //animate
      if(opt.hideLabels) this.labels.hideLabels(true);
      animation.setOptions($.extend(opt, {
        $animating: false,
        compute: function(delta) {
          graph.eachNode(function(node) { 
            for(var p in m) {
              interp[p](node, m[p], delta, versor);
            }
          });
          that.plot(opt, this.$animating, delta);
          this.$animating = true;
        },
        complete: function() {
          if(opt.hideLabels) that.labels.hideLabels(false);
          that.plot(opt);
          opt.onComplete();
          //TODO(nico): This shouldn't be here!
          //opt.onAfterCompute();
        }       
      })).start();
    },
    
    /*
       Method: plot
    
       Plots a <Graph>.

       Parameters:

       opt - (optional) Plotting options. Most of them are described in <Options.Fx>.

       Example:

       (start code js)
       var viz = new $jit.Viz(options);
       viz.fx.plot(); 
       (end code)

    */
   plot: function(opt, animating) {
     var viz = this.viz, 
         aGraph = viz.graph, 
         canvas = viz.canvas, 
         id = viz.root, 
         that = this, 
         ctx = canvas.getCtx(), 
         min = Math.min,
         opt = opt || this.viz.controller;
     
     opt.clearCanvas && canvas.clear();
       
     var root = aGraph.getNode(id);
     if(!root) return;
     
     var T = !!root.visited;
     aGraph.eachNode(function(node) {
       var nodeAlpha = node.getData('alpha');
       node.eachAdjacency(function(adj) {
         var nodeTo = adj.nodeTo;
         if(!!nodeTo.visited === T && node.drawn && nodeTo.drawn) {
           !animating && opt.onBeforePlotLine(adj);
           that.plotLine(adj, canvas, animating);
           !animating && opt.onAfterPlotLine(adj);
         }
       });
       if(node.drawn) {
         !animating && opt.onBeforePlotNode(node);
         that.plotNode(node, canvas, animating);
         !animating && opt.onAfterPlotNode(node);
       }
       if(!that.labelsHidden && opt.withLabels) {
         if(node.drawn && nodeAlpha >= 0.95) {
           that.labels.plotLabel(canvas, node, opt);
         } else {
           that.labels.hideLabel(node, false);
         }
       }
       node.visited = !T;
     });
    },

  /*
      Plots a Subtree.
   */
   plotTree: function(node, opt, animating) {
       var that = this, 
       viz = this.viz, 
       canvas = viz.canvas,
       config = this.config,
       ctx = canvas.getCtx();
       var nodeAlpha = node.getData('alpha');
       node.eachSubnode(function(elem) {
         if(opt.plotSubtree(node, elem) && elem.exist && elem.drawn) {
             var adj = node.getAdjacency(elem.id);
             !animating && opt.onBeforePlotLine(adj);
             that.plotLine(adj, canvas, animating);
             !animating && opt.onAfterPlotLine(adj);
             that.plotTree(elem, opt, animating);
         }
       });
       if(node.drawn) {
           !animating && opt.onBeforePlotNode(node);
           this.plotNode(node, canvas, animating);
           !animating && opt.onAfterPlotNode(node);
           if(!opt.hideLabels && opt.withLabels && nodeAlpha >= 0.95) 
               this.labels.plotLabel(canvas, node, opt);
           else 
               this.labels.hideLabel(node, false);
       } else {
           this.labels.hideLabel(node, true);
       }
   },

  /*
       Method: plotNode
    
       Plots a <Graph.Node>.

       Parameters:
       
       node - (object) A <Graph.Node>.
       canvas - (object) A <Canvas> element.

    */
    plotNode: function(node, canvas, animating) {
        var f = node.getData('type'), 
            ctxObj = this.node.CanvasStyles;
        if(f != 'none') {
          var width = node.getData('lineWidth'),
              color = node.getData('color'),
              alpha = node.getData('alpha'),
              ctx = canvas.getCtx();
          ctx.save();
          ctx.lineWidth = width;
          ctx.fillStyle = ctx.strokeStyle = color;
          ctx.globalAlpha = alpha;
          
          for(var s in ctxObj) {
            ctx[s] = node.getCanvasStyle(s);
          }

          this.nodeTypes[f].render.call(this, node, canvas, animating);
          ctx.restore();
        }
    },
    
    /*
       Method: plotLine
    
       Plots a <Graph.Adjacence>.

       Parameters:

       adj - (object) A <Graph.Adjacence>.
       canvas - (object) A <Canvas> instance.

    */
    plotLine: function(adj, canvas, animating) {
      var f = adj.getData('type'),
          ctxObj = this.edge.CanvasStyles;
      if(f != 'none') {
        var width = adj.getData('lineWidth'),
            color = adj.getData('color'),
            ctx = canvas.getCtx(),
            nodeFrom = adj.nodeFrom,
            nodeTo = adj.nodeTo;
        
        ctx.save();
        ctx.lineWidth = width;
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.globalAlpha = Math.min(nodeFrom.getData('alpha'), 
            nodeTo.getData('alpha'), 
            adj.getData('alpha'));
        
        for(var s in ctxObj) {
          ctx[s] = adj.getCanvasStyle(s);
        }

        this.edgeTypes[f].render.call(this, adj, canvas, animating);
        ctx.restore();
      }
    }    
  
};

/*
 * File: Graph.Label.js
 *
*/

/*
   Object: Graph.Label

   An interface for plotting/hiding/showing labels.

   Description:

   This is a generic interface for plotting/hiding/showing labels.
   The <Graph.Label> interface is implemented in multiple ways to provide
   different label types.

   For example, the Graph.Label interface is implemented as <Graph.Label.HTML> to provide
   HTML label elements. Also we provide the <Graph.Label.SVG> interface for SVG type labels. 
   The <Graph.Label.Native> interface implements these methods with the native Canvas text rendering functions.
   
   All subclasses (<Graph.Label.HTML>, <Graph.Label.SVG> and <Graph.Label.Native>) implement the method plotLabel.
*/

Graph.Label = {};

/*
   Class: Graph.Label.Native

   Implements labels natively, using the Canvas text API.
*/
Graph.Label.Native = new Class({
    initialize: function(viz) {
      this.viz = viz;
    },

    /*
       Method: plotLabel

       Plots a label for a given node.

       Parameters:

       canvas - (object) A <Canvas> instance.
       node - (object) A <Graph.Node>.
       controller - (object) A configuration object.
       
       Example:
       
       (start code js)
       var viz = new $jit.Viz(options);
       var node = viz.graph.getNode('nodeId');
       viz.labels.plotLabel(viz.canvas, node, viz.config);
       (end code)
    */
    plotLabel: function(canvas, node, controller) {
      var ctx = canvas.getCtx();
      var pos = node.pos.getc(true);

      ctx.font = node.getLabelData('style') + ' ' + node.getLabelData('size') + 'px ' + node.getLabelData('family');
      ctx.textAlign = node.getLabelData('textAlign');
      ctx.fillStyle = ctx.strokeStyle = node.getLabelData('color');
      ctx.textBaseline = node.getLabelData('textBaseline');

      this.renderLabel(canvas, node, controller);
    },

    hideLabel: $.empty,
    hideLabels: $.empty
});

/*
   Class: Graph.Label.DOM

   Abstract Class implementing some DOM label methods.

   Implemented by:

   <Graph.Label.HTML> and <Graph.Label.SVG>.

*/
Graph.Label.DOM = new Class({
    //A flag value indicating if node labels are being displayed or not.
    labelsHidden: false,
    //Label container
    labelContainer: false,
    //Label elements hash.
    labels: {},

    /*
       Method: getLabelContainer

       Lazy fetcher for the label container.

       Returns:

       The label container DOM element.

       Example:

      (start code js)
        var viz = new $jit.Viz(options);
        var labelContainer = viz.labels.getLabelContainer();
        alert(labelContainer.innerHTML);
      (end code)
    */
    getLabelContainer: function() {
      return this.labelContainer ?
        this.labelContainer :
        this.labelContainer = document.getElementById(this.viz.config.labelContainer);
    },

    /*
       Method: getLabel

       Lazy fetcher for the label element.

       Parameters:

       id - (string) The label id (which is also a <Graph.Node> id).

       Returns:

       The label element.

       Example:

      (start code js)
        var viz = new $jit.Viz(options);
        var label = viz.labels.getLabel('someid');
        alert(label.innerHTML);
      (end code)

    */
    getLabel: function(id) {
      return (id in this.labels && this.labels[id] != null) ?
        this.labels[id] :
        this.labels[id] = document.getElementById(id);
    },

    /*
       Method: hideLabels

       Hides all labels (by hiding the label container).

       Parameters:

       hide - (boolean) A boolean value indicating if the label container must be hidden or not.

       Example:
       (start code js)
        var viz = new $jit.Viz(options);
        rg.labels.hideLabels(true);
       (end code)

    */
    hideLabels: function (hide) {
      var container = this.getLabelContainer();
      if(hide)
        container.style.display = 'none';
      else
        container.style.display = '';
      this.labelsHidden = hide;
    },

    /*
       Method: clearLabels

       Clears the label container.

       Useful when using a new visualization with the same canvas element/widget.

       Parameters:

       force - (boolean) Forces deletion of all labels.

       Example:
       (start code js)
        var viz = new $jit.Viz(options);
        viz.labels.clearLabels();
        (end code)
    */
    clearLabels: function(force) {
      for(var id in this.labels) {
        if (force || !this.viz.graph.hasNode(id)) {
          this.disposeLabel(id);
          delete this.labels[id];
        }
      }
    },

    /*
       Method: disposeLabel

       Removes a label.

       Parameters:

       id - (string) A label id (which generally is also a <Graph.Node> id).

       Example:
       (start code js)
        var viz = new $jit.Viz(options);
        viz.labels.disposeLabel('labelid');
       (end code)
    */
    disposeLabel: function(id) {
      var elem = this.getLabel(id);
      if(elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    },

    /*
       Method: hideLabel

       Hides the corresponding <Graph.Node> label.

       Parameters:

       node - (object) A <Graph.Node>. Can also be an array of <Graph.Nodes>.
       show - (boolean) If *true*, nodes will be shown. Otherwise nodes will be hidden.

       Example:
       (start code js)
        var rg = new $jit.Viz(options);
        viz.labels.hideLabel(viz.graph.getNode('someid'), false);
       (end code)
    */
    hideLabel: function(node, show) {
      node = $.splat(node);
      var st = show ? "" : "none", lab, that = this;
      $.each(node, function(n) {
        var lab = that.getLabel(n.id);
        if (lab) {
          lab.style.display = st;
        }
      });
    },

    /*
       fitsInCanvas

       Returns _true_ or _false_ if the label for the node is contained in the canvas dom element or not.

       Parameters:

       pos - A <Complex> instance (I'm doing duck typing here so any object with _x_ and _y_ parameters will do).
       canvas - A <Canvas> instance.

       Returns:

       A boolean value specifying if the label is contained in the <Canvas> DOM element or not.

    */
    fitsInCanvas: function(pos, canvas) {
      var size = canvas.getSize();
      if(pos.x >= size.width || pos.x < 0
         || pos.y >= size.height || pos.y < 0) return false;
       return true;
    }
});

/*
   Class: Graph.Label.HTML

   Implements HTML labels.

   Extends:

   All <Graph.Label.DOM> methods.

*/
Graph.Label.HTML = new Class({
    Implements: Graph.Label.DOM,

    /*
       Method: plotLabel

       Plots a label for a given node.

       Parameters:

       canvas - (object) A <Canvas> instance.
       node - (object) A <Graph.Node>.
       controller - (object) A configuration object.
       
      Example:
       
       (start code js)
       var viz = new $jit.Viz(options);
       var node = viz.graph.getNode('nodeId');
       viz.labels.plotLabel(viz.canvas, node, viz.config);
       (end code)


    */
    plotLabel: function(canvas, node, controller) {
      var id = node.id, tag = this.getLabel(id);

      if(!tag && !(tag = document.getElementById(id))) {
        tag = document.createElement('div');
        var container = this.getLabelContainer();
        tag.id = id;
        tag.className = 'node';
        tag.style.position = 'absolute';
        controller.onCreateLabel(tag, node);
        container.appendChild(tag);
        this.labels[node.id] = tag;
      }

      this.placeLabel(tag, node, controller);
    }
});

/*
 * File: Loader.js
 * 
 */

/*
   Object: Loader

   Provides methods for loading and serving JSON data.
*/
var Loader = {
     construct: function(json) {
        var isGraph = ($.type(json) == 'array');
        var ans = new Graph(this.graphOptions, this.config.Node, this.config.Edge, this.config.Label);
        if(!isGraph) 
            //make tree
            (function (ans, json) {
                ans.addNode(json);
                if(json.children) {
                  for(var i=0, ch = json.children; i<ch.length; i++) {
                    ans.addAdjacence(json, ch[i]);
                    arguments.callee(ans, ch[i]);
                  }
                }
            })(ans, json);
        else
            //make graph
            (function (ans, json) {
                var getNode = function(id) {
                  for(var i=0, l=json.length; i<l; i++) {
                    if(json[i].id == id) {
                      return json[i];
                    }
                  }
                  // The node was not defined in the JSON
                  // Let's create it
                  var newNode = {
                		"id" : id,
                		"name" : id
                	};
                  return ans.addNode(newNode);
                };

                for(var i=0, l=json.length; i<l; i++) {
                  ans.addNode(json[i]);
                  var adj = json[i].adjacencies;
                  if (adj) {
                    for(var j=0, lj=adj.length; j<lj; j++) {
                      var node = adj[j], data = {};
                      if(typeof adj[j] != 'string') {
                        data = $.merge(node.data, {});
                        node = node.nodeTo;
                      }
                      ans.addAdjacence(json[i], getNode(node), data);
                    }
                  }
                }
            })(ans, json);

        return ans;
    },

    /*
     Method: loadJSON
    
     Loads a JSON structure to the visualization. The JSON structure can be a JSON *tree* or *graph* structure.
     
      A JSON tree or graph structure consists of nodes, each having as properties
       
       id - (string) A unique identifier for the node
       name - (string) A node's name
       data - (object) The data optional property contains a hash (i.e {}) 
       where you can store all the information you want about this node.
        
      For JSON *Tree* structures, there's an extra optional property *children* of type Array which contains the node's children.
      
      Example:

      (start code js)
        var json = {  
          "id": "aUniqueIdentifier",  
          "name": "usually a nodes name",  
          "data": {
            "some key": "some value",
            "some other key": "some other value"
           },  
          "children": [ *other nodes or empty* ]  
        };  
      (end code)
        
        JSON *Graph* structures consist of an array of nodes, each specifying the nodes to which the current node is connected. 
        For JSON *Graph* structures, the *children* property is replaced by the *adjacencies* property.
        
        There are two types of *Graph* structures, *simple* and *extended* graph structures.
        
        For *simple* Graph structures, the adjacencies property contains an array of strings, each specifying the 
        id of the node connected to the main node.
        
        Example:
        
        (start code js)
        var json = [  
          {  
            "id": "aUniqueIdentifier",  
            "name": "usually a nodes name",  
            "data": {
              "some key": "some value",
              "some other key": "some other value"
             },  
            "adjacencies": ["anotherUniqueIdentifier", "yetAnotherUniqueIdentifier", 'etc']  
          },

          'other nodes go here...' 
        ];          
        (end code)
        
        For *extended Graph structures*, the adjacencies property contains an array of Adjacency objects that have as properties
        
        nodeTo - (string) The other node connected by this adjacency.
        data - (object) A data property, where we can store custom key/value information.
        
        Example:
        
        (start code js)
        var json = [  
          {  
            "id": "aUniqueIdentifier",  
            "name": "usually a nodes name",  
            "data": {
              "some key": "some value",
              "some other key": "some other value"
             },  
            "adjacencies": [  
            {  
              nodeTo:"aNodeId",  
              data: {} //put whatever you want here  
            },
            'other adjacencies go here...'  
          },

          'other nodes go here...' 
        ];          
        (end code)
       
       About the data property:
       
       As described before, you can store custom data in the *data* property of JSON *nodes* and *adjacencies*. 
       You can use almost any string as key for the data object. Some keys though are reserved by the toolkit, and 
       have special meanings. This is the case for keys starting with a dollar sign, for example, *$width*.
       
       For JSON *node* objects, adding dollar prefixed properties that match the names of the options defined in 
       <Options.Node> will override the general value for that option with that particular value. For this to work 
       however, you do have to set *overridable = true* in <Options.Node>.
       
       The same thing is true for JSON adjacencies. Dollar prefixed data properties will alter values set in <Options.Edge> 
       if <Options.Edge> has *overridable = true*.
       
       When loading JSON data into TreeMaps, the *data* property must contain a value for the *$area* key, 
       since this is the value which will be taken into account when creating the layout. 
       The same thing goes for the *$color* parameter.
       
       In JSON Nodes you can use also *$label-* prefixed properties to refer to <Options.Label> properties. For example, 
       *$label-size* will refer to <Options.Label> size property. Also, in JSON nodes and adjacencies you can set 
       canvas specific properties individually by using the *$canvas-* prefix. For example, *$canvas-shadowBlur* will refer 
       to the *shadowBlur* property.
       
       These properties can also be accessed after loading the JSON data from <Graph.Nodes> and <Graph.Adjacences> 
       by using <Accessors>. For more information take a look at the <Graph> and <Accessors> documentation.
       
       Finally, these properties can also be used to create advanced animations like with <Options.NodeStyles>. For more 
       information about creating animations please take a look at the <Graph.Plot> and <Graph.Plot.animate> documentation.
       
       loadJSON Parameters:
    
        json - A JSON Tree or Graph structure.
        i - For Graph structures only. Sets the indexed node as root for the visualization.

    */
    loadJSON: function(json, i) {
      this.json = json;
      //if they're canvas labels erase them.
      if(this.labels && this.labels.clearLabels) {
        this.labels.clearLabels(true);
      }
      this.graph = this.construct(json);
      if($.type(json) != 'array'){
        this.root = json.id;
      } else {
        this.root = json[i? i : 0].id;
      }
    },
    
    /*
      Method: toJSON
   
      Returns a JSON tree/graph structure from the visualization's <Graph>. 
      See <Loader.loadJSON> for the graph formats available.
      
      See also:
      
      <Loader.loadJSON>
      
      Parameters:
      
      type - (string) Default's "tree". The type of the JSON structure to be returned. 
      Possible options are "tree" or "graph".
    */    
    toJSON: function(type) {
      type = type || "tree";
      if(type == 'tree') {
        var ans = {};
        var rootNode = this.graph.getNode(this.root);
        var ans = (function recTree(node) {
          var ans = {};
          ans.id = node.id;
          ans.name = node.name;
          ans.data = node.data;
          var ch =[];
          node.eachSubnode(function(n) {
            ch.push(recTree(n));
          });
          ans.children = ch;
          return ans;
        })(rootNode);
        return ans;
      } else {
        var ans = [];
        var T = !!this.graph.getNode(this.root).visited;
        this.graph.eachNode(function(node) {
          var ansNode = {};
          ansNode.id = node.id;
          ansNode.name = node.name;
          ansNode.data = node.data;
          var adjs = [];
          node.eachAdjacency(function(adj) {
            var nodeTo = adj.nodeTo;
            if(!!nodeTo.visited === T) {
              var ansAdj = {};
              ansAdj.nodeTo = nodeTo.id;
              ansAdj.data = adj.data;
              adjs.push(ansAdj);
            }
          });
          ansNode.adjacencies = adjs;
          ans.push(ansNode);
          node.visited = !T;
        });
        return ans;
      }
    }
};



/*
 * File: Layouts.js
 * 
 * Implements base Tree and Graph layouts.
 *
 * Description:
 *
 * Implements base Tree and Graph layouts like Radial, Tree, etc.
 * 
 */

/*
 * Object: Layouts
 * 
 * Parent object for common layouts.
 *
 */
var Layouts = $jit.Layouts = {};


//Some util shared layout functions are defined here.
var NodeDim = {
  label: null,
  
  compute: function(graph, prop, opt) {
    this.initializeLabel(opt);
    var label = this.label, style = label.style;
    graph.eachNode(function(n) {
      var autoWidth  = n.getData('autoWidth'),
          autoHeight = n.getData('autoHeight');
      if(autoWidth || autoHeight) {
        //delete dimensions since these are
        //going to be overridden now.
        delete n.data.$width;
        delete n.data.$height;
        delete n.data.$dim;
        
        var width  = n.getData('width'),
            height = n.getData('height');
        //reset label dimensions
        style.width  = autoWidth? 'auto' : width + 'px';
        style.height = autoHeight? 'auto' : height + 'px';
        
        //TODO(nico) should let the user choose what to insert here.
        label.innerHTML = n.name;
        
        var offsetWidth  = label.offsetWidth,
            offsetHeight = label.offsetHeight;
        var type = n.getData('type');
        if($.indexOf(['circle', 'square', 'triangle', 'star'], type) === -1) {
          n.setData('width', offsetWidth);
          n.setData('height', offsetHeight);
        } else {
          var dim = offsetWidth > offsetHeight? offsetWidth : offsetHeight;
          n.setData('width', dim);
          n.setData('height', dim);
          n.setData('dim', dim); 
        }
      }
    });
  },
  
  initializeLabel: function(opt) {
    if(!this.label) {
      this.label = document.createElement('div');
      document.body.appendChild(this.label);
    }
    this.setLabelStyles(opt);
  },
  
  setLabelStyles: function(opt) {
    $.extend(this.label.style, {
      'visibility': 'hidden',
      'position': 'absolute',
      'width': 'auto',
      'height': 'auto'
    });
    this.label.className = 'jit-autoadjust-label';
  }
};

/*
 * Class: Layouts.TM
 * 
 * Implements TreeMaps layouts (SliceAndDice, Squarified, Strip).
 * 
 * Implemented By:
 * 
 * <TM>
 * 
 */
Layouts.TM = {};

Layouts.TM.Area = {
 /*
    Method: compute
 
   Called by loadJSON to calculate recursively all node positions and lay out the tree.
 
    Parameters:

       json - A JSON tree. See also <Loader.loadJSON>.
       coord - A coordinates object specifying width, height, left and top style properties.
 */
 compute: function(prop) {
    prop = prop || "current";
    var root = this.graph.getNode(this.clickedNode && this.clickedNode.id || this.root);
    this.controller.onBeforeCompute(root);
    var config = this.config,
        size = this.canvas.getSize(),
        width = size.width,
        height = size.height,
        offst = config.offset,
        offwdth = width - offst,
        offhght = height - offst;
    this.graph.computeLevels(this.root, 0, "ignore");
    //set root position and dimensions
    root.getPos(prop).setc(-width/2, -height/2);
    root.setData('width', width, prop);
    root.setData('height', height, prop);
    //create a coordinates object
    var coord = {
        'top': -height/2 + config.titleHeight,
        'left': -width/2,
        'width': offwdth,
        'height': offhght - config.titleHeight
    };
    this.computePositions(root, coord, prop);
    this.controller.onAfterCompute(root);
 }, 
 
 /*
    Method: computeDim
 
   Computes dimensions and positions of a group of nodes
   according to a custom layout row condition. 
 
    Parameters:

       tail - An array of nodes.  
       initElem - An array of nodes (containing the initial node to be laid).
       w - A fixed dimension where nodes will be layed out.
       coord - A coordinates object specifying width, height, left and top style properties.
       comp - A custom comparison function
 */
 computeDim: function(tail, initElem, w, coord, comp, prop) {
   if(tail.length + initElem.length == 1) {
     var l = (tail.length == 1)? tail : initElem;
     this.layoutLast(l, w, coord, prop);
     return;
   }
   if(tail.length >= 2 && initElem.length == 0) {
     initElem = [tail.shift()];
   }
   if(tail.length == 0) {
     if(initElem.length > 0) this.layoutRow(initElem, w, coord, prop);
     return;
   }
   var c = tail[0];
   if(comp(initElem, w) >= comp([c].concat(initElem), w)) {
     this.computeDim(tail.slice(1), initElem.concat([c]), w, coord, comp, prop);
   } else {
     var newCoords = this.layoutRow(initElem, w, coord, prop);
     this.computeDim(tail, [], newCoords.dim, newCoords, comp, prop);
   }
 },

 
 /*
    Method: worstAspectRatio
 
   Calculates the worst aspect ratio of a group of rectangles. 
       
    See also:
       
       <http://en.wikipedia.org/wiki/Aspect_ratio>
   
    Parameters:

     ch - An array of nodes.  
     w  - The fixed dimension where rectangles are being laid out.

    Returns:
 
        The worst aspect ratio.


 */
 worstAspectRatio: function(ch, w) {
   if(!ch || ch.length == 0) return Number.MAX_VALUE;
   var areaSum = 0, maxArea = 0, minArea = Number.MAX_VALUE;
   for(var i=0, l=ch.length; i<l; i++) {
     var area = ch[i]._area;
     areaSum += area; 
     minArea = minArea < area? minArea : area;
     maxArea = maxArea > area? maxArea : area; 
   }
   var sqw = w * w, sqAreaSum = areaSum * areaSum;
   return Math.max(sqw * maxArea / sqAreaSum,
           sqAreaSum / (sqw * minArea));
 },
 
 /*
    Method: avgAspectRatio
 
   Calculates the average aspect ratio of a group of rectangles. 
       
       See also:
       
       <http://en.wikipedia.org/wiki/Aspect_ratio>
   
    Parameters:

     ch - An array of nodes.  
       w - The fixed dimension where rectangles are being laid out.

    Returns:
 
        The average aspect ratio.


 */
 avgAspectRatio: function(ch, w) {
   if(!ch || ch.length == 0) return Number.MAX_VALUE;
   var arSum = 0;
   for(var i=0, l=ch.length; i<l; i++) {
     var area = ch[i]._area;
     var h = area / w;
     arSum += w > h? w / h : h / w;
   }
   return arSum / l;
 },

 /*
    layoutLast
 
   Performs the layout of the last computed sibling.
 
    Parameters:

       ch - An array of nodes.  
       w - A fixed dimension where nodes will be layed out.
     coord - A coordinates object specifying width, height, left and top style properties.
 */
 layoutLast: function(ch, w, coord, prop) {
   var child = ch[0];
   child.getPos(prop).setc(coord.left, coord.top);
   child.setData('width', coord.width, prop);
   child.setData('height', coord.height, prop);
 }
};


Layouts.TM.Squarified = new Class({
 Implements: Layouts.TM.Area,
 
 computePositions: function(node, coord, prop) {
   var config = this.config, 
       max = Math.max;
   
   if (coord.width >= coord.height) 
     this.layout.orientation = 'h';
   else
     this.layout.orientation = 'v';
   
   var ch = node.getSubnodes([1, 1], "ignore");
   if(ch.length > 0) {
     this.processChildrenLayout(node, ch, coord, prop);
     for(var i=0, l=ch.length; i<l; i++) {
       var chi = ch[i], 
           offst = config.offset,
           height = max(chi.getData('height', prop) - offst - config.titleHeight, 0),
           width = max(chi.getData('width', prop) - offst, 0),
           chipos = chi.getPos(prop);

       coord = {
         'width': width,
         'height': height,
         'top': chipos.y + config.titleHeight,
         'left': chipos.x
       };
       this.computePositions(chi, coord, prop);
     }
   }
 },

 /*
    Method: processChildrenLayout
 
   Computes children real areas and other useful parameters for performing the Squarified algorithm.
 
    Parameters:

       par - The parent node of the json subtree.  
       ch - An Array of nodes
     coord - A coordinates object specifying width, height, left and top style properties.
 */
 processChildrenLayout: function(par, ch, coord, prop) {
   //compute children real areas
   var parentArea = coord.width * coord.height;
   var i, l=ch.length, totalChArea=0, chArea = [];
   for(i=0; i<l; i++) {
     chArea[i] = parseFloat(ch[i].getData('area', prop));
     totalChArea += chArea[i];
   }
   for(i=0; i<l; i++) {
     ch[i]._area = parentArea * chArea[i] / totalChArea;
   }
   var minimumSideValue = this.layout.horizontal()? coord.height : coord.width;
   ch.sort(function(a, b) { 
     var diff = b._area - a._area; 
     return diff? diff : (b.id == a.id? 0 : (b.id < a.id? 1 : -1)); 
   });
   var initElem = [ch[0]];
   var tail = ch.slice(1);
   this.squarify(tail, initElem, minimumSideValue, coord, prop);
 },

 /*
   Method: squarify
 
   Performs an heuristic method to calculate div elements sizes in order to have a good aspect ratio.
 
    Parameters:

       tail - An array of nodes.  
       initElem - An array of nodes, containing the initial node to be laid out.
       w - A fixed dimension where nodes will be laid out.
       coord - A coordinates object specifying width, height, left and top style properties.
 */
 squarify: function(tail, initElem, w, coord, prop) {
   this.computeDim(tail, initElem, w, coord, this.worstAspectRatio, prop);
 },
 
 /*
    Method: layoutRow
 
   Performs the layout of an array of nodes.
 
    Parameters:

       ch - An array of nodes.  
       w - A fixed dimension where nodes will be laid out.
       coord - A coordinates object specifying width, height, left and top style properties.
 */
 layoutRow: function(ch, w, coord, prop) {
   if(this.layout.horizontal()) {
     return this.layoutV(ch, w, coord, prop);
   } else {
     return this.layoutH(ch, w, coord, prop);
   }
 },
 
 layoutV: function(ch, w, coord, prop) {
   var totalArea = 0, rnd = function(x) { return x; }; 
   $.each(ch, function(elem) { totalArea += elem._area; });
   var width = rnd(totalArea / w), top =  0; 
   for(var i=0, l=ch.length; i<l; i++) {
     var h = rnd(ch[i]._area / width);
     var chi = ch[i];
     chi.getPos(prop).setc(coord.left, coord.top + top);
     chi.setData('width', width, prop);
     chi.setData('height', h, prop);
     top += h;
   }
   var ans = {
     'height': coord.height,
     'width': coord.width - width,
     'top': coord.top,
     'left': coord.left + width
   };
   //take minimum side value.
   ans.dim = Math.min(ans.width, ans.height);
   if(ans.dim != ans.height) this.layout.change();
   return ans;
 },
 
 layoutH: function(ch, w, coord, prop) {
   var totalArea = 0; 
   $.each(ch, function(elem) { totalArea += elem._area; });
   var height = totalArea / w,
       top = coord.top, 
       left = 0;
   
   for(var i=0, l=ch.length; i<l; i++) {
     var chi = ch[i];
     var w = chi._area / height;
     chi.getPos(prop).setc(coord.left + left, top);
     chi.setData('width', w, prop);
     chi.setData('height', height, prop);
     left += w;
   }
   var ans = {
     'height': coord.height - height,
     'width': coord.width,
     'top': coord.top + height,
     'left': coord.left
   };
   ans.dim = Math.min(ans.width, ans.height);
   if(ans.dim != ans.width) this.layout.change();
   return ans;
 }
});


/*
 * File: Treemap.js
 *
*/

$jit.TM = {};

var TM = $jit.TM;

$jit.TM.$extend = true;

/*
  Class: TM.Base
  
  Abstract class providing base functionality for <TM.Squarified>, <TM.Strip> and <TM.SliceAndDice> visualizations.
  
  Implements:
  
  All <Loader> methods
  
  Constructor Options:
  
  Inherits options from
  
  - <Options.Canvas>
  - <Options.Controller>
  - <Options.Node>
  - <Options.Edge>
  - <Options.Label>
  - <Options.Events>
  - <Options.Tips>
  - <Options.NodeStyles>
  - <Options.Navigation>
  
  Additionally, there are other parameters and some default values changed

  orientation - (string) Default's *h*. Whether to set horizontal or vertical layouts. Possible values are 'h' and 'v'.
  titleHeight - (number) Default's *13*. The height of the title rectangle for inner (non-leaf) nodes.
  offset - (number) Default's *2*. Boxes offset.
  constrained - (boolean) Default's *false*. Whether to show the entire tree when loaded or just the number of levels specified by _levelsToShow_.
  levelsToShow - (number) Default's *3*. The number of levels to show for a subtree. This number is relative to the selected node.
  animate - (boolean) Default's *false*. Whether to animate transitions.
  Node.type - Described in <Options.Node>. Default's *rectangle*.
  duration - Described in <Options.Fx>. Default's *700*.
  fps - Described in <Options.Fx>. Default's *45*.
  
  Instance Properties:
  
  canvas - Access a <Canvas> instance.
  graph - Access a <Graph> instance.
  op - Access a <TM.Op> instance.
  fx - Access a <TM.Plot> instance.
  labels - Access a <TM.Label> interface implementation.

  Inspired by:
  
  Squarified Treemaps (Mark Bruls, Kees Huizing, and Jarke J. van Wijk) <http://www.win.tue.nl/~vanwijk/stm.pdf>
  
  Tree visualization with tree-maps: 2-d space-filling approach (Ben Shneiderman) <http://hcil.cs.umd.edu/trs/91-03/91-03.html>
  
   Note:
   
   This visualization was built and engineered from scratch, taking only the paper as inspiration, and only shares some features with the visualization described in the paper.

*/
TM.Base = {
  layout: {
    orientation: "h",
    vertical: function(){
      return this.orientation == "v";
    },
    horizontal: function(){
      return this.orientation == "h";
    },
    change: function(){
      this.orientation = this.vertical()? "h" : "v";
    }
  },

  initialize: function(controller){
    var config = {
      orientation: "h",
      titleHeight: 13,
      offset: 2,
      levelsToShow: 0,
      constrained: false,
      animate: false,
      Node: {
        type: 'rectangle',
        overridable: true,
        //we all know why this is not zero,
        //right, Firefox?
        width: 3,
        height: 3,
        color: '#444'
      },
      Label: {
        textAlign: 'center',
        textBaseline: 'top'
      },
      Edge: {
        type: 'none'
      },
      duration: 700,
      fps: 45
    };

    this.controller = this.config = $.merge(Options("Canvas", "Node", "Edge",
        "Fx", "Controller", "Tips", "NodeStyles", "Events", "Navigation", "Label"), config, controller);
    this.layout.orientation = this.config.orientation;

    var canvasConfig = this.config;
    if (canvasConfig.useCanvas) {
      this.canvas = canvasConfig.useCanvas;
      this.config.labelContainer = this.canvas.id + '-label';
    } else {
      if(canvasConfig.background) {
        canvasConfig.background = $.merge({
          type: 'Circles'
        }, canvasConfig.background);
      }
      this.canvas = new Canvas(this, canvasConfig);
      this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
    }

    this.graphOptions = {
      'klass': Complex,
      'Node': {
        'selected': false,
        'exist': true,
        'drawn': true
      }
    };
    this.graph = new Graph(this.graphOptions, this.config.Node,
        this.config.Edge);
    this.labels = new TM.Label[canvasConfig.Label.type](this);
    this.fx = new TM.Plot(this);
    this.op = new TM.Op(this);
    this.group = new TM.Group(this);
    this.geom = new TM.Geom(this);
    this.clickedNode = null;
    this.busy = false;
    // initialize extras
    this.initializeExtras();
  },

  /* 
    Method: refresh 
    
    Computes positions and plots the tree.
  */
  refresh: function(){
    if(this.busy) return;
    this.busy = true;
    var that = this;
    if(this.config.animate) {
      this.compute('end');
      this.config.levelsToShow > 0 && this.geom.setRightLevelToShow(this.graph.getNode(this.clickedNode 
          && this.clickedNode.id || this.root));
      this.fx.animate($.merge(this.config, {
        modes: ['linear', 'node-property:width:height'],
        onComplete: function() {
          that.busy = false;
        }
      }));
    } else {
      var labelType = this.config.Label.type;
      if(labelType != 'Native') {
        var that = this;
        this.graph.eachNode(function(n) { that.labels.hideLabel(n, false); });
      }
      this.busy = false;
      this.compute();
      this.config.levelsToShow > 0 && this.geom.setRightLevelToShow(this.graph.getNode(this.clickedNode 
          && this.clickedNode.id || this.root));
      this.plot();
    }
  },

  /* 
    Method: plot 
    
    Plots the TreeMap. This is a shortcut to *fx.plot*. 
  
   */
  plot: function(){
    this.fx.plot();
  },

  /* 
  Method: leaf 
  
  Returns whether the node is a leaf.
  
   Parameters:
   
   n - (object) A <Graph.Node>.

 */
  leaf: function(n){
    return n.getSubnodes([
        1, 1
    ], "ignore").length == 0;
  },
  
  /* 
  Method: enter 
  
  Sets the node as root.
  
   Parameters:
   
   n - (object) A <Graph.Node>.

 */
  enter: function(n){
    if(this.busy) return;
    this.busy = true;
    
    var that = this,
        config = this.config,
        graph = this.graph,
        clickedNode = n,
        previousClickedNode = this.clickedNode;

    var callback = {
      onComplete: function() {
        //ensure that nodes are shown for that level
        if(config.levelsToShow > 0) {
          that.geom.setRightLevelToShow(n);
        }
        //compute positions of newly inserted nodes
        if(config.levelsToShow > 0 || config.request) that.compute();
        if(config.animate) {
          //fade nodes
          graph.nodeList.setData('alpha', 0, 'end');
          n.eachSubgraph(function(n) {
            n.setData('alpha', 1, 'end');
          }, "ignore");
          that.fx.animate({
			// FOUND HOLY GRAIL
            duration: 100,
            modes:['node-property:alpha'],
            onComplete: function() {
              //compute end positions
              that.clickedNode = clickedNode;
              that.compute('end');
              //animate positions
              //TODO(nico) commenting this line didn't seem to throw errors...
              that.clickedNode = previousClickedNode;
			  that.fx.animate({
				modes:['linear', 'node-property:width:height'],
				// FOUND HOLY GRAIL
				duration: 200,
				onComplete: function() { 
				  that.busy = false;
				  //TODO(nico) check comment above
				  that.clickedNode = clickedNode;
				}
			  });
            }
          });
        } else {
          that.busy = false;
          that.clickedNode = n;
          that.refresh();
        }
      }
    };
    if(config.request) {
      this.requestNodes(clickedNode, callback);
    } else {
      callback.onComplete();
    }
  },

  /* 
  Method: out 
  
  Sets the parent node of the current selected node as root.

 */
  out: function(){
    if(this.busy) return;
    this.busy = true;
    this.events.hoveredNode = false;
    var that = this,
        config = this.config,
        graph = this.graph,
        parents = graph.getNode(this.clickedNode 
            && this.clickedNode.id || this.root).getParents(),
        parent = parents[0],
        clickedNode = parent,
        previousClickedNode = this.clickedNode;
    
    //if no parents return
    if(!parent) {
      this.busy = false;
      return;
    }
    //final plot callback
    callback = {
      onComplete: function() {
        that.clickedNode = parent;
        if(config.request) {
          that.requestNodes(parent, {
            onComplete: function() {
              that.compute();
              that.plot();
              that.busy = false;
            }
          });
        } else {
          that.compute();
          that.plot();
          that.busy = false;
        }
      }
    };
    //prune tree
    if (config.levelsToShow > 0)
      this.geom.setRightLevelToShow(parent);
    //animate node positions
    if(config.animate) {
      this.clickedNode = clickedNode;
      this.compute('end');
      //animate the visible subtree only
      this.clickedNode = previousClickedNode;
      this.fx.animate({
        modes:['linear', 'node-property:width:height'],
		// FOUND HOLY GRAIL
        duration: 200,
        onComplete: function() {
          //animate the parent subtree
          that.clickedNode = clickedNode;
          //change nodes alpha
          graph.eachNode(function(n) {
            n.setDataset(['current', 'end'], {
              'alpha': [0, 1]
            });
          }, "ignore");
          previousClickedNode.eachSubgraph(function(node) {
            node.setData('alpha', 1);
          }, "ignore");
          that.fx.animate({
			// FOUND HOLY GRAIL
            duration: 100,
            modes:['node-property:alpha'],
            onComplete: function() {
              callback.onComplete();
            }
          });
        }
      });
    } else {
      callback.onComplete();
    }
  },

  requestNodes: function(node, onComplete){
    var handler = $.merge(this.controller, onComplete), 
        lev = this.config.levelsToShow;
    if (handler.request) {
      var leaves = [], d = node._depth;
      node.eachLevel(0, lev, function(n){
        var nodeLevel = lev - (n._depth - d);
        if (n.drawn && !n.anySubnode() && nodeLevel > 0) {
          leaves.push(n);
          n._level = nodeLevel;
        }
      });
      this.group.requestNodes(leaves, handler);
    } else {
      handler.onComplete();
    }
  },
  
  reposition: function() {
    this.compute('end');
  }
};

/*
  Class: TM.Op
  
  Custom extension of <Graph.Op>.
  
  Extends:
  
  All <Graph.Op> methods
  
  See also:
  
  <Graph.Op>
  
  */
TM.Op = new Class({
  Implements: Graph.Op,

  initialize: function(viz){
    this.viz = viz;
  }
});

//extend level methods of Graph.Geom
TM.Geom = new Class({
  Implements: Graph.Geom,
  
  getRightLevelToShow: function() {
    return this.viz.config.levelsToShow;
  },
  
  setRightLevelToShow: function(node) {
    var level = this.getRightLevelToShow(), 
        fx = this.viz.labels;
    node.eachLevel(0, level+1, function(n) {
      var d = n._depth - node._depth;
      if(d > level) {
        n.drawn = false; 
        n.exist = false;
        n.ignore = true;
        fx.hideLabel(n, false);
      } else {
        n.drawn = true;
        n.exist = true;
        delete n.ignore;
      }
    });
    node.drawn = true;
    delete node.ignore;
  }
});

/*

Performs operations on group of nodes.

*/
TM.Group = new Class( {

  initialize: function(viz){
    this.viz = viz;
    this.canvas = viz.canvas;
    this.config = viz.config;
  },

  /*
  
    Calls the request method on the controller to request a subtree for each node. 
  */
  requestNodes: function(nodes, controller){
    var counter = 0, len = nodes.length, nodeSelected = {};
    var complete = function(){
      controller.onComplete();
    };
    var viz = this.viz;
    if (len == 0)
      complete();
    for ( var i = 0; i < len; i++) {
      nodeSelected[nodes[i].id] = nodes[i];
      controller.request(nodes[i].id, nodes[i]._level, {
        onComplete: function(nodeId, data){
          if (data && data.children) {
            data.id = nodeId;
            viz.op.sum(data, {
              type: 'nothing'
            });
          }
          if (++counter == len) {
            viz.graph.computeLevels(viz.root, 0);
            complete();
          }
        }
      });
    }
  }
});

/*
  Class: TM.Plot
  
  Custom extension of <Graph.Plot>.
  
  Extends:
  
  All <Graph.Plot> methods
  
  See also:
  
  <Graph.Plot>
  
  */
TM.Plot = new Class({

  Implements: Graph.Plot,

  initialize: function(viz){
    this.viz = viz;
    this.config = viz.config;
    this.node = this.config.Node;
    this.edge = this.config.Edge;
    this.animation = new Animation;
    this.nodeTypes = new TM.Plot.NodeTypes;
    this.edgeTypes = new TM.Plot.EdgeTypes;
    this.labels = viz.labels;
  },

  plot: function(opt, animating){
    var viz = this.viz, 
        graph = viz.graph;
    viz.canvas.clear();
    this.plotTree(graph.getNode(viz.clickedNode && viz.clickedNode.id || viz.root), $.merge(viz.config, opt || {}, {
      'withLabels': true,
      'hideLabels': false,
      'plotSubtree': function(n, ch){
        return n.anySubnode("exist");
      }
    }), animating);
  }
});

/*
  Class: TM.Label
  
  Custom extension of <Graph.Label>. 
  Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.

  Extends:

  All <Graph.Label> methods and subclasses.

  See also:

  <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.
  
*/
TM.Label = {};

/*
 TM.Label.HTML

 Custom extension of <Graph.Label.HTML>.

 Extends:

 All <Graph.Label.HTML> methods.

 See also:

 <Graph.Label.HTML>

*/
TM.Label.HTML = new Class( {
  Implements: Graph.Label.HTML,

  initialize: function(viz){
    this.viz = viz;
    this.leaf = viz.leaf;
    this.config = viz.config;
  },

  /* 
    placeLabel
  
    Overrides abstract method placeLabel in <Graph.Plot>.
  
    Parameters:
  
    tag - A DOM label element.
    node - A <Graph.Node>.
    controller - A configuration/controller object passed to the visualization.
  
  */
  placeLabel: function(tag, node, controller){
    var pos = node.pos.getc(true), 
        canvas = this.viz.canvas,
        ox = canvas.translateOffsetX,
        oy = canvas.translateOffsetY,
        sx = canvas.scaleOffsetX,
        sy = canvas.scaleOffsetY,
        radius = canvas.getSize();
    var labelPos = {
      x: Math.round(pos.x * sx + ox + radius.width / 2),
      y: Math.round(pos.y * sy + oy + radius.height / 2)
    };

    var style = tag.style;
    style.left = labelPos.x + 'px';
    style.top = labelPos.y + 'px';
    style.width = node.getData('width') * sx + 'px';
    style.height = node.getData('height') * sy + 'px';
    style.zIndex = node._depth * 100;
    style.display = '';

    if(!this.leaf(node) && !this.config.titleHeight) {
      tag.style.display = 'none';
    }
    controller.onPlaceLabel(tag, node);
  }
});

/*
  Class: TM.Plot.NodeTypes

  This class contains a list of <Graph.Node> built-in types. 
  Node types implemented are 'none', 'rectangle'.

  You can add your custom node types, customizing your visualization to the extreme.

  Example:

  (start code js)
    TM.Plot.NodeTypes.implement({
      'mySpecialType': {
        'render': function(node, canvas) {
          //print your custom node to canvas
        },
        //optional
        'contains': function(node, pos) {
          //return true if pos is inside the node or false otherwise
        }
      }
    });
  (end code)

*/
TM.Plot.NodeTypes = new Class( {
  'rectangle': {
    'render': function(node, canvas, animating){
      var leaf = this.viz.leaf(node),
          config = this.config,
          offst = config.offset,
          titleHeight = config.titleHeight,
          pos = node.pos.getc(true),
          width = node.getData('width'),
          height = node.getData('height'),
          border = node.getData('border'),
          ctx = canvas.getCtx(),
          posx = pos.x + offst / 2, 
          posy = pos.y + offst / 2;
      if(width <= offst || height <= offst) return;
      if (leaf) {
        if(config.cushion) {
          var lg = ctx.createRadialGradient(posx + (width-offst)/2, posy + (height-offst)/2, 1, 
              posx + (width-offst)/2, posy + (height-offst)/2, width < height? height : width);
          var color = node.getData('color');
          var colorGrad = $.rgbToHex($.map($.hexToRgb(color), 
              function(r) { return r * 0.2 >> 0; }));
          lg.addColorStop(0, color);
          lg.addColorStop(1, colorGrad);
          ctx.fillStyle = lg;
        }
        ctx.fillRect(posx, posy, width - offst, height - offst);
        if(border) {
          ctx.save();
          ctx.strokeStyle = border;
          ctx.strokeRect(posx, posy, width - offst, height - offst);
          ctx.restore();
        }
      } else if(titleHeight > 0){
        ctx.fillRect(pos.x + offst / 2, pos.y + offst / 2, width - offst,
            titleHeight - offst);
        if(border) {
          ctx.save();
          ctx.strokeStyle = border;
          ctx.strokeRect(pos.x + offst / 2, pos.y + offst / 2, width - offst,
              height - offst);
          ctx.restore();
        }
      }
    }
  }
});

TM.Plot.EdgeTypes = new Class( {
  'none': $.empty
});

/*
  Class: TM.Squarified
  
  A squarified TreeMap visualization.

  Implements:
  
  All <TM.Base> methods and properties.
*/
TM.Squarified = new Class( {
  Implements: [
      Loader, Extras, TM.Base, Layouts.TM.Squarified
  ]
});

})();