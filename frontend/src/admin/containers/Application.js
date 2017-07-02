import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Application from 'template-ui/lib/components/Application'
import ListMenu from 'template-ui/lib/components/ListMenu'
import IconMenu from 'template-ui/lib/components/IconMenu'

import config from '../config'
import * as actions from '../actions'

import {
  valueSelectors
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
        />
      ),
      appbar: (
        <IconMenu
          options={ menuOptions }
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