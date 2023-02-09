import halfMarathonPlan from './halfMPlan.json'
import fullMarathonNovicePlan from './fullMNovicePlan.json'

const plans = [
  {
    name: 'Half Marathon Plan',
    path: 'half-marathon-plan',
    duration: '12 weeks',
    activities: ['run'],
    data: halfMarathonPlan
  },
  {
    name: 'Marathon Plan - Novice',
    path: 'marathon-plan-novice',
    duration: '18 weeks',
    activities: ['run'],
    data: fullMarathonNovicePlan
  }
]
export default plans
