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

        var $elem = this._getMetaWrapper(this.meta[id], id);
        this.$metaCache[id] = $elem;
        return $elem;

    },
    
    keys: function(){
        return Object.keys(this.meta);
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
    },
    
    foreach: function(handler, context){
        for (var key in this.meta){
            var elem = this.get(key);
            dojo.hitch(context || this, handler)(elem);
        }
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
