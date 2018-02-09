import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import options from 'template-tools/src/utils/options'

import { Button } from 'react-toolbox/lib/button'

import routerActions from '../../router/actions'
import valueActions from '../../value/actions'
import formActions from '../../form/actions'
import systemActions from '../../system/actions'

import valueSelectors from '../../value/selectors'
import formSelectors from '../../form/selectors'

import FormModal from '../../../components/FormModal'

const REQUIRED = [
  'form',
  'schema',
  'trigger',
]

const FormModalFactory = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const {
    form,
    schema,
    trigger,
  } = opts

  class FormItemFieldContainer extends Component {
    render() {
      const buttonProps = Object.assign({}, opts.buttonProps, {
        onClick: () => this.props.onOpen()
      })
      return (
        <div>
          <Button {...buttonProps} />
          <FormModal {...this.props} />
        </div>
      )
    }
  }

  return connect(
    (state, ownProps) => ({
      title: opts.modalTitle,
      confirmTitle: opts.confirmTitle,
      valid: formSelectors.valid(state, form),
      active: valueSelectors.get(state, `${form}WindowOpen`) ? true : false,
      form,
      schema,
    }),
    (dispatch) => ({
      onCancel: () => {
        dispatch(valueActions.set(`${form}WindowOpen`, false))
      },
      onOpen: () => {
        dispatch(valueActions.set(`${form}WindowOpen`, true))
      },
      onConfirm: () => {
        if(opts.trigger) opts.trigger(dispatch)
      }
    })
  )(FormItemFieldContainer)

}

export default FormModalFactory