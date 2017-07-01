import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'redux-little-router'
import Routes from './Routes'
import DevTools from './DevTools'

export default class Root extends Component {
  render() {
    const { store, routes } = this.props

    return (
      <Provider store={store}>
        <RouterProvider store={store}>
          { routes }
          <DevTools />
        </RouterProvider>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
