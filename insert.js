const canvas = document.createElement('canvas');

canvas.id = "my-canvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.top = '0px';
canvas.style.position = "absolute";
canvas.style.zIndex = 999;

const body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);


// Some optional drawings.
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
ctx.fillRect(100, 100, 200, 200);
ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
ctx.fillRect(150, 150, 200, 200);
ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
ctx.fillRect(200, 50, 200, 200);