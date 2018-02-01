class AgentComponent
{
    constructor(props){
        const {ctx, x, y, width, height, obstacles} = props;
        this.obstacles = obstacles;
        this.ctx= ctx;
        this.width = width;
        this.height = height;
        this.speedX = 5;
        this.speedY = 5;
	this.orientation= "N";
        this.x = x;
        this.y = y;
        this.listAction = ["forward","turnLeft","turnRight", "touchLeft", "touchRight", "touchForward"];
	this.nbrNodes= 0;
	this.memory= [];
        this.score = 0;
    }
    
    update(){
        this.ctx.save();
        //this.ctx.translate(this.x+this.width/2, this.y+this.height/2);        
        //this.ctx.rotate(0.5 * Math.PI);
        var imageObj = new Image();
        imageObj.src = "navigation-"+this.orientation+".jpg";
        var self = this;
        imageObj.onload = function(){
            self.ctx.drawImage( imageObj,
                                self.x,
                                self.y,
                                self.width, self.height);
        };
        this.ctx.restore();
    }
    
    forward() {
        var oldX= this.x;
        var oldY= this.y;
        switch(this.orientation){
            case "N":
                    this.y -= this.speedY;
                    break;
            case "S":
                    this.y += this.speedY;
                    break;
            case "E":
                    this.x += this.speedX;
                    break;
            default:
                    this.x -= this.speedX;
                    break;
        }
        if(this.collision()){
            this.x = oldX;
            this.y = oldY;
            return  parseInt(document.getElementById("collisionValue").value);
        }
        return  parseInt(document.getElementById("forwardValue").value);
    }
    
    turnLeft(){
        switch(this.orientation){
            case "N":
                this.orientation = "O";
                break;
            case "S":
                this.orientation = "E";
                break;
            case "E":
                this.orientation = "N";
                break;
            default:
                this.orientation = "S";
                break;
        }
        return parseInt(document.getElementById("turnLeftValue").value);
    }
    
    turnRight(){
        switch(this.orientation){
            case "N":
                this.orientation = "E";
                break;
            case "S":
                this.orientation = "O";
                break;
            case "E":
                this.orientation = "S";
                break;
            default:
                this.orientation = "N";
                break;
        }
        return parseInt(document.getElementById("turnRightValue").value);
    }
    
    touchForward(){
        var oldX= this.x;
        var oldY= this.y;
        switch(this.orientation){
            case "N":
                this.y -= this.speedY;
                break;
            case "S":
                this.y += this.speedY;
                break;
            case "E":
                this.x += this.speedX;
                break;
            default:
                this.x -= this.speedX;
                break;
        }
        var result= parseInt(document.getElementById("touchForwardEmptyValue").value);
        if(this.collision()){
                result= parseInt(document.getElementById("touchForwardValue").value);
        }
        this.x = oldX;
        this.y = oldY;
        return result;
    }
    
    touchLeft = function(){
        var oldX= this.x;
        var oldY= this.y;
        switch(this.orientation){
                case "N":
                        this.x -= this.speedX;
                        break;
                case "S":
                        this.x += this.speedX;
                        break;
                case "E":
                        this.y -= this.speedY;
                        break;
                default:
                        this.y += this.speedY;
                        break;
        }
        var result= parseInt(document.getElementById("touchLeftEmptyValue").value);
        if(this.collision()){
                result= parseInt(document.getElementById("touchLeftValue").value);
        }
        this.x = oldX;
        this.y = oldY;
        return result;
    }

    touchRight = function(){
        var oldX= this.x;
        var oldY= this.y;
        switch(this.orientation){
            case "N":
                this.x += this.speedX;
                break;
            case "S":
                this.x -= this.speedX;
                break;
            case "E":
                this.y += this.speedY;
                break;
            default:
                this.y -= this.speedY;
                break;
        }
        var result= parseInt(document.getElementById("touchRightEmptyValue").value);
        if(this.collision()){
                result= parseInt(document.getElementById("touchRightValue").value);
        }
        this.x = oldX;
        this.y = oldY;
        return result;
    }
	
    collision() {
        for (var i = 0; i < this.obstacles.length; i += 1) {
            if (this.crashWith(this.obstacles[i])) {
                return true;
            } 
        }
        return false;
    }
    
    crashWith(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
	
    updateMemory(action, result){
        if(this.memory.length<50000){
            this.memory.push({ 
                                "action":action,
                                "result":result
                            });
        }else{
                //startGame();
        }
        this.score+=result;
        document.getElementById("info").innerHTML ="Score : "+this.score+", Taille memoire : "+this.memory.length;
    }
    
    choosBestAction(){
        if(this.memory.length<this.listAction.length){
            return this.listAction[this.memory.length];
        }else{
            var lastAction= this.memory[this.memory.length-1].action;
            var sequences= [];
            for(var i=Math.floor(Math.random() *this.memory.length); i<this.memory.length; i++){
            //for(var i=0; i<this.memory.length; i++){
                if(this.memory[i].action===lastAction){
                    var tempSequence= this.memory[i].action;
                    for(var j=i; j<this.memory.length && j<Math.floor(Math.random() * (i+20 - i)) + i; j++){
                    //for(var j=i; j<this.memory.length; j++){
                        if(i===j){
                            sequences[tempSequence]= this.memory[i].result;
                        }else{
                            var tempResult= sequences[tempSequence];
                            tempSequence+="."+this.memory[j].action;
                            sequences[tempSequence]=  this.memory[j].result + tempResult;
                        }
                    }
                }
            }
            var bestPerformance=null;
            var selectedSequence="";
            for(var n in sequences){
                if(n.substr(0, n.indexOf("."))===lastAction){
                    if(sequences[n]>bestPerformance){
                            bestPerformance= sequences[n];
                            selectedSequence=n;
                    }
                }
            }
            if(selectedSequence){
                //console.log(selectedSequence+ " : "+ sequences[selectedSequence]);
                //On retire l'action precendente de la sequence
                if(selectedSequence.indexOf(".")!==-1){
                        selectedSequence= selectedSequence.substr(selectedSequence.indexOf(".")+1, selectedSequence.length);
                }
                //retour de l'action
                if(selectedSequence.indexOf(".")!==-1){
                        return selectedSequence.substr(0, selectedSequence.indexOf("."));
                }else{
                        return selectedSequence;
                }
            }
            do{
                var bestAction= this.listAction[Math.floor(Math.random()*this.listAction.length)];
            }while(sequences[lastAction+"."+bestAction]!==undefined && sequences[bestAction]!==undefined)
            return bestAction;	
        }
    }
}

export default AgentComponent;