DDResourcesTab = React.createClass({

    getDefaultProps: function() {
        return {
           
        }
    },

    render: function() {

        var country = $server.world.countries[0];
        var children = [];

        for (var i in country.resources.meta){
            var res = country.resources.get(i);

            children.push($r("div", {
                className: "table-row"
            }, [
                $r("div", {}, res.$().title),
                $r("div", {}, res.get())
            ]));
        }

        var div = $r("div", {className: "table-block"}, children);
        return div;
    }
});