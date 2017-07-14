import React, { Component, PropTypes } from 'react'

class Loading extends Component {
  render() {
    return (
      <div>
        {
          this.props.loading ? 
            'loading...' :
            this.props.children
        }
      </div>
    )
  }
}

export default Loading