import React, { Component, PropTypes } from 'react'

import FormWrapper from 'template-ui/lib/components/FormWrapper'
import FormLayout from 'template-ui/lib/components/FormLayout'
import formUtils from 'template-ui/lib/plugins2/form/utils'
import forms from '../forms'

class LoginForm extends Component {
  render() {
    const data = this.props.data || []
    const fields = formUtils.getFields(forms.authLogin)
    return (
      <FormWrapper
        title='Login'
        submitTitle='Login'
        loading={ this.props.loading }
        error={ this.props.error }
        submit={ this.props.submit }
      >
        <FormLayout
          fields={ fields }
        />
      </FormWrapper>
    )
  }
}

export default LoginForm