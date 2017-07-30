import React, { Component } from 'react'
import theme from './theme/autoscroll.css'

export class AutoScroll extends Component {

  render () {
    return (
      <div className={ theme.container }>
        { this.props.children }
      </div>
    )
  }
}

export default AutoScroll