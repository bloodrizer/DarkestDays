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


DDRegionView = React.createClass({
    render: function() {
        var div = $r("div", {className: "accordion-item"}, [
            $r("div", {className: "accordion-item-toggle"}, "REGION NAME"),
            $r("div", {className: "accordion-item-content"}, [
                //-------------- content goes there ---------------------
                "CONTENT GOES THERE"
            ])
        ]);
        return div;
    }
    /**
     *  <div class="accordion-item">
        <div class="accordion-item-toggle">...</div>
        <div class="accordion-item-content">...</div>
        </div>
     */
});
