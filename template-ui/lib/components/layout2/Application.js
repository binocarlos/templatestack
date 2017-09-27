import React, { Component } from 'react'
import SnackBar from 'react-toolbox/lib/snackbar'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'
import { AppBar } from 'react-toolbox/lib/app_bar';

class Application extends Component {
  render () {
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
        <Panel bodyScroll={ this.props.bodyScroll }>
          { this.props.children }
        </Panel>       
        <SnackBar
          active={this.props.snackbar ? true : false}
          label={this.props.snackbar || ''}
          timeout={5000}
          onTimeout={() => this.props.clearSnackbar()}
        />
      </Layout>
    )
  }
}

export default Application