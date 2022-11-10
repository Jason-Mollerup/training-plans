import './App.css'
import runningIcon from './running.svg'
import todayIcon from './today.svg'
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
    text: null,
    texts: [
      'Hill Sprints: 4x15s',
      'Hill Sprints: 4x20s',
      'Hill Sprints: 6x15s',
    ]
  },
  strides: {
    dividerBackgroundColor: '#2A9D8F',
    backgroundColor: '#2A9D8F',
    color: 'white',
    text: 'Strides after run: 4 then build to 6-8',
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
    boxShadow: '0 2px 3px rgba(0, 0, 0, .15)',
    fontSize: 'Larger',
    position: 'sticky',
    top: '0px',
    backgroundColor: 'white',
    width: '100%',
  },
  inputWrapper: {
    fontSize: 'small',
    margin: '10px 25px 0',
  },
  input: {
    fontSize: 'small',
    outline: 'none',
    border: 'none',
    borderBottom: '0.01rem solid lightgray',
    margin: 0,
    textAlign: 'center',
  },
  backgroundWrapper: {
    backgroundColor: 'black',
    padding: '7px',
    height: 'calc(100% - 14px)',
    background: 'linear-gradient(65deg, #264653, #2a9d8f)',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: '30px',
    backgroundColor: 'white',
    overflowY: 'scroll',
    height: '100%',
    boxShadow: '0 3px 5px rgba(0, 0, 0, .4)',
  },
  dayWrapper: {
    padding: '10px',
    borderBottom: '0.05rem solid lightgray',
    display: 'flex',
    flexDirection: 'row',
    width: 'calc(100% - 20px)',
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
  },
  todayButton: {
    zIndex: 2,
    position: 'fixed',
    bottom: '0px',
    right: '0px',
    margin: '15px',
    width: '60px',
    height: '60px',
    color: 'white',
    lineHeight: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: '100px',
    boxShadow: '0 3px 5px rgba(0, 0, 0, .4)',
    background: 'linear-gradient(65deg, #2a9d8f, #264653)',
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
  const hours = isNaN(parseInt(obj.hours)) ? 0 : parseInt(obj.hours)
  const minutes = isNaN(parseInt(obj.minutes)) ? 0 : parseInt(obj.minutes)
  const seconds = isNaN(parseInt(obj.seconds)) ? 0 : parseInt(obj.seconds)
  return (hours * 3600) + (minutes * 60) + seconds
}

const dateToArr = (date, days) => {
  const startDate = new Date(date)
  const newDate = new Date(startDate.setDate(startDate.getDate() + days))
  return newDate.toString().split(' ').slice(0, 3)
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
  hours: '00',
  minutes: '30',
  seconds: '00',
}

const defaultTenK = {
  hours: '01',
  minutes: '10',
  seconds: '00',
}

