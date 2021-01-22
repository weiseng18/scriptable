// constants
var link = "https://api.data.gov.sg/v1/environment/psi";

const levels = [
	{
		threshold: 251,
		label: "Very High",
		color: "#fa2323"
	},
	{
		threshold: 151,
		label: "High",
		color: "#d66722"
	},
	{
		threshold: 56,
		label: "Elevated",
		color: "#c7d622"
	},
	{
		threshold: 0,
		label: "Healthy",
		color: "#22d652"
	}
];

function getAttributes(PSI) {
	let index = 0;
	while (index < 4 && PSI < levels[index].threshold) {
		index++;
	}
	return levels[index];
}

async function getJSON(url) {
	let request = new Request(url);
	let json = await request.loadJSON();

	return {
		val: json.items[0].readings["psi_twenty_four_hourly"].national,
		time: json.items[0].timestamp,
		updateTime: json.items[0].update_timestamp
	};
}

async function run() {
	let widget = new ListWidget();
	/*
		data: val, time, updateTime
		attributes: threshold, label, color
	*/
	let data = await getJSON(link);
	let attributes = getAttributes(data.val);

	// backgroundImage
	let FM = FileManager.local();
	let path = FM.bookmarkedPath("Images");
	// depends on the widget's parameter
	widget.backgroundImage = FM.readImage(path + "/" + args.widgetParameter + ".png");

	// fonts
	let contentFont = new Font("Helvetica", 12);
	let hugeFont = new Font("Helvetica", 40)

	// content
	let header = widget.addText("24H PSI")
	header.font = contentFont;
	header.textColor = Color.black();

	let PSI = widget.addText(data.val.toString());
	PSI.font = hugeFont;
	PSI.textColor = Color.black();

	let desc = widget.addText(attributes.label);
	desc.font = contentFont;
	desc.textColor = Color.black();

	let time = new Date(data.updateTime).toLocaleTimeString();
	let updateTime = widget.addText("Updated at " + time);
	updateTime.font = contentFont;
	updateTime.textColor = Color.black();

	Script.setWidget(widget);
	Script.complete();
}

await run();