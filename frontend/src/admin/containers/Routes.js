import React from 'react'
import Route from './RouteWrapper'

const Routes = (
  <div id='routeWrapper'>

    <Route home>
      <div>
        Home page
      </div>
    </Route>

    <Route path='/help'>
      <div>
        Help
      </div>
    </Route>

  </div>
)

export default Routes