function App() {
  const initialFiveK = JSON.parse(localStorage.getItem('fiveKTimes')) || defaultFiveK
  const initialTenK = JSON.parse(localStorage.getItem('tenKTimes')) || defaultTenK

  const [fiveK, setFiveK] = useState(timeObjToSeconds(initialFiveK))
  const [tenK, setTenK] = useState(timeObjToSeconds(initialTenK))
  const startDate = new Date(2022, 9, 24)

  const [fiveKTimes, setFiveKTimes] = useState(initialFiveK)
  const [tenKTimes, setTenKTimes] = useState(initialTenK)
  const [scrollMarginTop, setScrollMarginTop] = useState('146px')

  const handleTime = (e, type, unit) => {
    const val = (e.target.value === '' || !e.target.value) ? '' : parseInt(e.target.value)
    const value = isNaN(val) ? 0 : val
    let valueForUse = value
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

  const handleFocus = (e) => e.target.select()

  const handleBlur = () => {
    setTenKTimes(addLeadingZeros(structuredClone(tenKTimes)))
    setFiveKTimes(addLeadingZeros(structuredClone(fiveKTimes)))
  }

  const addLeadingZeros = (obj) => {
    const hours = isNaN(parseInt(obj.hours)) ? 0 : parseInt(obj.hours)
    const minutes = isNaN(parseInt(obj.minutes)) ? 0 : parseInt(obj.minutes)
    const seconds = isNaN(parseInt(obj.seconds)) ? 0 : parseInt(obj.seconds)
    return {
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds
    }
  }

  const setScrollMargin = () => {
    const height = document.getElementById('header').getClientRects()[0].height
    setScrollMarginTop(`${height}px`)
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
    tenKSixteenHundredMeter: tenK / 10000 * 1609,
    halfMFourHundredMeter: (tenK * 2.2063) / 21097 * 400,
    halfMSixteenHundredMeter: (tenK * 2.2063) / 21097 * 1609,
  }

  const workouts = {
    fourA: {
      time: times.mile * 1.05,
      notes: '(3x) 1 Mile with 90s recovery',
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
      notes: '(4x) 1 Mile with 90s recovery',
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
      notes: '(8x) 800 with 3 mins recovery',
    },
    nineA: {
      time: timesAfter.tenKSixteenHundredMeter,
      notes: '(2x) 2 mile with 5 mins recovery, then 1 mile',
    },
    nineB: {
      time: timesAfter.halfMSixteenHundredMeter,
      notes: 'Last 6 miles of Long Run at HM pace',
    },
    tenA: {
      time: timesAfter.sixteenHundredMeter * 1.05,
      notes: '(6x) 1 mile with 2 minutes recovery',
    },
    elevenA: {
      time: timesAfter.sixteenHundredMeter * 1.14,
      notes: '35 minute tempo run',
    },
    elevenB: {
      time: timesAfter.eightHundredMeter * 1.03,
      notes: '(10x) 800m with 3 mins recovery',
    },
    twelveA: {
      time: timesAfter.halfMFourHundredMeter,
      notes: '(10x) 400m with 90s recovery',
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
    { miles: 4, type: 'sprints', workout: null, texts: 0 },
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
    { miles: 5, type: 'sprints', workout: null, texts: 1 },
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
    { miles: 5, type: 'sprints', workout: null, texts: 2 },
    { miles: 8, type: 'workout', workout: workouts.tenA },
    { miles: 0, type: 'off', workout: null },
    { miles: 5, type: 'regular', workout: null },
    { miles: 3, type: 'strides', workout: null },
    { miles: 12, type: 'regular', workout: null },
    { miles: 0, type: 'off', workout: null },
    // Week 11
    { miles: 5, type: 'sprints', workout: null, texts: 2 },
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
    { miles: 2, type: 'regular', workout: null },
    { miles: 13.1, type: 'race', workout: null },
    { miles: 0, type: 'off', workout: null },
  ]

  // const halfMBefore = fiveK * 4.6
  // const halfMAfter = tenK * 2.2063

  return (
    <div className='App'>
      <a style={styles.todayButton} href='#today' onClick={setScrollMargin}>
        <img style={{ width: '18px', color: 'white' }} src={todayIcon} alt='running'/>
      </a>
      <div style={styles.backgroundWrapper}>
        <div style={styles.wrapper}>
          <div id='header' style={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span>Half Marathon Training Plan</span>
              <img style={{ width: '20px', marginLeft: '10px' }} src={runningIcon} alt='running'/>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: 'calc(100% - 50px)',
              justifyContent: 'center',
              margin: '0 25px'
            }}>
              <div style={styles.inputWrapper}>
                <span>5K Time: </span>
                <input style={styles.input}
                  type='number'
                  min='0'
                  max='24'
                  value={fiveKTimes.hours}
                  onChange={(e) => handleTime(e, 'fiveK', 'hours')}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                /><span>:</span>
                <input style={styles.input}
                  type='number'
                  min='0'
                  max='59'
                  value={fiveKTimes.minutes}
                  onChange={(e) => handleTime(e, 'fiveK', 'minutes')}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                /><span>:</span>
                <input style={styles.input}
                  type='number'
                  min='0'
                  max='59'
                  value={fiveKTimes.seconds}
                  onChange={(e) => handleTime(e, 'fiveK', 'seconds')}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
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
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                /><span>:</span>
                <input style={styles.input}
                  type='number'
                  min='0'
                  max='59'
                  value={tenKTimes.minutes}
                  onChange={(e) => handleTime(e, 'tenK', 'minutes')}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                /><span>:</span>
                <input style={styles.input}
                  type='number'
                  min='0'
                  max='59'
                  value={tenKTimes.seconds}
                  onChange={(e) => handleTime(e, 'tenK', 'seconds')}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              </div>
            </div>
          </div>
          {schedule.map(({ miles, type, workout, texts }, index) => {
            const isToday = checkToday(startDate, index)
            const dateArr = dateToArr(startDate, index)
            return (
              <div
                id={isToday ? 'today' : index}
                key={index}
                style={{
                  ...styles.dayWrapper,
                  backgroundColor: type === 'off' ? '#EEEEEE' : 'unset',
                  color: type === 'off' ? '#6C757D' : 'unset',
                  scrollMarginTop: scrollMarginTop,
                }}
              >
                <div style={isToday ? {...styles.dateToday, backgroundColor: dayTypes[type].dividerBackgroundColor } : styles.date}>
                  <div style={{fontSize: 'x-small', fontWeight: 'normal'}}>{dateArr[0]}</div>
                  <div style={{lineHeight: '14px'}}>{dateArr[1]}</div>
                  <div style={{fontSize: 'small'}}>{dateArr[2]}</div>
                </div>
                <div style={{
                  ...styles.divider,
                  backgroundColor: dayTypes[type].dividerBackgroundColor
                }}/>
                <div style={styles.detail}>
                  <div style={{
                    ...styles.dayType,
                    color: type === 'off' ? '#6C757D' : dayTypes[type].color,
                    backgroundColor: dayTypes[type].backgroundColor,
                    fontSize: type === 'off' ? 'larger' : 'unset',
                    fontWeight: type === 'off' ? 'bold' : 'unset'
                  }}>
                    {type === 'sprints' ? dayTypes[type].texts[texts] : dayTypes[type].text}
                  </div>
                  {miles > 0 && (
                    <div style={styles.miles}>{miles} miles</div>
                  )}
                  {workout && (
                    <div style={styles.workoutWrapper}>
                      <div style={styles.notes}>{workout.notes}</div>
                      {workout.time !== null && workout.time !== 0 && (
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
    </div>
  )
}

export default App
