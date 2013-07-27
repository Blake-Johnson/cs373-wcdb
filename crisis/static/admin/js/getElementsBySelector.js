/* document.getElementsBySelector(selector)
   - returns an array of element objects from the current document
     matching the CSS selector. Selectors can contain element names, 
     class names and ids and can be nested. For example:
     
       elements = document.getElementsBySelect('div#main p a.external')
     
     Will return an array of all 'a' elements with 'external' in their 
     class attribute that are contained inside 'p' elements that are 
     contained inside the 'div' element which has id="main"

   New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
   See http://www.w3.org/TR/css3-selectors/#attribute-selectors

   Version 0.4 - Simon Willison, March 25th 2003
   -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
   -- Opera 7 fails 
*/
function getAllChildren(e){return e.all?e.all:e.getElementsByTagName("*")}document.getElementsBySelector=function(e){if(!document.getElementsByTagName)return new Array;for(var t=e.split(" "),r=new Array(document),n=0;n<t.length;n++)if(token=t[n].replace(/^\s+/,"").replace(/\s+$/,""),token.indexOf("#")>-1){var a=token.split("#"),l=a[0],g=a[1],o=document.getElementById(g);if(!o||l&&o.nodeName.toLowerCase()!=l)return new Array;r=new Array(o)}else if(token.indexOf(".")>-1){var a=token.split("."),l=a[0],u=a[1];l||(l="*");for(var i=new Array,c=0,f=0;f<r.length;f++){var s;if("*"==l)s=getAllChildren(r[f]);else try{s=r[f].getElementsByTagName(l)}catch(m){s=[]}for(var A=0;A<s.length;A++)i[c++]=s[A]}r=new Array;for(var y=0,h=0;h<i.length;h++)i[h].className&&i[h].className.match(new RegExp("\\b"+u+"\\b"))&&(r[y++]=i[h])}else if(token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)){var l=RegExp.$1,b=RegExp.$2,w=RegExp.$3,d=RegExp.$4;l||(l="*");for(var i=new Array,c=0,f=0;f<r.length;f++){var s;s="*"==l?getAllChildren(r[f]):r[f].getElementsByTagName(l);for(var A=0;A<s.length;A++)i[c++]=s[A]}r=new Array;var v,y=0;switch(w){case"=":v=function(e){return e.getAttribute(b)==d};break;case"~":v=function(e){return e.getAttribute(b).match(new RegExp("\\b"+d+"\\b"))};break;case"|":v=function(e){return e.getAttribute(b).match(new RegExp("^"+d+"-?"))};break;case"^":v=function(e){return 0==e.getAttribute(b).indexOf(d)};break;case"$":v=function(e){return e.getAttribute(b).lastIndexOf(d)==e.getAttribute(b).length-d.length};break;case"*":v=function(e){return e.getAttribute(b).indexOf(d)>-1};break;default:v=function(e){return e.getAttribute(b)}}r=new Array;for(var y=0,h=0;h<i.length;h++)v(i[h])&&(r[y++]=i[h])}else{l=token;for(var i=new Array,c=0,f=0;f<r.length;f++)for(var s=r[f].getElementsByTagName(l),A=0;A<s.length;A++)i[c++]=s[A];r=i}return r};