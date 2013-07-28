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
var actions = [['home', "h.go('/', '_self');"],
               ['about', "h.go('/about', '_self');"],
               ['events', "h.go('/events', '_self');"],
               ['people', "h.go('/people', '_self');"],
               ['organizations', "h.go('/orgs', '_self');"],
               ['back', "history.back();"],
               ['forward', "history.forward();"],
               ['up', "h.scroll(-500);"],
               ['down', "h.scroll(500);"],
               ['404', "h.go('/404', '_self');"]
              ];
function completer(){
  $('.jtGo').each(function(){
    actions.push([$(this).attr('name').replace(/[^a-zA-Z0-9]/, ' ').trim(), "h.go('" + $(this).attr('href') + "', '" + $(this).attr('target') + "');"]);
  });
  $('.jtScroll').each(function(){
    actions.push([$(this).attr('id'), "h.scrollto('" + $(this).attr('id') + "');"]);
  });
  $('#justType').inlineComplete({
    list: $.map(actions, function(n){ return n; })
  });
}
completer();

// Helper Functions
var h = {
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