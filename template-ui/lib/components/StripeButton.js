import React, { Component, PropTypes } from 'react'
import { Button } from 'react-toolbox/lib/button'

class StripeButton extends Component {

  createStripeHandler() {
    if(this.handler) return
    if(!this.props.stripeKey) {
      throw new Error('trying to create a stripe button with no apiKey')
    }
    this.handler = window.StripeCheckout.configure({
      key: this.props.stripeKey,
      name: this.props.name,
      description: this.props.description,
      amount: this.props.amount,
      panelLabel: this.props.panelLabel,
      email: this.props.email,
      currency: this.props.currency || 'GBP',
      locale: 'en',
      zipCode: false,
      billingAddress: false,
      allowRememberMe: false,
      token: this.props.onToken
    })
  }

  componentWillMount() {
    if(!window.StripeCheckout || typeof(window.StripeCheckout.configure) !== 'function') {
      throw new Error('Stripe checkout api not found - pleasea add https://checkout.stripe.com/checkout.js to the scripts')
    }
    this.createStripeHandler()
  }

  componentWillReceiveProps() {
    this.createStripeHandler()
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleWindowClose.bind(this))
  }

  handleWindowClose() {
    this.handler.close()
  }

  onButtonClick(e) {
    this.handler.open()
    e.preventDefault()
  }

  getButton() {
    return (
      <Button 
        icon={ this.props.icon || 'credit_card' }
        primary
        raised
        label={ this.props.buttonTitle || 'Pay With Stripe' }
        onClick={ this.onButtonClick.bind(this) }
      />
    )
  }

  render() {
    return (
      <Button 
        icon={ this.props.icon || 'credit_card' }
        primary
        raised
        label={ this.props.buttonTitle || 'Pay With Stripe' }
        onClick={ this.onButtonClick.bind(this) }
      />
    )
  }

}

export default StripeButton