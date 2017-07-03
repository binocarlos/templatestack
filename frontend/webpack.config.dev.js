const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const toolboxVariables = require('./toolbox-variables');
const packageJSON = require('./package.json')

const APPS = packageJSON.template_apps

module.exports = {
  _apps: APPS,
  context: __dirname,
  devtool: 'inline-source-map',
  entry: APPS.reduce((all, app) => {
    all[app] = [
      'webpack-hot-middleware/client',
      `./src/${app}/index.js`
    ]
    return all
  }, {}),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'template-ui': path.resolve(__dirname, 'src', 'template-ui')
    },
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
  plugins: [
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
};