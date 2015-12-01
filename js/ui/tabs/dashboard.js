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
        var div = $r("div", {className: "list-block"}, [
            $r(DDRegionView, {}, [])
        ]);
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
    }
});


DDRegionView = React.createClass({
    render: function() {
        var div = $r(DDCollapsible, {title: "REGION NAME (Chelyabynsk)"},[
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
