import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import fields from './fields'

const composeParts = (parts = []) => {
  return parts.reduce((all, part) => {
    Object.keys(part).forEach((key) => {
      all[key] = part[key]
    })
    return all
  }, {})
}

const getFields = (schema = {}, injectProps = {}) => {
  return Object.keys(schema || {}).reduce((all, name, i) => {
    const field = schema[name]
    const fieldProps = Object.assign({}, {
      key: i,
      name,
      component: fields.input,
      label: field.title || name.replace(/^\w/, (s) => s.toUpperCase()),
    }, injectProps, field)
    const RenderComponent = fieldProps.containerComponent || Field
    all[name] = (
      <RenderComponent {...fieldProps} />
    )
    return all
  }, {})
}

const getDefaults = (schema = {}) => {
  return Object.keys(schema || {}).reduce((all, fieldname) => {
    const opts = schema[fieldname] || {}
    if(opts.default) all[fieldname] = opts.default
    return all
  }, {})
}

const utils = {
  composeParts,
  getFields,
  getDefaults
}

export default utils