import React, { Component, PropTypes } from 'react'
import Input from 'react-toolbox/lib/input'
import Checkbox from 'react-toolbox/lib/checkbox'
import DatePicker from 'react-toolbox/lib/date_picker'
import TimePicker from 'react-toolbox/lib/time_picker'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'
import Dropdown from 'react-toolbox/lib/dropdown'

import fieldTheme from './theme/field.css'
import radioTheme from './theme/radio.css'

const STYLES = {
  radioTitle: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#999'
  },
  notesTitle: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#999'
  },
  notesContent: {
    fontSize: '.85em',
    color: '#999'
  }
}

export const input = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => {
  return (
    <Input
      label={label}
      error={touched && error ? error : null}
      spellCheck={false}
      type={ custom.type }
      {...input}
    />
  )
}

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
}) => {
  const config = custom.config || {}
  const useTheme = config.horizontal ?
    { 
      field: radioTheme.horizontal
    } :
    { }

  return (
    <div>
      <div style={ STYLES.radioTitle }>{ label }</div>
      <RadioGroup {...input}>
        {
          (custom.source || []).map((item, i) => {
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
  ...custom
}) => {
  const config = custom.config || {}
  
  return (
    <div>
      <div style={ STYLES.notesTitle }>{ label }</div>
      <div style={ STYLES.notesContent }>{ config.notes }</div>
    </div>
  )
}

export const checkbox = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => {
  const isChecked = input.value ? true : false
  return (
    <div className={ fieldTheme.padded }>
      <Checkbox
        label={label}
        name={custom.config.id}
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
  notes,
  checkbox,
  date,
  time,
  multipleCheckbox
}

export default fields