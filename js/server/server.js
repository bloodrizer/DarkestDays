
dojo.declare("classes.sim.World", null, {
    calendar: null,
    
    countries: null,
    
    constructor: function(){
        this.calendar = new classes.Calendar();
        this.countries = [];
    },
    
    init: function(){
        var country = new classes.sim.Country();
        country.name = "Russia";
        country.init();
        
        this.countries.push(country);   //TODO: use metawrappers
    }
});

dojo.declare("classes.Timer", null, {
    handlers: [],

    addEvent: function(handler, frequency){
        this.handlers.push({
            handler: handler,
            frequency: frequency,
            phase: 0
        });
    },

    update: function(){
        for (var i= 0; i < this.handlers.length; i++){
            var h = this.handlers[i];
            h.phase--;
            if (h.phase <= 0){
                h.phase = h.frequency;
                h.handler();
            }
        }
    }
});

dojo.declare("classes.Server", null, {
    world: null,
    isDebug: false,
    isPaused: false,

    tickDelay: 1000,    //1 second

    timer: null,

    constructor: function(){
        var world = new classes.sim.World();
        world.init();
        
        this.world = world;
        
        //------------------ timer ---------------------
        var timer = new classes.Timer();
 
        this.timer = timer;
    },

    start: function(){
        if (!dojo.isIE && window.Worker){	//IE10 has a nasty security issue with running blob workers
            console.log("starting web worker...");
            var blob = new Blob([
                "onmessage = function(e) { setInterval(function(){ postMessage('tick'); }, " + this.tickDelay + "); }"]);
            var blobURL = window.URL.createObjectURL(blob);

            this.worker = new Worker(blobURL);
            this.worker.addEventListener('message', dojo.hitch(this, function(e) {
                this.tick();
            }));
            this.worker.postMessage("tick");
        } else {
            console.log("starting js timer...");
            //some older browser, perhaps IE. Have a nice idling.
            var timer = setInterval(dojo.hitch(this, this.tick), (1000 / this.rate));
        }
    },

    tick: function() {
        if (this.isPaused) {
            return;
        }
        console.log("tick")
    }
    
    
    
});

