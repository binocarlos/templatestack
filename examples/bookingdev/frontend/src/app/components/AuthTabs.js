import React, { Component, PropTypes } from 'react'

import {Tab, Tabs} from 'react-toolbox'

import LoginForm from '../containers/LoginForm'
import RegisterForm from '../containers/RegisterForm'

class AuthTabs extends Component {
  render() {

    return (
      
      <Tabs index={this.props.index} onChange={this.props.onTabChange}>
        <Tab label='Login'><LoginForm /></Tab>
        <Tab label='Register'><RegisterForm /></Tab>
      </Tabs>
        
      
    )
  }
}

export default AuthTabs