import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Route extends Component {
  render() {
    return this.props.visible ? this.props.children : null
  }
}

const RouteFactory = (basepath) => {
  return connect(
    (state, ownProps) => {
      
      const ownPath = ownProps.path || ''
      const ownRoute = ownProps.route || ''
      const exact = ownProps.exact || false

      basepath = (basepath || '').replace(/\/^/, '')
      const routerRoute = (state.router.route || '').replace(/\/^/, '')
      const routerPath = (state.router.pathname || '').replace(/\/^/, '')

      let visible = false

      if(ownPath) {
        visible = exact ?
          routerPath == basepath + ownPath :
          routerPath.indexOf(basepath + ownPath) == 0
      }
      else if(ownRoute) {
        visible = exact ?
          routerRoute == basepath + ownRoute :
          routerRoute.indexOf(basepath + ownRoute) == 0
      }

      if(ownProps.home) {
        visible = routerPath == basepath || routerPath == basepath + '/'
      }

      return {
        visible
      }
    },
    (dispatch) => {
      return {}
    }
  )(Route)
}

export default RouteFactory