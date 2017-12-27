import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import routerActions from '../../router/actions'
import valueActions from '../../value/actions'
import formActions from '../../form/actions'

import valueSelectors from '../../value/selectors'
import formSelectors from '../../form/selectors'

import FormItemField from '../../../components/FormItemField'

class FormItemFieldContainer extends Component {
  render() {
    return (
      <FormItemField {...this.props} />
    )
  }
}

const getFormId = (ownProps) => `formitem_${ownProps.meta.form}_${ownProps.input.name}`

export default connect(
  (state, ownProps) => {
    const id = getFormId(ownProps)
    return {
      id,
      valid: formSelectors.valid(state, id),
      values: formSelectors.values(state, id),
      errors: formSelectors.errors(state, id),
      data: ownProps.input.value,
      searchValue: valueSelectors.get(state, `${id}_itemSearch`),
      searchResults: valueSelectors.get(state, `${id}_itemSearchResults`),
      itemWindow: formSelectors.list.itemWindow(state, id),
    }
  },
  (dispatch, ownProps) => {
    const form = ownProps.meta.form
    const field = ownProps.input.name
    const item = ownProps.input.value
    const schema = ownProps.schema
    const id = getFormId(ownProps)

    return {
      toolbarClick: (name) => {
        if(name == 'edit') {
          const hook = ownProps.formHook || 'formItem'
          dispatch(routerActions.hook(hook, {
            action: 'edit',
            id,
            item
          }))
        }
      },
      cancelItemWindow: () => {
        dispatch(routerActions.hook('formItem', {
          action: 'cancel',
          id
        }))
      },
      confirmItemWindow: (values) => {
        dispatch(routerActions.hook('formItem', {
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
      searchBoxChanged: (val) => {
        dispatch(routerActions.hook('formItem', {
          action: 'search',
          id,
          api: ownProps.api,
          payload: val
        }))
      }
    }
  }
)(FormItemFieldContainer)