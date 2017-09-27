import React, { Component, PropTypes } from 'react'

class LongText extends Component {
  render() {

    let sts = []
    const count = this.props.count || 100
    for(let i=0; i<count; i++) {
      sts.push(`${i}: ${this.props.text}`)
    }
    return (
      <div>
        {
          sts.map((st, j) => {
            return (
              <div key={ j }>{st}</div>
            )
          })
        }
      </div>
    )
  }
}

export default LongText