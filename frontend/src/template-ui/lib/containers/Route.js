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
      const exact = ownProps.exact || false

      basepath = (basepath || '').replace(/\/^/, '')
      const routerPath = (state.router.pathname || '').replace(/\/^/, '')

      let visible = false

      if(ownProps.path) {
        visible = exact ?
          routerPath == basepath + ownPath :
          routerPath.indexOf(basepath + ownPath) == 0
      }

      if(ownProps.home) {
        visible = routerPath == basepath
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