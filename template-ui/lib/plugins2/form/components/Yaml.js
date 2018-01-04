import React, { Component, PropTypes } from 'react'
import Input from 'react-toolbox/lib/input'

const yaml = ({
  input,
  label,
  meta: { touched, error },
  ...props
}) => {
  return (
    <Input
      label={label}
      error={touched && error ? error : null}
      spellCheck={false}
      type={ props.type }
      multiline={ props.multiline }
      rows={ props.rows }
      {...input}
    />
  )
}

export default yaml