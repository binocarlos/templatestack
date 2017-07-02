import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'redux-little-router'
import { routes } from '../routes'

class Router extends Component {
  render() {
    return routes
  }
}

export default class Root extends Component {
  render() {
    const { store } = this.props

    return (
      <Provider store={store}>
        <RouterProvider store={store}>
          <Router />
        </RouterProvider>
      </Provider>
    )
  }
}