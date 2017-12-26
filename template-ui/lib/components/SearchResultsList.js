import React, { Component } from 'react'
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'

export class SearchResultsList extends Component {

  getItem(item, i) {
    if(!item) return null

    const title = this.props.getItemTitle ? this.props.getItemTitle(item) : item.name

    return (
      <ListItem 
        ripple
        caption={ title }
        leftIcon={ this.props.icon }
        onClick={ () => this.props.onClick(item) }
        key={ i }
      />
    )
  }

  render () {
    return (
      <List 
        selectable
      >
        {
          this.props.title ? (
            <ListSubHeader caption={ this.props.title } />
          ) : null
        }
        {
          (this.props.data  || []).map(this.getItem.bind(this))
        }
      </List>
    )
  }
}

export default SearchResultsList