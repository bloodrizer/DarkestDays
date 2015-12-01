dojo.declare("classes.Meta", null, {
    meta: null,

    constructor: function(meta){
        this.meta = meta;
    },

    get: function(meta, id){
        if (!this.$metaCache){
            this.$metaCache = {};
        }

        var val = this.$metaCache[id];
        if (val){
            return val;
        }

        for (var i in this.meta){
            if (this.meta[i].id == id){
                this.$metaCache[id] = this.meta[i];
                return this.meta[i];
            }
        }
    },
    
    save: function(){
        
    },
    
    load: function(){
        
    }
});

dojo.declare("classes.sim.World", null, {
    calendar: null,
    constructor: function(){
        this.calendar = new classes.Calendar();
    }
});

dojo.declare("classes.Server", null, {
    world: null,

    constructor: function(){
        this.world = new classes.sim.World();
    },

    run: function(){

    }
});

