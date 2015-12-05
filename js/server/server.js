window.LCstorage = window.localStorage;
if (document.all && !window.localStorage) {
    window.LCstorage = {};
    window.LCstorage.removeItem = function () { };
}


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

dojo.declare("classes.IO", null, {
    peer: null,
    peerList: null,
    
    constructor: function(){
        this.peerList = [];
        
        //this._initPeer(this.peerId);
        
        dojo.subscribe("server/save", dojo.hitch(this, this.save));
        dojo.subscribe("server/load", dojo.hitch(this, this.load));
    },
    
    _initPeer: function(peerId){
        var self = this;
        console.log("initializing peer #", peerId);
        
        this.peer = new Peer({key: 'holam7za1x9u23xr'}, peerId);
        if (!peerId){
            this.peer.on('open', function(id) {
                self.peerId = id;
                dojo.publish("io/update");
            });
        } else {
            this.peerId = peerId;
        }

        this.peer.on('connection', this.onConnect);
    },

    onConnect: function(conn){
        console.log("PEER CONNECTED:", conn);
    },
    
    addPeer: function(destPeerId){
        var conn = this.peer.connect(destPeerId);
        console.log(conn);
    },

    save: function($server){
        $server.storage.data["io"] = {
            peerId: this.peerId
        };
    },
    
    load: function($server){
        var io = $server.storage.data["io"];
        if (io) {
            this.peerId = io.peerId;
        }
        this._initPeer(this.peerId);
        dojo.publish("io/update");
    }
});

dojo.declare("classes.Storage", null, {
    
    storage: "com.nuclearunicorn.ddays.savedata", 
    data: null,
    
    constructor: function(){
        this.data = {};
    },
    
    load: function(){
        var data = LCstorage[this.storage];
        if (!data){
            return;
        }
        try {
            var saveData = JSON.parse(data);
            if (saveData){
                this.data = saveData;
                console.log("loaded data:", saveData);
            }
        } catch (ex) {
            console.error("Unable to load game data: ", ex);
        }
    },
    
    save: function(){
       LCstorage[this.storage] = JSON.stringify(this.data);
    },
    
    wipe: function(){
        LCstorage[this.storage] = null;
    }
});


dojo.declare("classes.Server", null, {
    world: null,
    isDebug: false,
    isPaused: false,

    tickDelay: 50,    //1 second
    ticksPerTurn: 50,
    
    timer: null,
    io: null,
    storage: null,
    
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
        this.addEvent(50, function(){
            this.save();
        });
        
        this.io = new classes.IO();
        this.storage = new classes.Storage();
    },

    addEvent: function(delay, callback){
        this.timer.addEvent(dojo.hitch(this, callback), delay);
    },
    
    load: function(){
        this.storage.load();
        dojo.publish("server/load", this);
    },

    save: function(){
        console.log("saving...");
        dojo.publish("server/save", this);
        
        console.log("STORAGE SNAPSHOT", this.storage);
        this.storage.save();  
    },

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

