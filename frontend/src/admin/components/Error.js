import React, { Component, PropTypes } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'

class Error extends Component {
  render() {
    return this.props.error ? (
      <div style={{color:'red'}}>
        { this.props.error }
      </div>
    )
  }
}

export default Error