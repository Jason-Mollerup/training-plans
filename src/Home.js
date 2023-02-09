import { Link } from 'react-router-dom'
import plans from './plans/index.js'

const Home = () => {
  return (
    <div className="background-wrapper">
      <div className="wrapper home-wrapper">
        <div className="header home-title">Training Plans</div>
        <div className="home-plans-wrapper">
          {plans.map(({ name, path, duration, activities }, index) => (
            <Link
              className="home-plan"
              key={'planName' + index}
              to={path}
              component={'div'}
            >
              <div className="home-plan__name">{name}</div>
              <div>
                <div>
                  {activities.map((activity, activityIndex) => (
                    <div
                      className="home-plan__activities"
                      key={`pathActivity${activityIndex}`}
                    >
                      Focus - {activity}
                    </div>
                  ))}
                </div>
                <div className="home-plan__duration">Duration - {duration}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
