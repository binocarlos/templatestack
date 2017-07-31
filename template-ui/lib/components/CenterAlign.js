import React, { Component, PropTypes } from 'react'

class CenterAlign extends Component {
  render() {
    const maxWidth = this.props.maxWidth || '1024px'
    return (
      <div style={{ width: '100%', maxWidth, margin: 'auto', textAlign: 'center' }}>
        { this.props.children }
      </div>
    )
  }
}

export default CenterAlign