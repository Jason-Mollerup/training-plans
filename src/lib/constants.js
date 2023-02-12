import swimIcon from '../icons/person-swimming-solid.svg'
import bikeIcon from '../icons/person-biking-solid.svg'
import runIcon from '../icons/person-running-solid.svg'
import crossIcon from '../icons/dumbbell-solid.svg'

export const activityDefaults = {
  cross: {
    planColor: 'orange',
    icon: crossIcon
  },
  swim: {
    planColor: 'blue',
    icon: swimIcon
  },
  bike: {
    planColor: 'violet',
    icon: bikeIcon
  },
  run: {
    planColor: 'green',
    icon: runIcon
  }
}

export const activityStyles = {
  regular: {
    style: {
      dividerBackgroundColor: '#6C757D',
      backgroundColor: '#6C757D',
      color: 'white'
    }
  },
  workout: {
    style: {
      dividerBackgroundColor: '#E9C46A',
      backgroundColor: '#E9C46A',
      color: 'white'
    }
  },
  sprints: {
    style: {
      dividerBackgroundColor: '#E76F51',
      backgroundColor: '#E76F51',
      color: 'white'
    }
  },
  strides: {
    style: {
      dividerBackgroundColor: '#2A9D8F',
      backgroundColor: '#2A9D8F',
      color: 'white'
    }
  },
  race: {
    style: {
      dividerBackgroundColor: '#264653',
      backgroundColor: '#264653',
      color: 'white'
    }
  },
  off: {
    style: {
      dividerBackgroundColor: '#6C757D',
      backgroundColor: 'transparent',
      color: 'black'
    }
  }
}

export const defaultTimes = {
  fiveK: {
    hours: '00',
    minutes: '30',
    seconds: '00'
  },
  tenK: {
    hours: '01',
    minutes: '05',
    seconds: '00'
  },
  halfM: {
    hours: '02',
    minutes: '15',
    seconds: '00'
  },
  fullM: {
    hours: '04',
    minutes: '45',
    seconds: '00'
  }
}

export const defaultTimeLabels = {
  fiveK: '5K',
  tenK: '10K',
  halfM: 'Half Marathon',
  fullM: 'Marathon'
}
