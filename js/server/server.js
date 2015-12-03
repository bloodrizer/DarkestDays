
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

dojo.declare("classes.Server", null, {
    world: null,
    isDebug: false,

    constructor: function(){
        var world = new classes.sim.World();
        world.init();
        
        this.world = world;
    },

    run: function(){

    }
});

