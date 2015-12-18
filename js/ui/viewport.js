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
                peerId: $server.svc("io").peerId,
                peerList: $server.svc("io").peerList
            });
        });
    },

    componentWillUnmount: function() {
        dojo.unsubscribe(this.handler);
    },

    render: function(){
        return $r("div", {},[
            $r("span", {}, "Peer ID: " + this.state.peerId),
            $r("input", {
                type: "button",
                value: "Add...",
                onClick: function(){
                    var targetPeerId = prompt("Please enter the peer id");
                    if (targetPeerId){
                        $server.svc("io").addPeer(targetPeerId);
                    }
                }
            }),
            
            this.renderPeers()
        ]);
    },

    renderPeers: function(){
        var children = [];
        for (var i in this.state.peerList){
            var peer = this.state.peerList[i];
            children.push($r("div", {
                
            },
                peer.id
            ));
        }
        
        return children;
    }
});

DDConsole = React.createClass({
    
    messages: [],

    getInitialState: function() {
        return {
            messages: []
        }
    },

    componentWillMount: function () {
        var self = this;
        this.handler = dojo.subscribe("server/msg", function(msg){
            self.addMessage(msg);
        });
    },

    componentDidUpdate : function(){
        // Automatically scroll to bottom
        var con = React.findDOMNode(this.refs.console);
        con.scrollTop = con.scrollHeight;
    },
    
    addMessage: function(msg){
        this.messages.push(msg);

        this.setState({
            messages: this.messages
        });
    },
    
    
    render: function() {

        var div = $r("div", {className: "console-content",
            style:{
                width: "100%"
            }
        },[
            $r("div", {
                    className: "messages",
                    ref: "console"
                },
                this.renderMessages()
            ),
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
    
    renderMessages: function(){
        //TODO: use $r.map(array, transform method)
        
        var children = [];  
        
        console.log("Messages:", this.state.messages, "len:", this.state.messages.length);
        
        for (var i in this.state.messages){
            var msg = this.state.messages[i];
            children.push($r("div", {}, ":" + msg.msg));
        }
        
        return children;
    },

    onSubmit: function(event) {
        if (event.keyCode == 13) {
            //parse console
            var input = React.findDOMNode(this.refs.input);
            this.addMessage({
                msg: ">" + input.value
            });
            input.value = "";
        }
    }
});

DDViewport = React.createClass({

    getDefaultProps: function() {
        return {
            tabs: [
                {   id:"overview",     title: "Overview", class: DDOverviewTab  },
                { 
                    id:"map", 
                    title: "Map",
                    class: DDViewportTab
                },
                {   id:"dashboard",     title: "Regions", class: DDViewportTabDashboard  },
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
                        $r("div", {className: "toolbar console"},
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