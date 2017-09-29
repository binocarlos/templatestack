import React, { Component, PropTypes } from 'react'
import Input from 'react-toolbox/lib/input'
import Checkbox from 'react-toolbox/lib/checkbox'
import DatePicker from 'react-toolbox/lib/date_picker'
import TimePicker from 'react-toolbox/lib/time_picker'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'
import Dropdown from 'react-toolbox/lib/dropdown'

import theme from './fields.css'

export const input = ({
  input,
  label,
  meta: { touched, error },
  ...props
}) => {
  
  const config = props.config || {}
    
  return (
    <Input
      label={label}
      error={touched && error ? error : null}
      spellCheck={false}
      type={ props.type }
      multiline={ config.multiline }
      rows={ config.rows }
      {...input}
    />
  )
}

// needs 'source' to power options
export const select = ({
  input,
  label,
  meta: { touched, error },
  ...props
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
  ...props
}) => {
  const config = props.config || {}
  const useTheme = config.horizontal ?
    { 
      field: theme.horizontal
    } :
    { }

  return (
    <div>
      <div className={ theme.radioTitle }>{ label }</div>
      <RadioGroup {...input}>
        {
          (props.source || []).map((item, i) => {
            return (
              <RadioButton 
                theme={ useTheme }
                label={ item.label }
                value={ item.value }
                key={ i }
              />
            )
          })
        }
      </RadioGroup>
    </div>
  )
}


// needs 'source' to power options
export const notes = ({
  input,
  label,
  meta: { touched, error },
  ...props
}) => {
  const config = props.config || {}
  
  return (
    <div>
      <div className={ theme.notesTitle }>{ label }</div>
      <div className={ theme.notesContent }>{ config.notes }</div>
    </div>
  )
}

export const checkbox = ({
  input,
  label,
  meta: { touched, error },
  ...props
}) => {
  const isChecked = input.value ? true : false
  return (
    <div className={ theme.padded }>
      <Checkbox
        label={label}
        name={input.name}
        checked={input.value ? true : false}
        onChange={() => input.onChange(isChecked ? false : true)}
      />
    </div>
  )
}

export const multipleCheckbox = ({
  input,
  label,
  meta: { touched, error },
  ...props
}) => {

  let currentValue = input.value || []

  return (
    <div>
      <div className={ theme.spaceBottom }>
        { label }
      </div>
      {
        (props.source || []).map((item, i) => {
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
              name={item.value}
              label={item.label}
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
  ...props
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
  ...props
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
  notes,
  checkbox,
  date,
  time,
  multipleCheckbox
}

export default fields