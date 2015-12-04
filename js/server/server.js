
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

    ticksTotal: 0,
    totalUpdateTime: 0,
    
    currentTime: 0,
    averageTime: 0,

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
    },
    
    beforeUpdate: function(){
        this.timestampStart = new Date().getTime();
    },
    
    afterUpdate: function(){
        this.ticksTotal++;

        var timestampEnd = new Date().getTime();

        var tsDiff = timestampEnd - this.timestampStart;
        this.totalUpdateTime += tsDiff;


        this.currentTime = tsDiff;
        this.averageTime = Math.round(this.totalUpdateTime / this.ticksTotal);
    }
    
});

dojo.declare("classes.Server", null, {
    world: null,
    isDebug: false,
    isPaused: false,

    tickDelay: 50,    //1 second
    ticksPerTurn: 50,
    
    timer: null,
    
    $listeners: {},

    constructor: function(){
        var world = new classes.sim.World();
        world.init();
        
        this.world = world;
        
        //------------------ timer ---------------------
        this.timer = new classes.Timer();
        
        this.addEvent(1, function(){
            this.tick++;
            this.ticksTotal++;
        });
        this.addEvent(this.ticksPerTurn, function(){
            this.tick = 0;
            this.onTurn();
        });
    },

    addEvent: function(delay, callback){
        this.timer.addEvent(dojo.hitch(this, callback), delay);
    },
    
    /*addListener: function(event, callback){
        if (!this.$listeners[event]){
            this.$listeners[event] = [];
        }
        this.$listeners[event].push(callback);
    },
    
    notify: function(event){
        var listeners = this.$listeners[event];
        if (!listeners){
            return;
        }
        for (var i in listeners){
            listeners[i]();
        }
    },*/

    start: function(){
        if (!dojo.isIE && window.Worker){	//IE10 has a nasty security issue with running blob workers
            console.log("starting web worker...");
            var blob = new Blob([
                "onmessage = function(e) { setInterval(function(){ postMessage('tick'); }, " + this.tickDelay + "); }"]);
            var blobURL = window.URL.createObjectURL(blob);

            this.worker = new Worker(blobURL);
            this.worker.addEventListener('message', dojo.hitch(this, function(e) {
                this.onTick();
            }));
            this.worker.postMessage("tick");
        } else {
            console.log("starting js timer...");
            //some older browser, perhaps IE. Have a nice idling.
            var timer = setInterval(dojo.hitch(this, this.tick), (1000 / this.rate));
        }
    },

    onTick: function() {
        if (this.isPaused) {
            return;
        }
        this.timer.beforeUpdate();
        this.timer.update();
        this.timer.afterUpdate();
    },

    onTurn: function(){
        //this.notify("onNewTurn");
    }
    
    
    
});

