function removeChildren(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}function quickElement(){var e=document.createElement(arguments[0]);if(""!=arguments[2]&&null!=arguments[2]){var t=document.createTextNode(arguments[2]);e.appendChild(t)}for(var r=arguments.length,n=3;r>n;n+=2)e.setAttribute(arguments[n],arguments[n+1]);return arguments[1].appendChild(e),e}function Calendar(e,t){this.div_id=e,this.callback=t,this.today=new Date,this.currentMonth=this.today.getMonth()+1,this.currentYear=this.today.getFullYear()}var CalendarNamespace={monthsOfYear:gettext("January February March April May June July August September October November December").split(" "),daysOfWeek:gettext("S M T W T F S").split(" "),firstDayOfWeek:parseInt(get_format("FIRST_DAY_OF_WEEK")),isLeapYear:function(e){return 0==e%4&&0!=e%100||0==e%400},getDaysInMonth:function(e,t){var r;return r=1==e||3==e||5==e||7==e||8==e||10==e||12==e?31:4==e||6==e||9==e||11==e?30:2==e&&CalendarNamespace.isLeapYear(t)?29:28},draw:function(e,t,r,n){var a=new Date,i=a.getDate(),u=a.getMonth()+1,l=a.getFullYear(),o="";e=parseInt(e),t=parseInt(t);var s=document.getElementById(r);removeChildren(s);var c=document.createElement("table");quickElement("caption",c,CalendarNamespace.monthsOfYear[e-1]+" "+t);for(var h=quickElement("tbody",c),d=quickElement("tr",h),f=0;7>f;f++)quickElement("th",d,CalendarNamespace.daysOfWeek[(f+CalendarNamespace.firstDayOfWeek)%7]);var g=new Date(t,e-1,1-CalendarNamespace.firstDayOfWeek).getDay(),m=CalendarNamespace.getDaysInMonth(e,t);d=quickElement("tr",h);for(var f=0;g>f;f++){var y=quickElement("td",d," ");y.style.backgroundColor="#f3f3f3"}for(var v=1,f=g;m>=v;f++){0==f%7&&1!=v&&(d=quickElement("tr",h)),o=v==i&&e==u&&t==l?"today":"";var p=quickElement("td",d,"","class",o);quickElement("a",p,v,"href","javascript:void("+n+"("+t+","+e+","+v+"));"),v++}for(;d.childNodes.length<7;){var y=quickElement("td",d," ");y.style.backgroundColor="#f3f3f3"}s.appendChild(c)}};Calendar.prototype={drawCurrent:function(){CalendarNamespace.draw(this.currentMonth,this.currentYear,this.div_id,this.callback)},drawDate:function(e,t){this.currentMonth=e,this.currentYear=t,this.drawCurrent()},drawPreviousMonth:function(){1==this.currentMonth?(this.currentMonth=12,this.currentYear--):this.currentMonth--,this.drawCurrent()},drawNextMonth:function(){12==this.currentMonth?(this.currentMonth=1,this.currentYear++):this.currentMonth++,this.drawCurrent()},drawPreviousYear:function(){this.currentYear--,this.drawCurrent()},drawNextYear:function(){this.currentYear++,this.drawCurrent()}};