var $bldMeta = {
    
    "oilWell": {
        title: "Oil Well",
        getEffects: function(){
            return {
                $consume: {
                    "energy" : 10   
                },
                $produce: {
                    "oil"    : 10
                }
            }
        },
        price: {
            "steel": 10000
        }
    },

    "coalMine": {
        title: "Coal Mine",
        getEffects: function(){
            return {
                $produce: {
                    "coal" : 10
                }
            }
        },
        price: {
            "steel": 10000
        }
    }
};

dojo.declare("classes.bld.Building", classes.MetaElement, {
    setVal: function(amt){
        this.meta.val = amt;
    },

    getVal: function(){
        return this.meta.val;
    },
    
    produce(){
        var effects = this.meta.getEffects();
        return effects.$produce || {};
    }
});

dojo.declare("classes.bld.BuildingMeta", classes.Meta, {
    getClass: function(){
        return classes.bld.Building;
    }
    
    /*update: function(){
        this.foreach(function(bld){
            var effects = bld.getEffects();
        });
    }*/
});