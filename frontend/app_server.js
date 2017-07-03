import "babel-polyfill"
import React from 'react'
import { renderToString } from 'react-dom/server'
import { routerForExpress } = from 'redux-little-router'
import Root from './containers/Root'
import configureStore from './store/configureStore.prod'
import rootSaga from './sagas'
import { routeConfig } from './routes'

const html = (opts = {}) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${opts.title}</title>
    <meta name="description" content="${opts.description}">
    <meta name="author" content="${opts.author}">
    <meta name="viewport" content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width">
    <meta name="viewport" content="initial-scale=1.0,user-scalable=no,maximum-scale=1" media="(device-height: 568px)">
    <meta name="apple-mobile-web-app-title" content="${opts.title}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <meta name="HandheldFriendly" content="True">
    <meta http-equiv="cleartype" content="on">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
    <style type="text/css">
        html,body,#mount {
            width: 100%;
            height: 100%;
            margin: 0px;
            border: 0;
            overflow: hidden;
        }
    </style>
    <link rel="stylesheet" href="/${opts.name}.css">
  </head>

  <body>
    <div id="mount"><div>${opts.body}</div></div>
    <script type="text/javascript" charset="utf-8">
      window.__INITIAL_STATE__ = ${opts.initialState};
    </script>
    <script src="/${opts.name}.js"></script>
  </body>
</html>
`
}

const server = (req, res) => {

  console.log('-------------------------------------------');
  console.log('run server app')

  const router = routerForExpress({
    routes: routeConfig,
    request: req
  })

  const store = configureStore(router)
  const rootComp = (
    <Root store={store} />
  )

  store.runSaga(rootSaga).done.then(() => {
    console.log('sagas complete')
    res.status(200).send(
      html({
        name: 
        body: renderToString(rootComp),
        initialState: JSON.stringify(store.getState())
      })
    )
  }).catch((e) => {
    console.log(e.message)
    res.status(500).send(e.message)
  })

  renderToString(rootComp)
  store.close()

  render(
    <Root 
      store={ store }
    />,
    document.getElementById('mount')
  )

}

module.exports = server