import React, { Component, PropTypes } from 'react'
import Input from 'react-toolbox/lib/input'
import Dropdown from 'react-toolbox/lib/dropdown'

export const input = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <Input
    label={label}
    error={touched && error}
    spellCheck={false}
    {...input}
    {...custom}
  />
)

// needs 'source' to power options
export const select = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <Dropdown
    auto={false}
    label={label}
    error={touched && error}
    {...input}
    {...custom}
  />
)

const fields = {
  input,
  select
}

export default fields