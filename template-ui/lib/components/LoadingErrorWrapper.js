import React, { Component, PropTypes } from 'react'

import Loading from './Loading'
import ErrorText from './ErrorText'

class LoadingErrorWrapper extends Component {
  render() {
    if(this.props.error) {
      return (
        <ErrorText error={this.props.error} />
      )
    }
    return (
      <Loading loading={this.props.loading}>
        { this.props.children }
      </Loading>
    )
  }
}

export default LoadingErrorWrapper