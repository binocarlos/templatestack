import React, { Component, PropTypes } from 'react'
import AppBar from 'react-toolbox/lib/app_bar'

import theme from './theme/toolbar.css'
import horizontal from './theme/horizontal.css'

class Toolbar extends Component {
  render() {
    const useTheme = Object.assign({}, theme)
    if(this.props.clearBackground) {
      useTheme.appBar = theme.appBarClear
    }
    const props = {
      ...this.props,
      flat: true,
      theme: useTheme
    }

    if(props.leftContent) {
      if(props.title) {
        const newTitle = (
          <div className={ horizontal.left }>
            <span className={ theme.injectedTitle}>
              {
                this.props.small ? this.props.title : (
                  <b className={ theme.boldTitle}>{ this.props.title }</b>
                )
              }
            </span>
            
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
      props.children = props.rightContent
      delete(props.rightContent)
    }

    return (
      <AppBar {...props} />
    )
  }
}

export default Toolbar