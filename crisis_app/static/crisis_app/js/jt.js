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
var request = ['home', 'about', 'events', 'people', 'organizations', 'back', 'forward', '404'];
var actions = ["h.goto('/');", "h.goto('/about');", "h.goto('/events');", "h.goto('/people');", "h.goto('/orgs');", "history.back();", "history.forward();", "h.goto('/404');"];
function completer(){
  $('.jtGo').each(function(){
    request.push($(this).attr('name').replace(/[^a-zA-Z0-9]/, ' ').trim());
    actions.push("h.go('" + $(this).attr('href') + "');");
  });
  $('.jtScroll').each(function(){
    request.push($(this).attr('id'));
    actions.push("h.scroll('" + $(this).attr('id') + "');");
  });
  $('#justType').inlineComplete({
    list: request
  });
}
completer();

// Helper Functions
var h = {
  go: function(url){
    window.open(url, '_self');
  },
  scroll: function(id){
    id = '#' + id;
    var dest=0;
    if($(id).offset().top > $(document).height() - $(window).height()){
      dest=$(document).height() - $(window).height();
    }else{
      dest=$(id).offset().top;
    }
    $('html,body').animate({scrollTop:dest}, 400, 'swing');
  }
}