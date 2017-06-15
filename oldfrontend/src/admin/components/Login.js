import React, { Component, PropTypes } from 'react'
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import { Button } from 'react-toolbox/lib/button'

import Page from 'boiler-ui/lib/components/Page'
import FormFields from 'boiler-ui/lib/components/FormFields'

import { getRoute } from '../tools'
import Link from './Link'
import ErrorCardText from './ErrorCardText'

class Login extends Component {

  render() {
    return (
      <div style={{marginTop: '60px'}}>
        <Page>
          <Card>
            <CardTitle
              title="Login"
              subtitle={(
                <span>
                  Enter your email and password to login
                </span>
              )}
            />
            <CardText>
              <FormFields
                fields={this.props.fields}
                update={this.props.update}
                touch={this.props.touch}
              />
            </CardText>
            <ErrorCardText error={this.props.error} />
            <CardActions>
              <Button 
                label="Cancel" 
                onClick={() => this.props.redirect(getRoute('/'))}
              />
              <Button 
                label="Submit" 
                raised={this.props.valid} 
                primary={this.props.valid}
                onClick={() => this.props.submit(this.props.valid)}
              />
            </CardActions>
          </Card>
        </Page>
      </div>
    )
  }

}

export default Login