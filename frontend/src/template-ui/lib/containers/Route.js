import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Route extends Component {
  render() {
    return this.props.visible ? this.props.children : null
  }
}

export default connect(
  (state, ownProps) => {
    
    const ownPath = ownProps.path || ''
    const exact = ownProps.exact || false

    const basePath = (ownProps.basepath || '').replace(/\/^/, '')
    const routerPath = (state.router.pathname || '').replace(/\/^/, '')

    let visible = false

    if(ownProps.path) {
      visible = exact ?
        routerPath == basePath + ownPath :
        routerPath.indexOf(basePath + ownPath) == 0
    }

    if(ownProps.home) {
      visible = routerPath == basePath
    }

    return {
      visible
    }
  },
  (dispatch) => {
    return {}
  }
)(Route)