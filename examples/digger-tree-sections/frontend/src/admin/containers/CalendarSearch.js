import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import selectors from '../selectors'
import actions from '../actions'
import forms from '../forms'
import config from '../config'

import FormModal from 'template-ui/lib/plugins2/widgets/containers/FormModal'

const CalendarSearchContainer = FormModal({
  form: 'calendarSearch',
  schema: forms.calendarSearch,
  modalTitle: 'Search Calendar',
  confirmTitle: 'Search',
  buttonProps: {
    label: 'Search',
    icon: config.icons.search,
    accent: true,
    raised: true,
  },
  trigger: (dispatch) => {
    dispatch(actions.router.hook('calendarLoad'))
  }
})

export default CalendarSearchContainer