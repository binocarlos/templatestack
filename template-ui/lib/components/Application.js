import React, { Component } from 'react'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'
import { AppBar } from 'react-toolbox/lib/app_bar';

class Application extends Component {
  render () {
    const bodyScroll = typeof(this.props.autoScroll) == 'boolean' ?
      !this.props.autoScroll :
      false
    return (
      <Layout>
        <NavDrawer
          active={ this.props.menuOpen }
          onOverlayClick={ this.props.toggleMenu }
          clipped={ false }
          pinned={ false }
        >
          { this.props.menu }
        </NavDrawer>
        <AppBar
          fixed
          leftIcon={ this.props.menu ? (this.props.leftIcon || 'menu') : null }
          onLeftIconClick={ this.props.toggleMenu }
          title={ this.props.title }
        >
          { this.props.appbar }
        </AppBar>
        <Panel bodyScroll={ bodyScroll }>
          { this.props.children }
        </Panel>        
      </Layout>
    )
  }
}

export default Application