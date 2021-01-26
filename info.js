/*
	Description:
	This widget aims to fill the home screen with lots of data, that might not necessarily be useful, but just good to know.
	1. Gets coronavirus numbers from https://coronavirus-19-api.herokuapp.com/countries/singapore

	This widget's text is designed to be large, top, with text right aligned.
*/

const contentFont = Font.semiboldSystemFont(16);

const include_coronavirus = true;

function getBackgroundImage(type) {
	// backgroundImage
	let FM = FileManager.local();
	let path = FM.bookmarkedPath("Images");

	// e.g. small_middle_left
	// depends on the widget's parameter
	return FM.readImage(path + "/" + type + ".png");
}

function getJSON(url) {
	let req = new Request(url);
	return req.loadJSON();
}

async function run() {
	let widget = new ListWidget();
	widget.backgroundImage = getBackgroundImage(args.widgetParameter);

	// adds active coronavirus cases
	if (include_coronavirus) {
		const url = "https://coronavirus-19-api.herokuapp.com/countries/singapore";
		const data = await getJSON(url);

		const activeCases = data["active"].toString();

		let description = widget.addText("Active cases:");
		description.rightAlignText();
		description.textColor = Color.white();
		description.font = contentFont;
		widget.addSpacer(5);

		let amount = widget.addText(activeCases);
		amount.rightAlignText();
		amount.textColor = Color.white();
		amount.font = contentFont;
	}
	
	widget.addSpacer();

	Script.setWidget(widget);
	Script.complete();
}

await run();