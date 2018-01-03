import React, { Component, PropTypes } from 'react'
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list'

import theme from './theme/tree'

class ListTree extends Component {

  getIcon(item) {
    if(this.props.getIcon) return this.props.getIcon(item)
    const meta = item.meta || {}
    if(meta.icon) return meta.icon
    return 'folder'
  }

  getItem(item, index, depth) {
    return (
      <ListItem
        key={ index }
        className={ theme['depth' + depth]}
        caption={ item.name }
        leftIcon={ this.getIcon(item) }
        onClick={ item => this.props.onClick(item) }
        theme={{
          itemAction: theme.itemAction
        }}
      />
    )
  }

  getItems(arr, index, depth) {
    return (arr || []).reduce((all, item) => {
      all = all.concat([this.getItem(item, index, depth)])
      index++
      depth++
      all = all.concat(this.getItems(item.children || [], index, depth))
      depth--
      return all
    }, [])
  }

  render() {
    const items = this.getItems(this.props.data || [], 0, 0)
    return (
      <List selectable ripple>
        {
          items
        }
      </List>
    )
  }
}

export default ListTree