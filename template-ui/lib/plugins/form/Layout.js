import React, { Component, PropTypes } from 'react'

class FormLayout extends Component {
  render() {
    const fields = this.props.fields || {}
    return (
      <div>
        {
          Object.keys(fields).map(name => fields[name])
        }
      </div>
    )
  }
}

export default FormLayout