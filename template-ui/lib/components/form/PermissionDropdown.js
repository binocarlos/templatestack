import React, { Component, PropTypes } from 'react'
import Dropdown from 'react-toolbox/lib/dropdown'

import theme from './utils.css'

const PERMISSIONS = [
  { value: 'owner', label: 'owner' },
  { value: 'editor', label: 'editor' },
  { value: 'viewer', label: 'viewer' },
]

class PermissionDropdown extends Component {

  render() {
    if(this.props.readOnly) {
      return (
        <div>{this.props.value}</div>
      )
    }
    else {
      return (
        <Dropdown
          auto
          source={PERMISSIONS}
          onChange={this.props.onChange}
          value={this.props.value}
          theme={{
            dropdown: theme.thinDropdown
          }}
        />
      )
    }
  }
}

export default PermissionDropdown