import React, { Component } from 'react'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'
import { AppBar } from 'react-toolbox/lib/app_bar';

class Application extends Component {
  render () {
    return (
      <Layout>
        <NavDrawer
          active={ false }
          clipped={ false }
          pinned={ false }
        >
          <p>I'm a NavDrawer content.</p>
        </NavDrawer>

        <AppBar
          fixed
          rightIcon='more'
          leftIcon='menu'
          title="Super Layout with a large text to be covered!"
        />

        <Panel>
          <section style={{ margin: '1.8rem'}}>
            Hello World
          </section>
        </Panel>

      </Layout>
    );
  }
}

export default Application
