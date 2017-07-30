import React, { Component } from 'react'
import theme from './theme/sidebar.css'

export class SideBar extends Component {

  render () {

    const width = this.props.width || '25%'
    const minWidth = this.props.minWidth || '250px'

    return (
      <div className={ theme.container }>
        <div className={ theme.col } style={{ width, minWidth }}>
          { this.props.content }
        </div>
        <div className={ theme.col }>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default SideBar