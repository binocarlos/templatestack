import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import config from '../config'
import * as actions from '../actions'

import {
  valueSelector,
  router
} from '../selectors'

import Application from '../components/Application'

class ApplicationContainer extends Component {
  render() {
    return (
      <Application {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => {
    const user = valueSelector(state, 'user')
    const menuOptions = user ?
      config.menu.user :
      config.menu.guest
    const autoScroll = router.firstValue(state, 'autoScroll')
    return {
      title: config.title,
      menuOpen: valueSelector(state, 'menuOpen'),
      user: valueSelector(state, 'user'),
      menuOptions,
      autoScroll: autoScroll,
      initialized: valueSelector(state, 'initialized')
    }
  },
  (dispatch) => {
    return {
      toggleMenu: () => dispatch(actions.value.toggle('menuOpen')),
      onMenuClick: (id) => {
        dispatch(actions.value.set('menuOpen', false))
        dispatch(actions.router.redirect(id))
      },
      onOptionClick: (id) => {
        dispatch(actions.router.redirect(id))
      }
    }
  }
)(ApplicationContainer)