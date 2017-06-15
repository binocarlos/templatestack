"use strict";
const emailValidator = require('email-validator')
const PHONE_REGEXP = /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/

const validators = {
  email: (val) => emailValidator.validate(val || ''),
  phone: (val) => (val || '').match(PHONE_REGEXP) ? true : false
}

const options = (formvalues, blocks) => {
  let errors = {}
  const sections = blocks.reduce((all, block) => {
    return all.concat(block.sections)
  }, [])

  sections.forEach(section => {
    const value = formvalues[section.id]
    if(section.input_type == 'number') {
      if(value < 0) {
        errors[section.id] = 'Negative values not allowed'
        return
      }
      if(section.required && value <= 0) {
        errors[section.id] = section.id + ' is required'
        return
      }
      if(section.minimum && value < section.minimum) {
        errors[section.id] = 'Minimum  ' + section.minimum + ' ' + section.id + ' per booking'
        return
      }

    }
  })
  return errors
}

const info = (formvalues, booking_form) => {
  let errors = {}

  booking_form.forEach(field => {
    const value = formvalues[field.id]
    if(field.required && !value) {
      errors[field.id] = field.id + ' is required'
      return
    }

    if(field.input_type == 'number') {
      if(field.minimum && value < field.minimum) {
        errors[field.id] = 'Minimum ' + field.minimum
        return
      }
    }
    else if(field.input_type == 'email') {
      if(value && !validators.email(value)) {
        errors[field.id] = 'Invalid email format'
        return
      }
    }
    else if(field.input_type == 'tel') {
      if(value && !validators.phone(value)) {
        errors[field.id] = 'Invalid phone number format'
        return
      }
    }
  })
  return errors
}

module.exports = {
  options,
  info
}