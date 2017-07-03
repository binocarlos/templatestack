const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const toolboxVariables = require('./toolbox-variables');

const appsConfig = require('./apps.config')
const APPS = appsConfig.apps

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
    new ExtractTextPlugin('[name].css', { allChunks: true }),
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
    new ExtractTextPlugin('[name].css', { allChunks: true }),
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

const getPlugins = () => {
  return isDevelopment ?
    devPlugins() :
    prodPlugins()
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
      'template-ui': path.resolve(__dirname, 'src', 'template-ui')
    } :
    {
      'template-ui': path.resolve(__dirname, 'src', 'template-ui'),
      'react': 'react-lite',
      'react-dom': 'react-lite'
    }
}

module.exports = {
  _apps: APPS,
  context: __dirname,
  devtool: isDevelopment ? 'inline-source-map' : null,
  entry: getEntryPoints(),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: getAliases(),
    extensions: ['', '.scss', '.css', '.js'],
    packageMains: ['browser', 'web', 'browserify', 'main', 'style'],
    modulesDirectories: [
      path.resolve(__dirname, 'node_modules')
    ],
    root: path.resolve(__dirname, 'src')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel'
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