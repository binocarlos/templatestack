import React, { Component } from 'react'
import theme from './theme/topbar.css'

export class TopBar extends Component {

  render () {
    const height = this.props.height || '264px'
    const minHeight = height
    const maxHeight = height

    return (
      <div className={ theme.container }>
        <div className={ theme.topbar } style={{ flex: `0 1 ${height}`, height, minHeight, maxHeight }}>
          { this.props.content }
        </div>
        <div className={ theme.content }>
          <div>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}

export default TopBar