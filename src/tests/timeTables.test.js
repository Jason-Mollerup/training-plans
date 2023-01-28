import { createTimeObject, createRunTimeTable } from '../lib/timeTables'

const seconds = 5970
const timeObj = createTimeObject('halfM', seconds)

const timeTable = createRunTimeTable([timeObj])
console.log(timeTable)
