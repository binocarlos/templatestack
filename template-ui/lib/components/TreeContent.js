import React, { Component, PropTypes } from 'react'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'

import theme from './theme/treecontent.css'

class TreeContent extends Component {
  render() {
    return (
      <Layout>
        <NavDrawer
          active={ true }
          clipped={ true }
          pinned={ true }
        >
          {this.props.menu}
        </NavDrawer>
        <Panel bodyScroll={ false } className={ theme.panel }>
          {this.props.children}
        </Panel>
      </Layout>
    )
  }
}

export default TreeContent