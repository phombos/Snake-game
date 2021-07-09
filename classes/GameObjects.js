class snake{
	constructor(x, y, len, vx, vy){
		this.head = {x : x, y : y};
		this.len = len;
		this.vx = vx;
		this.vy = vy;
		this.node = [];
		this.t = {x: 0, y: 0};
		for(let i = 1; i <= this.len; i++){
			this.node.push({x: this.head.x - i * tile, y: this.head.y});
		};
	};
	
	bound(){
		if(this.head.x > 775){
			this.head.x = 0;	
		};
		if(this.head.y > 575){
			this.head.y = 0;	
		};
		if(this.head.x < 0){
			this.head.x = 775;	
		};
		if(this.head.y < 0){
			this.head.y = 575;	
		};
	}
	
	move(tile){
		let last = this.node.length - 1;
		
		this.t.x = this.node[last].x;
		this.t.y = this.node[last].y;
		
		for(let i = last; i >= 1 ; i--){
			this.node[i].x = this.node[i - 1].x;
			this.node[i].y = this.node[i - 1].y;
		};
		
		this.node[0].x = this.head.x;
		this.node[0].y = this.head.y;
		this.head.x += this.vx * tile;
		this.head.y += this.vy * tile;
	};
	
	longer(){
		this.node.push({x: this.t.x, y: this.t.y});
	};
	
	dead(wall){
		
		for(let i = 0; i < this.node.length ; i++){
			
			if(this.node[i].x == this.head.x && this.node[i].y == this.head.y){
				return(true);
			};
		};
		
		for(let i = 0; i < wall.length ; i++){
			
			if(wall[i].x == this.head.x && wall[i].y == this.head.y){
				return(true);
			};
		};
		
		return(false);
	};
	
	draw(ctx, tile){
		ctx.fillStyle = "rgb(0, 100, 0)";
		ctx.fillRect(this.head.x, this.head.y, tile, tile);
		for(let i = 0; i < this.node.length; i++){
			ctx.fillRect(this.node[i].x, this.node[i].y, tile, tile);
		};
		ctx.fillStyle = "rgb(255, 0, 0)";
		//ctx.fillRect(this.t.x, this.t.y, tile, tile);
	};
};

class food{
	constructor(x, y){
		this.pos = {x: x, y: y};
		this.space = [];
	};
	
	setPos(){
		let i = Math.floor(Math.random() * this.space.length);
		this.pos.x = this.space[i].x;
		this.pos.y = this.space[i].y;
	};

	findSpace(snake, wall, tile){
		let gx = 800 / tile;
		let gy = 600 / tile;
		let x = 0;
		let y = 0;
		this.space = [];
		for(let i = 0; i < gx; i++){
			y = 0;
			for(let j = 0; j < gy; j++){
				let notOverlap = true;
				
				for(let s = 0; s < snake.length; s++){
					if(x == snake[s].x && y == snake[s].y){
						notOverlap = false;
						break;
					};
				};
				
				for(let s = 0; s < wall.length; s++){
					if(x == wall[s].x && y == wall[s].y){
						notOverlap = false;
						break;
					};
				};
				
				if(notOverlap){
					this.space.push({x: x, y: y});
				};
				y += tile;
			};
			x += tile;
		};
	};
	
	eaten(snake, wall, tile){
		this.findSpace(snake, wall, tile);
		this.setPos();
	};
	
	draw(ctx, tile){
		ctx.fillStyle = "rgb(200, 0, 0)";
		ctx.fillRect(this.pos.x, this.pos.y, tile, tile);
	};
};

class wall{
	constructor(){
		this.bricks = [];
	};
	
	draw(ctx, tile){
		for(let i = 0; i < this.bricks.length; i++){
			ctx.fillStyle = "rgb(100, 100, 100)";
			ctx.fillRect(this.bricks[i].x, this.bricks[i].y, tile, tile);
		};
	};
};
