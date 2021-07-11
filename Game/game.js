function makeButton(text, tag){
	let btn = document.createElement("button");
	btn.innerText = text;
	document.body.appendChild(btn);
	return({button: btn, tags: tag});
};

let btn = makeButton("Start", 1);

const DeltaTime = 1 / 60;
let tile = 25;
let wait = 6;
let frame = 0;
let wait_press = wait / 2;
let Dead = false;
let score = 0;
let game_started = false;
let wait_start = 0;
let won = false;
let current_level = 1;
let levelSelect = false;
let map1 = function(){
	let result = [];
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
let map2 = [
	{x: 300, y: 200}, {x: 325, y: 200}, {x: 350, y: 200}, {x: 300, y: 225}, {x: 300, y: 250}, {x: 450, y: 200}, {x: 475, y: 200},
	{x: 500, y: 200}, {x: 500, y: 225}, {x: 500, y: 250}, {x: 300, y: 400}, {x: 325, y: 400}, {x: 350, y: 400}, {x: 300, y: 375},
	{x: 300, y: 350}, {x: 500, y: 400}, {x: 475, y: 400}, {x: 450, y: 400}, {x: 500, y: 375}, {x: 500, y: 350}

];

let map3 = map1();
for(let i = 0; i < map2.length; i++){
	map3.push(map2[i]);
};

let lb = [];

btn.button.addEventListener ("click", function() {
  levelSelect = true;
	for(let i = 0; i < 4; i++){
		lb.push(makeButton("level " + (i + 1), (i + 1)));
	};
	for(let i = 0; i < 4; i++){
		lb[i].button.addEventListener ("click", function() {
			current_level = lb[i].tags;
			game_started = true;
			levelSelect = false;
			reset();
		});
	};
	btn.button.remove();
});




let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 650;
let ctx = canvas.getContext('2d');

function runGame(){
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
		trans = 0;
		//reset();
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
};

function waiting(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(0, 0, 0)"
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if(won){
		ctx.fillStyle = "rgb(255, 255, 255)" ;
		ctx.font = "40px Arial";
		ctx.fillText("YOU WON" , 300, 350);
	}
};



function deadScreen(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, 600);

	s.draw(ctx, tile);

	ctx.fillStyle = "rgb(0, 0, 0, " + trans + ")";
	ctx.fillRect(0, 0, canvas.width, 600);

	ctx.fillStyle = "rgb(255, 255, 255, " + trans + ")" ;
	ctx.font = "40px Arial";
	ctx.fillText("ENTER TO RETRY" , 250, 300);
	ctx.fillText("SCORE: " + Math.round(p.percent * 100) + "%", 300, 360);

	trans += 0.01;
};


let level = [];
level.push([{x: 3000, y: 200}]);
level.push(map1());
level.push(map2);
level.push(map3);

let w = new wall();
w.bricks = level[current_level - 1];
let s;
let f;
let Move;
let key;
let trans = 0;

function reset(){
	score = 0;
	w.bricks = level[current_level - 1];
	s = new snake(200, 300, 1, 0, 0);
	f = new food(600, 300);
	keys = [{x: 0, y: 0}];
	Move = false;
};

p = new progress_bar(100, 612, 40, 0, 600, 25);

window.requestAnimationFrame(function loop(){
	if(game_started){
		if(Dead == false){
			runGame();
		} else{
			deadScreen();
		};
	} else{
		waiting();
	};
	window.requestAnimationFrame(loop);
});

window.addEventListener("keydown", checkKeyPress, false);
function checkKeyPress(key){
	if(game_started){
		if(key.keyCode == "37"){
			if(s.vx != 1 && keys[keys.length - 1].x != -1){
				keys.push({x: -1, y: 0});
				Move = true;
			};
		};

		if(key.keyCode == "38"){
			if(s.vy != 1 && keys[keys.length - 1].y != -1){
				keys.push({x: 0, y: -1});
				Move = true;
			};
		};

		if(key.keyCode == "39"){
			if(s.vx != -1 && keys[keys.length - 1].x != 1){
				keys.push({x: 1, y: 0});
				Move = true;
			};
		};

		if(key.keyCode == "40"){
			if(s.vy != -1 && keys[keys.length - 1].y != 1){
				keys.push({x: 0, y: 1});
				Move = true;
			};
		};
	};
	if(key.keyCode == "13"){
			reset();
			Dead = false;
	};
};
