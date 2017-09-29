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
      errors: formSelectors.errors(state, id),
      data: ownProps.input.value || [],
      selected: valueSelectors.get(state, `${id}_selected`) || [],
      deleteActive: valueSelectors.get(state, `${id}_deleteWindow`),
      editActive: valueSelectors.get(state, `${id}_editWindow`)
    }
  },
  (dispatch, ownProps) => {
    const form = ownProps.meta.form
    const field = ownProps.input.name
    const id = getFormId(ownProps)
    
    const editItem = (item, index) => {
      if(ownProps.formHook) {
        dispatch(routerActions.hook(ownProps.formHook, {
          id,
          mode: 'edit',
          item,
          index
        }))
      }
      else {
        dispatch(routerActions.hook('formListWindowEdit', {
          id,
          item,
          index
        }))
      }
    }

    const addItem = () => {
      if(ownProps.formHook) {
        dispatch(routerActions.hook(ownProps.formHook, {
          id,
          mode: 'add'
        }))
      }
      else {
        dispatch(routerActions.hook('formListWindowAdd', {
          id,
          schema: ownProps.schema
        }))
      }
    }

    return {
      onSelect: (data) => dispatch(valueActions.set(`${id}_selected`, data)),
      itemClick: (name, item, index) => {
        if(name == 'delete') {
          dispatch(valueActions.set(`${id}_selected`, [index]))
          dispatch(valueActions.set(`${id}_deleteWindow`, true))
        }
        else if(name == 'edit') {
          editItem(item, index)
        }
      },
      toolbarClick: (name, selectedItems) => {
        if(name == 'delete') {
          dispatch(valueActions.set(`${id}_deleteWindow`, true))
        }
        else if(name == 'edit') {
          const item = selectedItems[0]
          if(!item) return
          editItem(item, 0)
        }
        else if(name == 'add') {
          addItem()
        }
      },
      cancelEditWindow: () => {
        dispatch(routerActions.hook('formListCloseWindow', {
          id
        }))
      },
      confirmEditWindow: () => {
        dispatch(routerActions.hook('formListConfirmWindow', {
          id,
          form,
          field
        }))
        dispatch(routerActions.hook('formListCloseWindow', {
          id
        }))
      },
      touchEditWindow: () => {
        dispatch(formActions.touchAll(id, ownProps.schema))
      },
      cancelDeleteWindow: () => {
        dispatch(valueActions.set(`${id}_deleteWindow`, false))
      },
      confirmDeleteWindow: () => {
        dispatch(valueActions.set(`${id}_deleteWindow`, false))
      }
    }
  }
)(FormListFieldContainer)