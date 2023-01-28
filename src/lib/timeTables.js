import { timeObjToSeconds } from './timeHelpers.js'

const multipliers = {
  fiveK: {
    twoH: 0.04,
    fourH: 0.08,
    eightH: 0.16,
    oneM: 0.3218,
    twoM: 0.6436,
    fiveK: 1.0,
    tenK: 2.085,
    halfM: 4.6,
    fullM: 9.591
  },
  tenK: {
    twoH: 0.02,
    fourH: 0.04,
    eightH: 0.08,
    oneM: 0.1609,
    twoM: 0.3218,
    fiveK: 0.47961631,
    tenK: 1.0,
    halfM: 2.2063,
    fullM: 4.5995
  },
  halfM: {
    twoH: 0.00948002,
    fourH: 0.01896004,
    eightH: 0.03792008,
    oneM: 0.07626677,
    twoM: 0.15253354,
    fiveK: 0.2173913,
    tenK: 0.45324752,
    halfM: 1.0,
    fullM: 2.085
  },
  fullM: {
    twoH: 0.0047399,
    fourH: 0.0094798,
    eightH: 0.01895959,
    oneM: 0.03813248,
    twoM: 0.07626496,
    fiveK: 0.10426441,
    tenK: 0.21741494,
    halfM: 0.47961631,
    fullM: 1.0
  }
}

const validTimeObjDistances = ['fiveK', 'tenK', 'halfM', 'fullM']

export const createTimeObject = (distance, time) => {
  const distanceValid = validTimeObjDistances.includes(distance)
  const timeValid = typeof time == 'number'

  if (!distanceValid) {
    throw new TypeError(
      `${distance} is invalid; choose one of ${validTimeObjDistances.join(',')}`
    )
  }

  if (!timeValid) {
    throw new TypeError(
      `${time} must be type number; received type: ${typeof time}`
    )
  }

  return { distance, time }
}

export const createRunTimeTable = timeObjects => {
  const table = {}
  timeObjects.forEach(({ distance, time }) => {
    const column = multipliers[distance]
    let times = {}
    for (let row in column) {
      times[row] = Math.ceil(column[row] * time)
    }
    table[distance] = times
  })
  return table
}

export const getTimeTableFromWorkout = (times, workout, defaultBaseTable) => {
  if (!workout) return
  const time = times[workout.baseTable] || times[defaultBaseTable]
  const seconds = timeObjToSeconds(time)
  const workoutTimeObject = createTimeObject(workout.baseTable, seconds)
  return createRunTimeTable([workoutTimeObject])[workout.baseTable]
}
