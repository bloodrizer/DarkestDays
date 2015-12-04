dojo.declare("classes.ui.ProgressCircle",null,{
    opts: null,
    canvas: null,
    
    constructor: function(canvas, opts){
        this.opts = {
            size: opts.size,
            color: opts.color || "#555555",
            bgColor: opts.bgColor || "#efefef",
            lineWidth: opts.width || 15,
            rotate: 0
        };
        
        this.canvas = canvas;
    },
    
    render: function(percent){
        var canvas = this.canvas;

        if (typeof(G_vmlCanvasManager) !== 'undefined') {
            G_vmlCanvasManager.initElement(canvas);
        }
        var ctx = canvas.getContext('2d');
        ctx.save();

        ctx.translate(this.opts.size / 2, this.opts.size / 2);
        ctx.rotate((-1 / 2 + this.opts.size.rotate / 180) * Math.PI);
        
        this._renderCircle(ctx, this.opts.bgColor, 100);
        this._renderCircle(ctx, this.opts.color, percent);

        ctx.restore();
    },
    
    _renderCircle: function(ctx, color, percent){
        var radius = (this.opts.size - this.opts.lineWidth) / 2;

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent / 100, false);
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.opts.lineWidth;
        ctx.stroke();
    }
    
});


UIProgressCircle = React.createClass({

    progressBar: null,
    handler: null,
    
    getDefaultProps: function() {
        return {
            size: 20,
            color: "#555555",
            width: 2
        }
    },

    render: function() {
        return (
            React.createElement("div", { className: "progress-circle"},[
                    React.createElement("canvas", { 
                        width: this.props.size,
                        height: this.props.size
                    })
            ])
        );
    },

    onTick: function(){
        var progress = $server.tick / $server.ticksPerTurn * 100;
        this.progressBar.render(progress);
    },

    componentWillMount: function () {
        this.handler = dojo.connect($server, "onTick", this, "onTick");
    },

    componentDidMount: function() {
        var container = React.findDOMNode(this);
        var self = this;
        

        var canvas = $(container).children('canvas')[0];
        var progress = new classes.ui.ProgressCircle(canvas, {
            size: this.props.size,
            color: this.props.color,
            width: this.props.width
        });
        progress.render(0);
        
        this.progressBar = progress;
    },

    componentWillUnmount: function() {
        dojo.disconnect(this.handler);
    }
});