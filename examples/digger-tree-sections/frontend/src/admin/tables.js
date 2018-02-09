import React, { Component, PropTypes } from 'react'
import GoogleUserChip from 'template-ui/lib/components/widgets/GoogleUserChip'
import IconBadge from 'template-ui/lib/components/widgets/IconBadge'
import ActiveInstallationFilter from 'template-ui/lib/plugins2/installation/containers/ActiveInstallationFilter'
import utils from './utils'

const user = {
  id: {
    getValue: (row, props) => row.username,
    getStyle: (row, props) => {
      return {
        width: '1px'
      }
    }
  },
  name: {
    getValue: (row, props) => {
      return (
        <GoogleUserChip
          user={ row }
        />
      )
    }
  }
}

const installation = {
  name: {},
  permission: {
    title: 'Permission',
    getValue: (row, props, index) => {
      return (
        <div>
          { row.collaboration_meta.permission }
        </div>
      )
    }
  },
  status: {
    title: 'Status',
    getValue: (row, props, index) => {
      return (
        <div>
          <ActiveInstallationFilter
            row={row}
          >
            <div>active</div>
          </ActiveInstallationFilter>
        </div>
      )
    }
  }
}

const tables = {
  user,
  installation,
}

export default tables