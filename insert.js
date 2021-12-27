let imgPos = {"x": 0, "y": 0};  // pos of the ping image
let curPos = {"x": 0, "y": 0};  // cursor pos
let controlPressed; // true if Ctrl pressed

let [pingDanger, pingWtf, pingHelp, pingOmw, pingNormal] = [false, false, false, false, false];
let AUDIOS = [
	new Audio(chrome.runtime.getURL("/sounds/pingDanger.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingWtf.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingHelp.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingOmw.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingNormal.mp3")),
];

let img = document.createElement("img");

// Images settings
img.src = chrome.runtime.getURL("/images/logo128.png");
img.alt= "Ping!";

// Image css
img.style.position = "absolute";
img.style.display = "none"; // hide by default
img.style.zIndex = 999;

document.body.appendChild(img);

document.addEventListener('keydown', (e) => {
	if(e.key === "Control") {
		controlPressed = true;
		
		// Position the ping image
		img.style.left = (imgPos.x - 128 / 2) + "px";
		img.style.top = (imgPos.y - 128 / 2) + "px";
		img.style.display = "block";
	}
});

document.addEventListener('keyup', (e) => {
	if(e.key === "Control") {
		controlPressed = false;
		
		// Normal ping if the mouse did not move
		if (![pingDanger, pingWtf, pingHelp, pingOmw, pingNormal].includes(true))
			pingNormal = true;
		
		ping();
		img.style.display = "none"; // hide the ping image
	}
});

document.addEventListener('mousemove', (e) => {
	if(!controlPressed) {
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
		}
		else if(Math.abs(dx) > Math.abs(dy)) {
			if(dx > 0) pingOmw = true;
			else pingWtf = true;
		}
		else {
			if(dy > 0) pingHelp = true;
			else pingDanger = true;
		}
	}
});


function ping() {	
	// what ping to ring 
	let index = [pingDanger, pingWtf, pingHelp, pingOmw, pingNormal].indexOf(true);
	
	// ring the actual ping
	AUDIOS[index].play();
	
	// cancel pings
	[pingDanger, pingWtf, pingHelp, pingOmw, pingNormal] = [false, false, false, false, false];
}