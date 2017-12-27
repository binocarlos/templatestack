import React, { Component, PropTypes } from 'react'
import Dropdown from 'react-toolbox/lib/dropdown'

const PERMISSIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

class PermissionDropdown extends Component {

  render() {
    return (
      <Dropdown
        auto
        source={PERMISSIONS}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    )
  }
}

export default PermissionDropdown