window.LCstorage = window.localStorage;
if (document.all && !window.localStorage) {
    window.LCstorage = {};
    window.LCstorage.removeItem = function () { };
}

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

dojo.declare("mixin.IService", null, {
    server: null,
    
    setServer: function(server){
        this.server = server;
    }
});

dojo.declare("mixin.IDataStorageAware", null, {
    constructor: function(){
        dojo.subscribe("server/save", dojo.hitch(this, this.save));
        dojo.subscribe("server/load", dojo.hitch(this, this.load));
    }
});

dojo.declare("mixin.IMessageAware", null, {
    msg: function(message, category){
        console.log("publishing message", message);
        dojo.publish("server/msg", {
            msg: message,
            category: category
        });
    },
    
    msgSubscribe: function(hanlder){
        dojo.subscribe("server/msg", handler);
    }
});

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
    scheduledHandlers: [],

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
    },

    scheduleEvent: function(handler){
        this.scheduledHandlers.push(handler)
    },

    updateScheduledEvents: function(){
        for (var i in this.scheduledHandlers){
            this.scheduledHandlers[i]();
        }
        this.scheduledHandlers = [];
    }
    
});

dojo.declare("classes.IO", [mixin.IService, mixin.IDataStorageAware, mixin.IMessageAware], {
    peer: null,
    peerList: null,
    
    constructor: function(){
        this.peerList = {};
    },

    /**
     * TODO: use some peer wrapper?
     * 
     * @param peerId
     * @private
     */
    
    _initPeer: function(peerId){
        var self = this;
        console.log("initializing peer #", peerId);
        
        this.peer = new Peer(peerId, {key: 'holam7za1x9u23xr'});
        this.peer.on('open', function(id) {
            console.log("peer to server connection established");
            
            self.peerId = id;
            self.notifyUpdate();
        });
        
        this.peer.on('error', function(err){
            console.log("PEER ERROR:", err);
        });
        this.peer.on('connection', dojo.hitch(this, this.onConnect));
    },

    onConnect: function(conn){
        console.log("PEER CONNECTED:", conn);
        
        var remotePeerId = conn.peer;
        this.msg(remotePeerId + " has connected");

        this.peerList[remotePeerId] = {
            id: remotePeerId,
            conn: conn
        }
    },
    
    addPeer: function(destPeerId){
        var conn = this.peer.connect(destPeerId);
        var self = this;
        
        conn.on('open', function() {
            self.peerList[destPeerId] = {
                //redundancy department of redundancy
                id: destPeerId,
                conn: conn
            };
            
            //TODO: ping peer and request data
            //then update id
            
            
            self.notifyUpdate();
            //TODO: attach message buss
        });
    },

    save: function($data){
        $data["io"] = {
            peerId: this.peerId
        };
    },
    
    load: function($data){
        var io = $data["io"];
        if (io) {
            this.peerId = io.peerId;
        }
        this._initPeer(this.peerId);
        dojo.publish("io/update");
    },
    
    notifyUpdate: function(){
        dojo.publish("io/update");
    }
});

dojo.declare("classes.OfflineManager", [mixin.IService, mixin.IDataStorageAware, mixin.IMessageAware], {
    save: function($data){
        $data["offline"] = {
            timestamp: Date.now()
        }
    },
    
    load: function($data){
        if (!$data["offline"]){
            return;
        }
        var timestamp = Date.now();
        var delta = timestamp - ( $data["offline"].timestamp || 0 );
        if (delta <= 0){
            return;
        }
        
        this.msg("Timestamp delta is: " + delta + " seconds");
    }
});

dojo.declare("classes.Server", null, {
    world: null,
    isDebug: false,
    isPaused: false,

    tickDelay: 50,    //1 second
    ticksPerTurn: 50,

    /**
     * This is messy. Should we have a pool of services?
     */
    timer: null,
    storage: null,

    io: null,
    offline: null,
    
    //----------------------------
    services: null,
 
    constructor: function(){
        this.services = [];
        
        
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
        //---------------------------------------------
        //  services
        //---------------------------------------------

        this.registerService("io", classes.IO);
        this.registerService("offline", classes.OfflineManager);

        this.storage = new classes.Storage();
 
    },
    
    registerService: function(name, clazz){
        //TODO: check for mixin.IService
        var service = new clazz();
        service.setServer(this);
        
        this.services[name] = service;
    },
    
    svc: function(name){
        return this.services[name];
    },

    addEvent: function(delay, callback){
        this.timer.addEvent(dojo.hitch(this, callback), delay);
    },

    /**
     * All load and reset logic should be performed in the main loop to avoid
     * race condition issues
     */
    load: function(){
        this.timer.scheduleEvent(dojo.hitch(this, function(){
            this.storage.load();
            //TODO: pass server instance as well?
            dojo.publish("server/load", this.storage.data);
        }));
    },

    save: function(){
        console.log("saving...");
        dojo.publish("server/save", this.storage.data);
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

    /**
     * Main server loop.
     * 
     */
    onTick: function() {
        this.timer.updateScheduledEvents();
        
        if (this.isPaused) {
            return;
        }
        this.timer.beforeUpdate();
        this.timer.update();
        this.timer.afterUpdate();
    },

    onTurn: function(){
        //this.notify("onNewTurn");
        this.world.countries[0].update();
    }

});

