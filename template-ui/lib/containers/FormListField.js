import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import routerActions from '../plugins2/router/actions'
import valueActions from '../plugins2/value/actions'
import formActions from '../plugins2/form/actions'

import valueSelectors from '../plugins2/value/selectors'
import formSelectors from '../plugins2/form/selectors'

import FormListField from '../components/FormListField'

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
    }
  },
  (dispatch, ownProps) => {
    const form = ownProps.meta.form
    const field = ownProps.input.name
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
        schema: ownProps.schema
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
        dispatch(routerActions.hook('formList', {
          action: 'confirmItem',
          id,
          form,
          field,
          values
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
      }
    }
  }
)(FormListFieldContainer)