const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const toolboxVariables = require('./toolbox-variables');

const appsConfig = require('./apps.config')
const APPS = appsConfig.apps || []
const LINKED_MODULES = appsConfig.linkedModules || [] 

const isDevelopment = process.env.NODE_ENV !== "production"

const isExternalModule = (module) => {
  var userRequest = module.userRequest
  if (typeof userRequest !== 'string') {
    return false
  }
  return userRequest.indexOf('node_modules') >= 0
}

const devPlugins = () => {
  return [
    new ExtractTextPlugin('[name].[hash].css', { allChunks: true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CopyWebpackPlugin([{
      from: 'www',
      to: ''
    }])
  ]
}

const prodPlugins = () => {
  return [
    new ExtractTextPlugin('[name].[hash].css', { allChunks: true }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => {
        return isExternalModule(module)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
    new CopyWebpackPlugin([{
      from: 'www',
      to: ''
    }])
  ]
}


const htmlPlugins = () => {
  return APPS.map(app => {
    return new HtmlWebpackPlugin({
      inject: false,
      chunks: [app.name],
      title: app.title,
      template: 'template.ejs',
      filename: `${app.name}/index.html`
    })
  })
}

const getPlugins = () => {
  const basePlugins =  isDevelopment ?
    devPlugins() :
    prodPlugins()
  return basePlugins.concat(htmlPlugins())
}

const getEntryPoints = () => {
  return APPS.reduce((all, app) => {
    all[app.name] = isDevelopment ?
      [
        'webpack-hot-middleware/client',
        `./src/${app.name}/index.js`
      ] :
      `./src/${app.name}/index.js`
    return all
  }, {})
}

const getAliases = () => {
  return isDevelopment ?
    {
      'template-tools': fs.realpathSync('../template-tools'),
      'template-ui': fs.realpathSync('../template-ui'),
      'shared': fs.realpathSync('../shared')
    } :
    {
      'react': 'react-lite',
      'react-dom': 'react-lite'
    }
}

module.exports = {
  _apps: APPS,
  context: __dirname,
  devtool: isDevelopment ? 'eval-source-map' : null,
  entry: getEntryPoints(),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    alias: getAliases(),
    extensions: ['', '.scss', '.css', '.js'],
    packageMains: ['browser', 'web', 'browserify', 'main', 'style'],
    modulesDirectories: [
      path.resolve(__dirname, 'node_modules')
    ],
    root: path.resolve(__dirname, 'src'),
    fallback: path.join(__dirname, 'node_modules')
  },
  resolveLoader: {
    fallback: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          fs.realpathSync('../template-tools'),
          fs.realpathSync('../template-ui'),
          fs.realpathSync('../shared')
        ]/*.concat(
          LINKED_MODULES
            .map(moduleName => {
              return fs.realpathSync(`./node_modules/${moduleName}`)
            })
        )*/,
        loader: 'babel',
        query: {
          presets: [
            "es2015",
            "stage-2",
            "react"
          ].map(dep => require.resolve(`babel-preset-${dep}`)),
          plugins: [
            "transform-runtime"
          ].map(dep => require.resolve(`babel-plugin-${dep}`)),
          env: {
            development: {
              plugins: [
                ["react-transform", {
                  "transforms": [{
                    "transform": "react-transform-hmr",
                    "imports": ["react"],
                    "locals": ["module"]
                  }, {
                    "transform": "react-transform-catch-errors",
                    "imports": ["react", "redbox-react"]
                  }]
                }]
              ]
            }
          }
        }
      }, {
        test: /\.json$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'json-loader'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?sourceMap&sourceComments'),
        exclude: /flexboxgrid/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules',
        include: /flexboxgrid/
      }
    ]
  },
  postcss (webpackInstance) {
    return [
      require('postcss-import')({
        root: __dirname,
        path: [
          path.join(__dirname, 'src')
        ]
      }),
      require('postcss-mixins')(),
      require('postcss-each')(),
      require('postcss-cssnext')({
        features: {
          customProperties: {
            variables: toolboxVariables
          }
        }
      }),
      require('postcss-reporter')({ clearMessages: true })
    ];
  },
  plugins: getPlugins()
};