let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const DeltaTime = 1 / 60;
canvas.width = 800;
canvas.height = 650;
let ctx = canvas.getContext('2d');
let tile = 25;
let wait = 6;
let frame = 0;
let wait_press = wait / 2;
let Dead = false;
let score = 0;
let game_started = false;
let wait_start = 0;
let reason;
let won = false;
let current_level = 1;
let map1 = function(){
	let result = new Array();
	for(let i = 0; i < 800 / tile; i++){
		result.push({x: i * tile, y: 0});
		result.push({x: i * tile, y: 575});
	};
	
	for(let i = 0; i < 600 / tile; i++){
		result.push({x: 0, y: i * tile});
		result.push({x: 775, y: i * tile});
	};
	return(result);
};
let map2 = new Array(
	{x: 300, y: 200}, {x: 325, y: 200}, {x: 350, y: 200}, {x: 300, y: 225}, {x: 300, y: 250}, {x: 450, y: 200}, {x: 475, y: 200}, 
	{x: 500, y: 200}, {x: 500, y: 225}, {x: 500, y: 250}, {x: 300, y: 400}, {x: 325, y: 400}, {x: 350, y: 400}, {x: 300, y: 375}, 
	{x: 300, y: 350}, {x: 500, y: 400}, {x: 475, y: 400}, {x: 450, y: 400}, {x: 500, y: 375}, {x: 500, y: 350}
	
)

let map3 = map1();
for(let i = 0; i < map2.length; i++){
	map3.push(map2[i]);
};

let level = new Array();
level.push(new Array({x: 3000, y: 200}));
level.push(map1());
level.push(map2);
level.push(map3);


class food{
	constructor(x, y){
		this.pos = {x: x, y: y};
		this.space = new Array();
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
		this.space = new Array()
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

class snake{
	constructor(x, y, len, vx, vy){
		this.head = {x : x, y : y};
		this.len = len;
		this.vx = vx;
		this.vy = vy;
		this.node = new Array();
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
				reason = "body";
				return(true);
			};
		};
		
		for(let i = 0; i < wall.length ; i++){
			
			if(wall[i].x == this.head.x && wall[i].y == this.head.y){
				reason = "wall";
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
}

class wall{
	constructor(){
		this.bricks = new Array();
	};
	
	draw(ctx, tile){
		for(let i = 0; i < this.bricks.length; i++){
			ctx.fillStyle = "rgb(100, 100, 100)";
			ctx.fillRect(this.bricks[i].x, this.bricks[i].y, tile, tile);
		};
	};
};

let w = new wall();
w.bricks = level[current_level - 1];
let s;
let f;
let Move;
let key;
function reset(){
	score = 0;
	w.bricks = level[current_level - 1];
	s = new snake(200, 300, 1, 0, 0);
	f = new food(600, 300);
	keys = new Array({x: 0, y: 0});
	Move = false;
};
p = new progress_bar(100, 612, 40, 0, 600, 25);
reset();

window.requestAnimationFrame(function loop(){
	if(game_started){
		if(Dead == false){
			if(score > 39){
				game_started = false;
				if(current_level == 4){
					won = true;
				} else{
					current_level += 1;
					reset();
					wait_start = 0;
				};
			};
			
			p.amount = score;
			
			if(s.head.x == f.pos.x && s.head.y == f.pos.y){
				f.eaten(s.node, w.bricks, tile);
				s.longer();
				score += 1;
			};
			
			if(s.dead(w.bricks)){
				Dead = true;
				current_level = 1;
				reset();
			};
			
			if(frame == wait){
				if(Move){
					if(keys.length > 1){
						s.vx = keys[1].x;
						s.vy = keys[1].y;
						keys.shift();
					};
					s.move(tile);
					s.bound();
				}
				frame = 0;
			};
			
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "rgb(0, 0, 0)"
			ctx.fillRect(0, 0, canvas.width, 600);
			ctx.fillStyle = "rgb(75, 75, 75)"
			ctx.fillRect(0, 600, canvas.width, 50);
			
			f.draw(ctx, tile);
			s.draw(ctx, tile);
			w.draw(ctx, tile);
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.font = "20px Arial";
			ctx.fillText("level: " + current_level, 20, 630);
			p.draw();
			
			frame += 1;
			wait_press += 1;
		} else{
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			ctx.fillStyle = "rgb(0, 0, 0)" ;
			ctx.font = "40px Arial";
			ctx.fillText("ENTER TO RETRY" , 250, 300);
			ctx.fillText("SCORE: " + Math.round(p.percent * 100) + "%", 300, 360);
		};
	} else{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "rgb(0, 0, 0)"
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		if(won){
			ctx.fillStyle = "rgb(255, 255, 255)" ;
			ctx.font = "40px Arial";
			ctx.fillText("YOU WON" , 300, 350);
		} else{
			ctx.fillStyle = "rgb(255, 255, 255)" ;
			ctx.font = "20px Arial";
			ctx.fillText("Please wait...", 350, 325);
			wait_start += 1;
			if(wait_start > 120){
				game_started = true;
			};
		};
	};
	window.requestAnimationFrame(loop);
});

window.addEventListener("keydown", checkKeyPress, false);
function checkKeyPress(key){
	if(key.keyCode == "37"){
		if(s.vx != 1 && keys[keys.length - 1].x != -1){
			keys.push({x: -1, y: 0});
		};
	};
	
	if(key.keyCode == "38"){
		if(s.vy != 1 && keys[keys.length - 1].y != -1){
			keys.push({x: 0, y: -1});
		};
	};
	
	if(key.keyCode == "39"){
		if(s.vx != -1 && keys[keys.length - 1].x != 1){	
			keys.push({x: 1, y: 0});
		};
	};
	
	if(key.keyCode == "40"){
		if(s.vy != -1 && keys[keys.length - 1].y != 1){
			keys.push({x: 0, y: 1});
		};
	};
	if(key.keyCode == "13"){
			Dead = false;
	} else{
		if (game_started){
			Move = true;
		};
	};
};


