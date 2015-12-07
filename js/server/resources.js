var $resMeta = {
    "oil": {
        title: "Crude Oil",
        description: ""
    },
    "coal": {
        title: "Coal",
        description: ""
    },
    "energy": {
        title: "Energy",
        description: ""
    },
    "steel": {
        title: "Steel",
        description: ""
    },
}

dojo.declare("classes.res.Resource", classes.MetaElement, {
    set: function(amt){
        this.meta.val = amt;
    },
    
    get: function(){
        return this.meta.val;
    }
});

dojo.declare("classes.res.ResMeta", classes.Meta, {
    getClass: function(){
        return classes.res.Resource;
    }
});