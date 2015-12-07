/* placehodler, remove me */
DDViewportTab = React.createClass({
    render: function() {
        var div = $r("div", {}, this.props.id);
        return div;
    }
});

DDGameProfiler = React.createClass({
    getInitialState: function() {
        return {
            currentTime: 0,
            avgTime: 0
        }
    },

    componentWillMount: function () {
        this.handler = dojo.connect($server, "onTick", this, "onTick");
    },
    
    componentWillUnmount: function() {
        dojo.disconnect(this.handler);
    },

    onTick: function(){
        this.setState({
            currentTime: $server.timer.currentTime,
            averageTime: $server.timer.averageTime
        });
    },
    
    render: function(){
        return $r("div", {},[
            $r("span", {}, "Update time: " + this.state.currentTime + "ms, average: " + this.state.averageTime + "ms")
        ]);
    }
});

//============================================
//                  Network
//============================================

DDNetworkProfiler = React.createClass({
    getInitialState: function() {
        return {
            peerId: "n/a"
        }
    },

    componentWillMount: function () {
        var self = this;
        this.handler = dojo.subscribe("io/update", function(){
            self.setState({
                peerId: $server.io.peerId
            });
        });
    },

    componentWillUnmount: function() {
        dojo.unsubscribe(this.handler);
    },

    render: function(){
        return $r("div", {},[
            $r("span", {}, "Peer ID:" + this.state.peerId),
            $r("input", {
                type: "button",
                value: "Add...",
                onClick: function(){
                    var targetPeerId = prompt("Please enter the peer id");
                    if (targetPeerId){
                        $server.io.addPeer(targetPeerId);
                    }
                }
            })
        ]);
    }
});


DDConsole = React.createClass({
    render: function() {

        var div = $r("div", {className: "console-content",
            style:{
                width: "100%"
            }
        },[
            $r("div", {className: "messages"}),
            $r("input", {
                ref: "input",
                type: "text",
                style:{
                    width: "100%"
                },
                onKeyDown: this.onSubmit
            })
        ]);
        
        return div;
    },

    onSubmit: function(event) {
        if (event.keyCode == 13) {
            //parse console
            var input = React.findDOMNode(this.refs.input);
            input.value = "";
        }
    }
});

DDViewport = React.createClass({

    getDefaultProps: function() {
        return {
            tabs: [
                { 
                    id:"map", 
                    title: "Map",
                    class: DDViewportTab
                },
                {   id:"dashboard",     title: "Dashboard", class: DDViewportTabDashboard  },
                {   id:"resources",     title: "Resources", class: DDResourcesTab  },
                {   id:"economy",       title: "Economy", class: DDViewportTab  },
                {   id:"trade",         title: "Trade", class: DDViewportTab  }
            ]
        }
    },

    getInitialState: function() {
        return {
            selectedTab: "dashboard"
        }
    },

    render: function() {
        var selectedTab = $dd.get(this.props.tabs, this.state.selectedTab);
        
        var viewport =  $r("div", {
              className: "views"
        },[
            $r("div", {className: "view view-left navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"}, "Left View")
                    ])
                ]),
                $r("div", {className: "pages"},[
                    $r("div", {
                        className: "page",
                        "data-page": "index-left"
                    }, [
                        $r("div", {className: "page-content"}, [
                            //------------------- buttons -------------------------
                            $r("div", {className: "list-block"}, [
                                $r("ul", {}, this.createButtons())
                            ])
                        ])
                    ])
                ])
            ]),
            $r("div", {className: "view view-main navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"}, 
                            $server.world.countries[0].name
                        )
                    ])
                ]),
                $r("div", {className: "pages"},[
                    $r("div", {
                        className: "page toolbar-fixed",
                        "data-page": "index-left"
                    }, [
                        $r("div", {className: "toolbar"},
                            $r("div", {className: "toolbar-inner"},[
                                $r(DDConsole, {})
                            ])
                        ),
                        $r("div", {className: "page-content"}, [
                            //-------------------------------------------- MID goes there --------------------------
                            $r(selectedTab.class, {
                                id: this.state.selectedTab
                            })
                            //--------------------------------------------------------------------------------------

                        ])
                    ])
                ])
            ]),
            $r("div", {className: "view view-right navbar-through"},[
                $r("div", {className: "navbar"}, [
                    $r("div", {className: "navbar-inner"}, [
                        $r("div", {className: "center sliding"}, [
                            //--------------------- RIGHT PANEL HEADER (calendar, menu) ------------------
                            $r(DDCalendar, {
                            }),

                            $r(UIProgressCircle, {
                                size: 20
                            })
                        ])
                    ])
                ]),
                $r("div", {className: "pages"},[
                    $r("div", {
                        className: "page",
                        "data-page": "index-left"
                    }, [
                        $r("div", {className: "page-content"}, [
                            //-------------------------------------------- RIGHT goes there --------------------------
                            $r(DDGameProfiler, {}),
                            $r(DDNetworkProfiler, {})
                        ])
                    ])
                ])
            ]),
        ]);
        return viewport;
    },

    createButtons: function(){
        var viewportButtons = [];
        for (var i in this.props.tabs){
            var tab = this.props.tabs[i];

            var btn = $r(DDViewportTabButton, {
                id:    tab.id,
                title: tab.title,
                selected: 
                    (this.state.selectedTab == tab.id),
                onclick: this.setTab
            });
            viewportButtons.push(btn);
        }
        return viewportButtons;
    },
    
    setTab: function(id){
        this.setState({selectedTab: id});
    }
});

DDViewportTabButton = React.createClass({

    render: function() {
        var selectedClass = this.props.selected ? " selected" : "";
        var btn = $r("li", {}, [
            $r("a", {
                    className: "item-link list-button viewport-button" + selectedClass,
                    onClick: this.onclick,
                    href: "#"
                },
                this.props.title)
        ]);
        return btn;
    },

    onclick: function(){
        this.props.onclick(this.props.id);
    }
});

DDCalendar =  React.createClass({
    render: function() {
        var div = $r("div", {}, [
           "30 NOV 2015"
        ]);
        return div;
    }
});