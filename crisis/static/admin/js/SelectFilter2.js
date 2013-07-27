!function(e){function t(e){return"form"!=e.tagName.toLowerCase()?t(e.parentNode):e}window.SelectFilter={init:function(r,n,a,l){if(!r.match(/__prefix__/)){var i=document.getElementById(r);i.id+="_from",i.className="filtered";for(var o=i.parentNode.getElementsByTagName("p"),c=0;c<o.length;c++)-1!=o[c].className.indexOf("info")?i.parentNode.removeChild(o[c]):-1!=o[c].className.indexOf("help")&&i.parentNode.insertBefore(o[c],i.parentNode.firstChild);var s=quickElement("div",i.parentNode);s.className=a?"selector stacked":"selector";var d=quickElement("div",s,"");d.className="selector-available";var u=quickElement("h2",d,interpolate(gettext("Available %s")+" ",[n]));quickElement("img",u,"","src",l+"img/icon-unknown.gif","width","10","height","10","class","help help-tooltip","title",interpolate(gettext('This is the list of available %s. You may choose some by selecting them in the box below and then clicking the "Choose" arrow between the two boxes.'),[n]));var h=quickElement("p",d,"","id",r+"_filter");h.className="selector-filter";var m=quickElement("label",h,"","for",r+"_input");quickElement("img",m,"","src",l+"img/selector-search.gif","class","help-tooltip","alt","","title",interpolate(gettext("Type into this box to filter down the list of available %s."),[n])),h.appendChild(document.createTextNode(" "));var f=quickElement("input",h,"","type","text","placeholder",gettext("Filter"));f.id=r+"_input",d.appendChild(i);var g=quickElement("a",d,gettext("Choose all"),"title",interpolate(gettext("Click to choose all %s at once."),[n]),"href",'javascript: (function(){ SelectBox.move_all("'+r+'_from", "'+r+'_to"); SelectFilter.refresh_icons("'+r+'");})()',"id",r+"_add_all_link");g.className="selector-chooseall";var v=quickElement("ul",s,"");v.className="selector-chooser";var p=quickElement("a",quickElement("li",v,""),gettext("Choose"),"title",gettext("Choose"),"href",'javascript: (function(){ SelectBox.move("'+r+'_from","'+r+'_to"); SelectFilter.refresh_icons("'+r+'");})()',"id",r+"_add_link");p.className="selector-add";var _=quickElement("a",quickElement("li",v,""),gettext("Remove"),"title",gettext("Remove"),"href",'javascript: (function(){ SelectBox.move("'+r+'_to","'+r+'_from"); SelectFilter.refresh_icons("'+r+'");})()',"id",r+"_remove_link");_.className="selector-remove";var k=quickElement("div",s,"");k.className="selector-chosen";var y=quickElement("h2",k,interpolate(gettext("Chosen %s")+" ",[n]));quickElement("img",y,"","src",l+"img/icon-unknown.gif","width","10","height","10","class","help help-tooltip","title",interpolate(gettext('This is the list of chosen %s. You may remove some by selecting them in the box below and then clicking the "Remove" arrow between the two boxes.'),[n]));var x=quickElement("select",k,"","id",r+"_to","multiple","multiple","size",i.size,"name",i.getAttribute("name"));x.className="filtered";var w=quickElement("a",k,gettext("Remove all"),"title",interpolate(gettext("Click to remove all chosen %s at once."),[n]),"href",'javascript: (function() { SelectBox.move_all("'+r+'_to", "'+r+'_from"); SelectFilter.refresh_icons("'+r+'");})()',"id",r+"_remove_all_link");if(w.className="selector-clearall",i.setAttribute("name",i.getAttribute("name")+"_old"),addEvent(f,"keyup",function(e){SelectFilter.filter_key_up(e,r)}),addEvent(f,"keydown",function(e){SelectFilter.filter_key_down(e,r)}),addEvent(i,"change",function(){SelectFilter.refresh_icons(r)}),addEvent(x,"change",function(){SelectFilter.refresh_icons(r)}),addEvent(i,"dblclick",function(){SelectBox.move(r+"_from",r+"_to"),SelectFilter.refresh_icons(r)}),addEvent(x,"dblclick",function(){SelectBox.move(r+"_to",r+"_from"),SelectFilter.refresh_icons(r)}),addEvent(t(i),"submit",function(){SelectBox.select_all(r+"_to")}),SelectBox.init(r+"_from"),SelectBox.init(r+"_to"),SelectBox.move(r+"_from",r+"_to"),!a){var E=e(i),C=e(x),b=function(){C.height(e(h).outerHeight()+E.outerHeight())};E.outerHeight()>0?b():C.closest("fieldset").one("show.fieldset",b)}SelectFilter.refresh_icons(r)}},refresh_icons:function(t){var r=e("#"+t+"_from"),n=e("#"+t+"_to"),a=r.find("option:selected").length>0,l=n.find("option:selected").length>0;e("#"+t+"_add_link").toggleClass("active",a),e("#"+t+"_remove_link").toggleClass("active",l),e("#"+t+"_add_all_link").toggleClass("active",r.find("option").length>0),e("#"+t+"_remove_all_link").toggleClass("active",n.find("option").length>0)},filter_key_up:function(e,t){var r=document.getElementById(t+"_from");if(e.which&&13==e.which||e.keyCode&&13==e.keyCode)return r.selectedIndex=0,SelectBox.move(t+"_from",t+"_to"),r.selectedIndex=0,!1;var n=r.selectedIndex;return SelectBox.filter(t+"_from",document.getElementById(t+"_input").value),r.selectedIndex=n,!0},filter_key_down:function(e,t){var r=document.getElementById(t+"_from");if(e.which&&39==e.which||e.keyCode&&39==e.keyCode){var n=r.selectedIndex;return SelectBox.move(t+"_from",t+"_to"),r.selectedIndex=n==r.length?r.length-1:n,!1}return(e.which&&40==e.which||e.keyCode&&40==e.keyCode)&&(r.selectedIndex=r.length==r.selectedIndex+1?0:r.selectedIndex+1),(e.which&&38==e.which||e.keyCode&&38==e.keyCode)&&(r.selectedIndex=0==r.selectedIndex?r.length-1:r.selectedIndex-1),!0}}}(django.jQuery);