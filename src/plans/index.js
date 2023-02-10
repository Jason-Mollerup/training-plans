import halfMarathonPlan from './halfMPlan.json'
import fullMarathonNovicePlan from './fullMNovicePlan.json'
import fullMarathonIntermediatePlan from './fullMIntermediatePlan.json'
import fullMarathonAdvancedPlan from './fullMAdvancedPlan.json'

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
  }
]
export default plans
