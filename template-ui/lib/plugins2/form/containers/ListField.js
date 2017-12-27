import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import routerActions from '../../router/actions'
import valueActions from '../../value/actions'
import formActions from '../../form/actions'

import valueSelectors from '../../value/selectors'
import formSelectors from '../../form/selectors'

import FormListField from '../../../components/FormListField'

class FormListFieldContainer extends Component {
  render() {
    return (
      <FormListField {...this.props} />
    )
  }
}

const getFormId = (ownProps) => `formlist_${ownProps.meta.form}_${ownProps.input.name}`

export default connect(
  (state, ownProps) => {
    const id = getFormId(ownProps)
    return {
      id,
      valid: formSelectors.valid(state, id),
      values: formSelectors.values(state, id),
      errors: formSelectors.errors(state, id),
      data: ownProps.input.value || [],
      selected: formSelectors.list.selected(state, id),
      deleteWindow: formSelectors.list.deleteWindow(state, id),
      itemWindow: formSelectors.list.itemWindow(state, id),
      searchValue: valueSelectors.get(state, `${id}_itemSearch`),
      searchResults: valueSelectors.get(state, `${id}_itemSearchResults`),
    }
  },
  (dispatch, ownProps) => {
    const form = ownProps.meta.form
    const field = ownProps.input.name
    const schema = ownProps.schema
    const id = getFormId(ownProps)
    
    const editItem = (item, index) => {
      const hook = ownProps.formHook || 'formList'
      dispatch(routerActions.hook(hook, {
        action: 'edit',
        id,
        item,
        index
      }))
    }

    const addItem = () => {
      const hook = ownProps.formHook || 'formList'
      dispatch(routerActions.hook(hook, {
        action: 'add',
        id,
        schema
      }))
    }

    return {
      onSelect: (data) => dispatch(valueActions.set(`${id}_selected`, data)),
      itemClick: (name, item, index) => {
        if(name == 'delete') {
          dispatch(routerActions.hook('formList', {
            action: 'selected',
            id,
            selected: [index],
          }))
          dispatch(routerActions.hook('formList', {
            action: 'del',
            id,
          }))
        }
        else if(name == 'edit') {
          editItem(item, index)
        }
      },
      toolbarClick: (name, selectedItems, selected) => {
        if(name == 'delete') {
          dispatch(routerActions.hook('formList', {
            action: 'del',
            id,
          }))
        }
        else if(name == 'edit') {
          const item = selectedItems[0]
          const itemIndex = selected[0]
          if(!item) return
          editItem(item, itemIndex)
        }
        else if(name == 'add') {
          addItem()
        }
      },
      cancelItemWindow: () => {
        dispatch(routerActions.hook('formList', {
          action: 'cancel',
          id
        }))
      },
      confirmItemWindow: (values) => {
        values = ownProps.processNewItem ? ownProps.processNewItem(values) : values
        dispatch(routerActions.hook('formList', {
          action: 'confirmItem',
          id,
          form,
          field,
          values,
          schema
        }))
      },
      touchItemWindow: () => {
        dispatch(formActions.touchAll(id, ownProps.schema))
      },
      cancelDeleteWindow: () => {
        dispatch(routerActions.hook('formList', {
          action: 'cancel',
          id
        }))
      },
      confirmDeleteWindow: (selected) => {
        dispatch(routerActions.hook('formList', {
          action: 'confirmDelete',
          form,
          field,
          selected
        }))
        dispatch(routerActions.hook('formList', {
          action: 'selected',
          id,
          selected: [],
        }))
        dispatch(routerActions.hook('formList', {
          action: 'cancel',
          id
        }))
      },
      searchBoxChanged: (val) => {
        dispatch(routerActions.hook('formList', {
          action: 'search',
          id,
          api: ownProps.api,
          payload: val
        }))
      },
      updateItemValue: (index, field, value) => {
        dispatch(routerActions.hook('formList', {
          action: 'updateItemValue',
          id,
          index,
          field,
          value
        }))
      }
    }
  }
)(FormListFieldContainer)