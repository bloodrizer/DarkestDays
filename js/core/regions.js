/**
 * All region-related logic goes there
 */


dojo.declare("classes.sim.World", null, {

});

/**
 * Country model
 */
dojo.declare("classes.sim.Country", null, {
    id : null,
    name: null,
    regions: []
});

/**
 * Region model
 */
dojo.declare("classes.sim.Region", null, {
    id : null,
    name: null,
    simUnits: []
});

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
    income: null
    
});