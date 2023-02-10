import halfMarathonPlan from './halfMPlan.json'
import fullMarathonNovicePlan from './fullMNovicePlan.json'

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
    activities: ['run'],
    data: fullMarathonNovicePlan,
    distances: null
  }
]
export default plans
