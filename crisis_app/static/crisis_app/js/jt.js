function direct(q){
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
    if(searchbox.value == ''){
      $('#searchModal').modal('show');
    }
    searchbox.focus();
  }
}
$(document).keyup(function(e){
  if (e.keyCode == 27) { // Escape key
    $('#searchModal').modal('hide');
  }
});
$('#searchModal').modal({ backdrop: false, keyboard: false, show: false });
$('#searchModal').on('shown', function(){
  searchbox = document.getElementById('justType');
  searchbox.focus();
});
$('#searchModal').on('hide', function(){
  searchbox = document.getElementById('justType');
  searchbox.value = '';
  searchbox.blur();
});
$('#justType').inlineComplete({
  list: ['@home', '@about', '@events', '@people', '@organizations', '@404']
});