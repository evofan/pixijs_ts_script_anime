var message = "TypeScript Ver.";
console.log(message);
// import { Stats } from "stats.js";
// stats
var stats = new Stats();
console.log(stats);
stats.showPanel(0); // 0: fps, 1: ms; 2: mb, 3: custom
document.body.appendChild(stats.dom);
var WIDTH = 480;
var HEIGHT = 320;
var APP_FPS = 30;
// init
var app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT
});
var canvas = document.getElementById("canvas");
canvas.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;
app.stage.interactive = true;
app.ticker.remove(app.render, app);
var fpsDelta = 60 / APP_FPS;
var bg;
var elapsedTime = 0;
var container_bg = new PIXI.Container();
container_bg.x = 0;
container_bg.y = 0;
app.stage.addChild(container_bg);
var container = new PIXI.Container();
container.width = 480;
container.height = 480;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = true;
app.stage.addChild(container);
// asset property
var ASSET_BG = "images/sky_bg.jpg";
var ASSET_SNOW = "images/snow_07.png";
// snow property
var ROTATE_LEFT = 1;
var ROTATE_RIGHT = 2;
var MAX_NUM = 10;
var MIN_SCALE = 0.5;
var MAX_SCALE = 1.5;
var MAX_ACCEL = 7;
var MIN_ALPHA = 0.3;
var MAX_ALPHA = 1;
var MAX_RADIUS = 5;
var MIN_RADIUS = 1;
var snows = [];
var radiusNums = [];
var angleNums = [];
var accelNums = [];
PIXI.loader
    .add("bg_data", ASSET_BG)
    .add("snow_data", ASSET_SNOW)
    .load(onAssetsLoaded);
/**
 * Asset load Complete
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader, res) {
    // BG
    bg = new PIXI.Sprite(res.bg_data.texture);
    container_bg.addChild(bg);
    bg.x = 0;
    bg.y = 0;
    bg.interactive = true;
    bg.on("tap", function (event) {
        console.log("onTap"); // Desktop(Touch)
    });
    bg.on("click", function (event) {
        console.log("click"); // Desktop
    });
    // Text
    var text = new PIXI.Text("Fall Snow\n(in Making..)", {
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
    for (var i = 0; i < MAX_NUM; i++) {
        var snow = PIXI.Sprite.from(res.snow_data.texture);
        // x position
        var xNum = Math.floor(Math.random() * WIDTH + 1);
        snow.x = xNum;
        // y position
        var yNum = -Math.floor(Math.random() * 100 + 1);
        snow.y = yNum;
        // xy scale
        var scaleNum = Math.floor((Math.random() * (MAX_SCALE - MIN_SCALE) + MIN_SCALE) * 10) /
            10;
        snow.scale.set(scaleNum, scaleNum);
        // direction of rotation
        var rotateDirecNum = Math.floor(Math.random() * 2 + 1);
        rotateDirecNum === 1
            ? (rotateDirecNum = ROTATE_LEFT)
            : (rotateDirecNum = ROTATE_RIGHT);
        console.log(rotateDirecNum);
        // acceleration
        var accelNum = Math.floor(Math.random() * MAX_ACCEL + 1);
        accelNums.push(accelNum);
        // transparency
        var alphaNum = Math.floor((Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA) * 10) /
            10;
        console.log(alphaNum);
        snow.alpha = alphaNum;
        // radius
        var radiusNum = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
        radiusNums.push(radiusNum);
        // angle
        var angleNum = Math.floor(Math.random() * 360 + 1);
        angleNums.push(angleNum);
        snows.push(snow);
        container.addChild(snow);
    }
    var ticker = PIXI.ticker.shared;
    ticker.autoStart = false;
    ticker.stop();
    PIXI.settings.TARGET_FPMS = 0.06;
    app.ticker.add(tick);
}
/**
 * adjust fps
 * @param { number } delta time
 */
function tick(delta) {
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
function update(delta) {
    stats.begin();
    for (var i = 0; i < MAX_NUM; i++) {
        // radian
        var radian = (angleNums[i] * Math.PI) / 180;
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
            var xNum = Math.floor(Math.random() * WIDTH + 1);
            snows[i].x = xNum;
            snows[i].y = -snows[i].height;
        }
    }
    stats.end();
    // render the canvas
    app.render();
}
//# sourceMappingURL=index.js.map