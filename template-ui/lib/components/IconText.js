import React, { Component } from 'react'

import FontIcon from 'react-toolbox/lib/font_icon'

import theme from './theme/horizontal.css'

export class IconText extends Component {

  render () {
    return (
      <div className={ theme.center }>
        <FontIcon value={ this.props.icon } />
        <span>{ this.props.text }</span>
      </div>
    )
  }
}

export default IconText