import React, { Component } from 'react'
import { Button } from 'react-toolbox/lib/button'
import Navigation from 'react-toolbox/lib/navigation'
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'

import theme from './listEditorTheme.css'

class ListEditor extends Component {

  getItem(item, i) {
    const name = this.props.getName ? this.props.getName(item) : null
    const summary = this.props.getSummary ? this.props.getSummary(item) : null
    const icon = this.props.getIcon ? this.props.getIcon(item) : null
    return (
      <ListItem 
        theme={ theme }
        ripple
        caption={ name }
        legend={ summary }
        leftIcon={ icon }
        rightIcon='edit'
        onClick={ () => this.props.onAction('edit', {
          index: i
        }) }
        key={ i }
      />
    )
  }

  render () {
    const input = this.props.input || {}
    const meta = this.props.meta || {}
    const items = input.value || []
    const error = meta.touched && meta.error ? meta.error : null
    
    return (
      <div>
        <List 
          selectable
        >
          {
            this.props.title ? (
              <ListSubHeader caption={ this.props.title } />
            ) : null
          }
          <Navigation type='horizontal'>
          <Button
            label='Add'
            icon='add'
            accent
            onClick={ () => this.props.onAction('add') }
          />
          { this.props.buttons }
        </Navigation>
          {
            (items || []).map(this.getItem.bind(this))
          }
        </List>
        {
          error ? (
            <div className={ theme.errorText }>{ error }</div>
          ) : null
        }
      </div>
    )
    
  }
}

export default ListEditor