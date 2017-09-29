import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import routerActions from '../plugins2/router/actions'
import valueActions from '../plugins2/value/actions'
import formActions from '../plugins2/form/actions'

import valueSelectors from '../plugins2/value/selectors'
import formSelectors from '../plugins2/form/selectors'

import FormItemField from '../components/FormItemField'

class FormItemFieldContainer extends Component {
  render() {
    return (
      <FormItemField {...this.props} />
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
      data: ownProps.input.value || {},
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
      toolbarClick: (name, values) => {
        if(name == 'edit') {
          dispatch(routerActions.hook('formModal', {
            action: 'edit',
            id,
            values
          }))
        }
      },
      cancelItemWindow: () => {
        dispatch(routerActions.hook('formModal', {
          action: 'cancel',
          id
        }))
      },
      confirmItemWindow: (values) => {
        dispatch(routerActions.hook('formModal', {
          action: 'confirmItem',
          id,
          form,
          field,
          values
        }))
        dispatch(routerActions.hook('formModal', {
          action: 'cancel',
          id
        }))
      },
      touchItemWindow: () => {
        dispatch(formActions.touchAll(id, ownProps.schema))
      }
    }
  }
)(FormItemFieldContainer)