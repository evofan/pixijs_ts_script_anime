import { Sprite, DisplayObject } from "pixi.js";

let message: string = "TypeScript Ver.";
console.log(message);

// import { Stats } from "stats.js";

// stats
let stats: any = new Stats();
console.log(stats);
stats.showPanel(0); // 0: fps, 1: ms; 2: mb, 3: custom
document.body.appendChild(stats.dom);

const WIDTH: number = 480;
const HEIGHT: number = 320;
const APP_FPS: number = 30;

// init
let app = new PIXI.Application({
	width: WIDTH,
	height: HEIGHT
});

let canvas: any = document.getElementById("canvas");
canvas.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;
app.stage.interactive = true;
app.ticker.remove(app.render, app);
const fpsDelta: number = 60 / APP_FPS;

let bg: DisplayObject;
let elapsedTime: number = 0;

let container_bg = new PIXI.Container();
container_bg.x = 0;
container_bg.y = 0;
app.stage.addChild(container_bg);

let container = new PIXI.Container();
container.width = 480;
container.height = 480;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = true;
app.stage.addChild(container);

// asset property
const ASSET_BG: string = "images/sky_bg.jpg";
const ASSET_SNOW: string = "images/snow_07.png";

// snow property
const ROTATE_LEFT: number = 1;
const ROTATE_RIGHT: number = 2;
const MAX_NUM: number = 10;
const MIN_SCALE: number = 0.5;
const MAX_SCALE: number = 1.5;
const MAX_ACCEL: number = 7;
const MIN_ALPHA: number = 0.3;
const MAX_ALPHA: number = 1;
const MAX_RADIUS: number = 5;
const MIN_RADIUS: number = 1;
let snows: Array<Sprite> = [];
let radiusNums: Array<number> = [];
let angleNums: Array<number> = [];
let accelNums: Array<number> = [];

PIXI.loader
	.add("bg_data", ASSET_BG)
	.add("snow_data", ASSET_SNOW)
	.load(onAssetsLoaded);

/**
 * Asset load Complete
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader: object, res: any) {
	// BG
	bg = new PIXI.Sprite(res.bg_data.texture);
	container_bg.addChild(bg);
	bg.x = 0;
	bg.y = 0;
	bg.interactive = true;
	bg.on("tap", (event: object) => {
		console.log("onTap"); // Desktop(Touch)
	});
	bg.on("click", (event: object) => {
		console.log("click"); // Desktop
	});

	// Text
	let text = new PIXI.Text("Fall Snow\n(in Making..)", {
		fontFamily: "Arial",
		fontSize: 30,
		fill: 0xf0fff0,
		align: "center",
		fontWeight: "bold",
		stroke: "#000000",
		strokeThickness: 4,
		dropShadow: false,
		dropShadowColor: "#666666"
	});
	container.addChild(text);
	text.x = 150;
	text.y = 20;

	// Snow
	for (let i: number = 0; i < MAX_NUM; i++) {
		let snow: Sprite = PIXI.Sprite.from(res.snow_data.texture);

		// x position
		let xNum: number = Math.floor(Math.random() * WIDTH + 1);
		snow.x = xNum;

		// y position
		let yNum: number = -Math.floor(Math.random() * 100 + 1);
		snow.y = yNum;

		// xy scale
		let scaleNum: number =
			Math.floor((Math.random() * (MAX_SCALE - MIN_SCALE) + MIN_SCALE) * 10) /
			10;
		snow.scale.set(scaleNum, scaleNum);

		// direction of rotation
		let rotateDirecNum: number = Math.floor(Math.random() * 2 + 1);
		rotateDirecNum === 1
			? (rotateDirecNum = ROTATE_LEFT)
			: (rotateDirecNum = ROTATE_RIGHT);
		console.log(rotateDirecNum);

		// acceleration
		let accelNum: number = Math.floor(Math.random() * MAX_ACCEL + 1);
		accelNums.push(accelNum);

		// transparency
		let alphaNum: number =
			Math.floor((Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA) * 10) /
			10;
		console.log(alphaNum);
		snow.alpha = alphaNum;

		// radius
		let radiusNum: number =
			Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
		radiusNums.push(radiusNum);

		// angle
		let angleNum: number = Math.floor(Math.random() * 360 + 1);
		angleNums.push(angleNum);

		snows.push(snow);
		container.addChild(snow);
	}

	let ticker = PIXI.ticker.shared;
	ticker.autoStart = false;
	ticker.stop();
	PIXI.settings.TARGET_FPMS = 0.06;
	app.ticker.add(tick);
}

/**
 * adjust fps
 * @param { number } delta time
 */
function tick(delta: number) {
	elapsedTime += delta;

	if (elapsedTime >= fpsDelta) {
		// enough time passed, update app
		update(elapsedTime);
		// reset
		elapsedTime = 0;
	}
}

/**
 * app rendering
 * @param { number } delta time
 */
function update(delta: number) {

	stats.begin();

	for (let i: number = 0; i < MAX_NUM; i++) {
		// radian
		let radian: number = (angleNums[i] * Math.PI) / 180;

		snows[i].x += radiusNums[i] * Math.cos(radian);

		snows[i].y += 1 * accelNums[i];
		angleNums[i] += 5;

		// rotate left or right
		// (if it is possible to determine the direction of rotation like crystals instead of dots)
		/*
		if (rotateDirecNum === ROTATE_LEFT) {
			snow.rotstion -= 10;
		} else {
			snow.rotstion = 10;
		}
		*/

		// moved out of screen
		if (HEIGHT + snows[i].height < snows[i].y) {
			// snow.scaleX = snow.scaleY = 1;
			let xNum: number = Math.floor(Math.random() * WIDTH + 1);
			snows[i].x = xNum;
			snows[i].y = -snows[i].height;
		}
	}

	stats.end();

	// render the canvas
	app.render();
}
