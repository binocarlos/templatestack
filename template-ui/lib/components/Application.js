import React, { Component } from 'react'
import SnackBar from 'react-toolbox/lib/snackbar'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'
import { AppBar } from 'react-toolbox/lib/app_bar';

import theme from './theme/appbar.css'

class Application extends Component {
  render () {
    const bodyScroll = typeof(this.props.autoScroll) == 'boolean' ?
      !this.props.autoScroll :
      false

    const useStyle = this.props.fitPage ?
      {
        maxHeight: 'calc(100% - 64px)', 
        height: 'calc(100% - 64px)'
      }
      :
      {}

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
          <div>
            {
              this.props.user ? (
                <div className={ theme.userInfo }>
                  user
                </div>
              ) : null
            }
            <div className={ theme.rightMenu }>
              { this.props.appbar }
            </div>
          </div>
        </AppBar>
        <Panel bodyScroll={ bodyScroll } style={ useStyle }>
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