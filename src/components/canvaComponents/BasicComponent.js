class BasicComponent{
    constructor(props){
        const {ctx, x, y, color, width, height} = props;
        this.ctx= ctx;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color= color;
    }
        
    update(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default BasicComponent;

