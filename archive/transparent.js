/*
	Description:
	Generates a widget, and its background can be set via parameter.
*/

async function run() {
    let widget = new ListWidget();

    let location = args.widgetParameter;

    // backgroundImage
    let FM = FileManager.local();
    let path = FM.bookmarkedPath("Images");

    widget.backgroundImage = FM.readImage(path + "/" + location + ".png");

    Script.setWidget(widget);
    Script.complete();
}


await run();