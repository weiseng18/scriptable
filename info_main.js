/*
	Description:
	This works the same as info.js, instead with more 'important' content, so this should be put on the first home screen.
*/

const headerFont = Font.boldSystemFont(20);
const contentFont = Font.semiboldSystemFont(16);

let include_battery = true;
let include_fpl = true;

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

	if (include_fpl) {
		let url = "https://fantasy.premierleague.com/api/bootstrap-static/";
		let data = await getJSON(url);

		// calculate current gw
		let GWs = data.events;
		let now = new Date().getTime();
		let gw = 0;
		let deadline = new Date(GWs[0].deadline_time).getTime();
		while (deadline < now && gw < 38) {
			gw++;
			deadline = new Date(GWs[gw].deadline_time).getTime();
		}

		// data for current gw
		let upcomingGW = gw + 1;
		let upcomingDeadline = deadline;

		// calculate time difference between upcomingDeadline and now
		let delta = Math.abs(upcomingDeadline - now) / 1000;

		let days = Math.floor(delta / 86400);
		delta -= days * 86400;

		let hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		let minutes = Math.floor(delta / 60) % 60;

		let dayText = days + " day" + (days > 1 ? "s" : "");
		let hoursText = hours + " hour" + (hours > 1 ? "s" : "");
		let minutesText = minutes + " minute" + (minutes > 1 ? "s" : "");

		let diffString = "";
		let sep = ", ";
		if (days > 0 && hours > 0 && minutes > 0)
			diffString = dayText + sep + hoursText + sep + minutesText;
		else if (days > 0 && hours > 0 && !minutes)
			diffString = dayText + sep + hoursText;
		else if (days > 0 && !hours && minutes > 0)
			diffString = dayText + sep + minutesText;
		else if (!days && hours > 0 && minutes > 0)
			diffString = hoursText + sep + minutesText;
		else if (!days && !hours && !minutes)
			diffString = "Less than a minute";
		else {
			// only one of days, hours, or minutes is > 0
			diffString = (days > 0 ? dayText : "") + (hours > 0 ? hoursText : "") + (minutes > 0 ? minutesText : "");
		}

		// actual widget text
		let description = widget.addText("Time to GW " + upcomingGW + " deadline");
		description.rightAlignText();
		description.textColor = color;
		description.font = headerFont;
		widget.addSpacer(5);

		let difference = widget.addText(diffString);
		difference.rightAlignText();
		difference.textColor = color;
		difference.font = contentFont;
		widget.addSpacer(5);
	}

	widget.addSpacer();

	Script.setWidget(widget);
	Script.complete();
}

await run();