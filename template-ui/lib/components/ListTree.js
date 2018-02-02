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

    let selected = false

    if(!this.props.selectedId && !item.id && item.namespace==this.props.namespace) {
      selected = true
    }
    else if(this.props.selectedId && item.id == this.props.selectedId) {
      selected = true
    }

    return (
      <ListItem
        key={ index + '-' + depth }
        caption={ item.name }
        leftIcon={ this.getIcon(item) }
        onClick={ () => this.props.onClick(item) }
        theme={{
          itemAction: theme.itemAction,
          listItem: selected ? theme.selectedItem : '',
          itemText: selected ? theme.selectedText : '',
          left: [theme['depth' + depth], selected ? theme.selectedLeft : ''].join(' '),
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
    let data = this.props.data || []
    const items = this.getItems(data, 0, 0)
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