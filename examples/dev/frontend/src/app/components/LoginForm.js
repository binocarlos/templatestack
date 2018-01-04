import React, { Component, PropTypes } from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'
import { Button } from 'react-toolbox/lib/button'
import FormWrapper from 'template-ui/lib/components/FormWrapper'
import FormLayout from 'template-ui/lib/components/FormLayout'
import formUtils from 'template-ui/lib/plugins2/form/utils'
import forms from '../forms'

class LoginForm extends Component {
  render() {
    const data = this.props.data || []
    const fields = formUtils.getFields(forms.authLogin)
    return (
      
        <Row>
          <Col xs={12} sm={6}>
            <div>
              <Button
                label="Login With Google"
                raised
                primary
                onClick={ () => this.props.googleLogin() }
              />
            </div> 
          </Col>
          <Col xs={12} sm={6}>
            <div>
              <p>
               OR - enter your manual login details below:
              </p>
              <div>
                <FormWrapper
                  submitTitle='Login'
                  loading={ this.props.loading }
                  error={ this.props.error }
                  submit={ this.props.submitForm }
                >
                  <FormLayout
                    fields={ fields }
                  />
                </FormWrapper>
              </div>
              <p>
               If you don't have any manual login details, you can <a href="#" onClick={this.props.register}>Register here</a>
              </p>
            </div>
          </Col>
        </Row>
        
      
    )
  }
}

export default LoginForm