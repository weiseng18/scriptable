await run()

function getBackgroundImage(type) {
	// backgroundImage
	let FM = FileManager.local();
	let path = FM.bookmarkedPath("Images");

	// e.g. small_middle_left
	// depends on the widget's parameter
	return FM.readImage(path + "/" + type + ".PNG");
}


async function run() {
  const widget = new ListWidget()

  widget.backgroundImage = getBackgroundImage("bg")

  Script.setWidget(widget)
  Script.complete()
}
