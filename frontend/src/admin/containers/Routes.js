import React, { Component, PropTypes } from 'react'
import Route from './RouteWrapper'

const Routes = (
  <div id='routeWrapper'>
    hello world
  </div>
)

class RouteWrapper extends Component {
  render() {
    return Routes
  }
}

export default RouteWrapper

/*

  
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

  
*/