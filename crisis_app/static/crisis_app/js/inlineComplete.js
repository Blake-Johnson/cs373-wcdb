/*
* jQuery inlineComplete Plugin
* Examples and documentation at: http://pburke.de/jquery-inlinecomplete
* Version: 0.2
*
* Licensed under the MIT license:
*
* Copyright (c) 2013 Patrick Burke
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
!function(t){"use strict";var e={dataListSupport:!(!document.createElement("datalist")||!window.HTMLDataListElement),_defaultOptions:{list:[],matchCase:!1,submitOnReturn:!1,startChar:"",startCharCi:!0,disableDataList:!1},_searchTerm:function(t,e){for(var n in e)if(e[n].substr(0,t.length).toLowerCase()==t)return e[n];return null},_getCurrentWord:function(t,e){var n=t.substr(0,e).lastIndexOf(" ")+1;return t.substr(n,e)},_performComplete:function(e,n,i){if(8==n.which||46==n.which||n.ctrlKey||17==n.which||!i.list||0==i.list.length)return!0;if(16==n.which)return this;var r=t(e),s=this._getCurrentWord(r.val()),a=!0;if(""!=s)if(i.matchCase||(s=s.toLowerCase()),"keydown"==n.type){var o=r.__getSelection(),l=String.fromCharCode(n.which);if(""==l)return a;n.shiftKey||(l=l.toLowerCase()),l.toLowerCase()==o.substr(0,1).toLowerCase()&&(r.__moveSelectionStart(1),a=!1)}else if("keyup"==n.type){var c=r.__cursorPosition(),u=r.val(),f=this._searchTerm(s,i.list);if(null!==f&&f!=s){var h=u.substr(0,c),d=u.substr(c,u.length),p=c-(u.substr(0,c).lastIndexOf(" ")+1),v=f.substr(p,f.length);r.val(h+v+d),r.__select(c,v.length+c)}}return a}};t.fn.__select=function(t,e){return"number"==typeof t&&"number"==typeof e&&this.each(function(){var n;if("undefined"!=typeof this.selectionStart)this.selectionStart=t,this.selectionEnd=e;else{var i=document.selection.createRange();this.select();var r=document.selection.createRange();r.setEndPoint("EndToStart",i),n=r.text.length,this.select(),i=document.selection.createRange(),i.moveStart("character",n),i.select()}}),this},t.fn.__getSelection=function(){var t=this.get(0);if("undefined"!=typeof t.selectionStart)return this.val().substr(t.selectionStart,t.selectionEnd);var e=document.selection.createRange();return e.text},t.fn.__moveSelectionStart=function(t){"number"==typeof t&&this.each(function(){if("undefined"!=typeof this.selectionStart)this.selectionStart+=t;else{var e=document.selection.createRange();e.moveStart("character",t),e.select()}})},t.fn.__cursorPosition=function(){if("undefined"!=typeof this.get(0).selectionStart)return this.get(0).selectionStart;var t=document.selection.createRange();t.moveStart("character",amount),t.select()},t.fn.inlineComplete=function(n){return this.filter("input[type=text], textarea").each(function(){var i=t(this),r=t.extend(!0,{},e._defaultOptions,n);if(0==r.list.length)if(i.data("list"))0===i.data("list").indexOf("list")&&(r.list=i.data("list").replace(/^list:/i,"").split("|"));else if("undefined"!=typeof i.attr("list")){var s=t("#"+i.attr("list"));if(s.length>0){if(e.dataListSupport){var a=s.get(0).options;for(var o in a)a[o].value&&r.list.push(a[o].value)}else r.list=[],s.find("option").each(function(){r.list.push(i.attr("value"))});r.disableDataList&&i.removeAttr("list")}}var l=[];for(var o in r.list)""!=r.list[o].replace(/\s*/,"")&&l.push(r.list[o]);return r.list=l,0==r.list.length?!0:(i.on("keyup keydown",function(t){return e._performComplete(i,t,r)}),!0)}),this}}(jQuery);