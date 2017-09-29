import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

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

const getFormId = (ownProps) => `formlist_${ownProps.formName}_${ownProps.fieldName}`

export default connect(
  (state, ownProps) => {
    const id = getFormId(ownProps)
    return {
      id,
      data: ownProps.data || [],
      selected: valueSelectors.get(state, `${id}_selected`) || [],
      deleteActive: valueSelectors.get(state, `${id}_deleteWindow`),
      editActive: valueSelectors.get(state, `${id}_editWindow`)
    }
  },
  (dispatch, ownProps) => {
    const id = getFormId(ownProps)
    return {
      onSelect: (data) => dispatch(valueActions.set(`${id}_selected`, data)),
      itemClick: (name, id, index) => {
        if(name == 'delete') {

        }
        else if(name == 'edit') {
          
        }
      },
      toolbarClick: (name, selectedItems) => {
        if(name == 'delete') {
          
        }
        else if(name == 'edit') {
          const item = selectedItems[0]
          if(item) {
            
          }
        }
        else if(name == 'add') {
          
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