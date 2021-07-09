function fill(v){
	ctx.beginPath();
    	ctx.moveTo(v[0].x, v[0].y);
    	for(let i = 1; i < v.length; i++){
    		ctx.lineTo(v[i].x, v[i].y);
    	};
    	ctx.fill();
};

function line(x0, y0, x1, y1, s){
    	ctx.lineWidth = s;
    	ctx.beginPath();
    	ctx.moveTo(x0, y0);
    	ctx.lineTo(x1, y1);
    	ctx.stroke();
    	ctx.closePath();
};

class button{
	constructor(x, y, w, h, tag, name, color){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.tag = tag;
		this.name = name;
		this.color = color;
		this.Max = {x: this.x + w, y: this.y + h};
		this.Min = {x: this.x - w, y: this.y - h};
		this.corners = [
			{x: this.x + w, y: this.y + h},
			{x: this.x + w, y: this.y - h},
			{x: this.x - w, y: this.y - h},
			{x: this.x - w, y: this.y + h}
			
		];
	};
	
	checkCollisions(mouse){
		let m = {x: mouse.x, y: mouse.y};
		let d = {x: Math.abs(m.x - this.x), y: Math.abs(m.y - this.y)};
		let xOverlap = d.x - this.w;
		let yOverlap = d.y - this.h;
		if(xOverlap < 0 && yOverlap < 0){
			return(true);
		} else{
			return(false);
		}
	};
	
	draw(){
		ctx.fillStyle = this.color;
		fill(this.corners);
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "30px Arial";
		ctx.fillText(this.name, this.Min.x + 30, this.y + 15);
	};
};



class progress_bar{
	constructor(x, y, full, amount, w, h){
		this.x = x;
		this.y = y
		this.full = full;
		this.amount = amount;
		this.percent = this.amount / this.full;
		this.w = w;
		this.h = h;
	};
	
	draw(){
		this.percent = this.amount / this.full;
		ctx.fillStyle = "rgb(40, 40, 40)";
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = "rgb(0, 0, 255)";
		ctx.fillRect(this.x + 2, this.y + 2, (this.w - 4) * this.percent, this.h - 4);
	};
};


