// https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
export const secondsToTime = seconds => {
  return seconds > 36000
    ? new Date(seconds * 1000).toISOString().substring(11, 19)
    : seconds > 3600
    ? new Date(seconds * 1000).toISOString().substring(12, 19)
    : seconds > 600
    ? new Date(seconds * 1000).toISOString().substring(14, 19)
    : new Date(seconds * 1000).toISOString().substring(15, 19)
}

export const timeObjToSeconds = obj => {
  const hours = isNaN(parseInt(obj.hours)) ? 0 : parseInt(obj.hours)
  const minutes = isNaN(parseInt(obj.minutes)) ? 0 : parseInt(obj.minutes)
  const seconds = isNaN(parseInt(obj.seconds)) ? 0 : parseInt(obj.seconds)
  return hours * 3600 + minutes * 60 + seconds
}

export const dateToArr = (date, days) => {
  const startDate = new Date(date)
  const newDate = new Date(startDate.setDate(startDate.getDate() + days))
  return newDate.toString().split(' ').slice(0, 3)
}

export const checkToday = (date, days) => {
  const startDate = new Date(date)
  const newDate = new Date(startDate.setDate(startDate.getDate() + days))
  const today = new Date()
  return (
    newDate.getFullYear() === today.getFullYear() &&
    newDate.getMonth() === today.getMonth() &&
    newDate.getDate() === today.getDate()
  )
}

export const addLeadingZeros = obj => {
  let newObj = {}
  for (let key in obj) {
    const hours = isNaN(parseInt(obj[key].hours)) ? 0 : parseInt(obj[key].hours)
    const minutes = isNaN(parseInt(obj[key].minutes))
      ? 0
      : parseInt(obj[key].minutes)
    const seconds = isNaN(parseInt(obj[key].seconds))
      ? 0
      : parseInt(obj[key].seconds)
    newObj[key] = {
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds
    }
  }
  return newObj
}
