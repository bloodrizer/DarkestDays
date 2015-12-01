var $r = React.createElement;

var $dd = {

    /**
     * Todo: use proper meta wrapper
     */
    get: function(meta, id){
        if (!meta.$metaCache){
            meta.$metaCache = {};
        }
        
        var val = meta.$metaCache[id];
        if (val){
            return val;
        }

        for (var i in meta){
            if (meta[i].id == id){
                meta.$metaCache[id] = meta[i];
                return meta[i];
            }
        }
    } 
}

window.onload = function(){
    setupFW7();
    setupServer();
}


function setupFW7(){
    console.log("setting fw7 framework...");
    var fw7App = new Framework7();
    
    /*var worldMap = React.createElement(DDWorldMap);
    React.render(worldMap, document.getElementById('wmContainer'));*/

    var viewport = $r(DDViewport);
    React.render(viewport, document.getElementById('viewportContainer'));
}

function setupServer(){
    
}