import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import routerActions from '../plugins2/router/actions'
import valueActions from '../plugins2/value/actions'

import valueSelectors from '../plugins2/value/selectors'

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
      data: ownProps.input.value || [],
      selected: valueSelectors.get(state, `${id}_selected`) || [],
      deleteActive: valueSelectors.get(state, `${id}_deleteWindow`),
      editActive: valueSelectors.get(state, `${id}_editWindow`)
    }
  },
  (dispatch, ownProps) => {
    const id = getFormId(ownProps)
    
    const editItem = (item) => {
      if(ownProps.formHook) {
        dispatch(routerActions.hook(ownProps.formHook, {
          mode: 'edit',
          item
        }))
      }
      else {
        dispatch(valueActions.set(`${id}_editWindow`, true))
      }
    }

    const addItem = () => {
      if(ownProps.formHook) {
        dispatch(routerActions.hook(ownProps.formHook, {
          mode: 'add'
        }))
      }
      else {
        dispatch(valueActions.set(`${id}_editWindow`, true))
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
          editItem(item)
        }
      },
      toolbarClick: (name, selectedItems) => {
        if(name == 'delete') {
          dispatch(valueActions.set(`${id}_deleteWindow`, true))
        }
        else if(name == 'edit') {
          const item = selectedItems[0]
          if(!item) return
          editItem(item)
        }
        else if(name == 'add') {
          addItem()
        }
      },
      cancelEditWindow: () => {
        dispatch(valueActions.set(`${id}_editWindow`, false))
      },
      confirmEditWindow: () => {
        dispatch(valueActions.set(`${id}_editWindow`, false))
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