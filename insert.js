let curPos = {"x": 0, "y": 0};

let img = document.createElement("img");

// The image seems accessible but doesn't show up on the page for me
img.src = chrome.runtime.getURL("/images/logo128.png");

// Same problem
// img.src = "chrome-extension://ngpbfilaedghaadgnlbdoggcghcdinop/images/logo32.png";

// But a random image like this works fine
// img.src = "https://www1.ac-grenoble.fr/sites/ac_grenoble/files/site_logo/2020-11/09_logoAC_GRENOBLE_normalWEB.jpg"
img.alt= "Ping!";
img.id = "Ping";

img.style.position = "absolute";
img.style.display = "none";
img.style.zIndex = 999;


document.body.appendChild(img);

document.addEventListener('keydown', (e) => {
	if(e.key === "Control") {
		// TODO : Center the image
		img.style.left = curPos.x + "px";
		img.style.top = curPos.y + "px";
		img.style.display = "block";
		
		console.log(img);
	}
});

document.addEventListener('keyup', (e) => {
	if(e.key === "Control") {
		img.style.display = "none";
	}
});

document.addEventListener('mousemove', (e) => {
	curPos.x = e.pageX;
	curPos.y = e.pageY;
});