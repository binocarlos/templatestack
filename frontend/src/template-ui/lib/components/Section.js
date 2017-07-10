import React, { Component } from 'react'

const DEFAULT_MARGIN = 1.8

const getMargin = (scale = 1) => scale * DEFAULT_MARGIN

class Section extends Component {
  render () {
    return (
      <section style={{ margin: `${getMargin(this.props.margin)}rem` }}>
        { this.props.children }
      </section>
    )
  }
}

export default Section