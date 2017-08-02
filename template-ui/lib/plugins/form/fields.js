import React, { Component, PropTypes } from 'react'
import Input from 'react-toolbox/lib/input'
import Checkbox from 'react-toolbox/lib/checkbox'
import DatePicker from 'react-toolbox/lib/date_picker'
import TimePicker from 'react-toolbox/lib/time_picker'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'
import Dropdown from 'react-toolbox/lib/dropdown'

export const input = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <Input
    label={label}
    error={touched && error ? error : null}
    spellCheck={false}
    {...input}
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
    error={touched && error ? error : null}
    {...input}
  />
)

// needs 'source' to power options
export const radio = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <RadioGroup
    {...input}
  >
    {
      (custom.source || []).map((item, i) => {
        return (
          <RadioButton label={ item.label } value={ item.value } key={ i } />
        )
      })
    }
  </RadioGroup>
)

export const checkbox = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => {
  return (
    <Checkbox
      label={label}
      {...input}
      checked={input.value ? true : false}
    />
  )
}

export const multipleCheckbox = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => {

  let currentValue = input.value || []

  return (
    <div>
      <div style={{marginBottom: '10px' }}>
        { label }
      </div>
      {
        (custom.source || []).map((item, i) => {
          const isChecked = currentValue.indexOf(item.value) >= 0
          const checkOnChange = (val) => {
            currentValue = currentValue.filter(v => v != item.value)
            if(val) {
              currentValue.push(item.value)
            }
            input.onChange(currentValue)
          }
          return (
            <Checkbox
              key={ i }
              label={item.label}
              value={item.value}
              checked={isChecked ? true : false}
              onChange={checkOnChange}
            />
          )
        })
      }
    </div>
    
  )
}

export const date = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <DatePicker
    autoOk
    label={label}
    error={touched && error ? error : null}
    {...input}
  />
)

export const time = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TimePicker
    label={label}
    error={touched && error ? error : null}
    {...input}
  />
)


const fields = {
  input,
  select,
  radio,
  checkbox,
  date,
  time,
  multipleCheckbox
}

export default fields