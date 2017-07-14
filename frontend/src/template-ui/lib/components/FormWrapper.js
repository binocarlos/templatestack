import React, { Component, PropTypes } from 'react'

import Navigation from 'react-toolbox/lib/navigation'

import ErrorText from './ErrorText'
import Loading from './Loading'

import formTheme from './theme/formWrapper.css'

class FormWrapper extends Component {

  defaultActions() {
    return [{
      label: this.props.submitTitle || 'Submit',
      raised: true,
      primary: true,
      onClick: this.props.submit
    }]
  }

  render() {
    const actions = this.props.actions || this.defaultActions()
    return (
      <div>
      
        {
          this.props.title ?
            (
              <div className={ formTheme.title }>{ this.props.title }</div>
            ) :
            null
        }
        <div className={ formTheme.fieldsWrapper }>
          { this.props.fields }
        </div>
        <Loading loading={this.props.loading}>
          <Navigation
            type='horizontal'
            actions={actions}
          />
        </Loading>
        <ErrorText error={ this.props.error } />        
      </div>
    )
    
  }
}

export default FormWrapper