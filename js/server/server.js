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
    
    countries: null,
    
    constructor: function(){
        this.calendar = new classes.Calendar();
        this.countries = [];
    },
    
    init: function(){
        var country = new classes.sim.Country();
        country.init();
        
        this.countries.push(country);   //TODO: use metawrappers
    }
});

dojo.declare("classes.Server", null, {
    world: null,

    constructor: function(){
        var world = new classes.sim.World();
        world.init();
        
        this.world = world;
    },

    run: function(){

    }
});

