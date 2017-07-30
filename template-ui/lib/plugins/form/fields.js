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
    error={touched && error ? error : null}
    {...input}
    {...custom}
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
    {...custom}
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
}) => (
  <Checkbox
    label={label}
    {...input}
    {...custom}
  />
)

export const multipleCheckbox = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => {

  const currentValue = input.value || []

  return (
    <div>
      {
        (custom.source || []).map((item, i) => {
          const isChecked = currentValue.indexOf(item.value) >= 0
          const checkOnChange = (val) => {
            currentValue = currentValue.filter(v => v != val)
            if(val) {
              currentValue.push(val)
            }
            input.onChange(currentValue)
          }
          return (
            <Checkbox
              key={ key }
              label={item.label}
              {...input}
              {...custom}
              value={item.value}
              checked={isChecked}
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
    {...custom}
  />
)

export const time = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <DatePicker
    label={label}
    error={touched && error ? error : null}
    {...input}
    {...custom}
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