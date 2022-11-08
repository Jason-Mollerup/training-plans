import './App.css'
import { useState } from 'react'

const dayTypes = {
  regular: {
    dividerBackgroundColor: '#6C757D',
    backgroundColor: '#6C757D',
    color: 'white',
    text: 'Regular run',
  },
  workout: {
    dividerBackgroundColor: '#E9C46A',
    backgroundColor: '#E9C46A',
    color: 'white',
    text: 'Workout Day!',
  },
  sprints: {
    dividerBackgroundColor: '#E76F51',
    backgroundColor: '#E76F51',
    color: 'white',
    text: 'Hill Sprints: 4x15s (w6) 4x20s (w8) 6x15s (w10)',
  },
  strides: {
    dividerBackgroundColor: '#2A9D8F',
    backgroundColor: '#2A9D8F',
    color: 'white',
    text: 'Strides following run: 4 then build up to 6-8',
  },
  race: {
    dividerBackgroundColor: '#264653',
    backgroundColor: '#264653',
    color: 'white',
    text: 'Race / Time Trial Day',
  },
  off: {
    dividerBackgroundColor: '#6C757D',
    backgroundColor: 'transparent',
    color: 'black',
    text: 'OFF DAY!',
  },
}

const styles = {
  header: {
    padding: '25px 0px',
    borderBottom: '0.1rem solid lightgray',
    fontSize: 'Larger',
    position: 'sticky',
    top: '0px',
    backgroundColor: 'white',
    width: '100%',
  },
  inputWrapper: {
    fontSize: 'small',
    marginTop: '10px',
  },
  input: {
    fontSize: 'small',
    outline: 'none',
    border: 'none',
    borderBottom: '0.01rem solid lightgray',
    margin: 0,
    textAlign: 'center',

  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  dayWrapper: {
    margin: '10px 10px 0px',
    padding: '0px 5px 10px',
    borderBottom: '0.05rem solid lightgray',
    display: 'flex',
    flexDirection: 'row',
    width: 'calc(100% - 30px)',
  },
  date: {
    minWidth: '50px',
    height: '50px',
    padding: '5px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dateToday: {
    minWidth: '50px',
    height: '50px',
    padding: '5px',
    textAlign: 'center',
    borderRadius: '100px',
    backgroundColor: '#6C757D',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  divider: {
    minHeight: '50px',
    margin: '0px 10px',
    minWidth: '3px',
    borderRadius: '100px',
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    fontSize: 'small',
  },
  dayType: {
    borderRadius: '3px',
    width: 'fit-content',
    padding: '4px 8px',
    color: 'white',
  },
  miles: {
    marginTop: '10px',
    width: 'fit-content',
    fontWeight: 'bold',
  },
  workoutWrapper: {
    marginTop: '10px',
  },
  notes: {
    fontSize: 'small',
    width: 'fit-content',
  },
  time: {
    borderRadius: '3px',
    backgroundColor: 'lightblue',
    padding: '3px 6px',
    fontSize: 'smaller',
    width: 'fit-content',
    marginTop: '6px',
  }
}

// https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
const secondsToTime = (seconds) => {
  return seconds > 36000
    ? new Date(seconds * 1000).toISOString().substring(11, 19)
    : seconds > 3600
    ? new Date(seconds * 1000).toISOString().substring(12, 19)
    : seconds > 600
    ? new Date(seconds * 1000).toISOString().substring(14, 19)
    : new Date(seconds * 1000).toISOString().substring(15, 19)
}

const timeObjToSeconds = (obj) => {
  return (
    obj.hours * 3600
    + obj.minutes * 60
    + obj.seconds
  )
}

const dateToType = (date, days, type) => {
  const startDate = new Date(date)
  const newDate = new Date(startDate.setDate(startDate.getDate() + days))
  return type === 'month'
    ? newDate.toLocaleString('en-US', {month: 'short'})
    : newDate.getDate()
}

const checkToday = (date, days) => {
  const startDate = new Date(date)
  const newDate = new Date(startDate.setDate(startDate.getDate() + days))
  const today = new Date()
  return (
    newDate.getFullYear() === today.getFullYear()
    && newDate.getMonth() === today.getMonth()
    && newDate.getDate() === today.getDate()
  )
}

const defaultFiveK = {
  hours: 0,
  minutes: 30,
  seconds: 0,
}

const defaultTenK = {
  hours: 1,
  minutes: 10,
  seconds: 0,
}

function App() {
  const [fiveK, setFiveK] = useState(timeObjToSeconds(JSON.parse(localStorage.getItem('fiveKTimes')) || defaultFiveK))
  const [tenK, setTenK] = useState(timeObjToSeconds(JSON.parse(localStorage.getItem('tenKTimes')) || defaultTenK))
  const startDate = new Date(2022, 9, 24)

  const [fiveKTimes, setFiveKTimes] = useState(JSON.parse(localStorage.getItem('fiveKTimes')) || defaultFiveK)
  const [tenKTimes, setTenKTimes] = useState(JSON.parse(localStorage.getItem('tenKTimes')) || defaultTenK)

  const handleTime = (e, type, unit) => {
    const val = parseInt(e.target.value)
    const value = isNaN(val) ? 0 : val
    let valueForUse = val
    if (unit === 'hours' && value > 23) {
      valueForUse = 23
    }
    if ((unit === 'minutes' || unit === 'seconds') && value > 60 ) {
      valueForUse = 59
    }
    if (type === 'fiveK') {
      let tempFiveK = structuredClone(fiveKTimes)
      unit === 'hours'
      ? tempFiveK.hours = valueForUse
      : unit === 'minutes'
      ? tempFiveK.minutes = valueForUse
      : tempFiveK.seconds = valueForUse
      setFiveKTimes(tempFiveK)
      setFiveK(timeObjToSeconds(tempFiveK))
      localStorage.setItem('fiveKTimes', JSON.stringify(tempFiveK))
    } else {
      let tempTenK = structuredClone(tenKTimes)
      unit === 'hours'
      ? tempTenK.hours = valueForUse
      : unit === 'minutes'
      ? tempTenK.minutes = valueForUse
      : tempTenK.seconds = valueForUse
      setTenKTimes(tempTenK)
      setTenK(timeObjToSeconds(tempTenK))
      localStorage.setItem('tenKTimes', JSON.stringify(tempTenK))
    }
  }

  const times = {
    mile: fiveK / 5000 * 1609,
    tenK: fiveK * 2.085,
    halfMarathon: fiveK * 4.6,
    fullMarathon: fiveK * 9.951,
    fourHundredMeter: fiveK / 5000 * 400,
    eightHundredMeter: fiveK / 5000 * 800,
  }

  const timesAfter = {
    eightHundredMeter: tenK / 2.085 / 5000 * 800,
    sixteenHundredMeter: tenK / 2.085 / 5000 * 1609,
    tenKEightHundredMeter: tenK / 10000 * 800,
    halfMFourHundredMeter: (tenK * 2.2063) / 21097 * 400,
    halfMSixteenHundredMeter: (tenK * 2.2063) / 21097 * 1609,
  }

  const workouts = {
    fourA: {
      time: times.mile * 1.05,
      notes: '3x1 Mile with 90s recovery',
    },
    fiveA: {
      time: times.mile * 1.14,
      notes: '25 minute tempo Run',
    },
    fiveB: {
      time: times.fourHundredMeter * 0.9,
      notes: '6x400m with 2 mins recovery',
    },
    sixA: {
      time: times.mile * 1.05,
      notes: '4x1 Mile with 90s recovery',
    },
    sixB: {
      time: times.fourHundredMeter * 0.9,
      notes: '8x400m with 2 mins recovery',
    },
    sevenA: {
      time: times.eightHundredMeter * 1.03,
      notes: '6x800m with 3 mins recovery',
    },
    sevenB: {
      time: null,
      notes: '10k Time Trial: All out 10k',
    },
    eightA: {
      time: timesAfter.sixteenHundredMeter * 1.14,
      notes: '30 minute tempo run',
    },
    eightB: {
      time: timesAfter.eightHundredMeter * 1.03,
      notes: '8x800 with 3 mins recovery',
    },
    nineA: {
      time: timesAfter.tenKEightHundredMeter,
      notes: '2x2 mile with 5 mins recovery, then 1 mile',
    },
    nineB: {
      time: timesAfter.halfMSixteenHundredMeter,
      notes: 'Last 6 miles of Long Run at HM pace',
    },
    tenA: {
      time: timesAfter.sixteenHundredMeter * 1.05,
      notes: '6x1 mile with 2 minutes recovery',
    },
    elevenA: {
      time: timesAfter.sixteenHundredMeter * 1.14,
      notes: '35 minute tempo run',
    },
    elevenB: {
      time: timesAfter.eightHundredMeter * 1.03,
      notes: '10x800m with 3 mins recovery',
    },
    twelveA: {
      time: timesAfter.halfMFourHundredMeter,
      notes: '10x400m with 90s recovery',
    },
  }

  const schedule = [
    // Week 1
    { miles: 2, type: 'regular', workout: null },
    { miles: 3, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    { miles: 2, type: 'regular', workout: null },
    { miles: 3, type: 'regular', workout: null },
    { miles: 4, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 2
    { miles: 3, type: 'regular', workout: null },
    { miles: 4, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    { miles: 2, type: 'regular', workout: null },
    { miles: 3, type: 'regular', workout: null },
    { miles: 5, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 3
    { miles: 3, type: 'regular', workout: null },
    { miles: 4, type: 'strides', workout: null },
    { miles: 0, type: 'off', workout: null },
    { miles: 2, type: 'regular', workout: null },
    { miles: 3, type: 'regular', workout: null },
    { miles: 6, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 4
    { miles: 4, type: 'regular', workout: null },
    { miles: 5, type: 'workout', workout: workouts.fourA },
    { miles: 0, type: 'off', workout: null },
    { miles: 3, type: 'regular', workout: null },
    { miles: 4, type: 'strides', workout: null },
    { miles: 7, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 5
    { miles: 4, type: 'regular', workout: null },
    { miles: 5, type: 'workout', workout: workouts.fiveA },
    { miles: 0, type: 'off', workout: null },
    { miles: 3, type: 'regular', workout: null },
    { miles: 4, type: 'workout', workout: workouts.fiveB },
    { miles: 7, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 6
    { miles: 4, type: 'sprints', workout: null },
    { miles: 5, type: 'workout', workout: workouts.sixA },
    { miles: 0, type: 'off', workout: null },
    { miles: 4, type: 'regular', workout: null },
    { miles: 5, type: 'workout', workout: workouts.sixB },
    { miles: 8, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 7
    { miles: 5, type: 'strides', workout: null },
    { miles: 6, type: 'workout', workout: workouts.sevenA },
    { miles: 0, type: 'off', workout: null },
    { miles: 4, type: 'strides', workout: null },
    { miles: 3, type: 'regular', workout: null },
    { miles: 6.2, type: 'race', workout: workouts.sevenB },
    { miles: 0, type: 'off', workout: null },
    // Week 8
    { miles: 5, type: 'sprints', workout: null },
    { miles: 6, type: 'workout', workout: workouts.eightA },
    { miles: 0, type: 'off', workout: null },
    { miles: 3, type: 'strides', workout: null },
    { miles: 5, type: 'workout', workout: workouts.eightB },
    { miles: 10, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 9
    { miles: 5, type: 'strides', workout: null },
    { miles: 7, type: 'workout', workout: workouts.nineA },
    { miles: 0, type: 'off', workout: null },
    { miles: 3, type: 'strides', workout: null },
    { miles: 4, type: 'regular', workout: null },
    { miles: 10, type: 'workout', workout: workouts.nineB },
    { miles: 0, type: 'off', workout: null },
    // Week 10
    { miles: 5, type: 'sprints', workout: null },
    { miles: 8, type: 'workout', workout: workouts.tenA },
    { miles: 0, type: 'off', workout: null },
    { miles: 5, type: 'regular', workout: null },
    { miles: 3, type: 'strides', workout: null },
    { miles: 12, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 11
    { miles: 5, type: 'sprints', workout: null },
    { miles: 7, type: 'workout', workout: workouts.elevenA },
    { miles: 0, type: 'off', workout: null },
    { miles: 3, type: 'strides', workout: null },
    { miles: 4, type: 'workout', workout: workouts.elevenB },
    { miles: 10, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 12
    { miles: 4, type: 'strides', workout: null },
    { miles: 5, type: 'workout', workout: workouts.twelveA },
    { miles: 0, type: 'off', workout: null },
    { miles: 3, type: 'strides', workout: null },
    { miles: 'Opt. 2-3', type: 'regular', workout: null },
    { miles: 13.1, type: 'regular', workout: null },
    { miles: 0, type: 'race', workout: null },
  ]

  // const halfMBefore = fiveK * 4.6
  // const halfMAfter = tenK * 2.2063

  return (
    <div className='App'>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div>
            Half Marathon Training Plan
          </div>
          <div style={styles.inputWrapper}>
            <span>5K Time: </span>
            <input style={styles.input}
              type='number'
              min='0'
              max='24'
              value={fiveKTimes.hours}
              onChange={(e) => handleTime(e, 'fiveK', 'hours')}
            /><span>:</span>
            <input style={styles.input}
              type='number'
              min='0'
              max='59'
              value={fiveKTimes.minutes}
              onChange={(e) => handleTime(e, 'fiveK', 'minutes')}
            /><span>:</span>
            <input style={styles.input}
              type='number'
              min='0'
              max='59'
              value={fiveKTimes.seconds}
              onChange={(e) => handleTime(e, 'fiveK', 'seconds')}
            />
          </div>
          <div style={styles.inputWrapper}>
            <span>10K Time: </span>
            <input style={styles.input}
              type='number'
              min='0'
              max='24'
              value={tenKTimes.hours}
              onChange={(e) => handleTime(e, 'tenK', 'hours')}
            /><span>:</span>
            <input style={styles.input}
              type='number'
              min='0'
              max='59'
              value={tenKTimes.minutes}
              onChange={(e) => handleTime(e, 'tenK', 'minutes')}
            /><span>:</span>
            <input style={styles.input}
              type='number'
              min='0'
              max='59'
              value={tenKTimes.seconds}
              onChange={(e) => handleTime(e, 'tenK', 'seconds')}
            />
          </div>
        </div>
        {schedule.map(({ miles, type, workout }, index) => {
          const isToday = checkToday(startDate, index)
          return (
            <div key={index} style={styles.dayWrapper}>
              <div style={isToday ? styles.dateToday : styles.date}>
                <div>{dateToType(startDate, index, 'month')}</div>
                <div>{dateToType(startDate, index, 'day')}</div>
              </div>
              <div style={{
                ...styles.divider,
                backgroundColor: dayTypes[type].dividerBackgroundColor
              }}/>
              <div style={styles.detail}>
                <div style={{
                  ...styles.dayType,
                  color: dayTypes[type].color,
                  backgroundColor: dayTypes[type].backgroundColor
                }}>
                  {dayTypes[type].text}
                </div>
                {miles > 0 && (
                  <div style={styles.miles}>{miles} miles</div>
                )}
                {workout && (
                  <div style={styles.workoutWrapper}>
                    <div style={styles.notes}>{workout.notes}</div>
                    {workout.time && (
                      <div style={styles.time}>@ {secondsToTime(workout.time)} time</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
