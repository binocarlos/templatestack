import React, { Component, PropTypes } from 'react'
import { Button } from 'react-toolbox/lib/button'

class StripeButton extends Component {

  createStripeHandler() {
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('making handler')
    console.dir(this.props)
    if(this.handler) return
    if(!this.props.stripeKey) return
    this.handler = window.StripeCheckout.configure({
      key: this.props.stripeKey,
      name: this.props.name,
      description: this.props.description,
      amount: this.props.amount,
      panelLabel: this.props.panelLabel,
      email: this.props.email,
      currency: 'GBP',
      locale: 'en',
      zipCode: false,
      billingAddress: false,
      allowRememberMe: false,
      token: function(token) {
        console.log('-------------------------------------------');
        console.log('-------------------------------------------');
        console.log('hello: ')
        console.dir(token)
      }
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