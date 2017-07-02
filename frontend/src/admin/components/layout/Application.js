import React, { Component } from 'react'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'
import AppBar from 'react-toolbox/lib/app_bar'

import GuestMenu from './GuestMenu'
import UserMenu from './UserMenu'

class Application extends Component {
  render () {

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

    return (
      <Layout>
        <NavDrawer
          active={ this.props.menuOpen }
          onOverlayClick={ this.props.toggleMenu }
          clipped={ false }
          pinned={ false }
        >
          { menu }
        </NavDrawer>
        <AppBar
          fixed
          leftIcon='menu'
          onLeftIconClick={ this.props.toggleMenu }
          title={ this.props.title }
        />
        <Panel>
          { this.props.children }
        </Panel>        
      </Layout>
    )
  }
}

export default Application