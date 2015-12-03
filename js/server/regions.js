/**
 * All region-related logic goes there
 */

/**
 * Country model
 */
dojo.declare("classes.sim.Country", null, {
    id : null,
    name: null,
    regions: null,

    resources: null,
    
    constructor: function(){
       this.regions = [];
       this.resources = new classes.res.ResMeta($resMeta);
    },
    
    init: function(){
        var region = new classes.sim.Region();
        region.name = "Chelyabinsk";

        this.regions.push(region);
        
        for (var res in $resMeta){
            this.resources.get(res).set(10000);
        }
    }
});

/**
 * Region model
 */
dojo.declare("classes.sim.Region", null, {
    id : null,
    name: null,
    
    //---------
    // population related stuff
    //---------
    
    lifeExpectancy: null,
    fertility: null,
    
    //----- geography -----
    /** Temperature modifier 0.0 - 1.0, 0.5 is mild */
    temperature: null,
    
    /**
     * Natural resources production ratios,
     * where 
     * {
     *     resId : ratio (0.0-1.0)
     * }
     * 
     * 
     */
    resourceDeposites: null,
    
    //---------
    simUnits: [],
    bld: null
});

/*dojo.declare("classes.sim.City", null, {
    id : null,
    name: null,
    simUnits: []
});*/

/**
 * Simulation unit for a region (represents an uniform group of population)
 */
dojo.declare("classes.sim.SimUnit", null, {

    /**
     * Number of people in unit
     */
    population: null,
    age: null,
    education: null,
    income: null,
    religion: null
    
});