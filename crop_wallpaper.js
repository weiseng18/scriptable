/*
	Description:
	Take a screenshot of your current wallpaper (necessary due to potential cropping when setting background). This widget will crop portions of the wallpaper, that can be used as backgrounds for widgets, so that it appears that the widget is transparent.
	
*/

// main() function essentially
// must be at top of script for some reason

// stores message to send to user
var message;

	// Determine if user has taken the screenshot.
	message = "Before you start, go to your home screen and enter wiggle mode. Scroll to the empty page on the far right and take a screenshot.";
	let exitOptions = ["Continue", "Exit to Take Screenshot"];
	let shouldExit = await generateAlert(message, exitOptions);
	if (shouldExit)
		return;

	// Get screenshot and determine phone size.
	let img = await Photos.fromLibrary();
	let height = img.size.height;
	let phone = phoneSizes()[height];
	if (!phone) {
		message = "It looks like you selected an image that isn't an iPhone screenshot, or your iPhone is not supported. Try again with a different image.";
		await generateAlert(message, ["OK"]);
		return;
	}

	// Do all widget sizes and positions

	let crop = { w: "", h: "", x: "", y: "" };
	let positions = [];
	let imgCrop;
	let FM = FileManager.local();
	let folder = FM.bookmarkedPath("Images");

	// small widget size
	positions = ["top left", "top right", "middle left", "middle right", "bottom left", "bottom right"];
	crop.w = phone.small;
	crop.h = phone.small;
	for (let i=0; i<positions.length; i++) {
		let keys = positions[i].split(' ');
		crop.y = phone[ keys[0] ];
		crop.x = phone[ keys[1] ];

		imgCrop = cropImage(img, new Rect(crop.x,crop.y,crop.w,crop.h));
		path = FM.joinPath(folder, "small_" + keys[0] + "_" + keys[1] + ".png");
		FM.writeImage(path, imgCrop);
	}

	// medium widget size
	positions = ["top", "middle", "bottom"];
	crop.w = phone.medium;
	crop.h = phone.small;
	crop.x = phone.left;
	for (let i=0; i<positions.length; i++) {
		crop.y = phone[ positions[i] ];

		imgCrop = cropImage(img, new Rect(crop.x,crop.y,crop.w,crop.h));
		path = FM.joinPath(folder, "medium_" + positions[i] + ".png");
		FM.writeImage(path, imgCrop);
	}

	// large widget size
	positions = ["top", "bottom"];
	crop.w = phone.medium;
	crop.h = phone.large;
	crop.x = phone.left;
	for (let i=0; i<positions.length; i++) {
		crop.y = i ? phone.middle : phone.top;

		imgCrop = cropImage(img, new Rect(crop.x,crop.y,crop.w,crop.h));
		path = FM.joinPath(folder, "large_" + positions[i] + ".png");
		FM.writeImage(path, imgCrop);
	}

// Generate an alert with the provided array of options.
async function generateAlert(message, options) {
	let alert = new Alert();
	alert.message = message;

	for (const option of options)
		alert.addAction(option);

	let response = await alert.presentAlert();
	return response;
}

// Crop an image into the specified rect.
function cropImage(img, rect) {
	let draw = new DrawContext();
	draw.size = new Size(rect.width, rect.height);

	draw.drawImageAtPoint(img,new Point(-rect.x, -rect.y));
	return draw.getImage();
}

// Pixel sizes and positions for widgets on all supported phones.
function phoneSizes() {
  	let phones = {
  		"2778": {
			"small":  510,
			"medium": 1092,
			"large":  1146,
			"left":  96,
			"right": 678,
			"top":    246,
			"middle": 882,
			"bottom": 1518
	    },
		"2688": {
			"small":  507,
			"medium": 1080,
			"large":  1137,
			"left":  81,
			"right": 654,
			"top":    228,
			"middle": 858,
			"bottom": 1488
		},
		
		"1792": {
			"small":  338,
			"medium": 720,
			"large":  758,
			"left":  54,
			"right": 436,
			"top":    160,
			"middle": 580,
			"bottom": 1000
		},
		
		"2436": {
			"small":  465,
			"medium": 987,
			"large":  1035,
			"left":  69,
			"right": 591,
			"top":    213,
			"middle": 783,
			"bottom": 1353
		},
		
		"2208": {
			"small":  471,
			"medium": 1044,
			"large":  1071,
			"left":  99,
			"right": 672,
			"top":    114,
			"middle": 696,
			"bottom": 1278
		},
		
		"1334": {
			"small":  296,
			"medium": 642,
			"large":  648,
			"left":  54,
			"right": 400,
			"top":    60,
			"middle": 412,
			"bottom": 764
		},
		
		"1136": {
			"small":  282,
			"medium": 584,
			"large":  622,
			"left": 30,
			"right": 332,
			"top":  59,
			"middle": 399,
			"bottom": 399
		}
  	}
  	return phones;
}