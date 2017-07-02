import React, { Component, PropTypes } from 'react'
import Route from 'template-ui/lib/containers/Route'
import config from '../config'

class RouteWrapper extends Component {
  render() {
    const props = {
      ...this.props,
      basepath: config.basepath
    }
    return (
      <Route {...props} />
    )
  }
}

export default RouteWrapper