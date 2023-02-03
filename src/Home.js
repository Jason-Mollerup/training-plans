import { Link } from 'react-router-dom'
import plans from './plans/index.js'

const Home = () => {
  return (
    <div>
      <div>Plans</div>
      <br/>
      {plans.map(({ name, path }, index) =>
        <Link key={'planName' + index} to={path}> {name}</Link>
      )}
    </div>
  )
}

export default Home