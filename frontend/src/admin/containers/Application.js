import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Application from 'template-ui/lib/components/Application'
import ListMenu from 'template-ui/lib/components/ListMenu'
import IconMenu from 'template-ui/lib/components/IconMenu'

import config from '../config'
import * as actions from '../actions'

import {
  valueSelector
} from '../selectors'

class ApplicationContainer extends Component {
  render() {

    const menuOptions = this.props.user ?
      config.menu.user :
      config.menu.guest

    const applicationProps = {
      ...this.props,
      menu: (
        <ListMenu
          options={ menuOptions }
          onClick={ this.props.onMenuClick }
        />
      ),
      appbar: (
        <IconMenu
          options={ menuOptions }
          onClick={ this.props.onOptionClick }
        />
      )
    }
    return (
      <Application {...applicationProps} />
    )
  }
}

export default connect(
  (state, ownProps) => {
    return {
      title: config.title,
      menuOpen: valueSelector(state, 'menuOpen'),
      user: valueSelector(state, 'user')
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