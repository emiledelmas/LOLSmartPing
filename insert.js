
class Ping {
	constructor(src, audioUrl, pos) {
		// Html element
		this.e = document.createElement("img");
		this.e.src = src;
		//Style
		this.e.style.position = "absolute";
		this.e.style.opacity = 0; // hide by default
		this.e.style.zIndex = 999; // On top
		
		// Audio
		this.a = new Audio(audioUrl);
		
		this.show(pos); // directly play when created
	}
	
	show(pos) { // Position, display, play and fadeOut
		this.e.style.left = pos.x;
		this.e.style.top = pos.y;
		this.e.style.opacity = 1;
		
		document.body.appendChild(this.e);
		
		this.play();
		setTimeout(() => {this.fadeOut(this.e)}, 2000);
	}
	
	fadeOut(e) {
		let tick = function () {
			e.style.opacity -= 0.05;
			if (e.style.opacity > 0) {
				(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
			} else document.body.removeChild(e);
		};
		tick();
	}
	
	play() {
		this.a.play();
	}
}

function ping() {	
	// what ping to ring 
	let index = [pingDanger, pingWtf, pingHelp, pingOmw, pingNormal].indexOf(true);
	
	// Position on the circle of the ping
	let pos = {"x": 0, "y": 0};
	pos.x = (imgPos.x - 64 / 2) + "px";
	pos.y = (imgPos.y - 64) + "px";
	
	// Create and play ping
	PINGS.push(new Ping(PINGCREATOR[index].src, PINGCREATOR[index].audioUrl, pos));
	
	if(PINGS.length > 50) PINGS.splice(0, 5);

	// cancel pings
	[pingDanger, pingWtf, pingHelp, pingOmw, pingNormal] = [false, false, false, false, false];
	img.src = chrome.runtime.getURL("/images/logo128.png"); // get the menu back
}

let imgPos = {"x": 0, "y": 0};  // pos of the ping image
let curPos = {"x": 0, "y": 0};  // cursor pos
let ContolPressed; // true if Ctrl pressed

// pings to show
let [pingDanger, pingWtf, pingHelp, pingOmw, pingNormal] = [false, false, false, false, false];

// array of pings that play
let PINGS = new Array(); // will contains Ping objects
let PINGCREATOR = [
	{
		"src": 		chrome.runtime.getURL("/images/pingDanger.png"),
		"audioUrl": chrome.runtime.getURL("/sounds/pingDanger.mp3")
	},
	
	{
		"src": 		chrome.runtime.getURL("/images/pingWtf.png"),
		"audioUrl": chrome.runtime.getURL("/sounds/pingWtf.mp3")
	},
	
	{
		"src": 		chrome.runtime.getURL("/images/pingHelp.png"),
		"audioUrl": chrome.runtime.getURL("/sounds/pingHelp.mp3")
	},
	
	{
		"src": 		chrome.runtime.getURL("/images/pingOmw.png"),
		"audioUrl": chrome.runtime.getURL("/sounds/pingOmw.mp3")
	},
	
	{
		"src": 		chrome.runtime.getURL("/images/pingNormal.png"),
		"audioUrl": chrome.runtime.getURL("/sounds/pingNormal.mp3")
	}
];

/* Ping menu */

let img = document.createElement("img");

// default settings
img.src = chrome.runtime.getURL("/images/logo128Normal.png");
img.alt= "Ping!";
// css
img.style.position = "absolute";
img.style.zIndex = 999;

/* event listener */

document.addEventListener('keydown', (e) => {
	if(e.key === "Control") {
		ContolPressed = true;
		
		// Position the ping image
		img.style.left = (imgPos.x - 128 / 2) + "px";
		img.style.top = (imgPos.y - 128 / 2) + "px";
		document.body.appendChild(img); // display
	}
});

document.addEventListener('keyup', (e) => {
	if(e.key === "Control") {
		ContolPressed = false;
		document.body.removeChild(img); // remove from screen
		img.src = chrome.runtime.getURL("/images/logo128Normal.png");
		
		// Normal ping if the mouse did not move
		if (![pingDanger, pingWtf, pingHelp, pingOmw, pingNormal].includes(true))
			pingNormal = true;
		
		ping();
	}
});

document.addEventListener('mousemove', (e) => {
	if(!ContolPressed) {
		// Move the image with the mouse iff Ctrl is up
		imgPos.x = e.pageX;
		imgPos.y = e.pageY;
	}
	else {
		// To do if the image is there
		
		// reset pings
		[pingDanger, pingWtf, pingHelp, pingOmw, pingNormal] = [false, false, false, false, false];
		
		// Retrieve curor Position
		curPos.x = e.pageX;
		curPos.y = e.pageY;
		// Check wether it is up, down, right or left
		dx = curPos.x - imgPos.x;
		dy = curPos.y - imgPos.y;
		if (Math.abs(dx)<10 && Math.abs(dy)<10) {
			pingNormal = true;
			img.src = chrome.runtime.getURL("/images/logo128Normal.png");
		}
		else if(Math.abs(dx) > Math.abs(dy)) {
			if(dx > 0) {
				pingOmw = true;
				img.src = chrome.runtime.getURL("/images/logo128Omw.png");
			}
			else {
				pingWtf = true;
				img.src = chrome.runtime.getURL("/images/logo128Wtf.png");
			}
		}
		else {
			if(dy > 0) {
				pingHelp = true;
				img.src = chrome.runtime.getURL("/images/logo128Help.png");
			}
			else {
				pingDanger = true;
				img.src = chrome.runtime.getURL("/images/logo128Danger.png");
			}
		}
	}
});

