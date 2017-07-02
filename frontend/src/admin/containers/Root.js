import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'redux-little-router'
import Routes from './Routes'

export default class Root extends Component {
  render() {
    const { store } = this.props

    return (
      <Provider store={store}>
        <RouterProvider store={store}>
          <Routes />
        </RouterProvider>
      </Provider>
    )
  }
}