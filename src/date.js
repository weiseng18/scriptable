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

  // convert it
  const string = `AY ${dateInfo.year}\n${dateInfo.sem}\n${weekString}`
  return string
}

async function run() {
  const widget = new ListWidget()

  // widget setup
  widget.backgroundColor = Color.black()
  const hugeFont = new Font("Helvetica", 12)

  // NUS date
  const body = widget.addStack()
  body.addSpacer()
  const text = NUSDate()
  const content = body.addText(text)
  content.font = hugeFont
  content.textColor = Color.white()
  body.addSpacer()

  Script.setWidget(widget)
  Script.complete()
}
