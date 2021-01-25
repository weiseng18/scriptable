/*
    Description:
    Displays battery level, centered.
*/

async function run() {
    let widget = new ListWidget();

    // backgroundImage
    let FM = FileManager.local();
    let path = FM.bookmarkedPath("Images");

    // e.g. small_middle_left, white
    let param = args.widgetParameter.split(", ");
    let location = param[0];
    let color = param[1];
    // depends on the widget's parameter
    widget.backgroundImage = FM.readImage(path + "/" + location + ".png");

    // fonts
    let contentFont = new Font("Helvetica", 12);
    let hugeFont = new Font("Helvetica", 40);

    // content
    let top = widget.addStack();

    top.addSpacer();

    let header = top.addText("Battery");
    header.font = contentFont;
    header.textColor = color == "white" ? Color.white() : Color.black();

    top.addSpacer();

    let body = widget.addStack();

    body.addSpacer();

    let batteryLevel = Math.round(Device.batteryLevel()*100);
    let batteryText = batteryLevel.toString() + "%";
    let batteryCont = body.addText(batteryText);
    batteryCont.font = hugeFont;
    batteryCont.textColor = color == "white" ? Color.white() : Color.black();

    body.addSpacer();

    Script.setWidget(widget);
    Script.complete();
}

await run();