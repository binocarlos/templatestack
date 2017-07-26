import React, { Component, PropTypes } from 'react'

import Application from 'template-ui/lib/components/Application'
import ListMenu from 'template-ui/lib/components/ListMenu'
import IconMenu from 'template-ui/lib/components/IconMenu'

class ApplicationComponent extends Component {
  render() {
    if(!this.props.initialized) {
      return (
        <div>loading...</div>
      )
    }

    const mainMenu = (
      <ListMenu
        options={ this.props.menuOptions }
        onClick={ this.props.onMenuClick }
      />
    )

    const appbarMenu = (
      <IconMenu
        options={ this.props.menuOptions }
        onClick={ this.props.onOptionClick }
      />
    )

    const applicationProps = {
      ...this.props,
      menu: mainMenu,
      appbar: appbarMenu
    }

    return (
      <Application {...applicationProps} />
    )
  }
}

export default ApplicationComponent