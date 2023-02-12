import { Link } from 'react-router-dom'
import plans from './plans/index.js'
import { activityDefaults } from './lib/constants.js'

const Home = () => {
  return (
    <div className="background-wrapper">
      <div className="wrapper home-wrapper">
        <div className="header home-title">Training Plans</div>
        <div className="home-plans-wrapper">
          {plans.map(({ name, path, duration, activities }, index) => {
            const { planColor } = activityDefaults[activities[0]]
            return (
              <Link
                className={`home-plan ${planColor}-border-left`}
                key={'planName' + index}
                to={path}
                component={'div'}
              >
                <div className="home-plan__name">{name}</div>
                <div className="home-plan-detail">
                  <div className="home-plan-activities-wrapper">
                    {activities.map((activity, activityIndex) => {
                      const { planColor: activityColor } =
                        activityDefaults[activity]
                      return (
                        <div
                          className={`home-plan-activity ${activityColor}-background-color`}
                          key={`pathActivity${activityIndex}`}
                        >
                          {activity}
                        </div>
                      )
                    })}
                  </div>
                  <div className="home-plan__duration">
                    Duration - {duration}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home
