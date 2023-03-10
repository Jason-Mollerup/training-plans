import './styles/App.css'
import leftArrowIcon from './icons/arrow-left-solid.svg'
import todayIcon from './icons/today.svg'
import youtubeIcon from './icons/youtube.svg'
import stravaIcon from './icons/strava.svg'
import xMarkIcon from './icons/xmark-solid.svg'
import { Link } from 'react-router-dom'
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
  defaultTimeLabels,
  activityStyles
} from './lib/constants.js'

const Plan = ({ planName, planData, planDistances }) => {
  // CONSTANTS
  const plan = useMemo(() => structuredClone(planData), [planData])
  const distances = useMemo(() => planDistances || [], [planDistances])
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
  const initialStartDate = useMemo(() => {
    const date = localStorage.getItem(`startDate${planName}`)
    return date ? new Date(JSON.parse(date)) : new Date()
  }, [planName])

  const [startDate, setStartDate] = useState(initialStartDate)

  const displayDate = useMemo(
    () => startDate.toISOString().slice(0, 10),
    [startDate]
  )

  const handleDate = e => {
    const [year, month, day] = e.target.value.split('-')
    const date = new Date(year, month - 1, day)
    setStartDate(date)
    localStorage.setItem(`startDate${planName}`, JSON.stringify(date))
  }

  const [scrollMarginTop, setScrollMarginTop] = useState('146px')
  const [times, setTimes] = useState(initialTimes)

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

  const buildActivity = (activityObj, index) => {
    const {
      activity,
      units,
      distance,
      type,
      workouts = [],
      note = null
    } = activityObj

    const firstWorkout = workouts[0]
    let timeTable = null
    if (activity === 'run' && firstWorkout && firstWorkout.baseTable) {
      timeTable = getTimeTableFromWorkout(times, firstWorkout, 'tenK')
    }

    const dayTypeStyles = {
      color: type === 'off' ? '#6C757D' : activityStyles[type].style.color,
      backgroundColor: activityStyles[type].style.backgroundColor,
      fontSize: type === 'off' ? 'larger' : 'unset',
      fontWeight: type === 'off' ? 'bold' : 'unset'
    }

    return (
      <div key={`buildActivity${index}`} className="detail">
        {type !== 'off' && (
          <img
            className="workout-icon"
            src={activityDefaults[activity].icon}
            alt={`${activity}-icon`}
          />
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
          {workouts.map(({ note, distance, link }, workoutIndex) => {
            return (
              <div
                key={`activity${index}-workout${workoutIndex}`}
                className="workout-wrapper"
              >
                <div className="workout-note-and-link-wrapper">
                  {link && (
                    <img
                      className="workout-video-button"
                      onClick={() => {
                        setVideoLink(link)
                        setVideoModalState('modal-open')
                      }}
                      src={youtubeIcon}
                      alt="video"
                    />
                  )}
                  <div className="note">{note}</div>
                </div>
                {workoutIndex === 0 && activity === 'run' && timeTable && (
                  <div className="time">
                    @ {secondsToTime(timeTable[distance])} time
                  </div>
                )}
              </div>
            )
          })}
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

  const buildDay = (startDate, index, activities, note) => {
    const type = activities[0].type

    const isToday = checkToday(startDate, index)
    const [dayText, month, dayNumber] = dateToArr(startDate, index)

    const dayWrapperStyles = {
      backgroundColor: type === 'off' ? '#EEEEEE' : 'unset',
      color: type === 'off' ? '#6C757D' : 'unset',
      scrollMarginTop: scrollMarginTop
    }

    const dayInnerStyles = isToday
      ? {
          backgroundColor: activityStyles[type].style.dividerBackgroundColor
        }
      : {}

    const dividerStyles = {
      backgroundColor: activityStyles[type].style.dividerBackgroundColor
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
          {activities.map((activity, secondIndex) =>
            buildActivity(activity, `${index}-${secondIndex}`)
          )}
          {note && buildNote(note, index)}
        </div>
      </div>
    )
  }

  const [videoModalState, setVideoModalState] = useState('modal-closed')
  const [videoLink, setVideoLink] = useState(null)
  const createEmbeded = link => {
    try {
      return `https://www.youtube.com/embed/${link.split('watch?v=')[1]}`
    } catch (e) {
      return 'https://www.youtube.com'
    }
  }

  const buildVideoModal = () => {
    return (
      <div className={`modal-back ${videoModalState}`}>
        <div className="modal">
          <div className="modal-header youtube-modal-header">
            <div className="modal-header-text">Example Video</div>
            <img
              src={xMarkIcon}
              className="close-icon"
              alt="close"
              onClick={() => {
                const iframes = document.querySelectorAll('iframe')
                Array.prototype.forEach.call(iframes, iframe => {
                  iframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'stopVideo' }),
                    '*'
                  )
                })
                setVideoModalState('modal-closed')
              }}
            />
          </div>
          <iframe
            allowFullScreen
            className="youtube-video"
            title="example-video"
            src={createEmbeded(videoLink)}
          />
        </div>
      </div>
    )
  }

  const [modalState, setModalState] = useState('modal-closed')

  const buildModal = () => {
    return (
      <div className={`modal-back ${modalState}`}>
        <div className="modal">
          <div className="modal-header">
            <div className="modal-header-text">Update Plan Details</div>
            <img
              src={xMarkIcon}
              className="close-icon"
              alt="close"
              onClick={() => setModalState('modal-closed')}
            />
          </div>
          <div className="modal-items">
            <div className="modal-title modal-title--no-top">
              Plan Start Date
            </div>
            <div>
              <input
                className="date-input"
                type="date"
                onChange={handleDate}
                value={displayDate}
              />
            </div>
            {distances.length > 0 && (
              <div className="time-input-wrapper">
                <div className="modal-title">Best Times</div>
                <div className="modal-note">
                  Best times determine your workout pace at certain points
                  during the plan
                </div>
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
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {buildVideoModal()}
      {buildModal()}
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
            <div className="home-icon-wrapper">
              <Link to="/">
                <img className="home-icon" src={leftArrowIcon} alt="back" />
              </Link>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: 'calc(100% - 145px)'
              }}
            >
              {planName}
            </div>
            <div
              className="update-plan-button"
              onClick={() => setModalState('modal-open')}
            >
              Update Plan Details
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
