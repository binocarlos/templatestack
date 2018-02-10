import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import dotty from 'dotty'
import fields from './fields'

const composeParts = (parts = []) => {
  return parts.reduce((all, part) => {
    Object.keys(part).forEach((key) => {
      all[key] = part[key]
    })
    return all
  }, {})
}

const getFields = (schema = {}, opts = {}) => {
  let { injectProps, prependName } = opts
  prependName = prependName ? prependName + '.' : ''
  return Object.keys(schema || {}).reduce((all, name, i) => {
    const field = schema[name]
    const fieldProps = Object.assign({}, {
      key: i,
      name: prependName + name,
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

const fieldNames = (schema = {}) => {
  return Object.keys(schema).reduce((all, name) => {
    const field = schema[name]
    if(field.childSchema) {
      return all.concat(fieldNames(field.childSchema).map(childname => `${name}.${childname}`))
    }
    else {
      return all.concat([name])
    }
  }, [])
}

const getDefaults = (schema = {}) => {
  return Object.keys(schema || {}).reduce((all, fieldname) => {
    const opts = schema[fieldname] || {}
    if(opts.childSchema) {      
      dotty.put(all, fieldname, getDefaults(opts.childSchema))
    }
    else if(opts.default) {
      dotty.put(all, fieldname, opts.default)
    }
    return all
  }, {})
}

const utils = {
  composeParts,
  getFields,
  fieldNames,
  getDefaults
}

export default utils