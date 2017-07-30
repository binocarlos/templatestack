import React, { Component } from 'react'
import theme from './theme/sidebar.css'

export class SideBar extends Component {

  render () {

    const width = this.props.width || '250px'
    const minWidth = width
    const maxWidth = width

    return (
      <div className={ theme.container }>
        <div className={ theme.sidebar } style={{ width, maxWidth, minWidth }}>
          { this.props.content }
        </div>
        <div className={ theme.content }>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default SideBar