import React, { Component, PropTypes } from 'react'

import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout'

const STYLES = {
  panel: {
    height: 'calc(100% - 128px)',
    maxHeight: 'calc(100% - 128px)',
    top: '64px',
    left: '0px'
  }
}

class ToolbarLayout extends Component {
  render() {
    return (
      <Layout>
        {this.props.toolbar}
        <Panel bodyScroll={false} style={ STYLES.panel }>
          <div ref={ this.props.scrollRef }>
            { this.props.children }
          </div>
        </Panel>
      </Layout>
    )
  }
}

export default ToolbarLayout