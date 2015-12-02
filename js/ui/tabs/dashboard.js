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
        var div = $r("div", {className: "accordion-item"}, [
            $r("div", {className: "accordion-item-toggle"}, this.props.title),
            $r("div", {className: "accordion-item-content"}, this.props.children)
        ]);
        return div;

        /*var div = $r("div", {className: "accordion-item"},[
            $r("a", {className: "item-content item-link", href:"#"},[
                $r("div", {className: "item-inner"},
                    $r("div", {className: "item-title"}, this.props.title)
                )
            ]),
            $r("div", {className: "accordion-item-content"}, this.props.children)
        ]);
        return div;*/
    }
});


DDRegionView = React.createClass({
    getDefaultProps: function() {
        return {
            title: null
        }
    },
    
    render: function() {
        var div = $r(DDCollapsible, {title: this.props.title},[
            $r(DDCollapsible, {title: "Overview"},[
                "Climate: D+, Ecology: E, Economy: F- (None)"
            ]),
            $r(DDCollapsible, {title: "Buildings"},[
                "Nuclear Reactor: 1"
            ])
        ]);
        return div;
    }
});
