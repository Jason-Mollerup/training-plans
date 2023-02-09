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

const Plan = ({ planName, planData }) => {
  // CONSTANTS
  const plan = useMemo(() => structuredClone(planData), [])
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

  const buildCross = (activity, index) => {}
  const buildSwim = (activity, index) => {}
  const buildBike = (activity, index) => {}

  const buildRun = (activity, index) => {
    const { units, distance, type, workouts = [], note = null } = activity
    const workout = workouts[0]
    const timeTable = getTimeTableFromWorkout(times, workout, 'tenK')

    const dayTypeStyles = {
      color: type === 'off' ? '#6C757D' : runTypesAndStyles[type].style.color,
      backgroundColor: runTypesAndStyles[type].style.backgroundColor,
      fontSize: type === 'off' ? 'larger' : 'unset',
      fontWeight: type === 'off' ? 'bold' : 'unset'
    }

    return (
      <div key={`buildActivity${index}`} className="detail">
        {type !== 'off' && (
          <img className="workout-icon" src={runningIcon} alt="run-icon" />
        )}
        <div className="activity-inner-wrapper">
          <div className="day-type" style={dayTypeStyles}>
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
  }

  const buildNote = (note, index) => {
    return (
      <div key={`buildNote${index}`} className="detail">
        <div className="activity-inner-wrapper">{note}</div>
      </div>
    )
  }

  const determineAndBuild = (activity, index) => {
    switch (activity.activity) {
      case 'cross':
        return buildCross(activity, index)
      case 'swim':
        return buildSwim(activity, index)
      case 'bike':
        return buildBike(activity, index)
      case 'run':
        return buildRun(activity, index)
      default:
        return null
    }
  }

  const buildDay = (startDate, index, activities, note) => {
    const type = activities[0].type

    if (!runTypesAndStyles[type]) console.log(activities)

    const isToday = checkToday(startDate, index)
    const [dayText, month, dayNumber] = dateToArr(startDate, index)

    const dayWrapperStyles = {
      backgroundColor: type === 'off' ? '#EEEEEE' : 'unset',
      color: type === 'off' ? '#6C757D' : 'unset',
      scrollMarginTop: scrollMarginTop
    }

    const dayInnerStyles = isToday
      ? {
          backgroundColor: runTypesAndStyles[type].style.dividerBackgroundColor
        }
      : {}

    const dividerStyles = {
      backgroundColor: runTypesAndStyles[type].style.dividerBackgroundColor
    }

    return (
      <div
        id={isToday ? 'today' : index}
        key={`buildDay${index}`}
        className="day-wrapper"
        style={dayWrapperStyles}
      >
        <div className={isToday ? 'date-today' : 'date'} style={dayInnerStyles}>
          <div style={{ fontSize: 'x-small', fontWeight: 'normal' }}>
            {dayText}
          </div>
          <div style={{ lineHeight: '14px' }}>{month}</div>
          <div style={{ fontSize: 'small' }}>{dayNumber}</div>
        </div>
        <div className="divider" style={dividerStyles} />
        <div className="activity-wrapper">
          {activities.map(activity => determineAndBuild(activity, index))}
          {note && buildNote(note, index)}
        </div>
      </div>
    )
  }

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
              {planName}
            </div>
            <div className="time-input-wrapper">
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
          {plan.map(({ activities, note }, index) =>
            buildDay(startDate, index, activities, note)
          )}
        </div>
      </div>
    </div>
  )
}

export default Plan
