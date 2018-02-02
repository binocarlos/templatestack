import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import options from 'template-tools/src/utils/options'

import authSelectors from '../../auth/selectors'
import formSelectors from '../../form/selectors'
import apiSelectors from '../../api/selectors'
import routerActions from '../../router/actions'
import routerSelectors from '../../router/selectors'

const REQUIRED = [
  'name',
  'component',
  'actions',
  'selectors'
]


const DiggerTreeFactory = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const {
    name,
    actions,
    selectors
  } = opts

  const Component = opts.component

  class TreeContainer extends Component {
    render() {
      return (
        <Component {...this.props} />
      )
    }
  }

  return connect(
    (state, ownProps) => ({
      data: selectors.tree.data(state),
      loaded: apiSelectors.loaded(state, `${name}Descendents`),
      error: apiSelectors.error(state, `${name}Descendents`),
      namespace: routerSelectors.param(state, `namespace`),
      selectedId: routerSelectors.param(state, `viewid`),
    }),
    (dispatch) => ({
      clickTree: (item) => {
        dispatch(routerActions.hook(`${name}View`, item))
      }
    })
  )(TreeContainer)

}

export default DiggerTreeFactory