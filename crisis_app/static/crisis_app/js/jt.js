var showing = false;

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
function hash(q){
  var result = false;
  var id;
  switch(q){
    case '#top':
    case '#header':
      id = '#header';
      break;
    case '#bottom':
    case '#footer':
      id = '#footer';
      break;
  }
  if(id){
    result = true;
    $('#searchModal').modal('hide');
    scrollTo(id);
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
  if(/[a-z0-9@#]/i.test(charTyped)){
    searchbox = document.getElementById('justType');
    if(searchbox.value == ''){
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
$('#searchModal').on('hide', function(){
  searchbox = document.getElementById('justType');
  searchbox.value = '';
  searchbox.blur();
});
function scrollTo(id){
   var dest=0;
   if($(id).offset().top > $(document).height()-$(window).height()){
        dest=$(document).height()-$(window).height();
   }else{
        dest=$(id).offset().top;
   }
   $('html,body').animate({scrollTop:dest}, 400, 'swing');
}
function completer(){
  var toComplete = ['@home', '@about', '@events', '@people', '@organizations', '@back', '@forward', '@404',
                    '#top', '#header', '#bottom', '#footer'];
  $('.jtAt').each(function(){
    toComplete.push($(this).attr('name').replace(/[^a-zA-Z0-9]/, ' ').trim());
  });
  $('.jtHash').each(function(){
    toComplete.push('#' + $(this).attr('id'));
  });
  $('#justType').inlineComplete({
    list: toComplete
  });
}
completer();