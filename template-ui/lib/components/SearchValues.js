import React, { Component, PropTypes } from 'react'
import Chip from 'react-toolbox/lib/chip'

class SearchValues extends Component {
  render() {
    return (
      <div style={{padding:'10px'}}>
        {
          (this.props.values || []).map((field, i) => {
            return (
              <Chip key={ i }>
                <span>{ field }</span>
              </Chip>
            )
          })
        }
      </div>
    )
  }
}

export default SearchValues