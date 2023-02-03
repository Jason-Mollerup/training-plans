import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.js'
import Plan from './Plan.js'
import plans from './plans/index.js'

function App() {
  return (
      <BrowserRouter>
        <Routes>
        <Route key="home" path="/" element={<Home/>}/>
        <Route key="home" path="/home" element={<Home/>}/>
        {plans.map((plan, index) => {
          return (
            <Route
              key={plan.path}
              path={plan.path}
              element={<Plan key={`plan${index}`} planData={plan.data}/>}
            />
          )
        })}
        </Routes>
      </BrowserRouter>
  )
}

export default App
