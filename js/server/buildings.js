var bldMeta = {
    
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
    }
}
