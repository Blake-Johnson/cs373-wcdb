var showing = false;

$('#justType').val(''); // Clears Just Type on history.back
document.getElementsByTagName('html')[0].onkeypress = function(e) {
  e = e || window.event;
  var charCode = e.which || e.keyCode;
  var charTyped = String.fromCharCode(charCode);
  if(document.activeElement.tagName == 'INPUT'){
    return;
  }
  if(/[a-z0-9@]/i.test(charTyped)){
    searchbox = document.getElementById('justType');
    if($(searchbox).not(':visible')){
      $('#searchModal').modal('show');
      showing = true;
    }
  }
  if(showing){
    searchbox = document.getElementById('justType');
    searchbox.value += charTyped;
  }
}
$(document).keyup(function(e){
  if (e.keyCode == 27) { // Escape key
    $('#searchModal').modal('hide');
  }
});
$('#searchModal').modal({ backdrop: false, keyboard: false, show: false });
$('#searchModal').on('shown', function(){
  showing = false;
  searchbox = document.getElementById('justType');
  searchbox.focus();
});
// Blurs both Just Type and the searchbox on ESC
$('#searchModal').on('hide', function(){
  document.getElementById('searchbox').blur();
  searchbox = document.getElementById('justType');
  searchbox.value = '';
  searchbox.blur();
});

// Actions
var act = {
  go: function(url, name){
    window.open(url, name);
  },
  scrollto: function(id){
    id = '#' + id;
    var dest=0;
    if($(id).offset().top > $(document).height() - $(window).height()){
      dest=$(document).height() - $(window).height();
    }else{
      dest=$(id).offset().top;
    }
    $('html, body').animate({ scrollTop: dest }, 400, 'swing');
  },
  scroll: function(dir){
    $('html, body').animate({ scrollTop: $(window).scrollTop() + dir }, 400, 'swing');
  }
}

// Imports
var imp = {
  lolcats: function(){
    ktndata = null, fcb = function (d) {
      ktndata = d;
      var p = document.getElementsByTagName('img');
      for (var i in p) {
        p[i].src = d.items[Math.floor(Math.random() * (d.items.length))].media.m;
      }
    };
    if (!ktndata) {
      var jp = document.createElement('script');
      jp.setAttribute('type', 'text/javascript');
      jp.setAttribute('src', 'http://ycpi.api.flickr.com/services/feeds/photos_public.gne?tags=lolcat%2Clolcats&tagmode=any&format=json&jsoncallback=fcb');
      document.getElementsByTagName('head')[0].appendChild(jp);
    } else {
      fcb(ktndata);
    }
  },
  grav: function(magnitude){
    $.getScript(STATIC_URL + 'crisis/js/class.js');
    $.getScript(STATIC_URL + 'crisis/js/box2d.js');
    if(magnitude){
      $.getScript(STATIC_URL + 'crisis/js/gravity.js')
      .fail(function(jqxhr, settings, exception){
        alert(exception);
      });
    }else{
      $.getScript(STATIC_URL + 'crisis/js/space.js')
      .fail(function(jqxhr, settings, exception){
        alert(exception);
      });
    }
  },
  spaceship: function(){
    javascript: var KICKASSVERSION = '2.0';
    var s = document.createElement('script');
    s.type = 'text/javascript';
    document.body.appendChild(s);
    s.src = '//hi.kickassapp.com/kickass.js';
    void(0);
  }
}

// Initializes Just Type
var actions = [['home', "act.go('/', '_self');"],
               ['about', "act.go('/about', '_self');"],
               ['events', "act.go('/events', '_self');"],
               ['people', "act.go('/people', '_self');"],
               ['organizations', "act.go('/orgs', '_self');"],
               ['back', "history.back();"],
               ['forward', "history.forward();"],
               ['refresh', "location.reload();"],
               ['up', "act.scroll(-$(window).height()*0.8);"],
               ['down', "act.scroll($(window).height()*0.8);"],
               ['404', "act.go('/404', '_self');"]
              ];
var imports = [['lolcats', "imp.lolcats();"],
               ['gravity', "imp.grav(1);"],
               ['antigravity', "imp.grav(0);"],
               ['spaceship', "imp.spaceship();"]
              ];
function completer(){
  $('.jtGo').each(function(){
    actions.push([$(this).attr('name').replace(/[^a-zA-Z0-9]/, ' ').trim(), "act.go('" + $(this).attr('href') + "', '" + $(this).attr('target') + "');"]);
  });
  $('.jtScroll').each(function(){
    actions.push([$(this).attr('id'), "act.scrollto('" + $(this).attr('id') + "');"]);
  });
  $('#justType').inlineComplete({
    list: $.map(actions, function(n){ return n[0]; })
  });
}
completer();
