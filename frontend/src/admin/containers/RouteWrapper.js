import React, { Component, PropTypes } from 'react'
import Route from 'template-ui/lib/containers/Route'
import { getRoute } from '../config'

class RouteWrapper extends Component {
  render() {
    const props = {
      ...this.props,
      path: getRoute(this.props.path)
    }
    return (
      <Route {...props} />
    )
  }
}

export default RouteWrapper