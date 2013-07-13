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
  list: ['@home', '@about', '@events', '@people', '@organizations']
});