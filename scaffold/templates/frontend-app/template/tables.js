import React, { Component, PropTypes } from 'react'
import GoogleUserChip from 'template-ui/lib/components/widgets/GoogleUserChip'
import selectors from './selectors'
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
      //selectors.user.displayName(row)
    }
  }
}


const tables = {
  user,
}

export default tables