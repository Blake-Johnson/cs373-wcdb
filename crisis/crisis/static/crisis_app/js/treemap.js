var labelType, useGradients, nativeTextSupport, animate;

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

function initTreeMap() {
    var tm = new $jit.TM.Squarified({
        injectInto: 'chart',
        //parent box title heights
        titleHeight: 42,
        animate: animate,
        //box offsets
        offset: 0,
		//width & height (don't use css)
		width: window.innerWidth,
		height: 800,
        //Attach left and right click events
        Events: {
            enable: true,
            onClick: function (node) {
				if(tm.leaf(node)){
					$('.tip').css('visibility', 'hidden');
				}
                if(node){
					tm.enter(node);
				}
            },
            onRightClick: function () {
				$('.tip').css('visibility', 'visible');
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
                    wheelSpeed: 20
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
	
	// Switch between size/equal visualization
	var btnPop = $jit.id('btnPop'),
		btnEqual = $jit.id('btnEqual'),
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
}