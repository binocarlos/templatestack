import React, { Component, PropTypes } from 'react'
import {
  FormSection
} from 'redux-form'
import Input from 'react-toolbox/lib/input'
import Checkbox from 'react-toolbox/lib/checkbox'
import DatePicker from 'react-toolbox/lib/date_picker'
import TimePicker from 'react-toolbox/lib/time_picker'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'
import Dropdown from 'react-toolbox/lib/dropdown'

import ErrorText from '../../components/ErrorText'
import FormLayout from '../../components/FormLayout'
import FormListField from '../../containers/FormListField'

import utils from './utils'
import theme from './theme.css'

const processOptions = (source) => {
  return (source || []).map(s => {
    if(typeof(s) == 'string') {
      return {
        value: s,
        label: s
      }
    }
    return s
  })
}
export const input = ({
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

// needs 'source' to power options
export const select = ({
  input,
  label,
  meta: { touched, error },
  ...props
}) => {
  const source = processOptions(props.source)
  return (
    <Dropdown
      auto={false}
      label={label}
      error={touched && error ? error : null}
      source={source}
      {...input}
    />
  )
}

// needs 'source' to power options
export const radio = ({
  input,
  label,
  meta: { touched, error },
  ...props
}) => {
  const useTheme = props.horizontal ?
    { 
      field: theme.horizontal
    } :
    { }

  const source = processOptions(props.source)

  return (
    <div>
      <div className={ theme.radioTitle }>{ label }</div>
      <RadioGroup {...input}>
        {
          source.map((item, i) => {
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
  return (
    <div>
      <div className={ theme.notesTitle }>{ label }</div>
      <div className={ theme.notesContent }>{ props.notes }</div>
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
  const source = processOptions(props.source)

  const useTheme = props.horizontal ?
    { 
      field: theme.horizontal
    } :
    { }

  return (
    <div>
      <div className={ theme.spaceBottom }>
        { label }
      </div>
      {
        source.map((item, i) => {
          const isChecked = currentValue.indexOf(item.value) >= 0
          const checkOnChange = (val) => {
            currentValue = currentValue.filter(v => v != item.value)
            if(val) {
              currentValue.push(item.value)
            }
            input.onChange([].concat(currentValue))
          }
          return (
            <Checkbox
              key={ i }
              theme={ useTheme }
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

export const list = FormListField

export const section = (props) => {
  const fields = utils.getFields(props.schema, {
    prependName: props.prependName
  })
  const LayoutComponent = props.layoutComponent || FormLayout
  return (
    <LayoutComponent
      fields={ fields }
      props={ props }
    />
  )
}

const fields = {
  input,
  select,
  radio,
  notes,
  checkbox,
  date,
  time,
  multipleCheckbox,
  list,
  section
}

export default fields