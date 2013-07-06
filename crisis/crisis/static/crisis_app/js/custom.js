function link(selector){
  if(document.body.style['webkitPerspective'] !== undefined || document.body.style['MozPerspective'] !== undefined){
    var nodes = document.querySelectorAll(selector);
    for(var i=0, len=nodes.length; i<len; i++){
        var node = nodes[i];
        node.innerHTML = '<span data-title="'+ node.text +'">' + node.innerHTML + '</span>';
    };
  }
}