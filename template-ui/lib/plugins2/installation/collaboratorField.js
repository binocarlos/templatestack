import React, { Component, PropTypes } from 'react'
import models from '../form/models'
import fields from '../form/fields'
import utils from '../form/utils'
import validators from 'template-tools/src/utils/validators'

import CurrentUserFilter from '../../containers/collaborator/CurrentUserFilter'
import PermissionDropdown from '../../containers/collaborator/PermissionDropdown'

const CollaboratorField = (opts = {}) => {

  const { api, icons, selectors } = opts

  const collaborationTable = {
    user: {
      getValue: (row, props) => selectors.displayName(row)
    },
    collaboration_permission: {
      title: 'Permission',
      getValue: (row, props, index) => {
        return (
          <PermissionDropdown
            onChange={ (val) => props.onItemUpdate(index, 'collaboration_permission', val) }
            row={row}
            value={row.collaboration_permission}
          />
        )
      }
    }
  }

  const field = {
    title: 'Collaborators',
    itemTitle: 'Collaborator',
    component: fields.list,
    showHead: true,
    table: collaborationTable,
    itemWindowMode: 'search',
    icon: icons.users,
    api,
    hideTableEdit: true,
    wrapRowButtons: (item, buttons) => {
      return (
        <CurrentUserFilter
          row={item}
        >
          { buttons }
        </CurrentUserFilter>
      )
    },
    processNewItem: (item) => {
      return Object.assign({}, item, {
        collaboration_permission: 'editor'
      })
    },
    filterNewItem: (item, currentData) => {
      const exists = currentData.filter(i => i.id == item.id).length > 0
      if(exists) return 'that user is aleady added'
      return null
    },
    getItemTitle: (item) => selectors.displayName(item),
  }
  
  return field
}

export default CollaboratorField