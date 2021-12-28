let imgPos = {"x": 0, "y": 0};  // pos of the ping image
let curPos = {"x": 0, "y": 0};  // cursor pos
let controlPressed; // true if Ctrl pressed
let stopFadeOut = false; //true if user pressed Ctrl

let [pingDanger, pingWtf, pingHelp, pingOmw, pingNormal] = [false, false, false, false, false];
let AUDIOS = [
	new Audio(chrome.runtime.getURL("/sounds/pingDanger.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingWtf.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingHelp.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingOmw.mp3")),
	new Audio(chrome.runtime.getURL("/sounds/pingNormal.mp3")),
];
let IMAGES = [
	chrome.runtime.getURL("/images/pingDanger.png"),
	chrome.runtime.getURL("/images/pingWtf.png"),
	chrome.runtime.getURL("/images/pingHelp.png"),
	chrome.runtime.getURL("/images/pingOmw.png"),
	chrome.runtime.getURL("/images/pingNormal.png"),
];

let img = document.createElement("img");

// Images default settings
img.src = chrome.runtime.getURL("/images/newLogo128.png");
img.alt= "Ping!";

// Image css
img.style.position = "absolute";
img.style.opacity = 0; //default opacity to 0
img.style.zIndex = 999;

document.body.appendChild(img);

document.addEventListener('keydown', (e) => {
	if(e.key === "Control") {
		if (!controlPressed) {
			stopFadeOut = true; // Stop fadeOut
			img.style.opacity = 1;
		}
		controlPressed = true;
		
		// Check wether it is up, down, right or left and change the image source to add hover effect
		if (Math.abs(dx)<10 && Math.abs(dy)<10) {
			img.src = chrome.runtime.getURL("/images/newLogo128.png");
		}
		else if(Math.abs(dx) > Math.abs(dy)) {
			if(dx > 0) img.src = chrome.runtime.getURL("/images/newLogoRightHover128.png");
			else img.src = chrome.runtime.getURL("/images/newLogoLeftHover128.png");
		}
		else {
			if(dy > 0) img.src = chrome.runtime.getURL("/images/newLogoDownHover128.png");
			else img.src = chrome.runtime.getURL("/images/newLogoUpHover128.png");
		}
		// Get the menu
		
		
		// Position the ping image
		img.style.left = (imgPos.x - 128 / 2) + "px";
		img.style.top = (imgPos.y - 128 / 2) + "px";
	}
});

document.addEventListener('keyup', (e) => {
	if(e.key === "Control") {
		controlPressed = false;
		stopFadeOut = false;
		// Normal ping if the mouse did not move
		if (![pingDanger, pingWtf, pingHelp, pingOmw, pingNormal].includes(true))
			pingNormal = true;
		
		ping();
		// hide the ping image
		setTimeout(fadeOut, 1000);
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
	
	// Ring the actual ping
	AUDIOS[index].play();
	
	// Display the actual ping
	img.src = IMAGES[index];
	
	// Position on the circle of the ping
	img.style.left = (imgPos.x - 64 / 2) + "px";
	img.style.top = (imgPos.y - 64) + "px";
	
	// cancel pings
	[pingDanger, pingWtf, pingHelp, pingOmw, pingNormal] = [false, false, false, false, false];
}


function fadeOut() {
    var tick = function () {
        img.style.opacity = img.style.opacity - 0.05;
        if (+img.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }
    };
	if (!stopFadeOut)
		tick();
}