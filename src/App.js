import halfMarathonPlan from './plans/halfMPlan.json'
import './styles/App.css'
import runningIcon from './icons/running.svg'
import todayIcon from './icons/today.svg'
import stravaIcon from './icons/strava.svg'
import { useState, useMemo } from 'react'
import {
  secondsToTime,
  addLeadingZeros,
  dateToArr,
  checkToday
} from './lib/timeHelpers.js'
import { getTimeTableFromWorkout } from './lib/timeTables.js'

import {
  activityDefaults,
  defaultTimes,
  defaultTimeLabels
} from './lib/constants.js'

const runTypesAndStyles = activityDefaults.run.types

function App() {
  // CONSTANTS
  const plan = useMemo(() => structuredClone(halfMarathonPlan), [])
  const distances = useMemo(() => ['fiveK', 'tenK'], [])
  const initialTimes = useMemo(() => {
    let timeObj = {}
    distances.forEach(distance => {
      const timeString = localStorage.getItem(distance)
      timeObj[distance] = timeString
        ? JSON.parse(timeString)
        : defaultTimes[distance]
    })
    return timeObj
  }, [distances])
  const startDate = useMemo(() => {
    const date = localStorage.getItem('startDate')
    return date ? JSON.parse(date) : new Date()
  }, [])

  // STATE
  const [scrollMarginTop, setScrollMarginTop] = useState('146px')
  const [times, setTimes] = useState(initialTimes)
  // IMPLEMENT
  // const [startDate, setStartDate] = useState(initialStartDate)

  // FUNCTIONS
  const handleFocus = e => e.target.select()
  const handleBlur = () => {
    const timesWithZeros = addLeadingZeros(structuredClone(times))
    setTimes(timesWithZeros)
    for (let key in timesWithZeros) {
      localStorage.setItem(key, JSON.stringify(timesWithZeros[key]))
    }
  }

  const setScrollMargin = () => {
    const height = document.getElementById('header').getClientRects()[0].height
    setScrollMarginTop(`${height}px`)
  }

  const handleTime = (e, type, unit) => {
    const val =
      e.target.value === '' || !e.target.value ? '' : parseInt(e.target.value)
    const value = isNaN(val) ? 0 : val
    const valueConverted =
      unit === 'hours' && value > 23
        ? 23
        : (unit === 'minutes' || unit === 'seconds') && value > 60
        ? 59
        : value

    let tempTimes = structuredClone(times)
    unit === 'hours'
      ? (tempTimes[type].hours = valueConverted)
      : unit === 'minutes'
      ? (tempTimes[type].minutes = valueConverted)
      : (tempTimes[type].seconds = valueConverted)
    setTimes(tempTimes)
    localStorage.setItem(type, JSON.stringify(tempTimes[type]))
  }

  // IMPLEMENT
  // const handleStartDate = e => {
  //   const date = e.target.value
  //   setStartDate(date)
  //   localStorage.setItem('startDate', JSON.stringify(date))
  // }

  return (
    <div className="App">
      <a className="today-button" href="#today" onClick={setScrollMargin}>
        <img
          style={{ width: '18px', color: 'white' }}
          src={todayIcon}
          alt="today"
        />
      </a>
      <a className="strava-button" href="https://strava.app.link">
        <img style={{ width: '36px' }} src={stravaIcon} alt="strava" />
      </a>
      <div className="background-wrapper">
        <div className="wrapper">
          <div id="header" className="header">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span>Half Marathon Training Plan</span>
              <img
                style={{ width: '20px', marginLeft: '10px' }}
                src={runningIcon}
                alt="running"
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: 'calc(100% - 50px)',
                justifyContent: 'center',
                margin: '0 25px'
              }}
            >
              {distances.map((distance, index) => (
                <div
                  key={`${distance}-${index}-header`}
                  className="input-wrapper"
                >
                  <span>{defaultTimeLabels[distance]} Time: </span>
                  <input
                    className="time-input"
                    type="number"
                    value={times[distance].hours}
                    onChange={e => handleTime(e, distance, 'hours')}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                  />
                  <span>:</span>
                  <input
                    className="time-input"
                    type="number"
                    value={times[distance].minutes}
                    onChange={e => handleTime(e, distance, 'minutes')}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                  />
                  <span>:</span>
                  <input
                    className="time-input"
                    type="number"
                    value={times[distance].seconds}
                    onChange={e => handleTime(e, distance, 'seconds')}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                  />
                </div>
              ))}
            </div>
          </div>
          {plan.map(({ activities }, index) => {
            const firstActivity = activities[0]
            // destructure activity once utilizing swim bike etc
            const {
              units,
              distance,
              type,
              workouts = [],
              note = null
            } = firstActivity
            const workout = workouts[0]
            const timeTable = getTimeTableFromWorkout(times, workout, 'tenK')
            const isToday = checkToday(startDate, index)
            const [dayText, month, dayNumber] = dateToArr(startDate, index)
            return (
              <div
                id={isToday ? 'today' : index}
                key={index}
                className="day-wrapper"
                style={{
                  backgroundColor: type === 'off' ? '#EEEEEE' : 'unset',
                  color: type === 'off' ? '#6C757D' : 'unset',
                  scrollMarginTop: scrollMarginTop
                }}
              >
                <div
                  className={isToday ? 'date-today' : 'date'}
                  style={
                    isToday
                      ? {
                          backgroundColor:
                            runTypesAndStyles[type].style.dividerBackgroundColor
                        }
                      : {}
                  }
                >
                  <div style={{ fontSize: 'x-small', fontWeight: 'normal' }}>
                    {dayText}
                  </div>
                  <div style={{ lineHeight: '14px' }}>{month}</div>
                  <div style={{ fontSize: 'small' }}>{dayNumber}</div>
                </div>
                <div
                  className="divider"
                  style={{
                    backgroundColor:
                      runTypesAndStyles[type].style.dividerBackgroundColor
                  }}
                />
                <div className="detail">
                  <div
                    className="day-type"
                    style={{
                      color:
                        type === 'off'
                          ? '#6C757D'
                          : runTypesAndStyles[type].style.color,
                      backgroundColor:
                        runTypesAndStyles[type].style.backgroundColor,
                      fontSize: type === 'off' ? 'larger' : 'unset',
                      fontWeight: type === 'off' ? 'bold' : 'unset'
                    }}
                  >
                    {note}
                  </div>
                  {distance > 0 && (
                    <div className="miles">
                      {distance} {units}(s)
                    </div>
                  )}
                  {workout && (
                    <div className="workout-wrapper">
                      <div className="note">{workout.note}</div>
                      <div className="time">
                        @ {secondsToTime(timeTable[workout.distance])} time
                      </div>
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
