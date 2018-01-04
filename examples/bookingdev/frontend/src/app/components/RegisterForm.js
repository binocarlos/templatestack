import React, { Component, PropTypes } from 'react'

import { Button } from 'react-toolbox/lib/button'
import FormWrapper from 'template-ui/lib/components/FormWrapper'
import FormLayout from 'template-ui/lib/components/FormLayout'
import formUtils from 'template-ui/lib/plugins2/form/utils'
import forms from '../forms'

class RegisterForm extends Component {
  render() {
    const data = this.props.data || []
    const fields = formUtils.getFields(forms.authRegister)
    return (
      <FormWrapper
        submitTitle='Register'
        loading={ this.props.loading }
        error={ this.props.error }
        submit={ this.props.submitForm }
      >
        <div>
          <p>
           Enter your details below:
          </p>
          <FormLayout
            fields={ fields }
          />
        </div>
      </FormWrapper>
    )
  }
}

export default RegisterForm