DDViewportTabDashboard = React.createClass({

    getDefaultProps: function() {
        return {
            /*regions: [
                {
                    id:"testRegion",
                    title: "TestRegion",
                    class: DDViewportTabDashboard
                },
                {   id:"dashboard", title: "Dashboard", class: DDViewportTab  },
                {   id:"resources", title: "Resources", class: DDViewportTab  }
            ]*/
        }
    },
    
    render: function() {
        
        var regions = $server.world.countries[0].regions;
        var regionViews = [];
        
        for (var i in regions){
            var r = regions[i];

            regionViews.push($r(DDRegionView, {
                title: r.name
            }))
        }
        
        var div = $r("div", {className: "list-block"}, regionViews);
        return div;
    }
});

//TODO: move to comon widgets

DDCollapsible = React.createClass({
    getDefaultProps: function() {
        return {
            title: null
        }
    },

    render: function() {
        var div = $r("div", {className: "collapsible"}, [
            $r("div", {className: "collapsible-title"}, this.props.title),
            $r("div", {className: "collapsible-body"}, this.props.children)
        ]);
        return div;
    }
});

DDBuilding = React.createClass({
    getDefaultProps: function() {
        return {
            id: "indefined",
            title: "Undefined",
            val: 0
        }
    },
    render: function() {
        var div = $r("div", {className: "building table-row"}, [
            $r("div", {}, this.props.title),
            $r("div", {}, this.props.val)
        ]);
        return div
    }
});

DDRegionView = React.createClass({
    getDefaultProps: function() {
        return {
            title: null
        }
    },
    
    render: function() {
        var bldMeta = $server.world.countries[0].regions[0].buildings;

        var buildings = [];
        //TODO: use $meta.foreach(callback)
        
        for (var i in bldMeta.meta){
            var bld = bldMeta.get(i);
            console.log(bld);
            
            buildings.push($r(DDBuilding, {
                id: i,
                title: bld.meta.title,
                val: bld.meta.val
            }));
        }
        
        var div = $r(DDCollapsible, {title: this.props.title},[
            $r(DDCollapsible, {title: "Overview"},[
                "Climate: D+, Ecology: E, Economy: F- (None)"
            ]),
            $r(DDCollapsible, {title: "Buildings"}, 
                $r("div", {className: "table-block"}, 
                    buildings))
        ]);
        return div;
    }
});
