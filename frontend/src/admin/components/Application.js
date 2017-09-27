import React, { Component, PropTypes } from 'react'

import Application from 'template-ui/lib/components/layout2/Application'
import IconText from 'template-ui/lib/components/IconText'
import ListMenu from 'template-ui/lib/components/ListMenu'
import IconMenu from 'template-ui/lib/components/IconMenu'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'
import apptheme from './theme/application.css'

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
      <div className={ horizontal.center }>
        <IconText
          icon='person'
          text={ this.props.username }
        />
        <IconMenu
          options={ this.props.menuOptions }
          onClick={ this.props.onOptionClick }
        />
      </div>
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