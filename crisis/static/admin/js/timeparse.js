function parseTimeString(n){for(var i=0;i<timeParsePatterns.length;i++){var t=timeParsePatterns[i].re,a=timeParsePatterns[i].handler,e=t.exec(n);if(e)return a(e)}return n}var timeParsePatterns=[{re:/^\d{1,2}$/i,handler:function(n){return 1==n[0].length?"0"+n[0]+":00":n[0]+":00"}},{re:/^\d{2}[:.]\d{2}$/i,handler:function(n){return n[0].replace(".",":")}},{re:/^\d[:.]\d{2}$/i,handler:function(n){return"0"+n[0].replace(".",":")}},{re:/^(\d+)\s*([ap])(?:.?m.?)?$/i,handler:function(n){var i=parseInt(n[1]);return 12==i&&(i=0),"p"==n[2].toLowerCase()?(12==i&&(i=0),i+12+":00"):10>i?"0"+i+":00":i+":00"}},{re:/^(\d+)[.:](\d{2})\s*([ap]).?m.?$/i,handler:function(n){var i=parseInt(n[1]),t=parseInt(n[2]);return 10>t&&(t="0"+t),12==i&&(i=0),"p"==n[3].toLowerCase()?(12==i&&(i=0),i+12+":"+t):10>i?"0"+i+":"+t:i+":"+t}},{re:/^no/i,handler:function(){return"12:00"}},{re:/^mid/i,handler:function(){return"00:00"}}];