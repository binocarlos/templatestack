import React, { Component, PropTypes } from 'react'
import AppBar from 'react-toolbox/lib/app_bar'

import theme from './theme/toolbar.css'
import horizontal from './theme/horizontal.css'

class Toolbar extends Component {
  render() {
    const props = {
      ...this.props,
      flat: true,
      theme
    }

    if(props.leftContent) {
      if(props.title) {
        const newTitle = (
          <div className={ horizontal.left }>
            <b className={ theme.injectedTitle}>{ props.title }</b>
            { props.leftContent }
          </div>
        )
        props.title = newTitle
        delete(props.leftContent)
      }
      else {
        props.title = props.leftContent
        delete(props.leftContent)
      }
    }

    if(props.rightContent) {
      delete(props.rightContent)
      props.children = props.rightContent
    }

    return (
      <AppBar {...props} />
    )
  }
}

export default Toolbar