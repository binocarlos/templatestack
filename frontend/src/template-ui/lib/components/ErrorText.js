import React, { Component, PropTypes } from 'react'
import errorTheme from './theme/errorText.css'

class ErrorText extends Component {
  render() {
    return this.props.error ? (
      <div className={ errorTheme.errorText }>
        { this.props.error }
      </div>
    ) : null
  }
}

export default ErrorText