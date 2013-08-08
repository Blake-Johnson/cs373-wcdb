/* Based on Alex Arnell's inheritance implementation. */
function $A(t){if(!t)return[];if(t.toArray)return t.toArray();for(var e=t.length||0,n=new Array(e);e--;)n[e]=t[e];return n}var Class={create:function(){function t(){this.initialize.apply(this,arguments)}var e=null,n=$A(arguments);if(Object.isFunction(n[0])&&(e=n.shift()),Object.extend(t,Class.Methods),t.superclass=e,t.subclasses=[],e){var r=function(){};r.prototype=e.prototype,t.prototype=new r,e.subclasses.push(t)}for(var i=0;i<n.length;i++)t.addMethods(n[i]);return t.prototype.initialize||(t.prototype.initialize=this.emptyFunction),t.prototype.constructor=t,t},emptyFunction:function(){}};Class.Methods={addMethods:function(t){var e=this.superclass&&this.superclass.prototype,n=Object.keys(t);Object.keys({toString:!0}).length||n.push("toString","valueOf");for(var r=0,i=n.length;i>r;r++){var o=n[r],s=t[o];if(e&&Object.isFunction(s)&&"$super"==s.argumentNames().first())var u=s,s=Object.extend(function(t){return function(){return e[t].apply(this,arguments)}}(o).wrap(u),{valueOf:function(){return u},toString:function(){return u.toString()}});this.prototype[o]=s}return this}},Object.extend=function(t,e){for(var n in e)t[n]=e[n];return t},Object.extend(Object,{inspect:function(t){try{return Object.isUndefined(t)?"undefined":null===t?"null":t.inspect?t.inspect():String(t)}catch(e){if(e instanceof RangeError)return"...";throw e}},toJSON:function(t){var e=typeof t;switch(e){case"undefined":case"function":case"unknown":return;case"boolean":return t.toString()}if(null===t)return"null";if(t.toJSON)return t.toJSON();if(!Object.isElement(t)){var n=[];for(var r in t){var i=Object.toJSON(t[r]);Object.isUndefined(i)||n.push(r.toJSON()+": "+i)}return"{"+n.join(", ")+"}"}},toQueryString:function(t){return $H(t).toQueryString()},toHTML:function(t){return t&&t.toHTML?t.toHTML():String.interpret(t)},keys:function(t){var e=[];for(var n in t)e.push(n);return e},values:function(t){var e=[];for(var n in t)e.push(t[n]);return e},clone:function(t){return Object.extend({},t)},isElement:function(t){return t&&1==t.nodeType},isArray:function(t){return null!=t&&"object"==typeof t&&"splice"in t&&"join"in t},isHash:function(t){return t instanceof Hash},isFunction:function(t){return"function"==typeof t},isString:function(t){return"string"==typeof t},isNumber:function(t){return"number"==typeof t},isUndefined:function(t){return"undefined"==typeof t}}),(WebKit=navigator.userAgent.indexOf("AppleWebKit/")>-1)&&($A=function(t){if(!t)return[];if((!Object.isFunction(t)||"[object NodeList]"!=t)&&t.toArray)return t.toArray();for(var e=t.length||0,n=new Array(e);e--;)n[e]=t[e];return n});