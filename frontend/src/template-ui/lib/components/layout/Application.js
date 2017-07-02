import React, { Component } from 'react'
import { Layout, NavDrawer, Sidebar, Panel } from 'react-toolbox/lib/layout'
import { AppBar } from 'react-toolbox/lib/app_bar'
import Checkbox from 'react-toolbox/lib/checkbox'

class LayoutExample extends Component {
  state = {
    bodyScrolled: true,
    sideNavActive: false,
    sideNavPinned: false,
    sideNavClipped: false,
    rightSideNavActive: false,
    rightSideNavPinned: false,
    rightSideNavClipped: false
  };

  handleToggle = param => {
    this.setState({ [param]: !this.state[param] });
  }

  render () {
    const { sideNavActive, rightSideNavActive } = this.state;
    return (
      <Layout>
        
        <NavDrawer
          active={this.state.sideNavActive}
          pinned={false}
          clipped={false}
          onOverlayClick={this.handleToggle.bind(this, 'sideNavActive')}
        >
          <p>I'm a NavDrawer content.</p>
        </NavDrawer>

        <AppBar
          fixed
          leftIcon='menu'
          onLeftIconClick={this.handleToggle.bind(this, 'sideNavActive')}
          title="Test"
        />

        <Panel bodyScroll={this.state.bodyScrolled}>
          <section style={{ margin: '1.8rem'}}>
            <h5 style={{ marginBottom: 20 }}>SideNav State</h5>
            <Checkbox
              label='Pinned'
              checked={this.state.sideNavPinned}
              onChange={this.handleToggle.bind(this, 'sideNavPinned')}
            />

            <Checkbox
              label='Clipped'
              checked={this.state.sideNavClipped}
              onChange={this.handleToggle.bind(this, 'sideNavClipped')}
            />

            <Checkbox
              label="Right SideNav Active"
              checked={this.state.rightSideNavActive}
              onChange={this.handleToggle.bind(this, 'rightSideNavActive')}
            />

            <Checkbox
              label="Right SideNav Pinned"
              checked={this.state.rightSideNavPinned}
              onChange={this.handleToggle.bind(this, 'rightSideNavPinned')}
            />

            <Checkbox
              label="Right SideNav Clipped"
              checked={this.state.rightSideNavClipped}
              onChange={this.handleToggle.bind(this, 'rightSideNavClipped')}
            />

            <Checkbox
              label="Body scrolled"
              checked={this.state.bodyScrolled}
              onChange={this.handleToggle.bind(this, 'bodyScrolled')}
            />
          </section>
        </Panel>

        <Sidebar
          active={rightSideNavActive}
          onOverlayClick={this.handleToggle.bind(this, 'rightSideNavActive')}
          clipped={this.state.rightSideNavClipped}
          pinned={this.state.rightSideNavPinned}
          width={11}
          right
        >
          <p>I'm a Sidebar content.</p>
        </Sidebar>
      </Layout>
    );
  }
}

export default LayoutExample

/*

  
        <NavDrawer
          active={sideNavActive}
          clipped={this.state.sideNavClipped}
          onOverlayClick={this.handleToggle.bind(this, 'sideNavActive')}
          permanentAt="md"
          pinned={this.state.sideNavPinned}
        >
          <p>I'm a NavDrawer content.</p>
        </NavDrawer>

  
*/