dojo.declare("classes.Meta", null, {
    meta: null,

    constructor: function(meta){
        this.meta = meta;
    },

    get: function(id){
        if (!this.$metaCache){
            this.$metaCache = {};
        }

        var val = this.$metaCache[id];
        if (val){
            return val;
        }

        console.log(this.meta);

        var $elem = this._getMetaWrapper(this.meta[id], id);
        this.$metaCache[id] = $elem;
        return $elem;
        
        /*for (var i in this.meta){
            if (this.meta[i].id == id){
                
                this.$metaCache[id] = this.meta[i];
                return this.meta[i];
            }
        }*/
    },

    save: function(){

    },

    load: function(){

    },

    _getMetaWrapper: function(meta, id){
        return new this.getClass()(meta, id);
    },

    getClass: function(){
        return classes.MetaElement;
    }
});

dojo.declare("classes.MetaElement", null, {
    id: null,
    constructor: function(meta, id){
        this.meta = meta;
        this.id = id;
    },

    $: function(){
        //return this.meta.get(this.id);
        return this.meta;
    }
});
