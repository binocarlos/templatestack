import React, { Component } from 'react'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'
import { AppBar } from 'react-toolbox/lib/app_bar';

class Application extends Component {
  render () {
    return (
      <Layout>
        
        { this.props.menu ? (
            <NavDrawer
              active={ this.props.menuOpen }
              onOverlayClick={ this.props.toggleMenu }
            >
              { this.props.menu }
            </NavDrawer>
          ) : null
        }
        
        { this.props.appbar ? (
            <AppBar
              fixed
              rightIcon='more'
              leftIcon='menu'
              title="Super Layout with a large text to be covered!"
            />
          ) : null
        }

        <Panel>
          { this.props.children }
        </Panel>

        { this.props.sidebar ? (
            <Sidebar
              active={ this.props.sidebarOpen }
              onOverlayClick={ this.props.toggleSidebar }
              width={11}
              right
            >
              { this.props.sidebar }
            </Sidebar>
          ) : null
        }
        
      </Layout>
    );
  }
}

export default Application