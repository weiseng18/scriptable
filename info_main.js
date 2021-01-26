/*
	Description:
	This works the same as info.js, instead with more 'important' content, so this should be put on the first home screen.
*/

const headerFont = Font.boldSystemFont(20);
const contentFont = Font.semiboldSystemFont(16);

let include_battery = true;

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

	if (include_battery) {
		let description = widget.addText("Battery");
		description.rightAlignText();
		description.textColor = color;
		description.font = headerFont;
		widget.addSpacer(5);

		let batteryLevel = Math.round(Device.batteryLevel()*100);
    	let batteryText = batteryLevel.toString() + "%";
		let battery = widget.addText(batteryText);
		battery.rightAlignText();
		battery.textColor = color;
		battery.font = contentFont;
		widget.addSpacer(5);
	}

	widget.addSpacer();

	Script.setWidget(widget);
	Script.complete();
}

await run();