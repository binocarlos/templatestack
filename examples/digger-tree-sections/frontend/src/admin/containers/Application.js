import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import config from '../config'
import actions from '../actions'
import selectors from '../selectors'

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
    const user = selectors.auth.user(state)
    const username = selectors.auth.displayName(user)    
    const menuOptions = user ?
      config.menu.user(user) :
      config.menu.guest()
    const dropdownOptions = user ?
      config.dropdown.user(user) :
      config.dropdown.guest()
    const manualScroll = selectors.system.manualScroll(state)
    const menuOpen = selectors.system.menuOpen(state)
    const installation = selectors.auth.activeInstallation(state)
    return {
      title: installation ? installation.name : config.title,
      menuOpen,
      user,
      username,
      menuOptions,
      dropdownOptions,
      bodyScroll: manualScroll ? true : false,
      initialized: selectors.system.initialized(state),
      snackbar: selectors.system.message(state)
    }
  },
  (dispatch) => {
    return {
      toggleMenu: () => dispatch(actions.system.toggleMenu()),
      onMenuClick: (id) => {
        dispatch(actions.system.setMenu(false))
        dispatch(actions.router.redirect(id))
      },
      onOptionClick: (id) => {
        dispatch(actions.router.redirect(id))
      },
      clearSnackbar: () => {
        dispatch(actions.system.message(''))
      }
    }
  }
)(ApplicationContainer)