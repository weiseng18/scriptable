/*
	Description:
	This works the same as info.js, instead with more 'important' content, so this should be put on the first home screen.
*/

const headerFont = Font.boldSystemFont(20);
const contentFont = Font.semiboldSystemFont(16);

function getBackgroundImage(type) {
	// backgroundImage
	let FM = FileManager.local();
	let path = FM.bookmarkedPath("Images");

	// e.g. small_middle_left
	// depends on the widget's parameter
	return FM.readImage(path + "/" + type + ".png");
}

async function run() {
	let widget = new ListWidget();
	let param = args.widgetParameter.split(", ");
	let imageSrc = param[0];
	widget.backgroundImage = getBackgroundImage(imageSrc);
	let colorType = param[1];
	let color = colorType == "white" ? Color.white() : Color.black();

	widget.addSpacer();

	Script.setWidget(widget);
	Script.complete();
}

await run();