import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'redux-little-router'

const RootFactory = (routes) => {
  class Router extends Component {
    render() {
      return routes
    }
  }

  class Root extends Component {
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

  return Root
}


export default RootFactory