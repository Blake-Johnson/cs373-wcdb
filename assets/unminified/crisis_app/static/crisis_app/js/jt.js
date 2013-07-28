var showing = false;

// Clears Just Type on history.back
$('#justType').val('')

function at(q){
  var elements = q.split(/\s+/);
  var len = elements.length;
  var result = false;
  for(var i = 0; i < len; i++){
    var url;
    switch(elements[i].toLowerCase()){
      case '@home':
        url = '/';
        break;
      case '@about':
        url = '/about';
        break;
      case '@events':
        url = '/events';
        break;
      case '@people':
        url = '/people';
        break;
      case '@organizations':
        url = '/orgs';
        break;
      case '@back':
        history.back();
        return true;
        break;
      case '@forward':
        history.forward();
        return true;
        break;
      case '@404':
        url = '/404';
        break;
    }
    if(url){
      result = true;
      window.open(url, (i == 0 ? '_self' : '_blank'));
    }
  }
  return result;
}
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
function scrollTo(id){
   id = '#' + id;
   var dest=0;
   if($(id).offset().top > $(document).height()-$(window).height()){
        dest=$(document).height()-$(window).height();
   }else{
        dest=$(id).offset().top;
   }
   $('html,body').animate({scrollTop:dest}, 400, 'swing');
}
var actions = ['@home', '@about', '@events', '@people', '@organizations', '@back', '@forward', '@404'];
function completer(){
  $('.jtGo').each(function(){
    actions.push($(this).attr('name').replace(/[^a-zA-Z0-9]/, ' ').trim());
  });
  $('.jtScroll').each(function(){
    actions.push($(this).attr('id'));
  });
  $('#justType').inlineComplete({
    list: actions
  });
}
completer();