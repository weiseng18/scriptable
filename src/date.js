// This block is only run in dev
//*
import NUSModerator from 'nusmoderator'
console.log(NUSDate())
//*/

// This block is only run in iOS
/*
const NUSModerator = importModule('nusmoderator')
await run()
//*/
//
function getBackgroundImage(type) {
	// backgroundImage
	let FM = FileManager.local();
	let path = FM.bookmarkedPath("Images");

	// e.g. small_middle_left
	// depends on the widget's parameter
	return FM.readImage(path + "/" + type + ".png");
}

function NUSDate() {
  const calendar = NUSModerator.academicCalendar

  // get relevant info
  const dateInfo = calendar.getAcadWeekInfo(new Date())

  // week info
  const weekNumber = dateInfo.num
  const weekInfo = calendar.getAcadWeekName(weekNumber)
  let weekString
  if (weekInfo.weekType == 'Instructional') {
    weekString = `Week ${weekNumber}`
  } else {
    weekString = `${weekType} Week`
  }

  // year, sem, week
  return {
    year: `AY ${dateInfo.year}`,
    sem: dateInfo.sem,
    week: weekString,
  }
}

async function run() {
  const widget = new ListWidget()

  // widget setup
  widget.backgroundImage = getBackgroundImage("small_top_left")
  const textFont = Font.boldSystemFont(16)

  // NUS date
  const info = NUSDate()

  const body = widget.addStack()
  body.addSpacer()
  const content = body.addText(`${info.year}\n${info.sem}\n${info.week}`)
  content.font = textFont
  content.textColor = Color.black()
  content.centerAlignText()
  body.addSpacer()

  Script.setWidget(widget)
  Script.complete()
}
