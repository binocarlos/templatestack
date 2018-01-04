import React, { Component, PropTypes } from 'react'
import Input from 'react-toolbox/lib/input'
import yaml from '../../../utils/yaml'

const YamlComponent = ({
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

const validator = (val) => yaml.validate(val)
  
const YamlField = (opts = {}) => {
  return {
    title: opts.title,
    component: YamlComponent,
    validate: [validator],
    multiline: true,
    rows: 10,
  }
}

export default YamlField