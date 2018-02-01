import React from 'react';
import BasicComponent from "./BasicComponent";
import AgentComponent from "./AgentComponent";

class MainComponent extends React.Component {
    
    constructor(props){
        super(props);
        this.ctx = null;
        this.frameNo = 0;
        this.interval = null;
        this.obstacles = [];
    }
    
    componentDidMount() {
        this.ctx = this.refs.canvas.getContext('2d');
        this.initCanvas();
        var ctx= this.ctx;
        this.agent= new AgentComponent({ctx, x: 0, y:0, width:0, height:0, obstacles:[]});
        this.clear();
        this.update();
    }
    
    initCanvas() {
        var ctx = this.ctx;
        var width = 480;
        var height = 270;
        ctx.clearRect(0,0, width, height);
        // draw children “components”
        // first green green
        for(var i=0; i<width;i=i+30){
            for(var j=0; j<height;j=j+30){
                this.obstacles.push(new BasicComponent({ctx, x: i, y: 0, color:'green', width: 30, height: 30}));
                this.obstacles.push(new BasicComponent({ctx, x: 0, y: j, color:'green', width: 30, height: 30}));
                if(i>=width-30 || j>=height-30)
                    this.obstacles.push(new BasicComponent({ctx, x: i, y: j, color:'green', width: 30, height: 30}));

            }
        }
        //interior green rect
        for(var i=60; i<=width-90;i=i+30){
            for(var j=60; j<=height-90;j=j+30){
                if(i!==60||j!==60){
                    this.obstacles.push(new BasicComponent({ctx, x: i, y: j, color:'green', width: 30, height: 30}));
                }
            }
        }
    }
    
    update(){
        this.clear();
        this.frameNo += 1;
        for (var i = 0; i < this.obstacles.length; i += 1) {
            this.obstacles[i].update();
        }
        if(this.everyinterval(1)){
            var action= this.agent.choosBestAction();
            console.log(action);
            var result= eval("this.agent."+action+"()");
            this.agent.updateMemory(action, result);
	} 
        this.agent.update();
    }
    
    start(){
        var ctx = this.ctx;
        var obstacles = this.obstacles;
        this.agent= new AgentComponent({ctx, x: 31, y:209, width:25, height:25, obstacles});
        
        this.frameNo = 0;
	clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), 20);
    }
    
    stop(){
        clearInterval(this.interval);
    }
    
    clear() {
        this.ctx.clearRect(0, 0, 480, 270);
    }
    
    everyinterval(n) {
        if ((this.frameNo / n) % 2 === 0) {return true;}
        return false;
    }
    
    render(){
        return (
            <div>
                <canvas ref="canvas" width={480} height={270}/>
                <br/>
                <button onClick={this.start.bind(this)}>Start</button>
                <button onClick={this.stop.bind(this)}>Stop</button>
            </div>
        );
    }
};

export default MainComponent;