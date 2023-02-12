import halfMarathonPlan from './halfMPlan.json'
import fullMarathonNovicePlan from './fullMNovicePlan.json'
import fullMarathonIntermediatePlan from './fullMIntermediatePlan.json'
import fullMarathonAdvancedPlan from './fullMAdvancedPlan.json'
import sprintBeginner from './sprintTriathalonBeginner.json'
import pullupsBeginner from './pullupsBeginner.json'

const plans = [
  {
    name: 'Half Marathon',
    path: 'half-marathon',
    duration: '12 weeks',
    activities: ['run'],
    data: halfMarathonPlan,
    distances: ['fiveK', 'tenK']
  },
  {
    name: 'Marathon (Novice)',
    path: 'marathon-novice',
    duration: '18 weeks',
    activities: ['run', 'cross'],
    data: fullMarathonNovicePlan,
    distances: null
  },
  {
    name: 'Marathon (Intermediate)',
    path: 'marathon-intermediate',
    duration: '18 weeks',
    activities: ['run', 'cross'],
    data: fullMarathonIntermediatePlan,
    distances: null
  },
  {
    name: 'Marathon (Advanced)',
    path: 'marathon-advanced',
    duration: '18 weeks',
    activities: ['run'],
    data: fullMarathonAdvancedPlan,
    distances: ['tenK', 'halfM']
  },
  {
    name: 'Sprint Triathalon (Beginner)',
    path: 'sprint-triathalon-beginner',
    duration: '12 weeks',
    activities: ['swim', 'bike', 'run'],
    data: sprintBeginner,
    distances: null
  },
  {
    name: 'Pullups (Beginner)',
    path: 'pullups-beginner',
    duration: '5 day blocks',
    activities: ['strength'],
    data: pullupsBeginner,
    distances: null
  }
]
export default plans
