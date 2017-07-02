import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'

import {
  valueSelectors
} from '../selectors'

import Application from 'template-ui/lib/components/layout/Application'
import AppBar from '../components/layout/AppBar'
import GuestMenu from '../components/layout/GuestMenu'
import UserMenu from '../components/layout/UserMenu'

class ApplicationContainer extends Component {
  render() {

    const appbar = (
      <AppBar 
        toggleMenu={ this.props.toggleMenu }
      />
    )

    const menu = this.props.user ?
      (
        <UserMenu
          onClick={ this.props.onMenuClick }
        />
      ) :
      (
        <GuestMenu
          onClick={ this.props.onMenuClick }
        />
      )

    console.log('-------------------------------------------');
    console.dir(this.props)

    return (
      <Application
        menu={ menu }
        appbar={ appbar }
        menuOpen={ this.props.menuOpen }
        toggleMenu={ this.props.toggleMenu }
      >
        { this.props.children }
      </Application>
    )
    
  }
}

export default connect(
  (state, ownProps) => {
    console.log('-------------------------------------------');
    console.log(valueSelectors.menuOpen(state))
    return {
      menuOpen: valueSelectors.menuOpen(state),
      user: valueSelectors.user(state)
    }
  },
  (dispatch) => {
    return {
      toggleMenu: () => dispatch(actions.value.toggle('menuOpen')),
      onMenuClick: (id) => dispatch(actions.application.menuClick(id))
    }
  }
)(ApplicationContainer)