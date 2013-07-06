var labelType, useGradients, nativeTextSupport, animate, tooltip = true, inLeaf = false;

(function () {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var tm = new $jit.TM.Squarified({
    injectInto: 'chart',
    //parent box title heights
    titleHeight: 42,
    animate: animate,
    //box offsets
    offset: 0,
	//width & height (don't use css)
	width: window.innerWidth,
	height: 700,
    //Attach left and right click events
    Events: {
        enable: true,
        onClick: function (node) {
			if(tm.leaf(node)){
                inLeaf = true;
                if(tooltip){
				   $('.tip').css('visibility', 'hidden');
                }
			}
            if(node){
				tm.enter(node);
			}
        },
        onRightClick: function () {
            if(tooltip){
                $('.tip').css('visibility', 'visible');
            }
            inLeaf = false;
            tm.out();
        }
    },
    duration: 300,
    Tips: {
        enable: true,
        offsetX: 15,
        offsetY: 20,
        //implement the onShow method to add content
		//to the tooltip when a node is hovered
        onShow: function (tip, node, isLeaf, domElement) {
            var html = '<h4 class="inline">' + node.name + '</h4>';
            if (node.data.popularity) {
                html += '<div>Popularity: ' + node.data.popularity + '</div>';
            }
            tip.innerHTML = html;
        }
    },
    //Add the name of the node in the correponding label
    //This method is called once, on label creation.
    onCreateLabel: function (domElement, node) {
        var style = domElement.style;
        style.fontSize = '1em';
        if (tm.leaf(node)) {
            // Leaf (content) node
			var html = '<div class="content">';
			html +=  '<img class="pull-right" src="' + node.data.image + '" />';
			html += '<h3>' + node.name + '</h3>';
			html += '<p class="text-white">' + node.data.description + '</p>';
			html += '</div>';
            domElement.innerHTML = html;
            $(domElement).addClass('content-node');
            $(domElement).perfectScrollbar({
                wheelSpeed: 20,
                wheelPropagation: true
            });
        } else {
            // Non-leaf (title) node
			var html = '<div class="title">';
			html += '<h2 class="inline">' + node.name + '</h2>';
			html += '</div>';
			domElement.innerHTML = html;
            style.fontWeight = 'bold';
        }
    }
});
tm.loadJSON(json);
tm.refresh();

// Button options
var btnPop = $jit.id('btnPop'),
    btnEqual = $jit.id('btnEqual'),
    btnBack = $jit.id('btnBack'),
    btnTipOn = $jit.id('btnTipOn'),
    btnTipOff = $jit.id('btnTipOff'),
	size = true;
$jit.util.addEvent(btnPop, 'click', function() {
	if(!size){
		tm.graph.eachNode(function(node){
			if(node.data.popularity){
				node.data.$area = node.data.popularity;
			}
		});
		tm.refresh();
		size = true;
	}
});
$jit.util.addEvent(btnEqual, 'click', function() {
    if(size){
        tm.graph.eachNode(function(node){
            node.data.$area = 1;
        });
        tm.refresh();
        size = false;
    }
});
$jit.util.addEvent(btnTipOn, 'click', function() {
    if(!inLeaf){
        $('.tip').css('visibility', 'visible');
    }
    tooltip = true;
});
$jit.util.addEvent(btnTipOff, 'click', function() {
    $('.tip').css('visibility', 'hidden');
    tooltip = false;
});
$jit.util.addEvent(btnBack, 'click', function() {
    tm.out();
});