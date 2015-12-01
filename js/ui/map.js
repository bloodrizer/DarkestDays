
DDWorldMap = React.createClass({
   

    getInitialState: function() {
      return {
          vectorMap: null,
          selectedRegion: null
      }  
    },
    
    render: function() {
        return (
            React.createElement("div",
            {
                id: "worldMap"
            })
        );
    },

    componentDidMount: function() {
        var container = React.findDOMNode(this);
        var self = this;
        //console.log(container, $(container).find("#worldMap"));

        var map = new jvm.Map({
            map: 'world_mill',
            onRegionClick: function(e, region){
                map.clearSelectedRegions();
                map.setSelectedRegions([region]);
                
                self.state.selectedRegion = region;
            },
            container: $(container)
        });
        this.state.vectorMap = map;
    },

    componentWillUnmount: function() {
        var container = React.findDOMNode(this);
        container.unbind();
        this.state.vectorMap = null;
    }
});