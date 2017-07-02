import React, { Component } from 'react'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'

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
        
        { this.props.appbar }

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