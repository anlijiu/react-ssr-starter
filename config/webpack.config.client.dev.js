require('dotenv').config();

const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
// const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

const { resolveCwd, resolveDir, pcwd } = require('./util/path');
const { log } = require('./util/log');
const babelConfig = require('./babel.config');

const htmlWebpackPluginOptions = {
	title: `React Application`,
	inject: true,
	hash: false,
	cache: true,
	showErrors: true,
	minify: {
		minifyCSS: true,
		minifyJS: true,
	},
}

function isProd(valProd, valDev) {
  return process.env.NODE_ENV === 'production' ? valProd : valDev;
}

function loadConfigOnBase(fileName) {
  const configOnBase = resolveCwd(fileName);
  const defaultConfig = resolveDir('../config', fileName);

  if (fs.existsSync(configOnBase)) {
    log(`"${fileName}" found, using this one.`);
    return configOnBase;
  }
  return defaultConfig;
}

log(`NODE_ENV is "${process.env.NODE_ENV}"`);


/**
 * Context resolver
 */
let ctx = resolveDir('../config');
if (fs.existsSync(resolveCwd('./server'))) {
  ctx = pcwd;
  log('"server" folder found on CRA client, using this one');
}

log('webpack.config.client.dev.js, ctx folder : ', ctx);

/**
 * Load 3rd party config
 */
const nodePath = process.env.NODE_PATH || 'src';

const config = {
  context: ctx,
  resolveLoader: {
    modules: [
      'node_modules',
      resolveDir('../../node_modules'),
      resolveDir('../../../../../node_modules'),
      resolveCwd('node_modules'),
    ],
  },
  resolve: {
    alias: {
      appbase: resolveCwd(''),
    },
    modules: [
      'node_modules',
      resolveDir('../../node_modules'),
      resolveDir('../../../../../node_modules'),
      resolveCwd('node_modules'),
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: ['./src/index.tsx'],
  output: {
    path: resolveCwd('./dist/client-dev'),
    publicPath: '',
    filename: 'bundle-[id].js',
    hotUpdateChunkFilename: '.hot/[id].[hash].hot-update.js',
    hotUpdateMainFilename: '.hot/[hash].hot-update.json',
    chunkFilename: '[id].chunk.js',
    globalObject: 'this'
  },
  target: 'web',
  // externals 详细解释：https://webpack.docschina.org/configuration/externals/#externals
  // externals: [nodeExternals()],
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
  },
  module: {
    rules: [
      /**
       * svg CRA reference:
       * https://github.com/facebook/create-react-app/blob/v5.0.1/packages/react-scripts/config/webpack.config.js#L389
       */
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash].[ext]',
            },
          },
        ],
        issuer: {
          and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
        },
      },
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [babelConfig],
          cacheDirectory: true,
          cacheCompression: false,
          compact: isProd(true, false),
        },
      },
      {
        test: /\.(png|jpe?g|gif|bmp)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '/static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              // css-loader前面有几个loader , 默认0
              importLoaders: 0,
              sourceMap: true,
              import: {
                filter: (url, media, resourcePath) => {
                  // console.log("webpack.config.babel.js import  resourcePath:", resourcePath)
                  // resourcePath - path to css file

                  // Don't handle `style.css` import
                  if (url.includes("style.css")) {
                    return false;
                  }

                  return false;
                }
              },
              esModule: true,
              // CSS Modules https://github.com/css-modules/css-modules
              modules:  {
                mode: (resourcePath) => {
                  // console.log("webpack.config.babel.js mode resourcePath:", resourcePath)

                  if (/pure.css$/i.test(resourcePath)) {
                    return "pure";
                  }

                  if (/global.css$/i.test(resourcePath)) {
                    return "global";
                  }

                  return "local";
                },
                auto: (resourcePath) => {
                  // console.log("webpack.config.babel.js auto resourcePath:", resourcePath)
                  return true;
                },
                exportGlobals: false,
                localIdentName: isProd('[contenthash:base64:5]', '[path][name]__[local]--[contenthash:base64:5]'),
                localIdentContext: resolveCwd('./src'),
                namedExport: true,
                exportLocalsConvention: "camelCaseOnly",
                exportOnlyLocals: false,
              },
            },
          },
          'postcss-loader'
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader"
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'null-loader',
      },
    ],
  },
  plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
          ...htmlWebpackPluginOptions ,
          inject: true,
          template: resolveCwd('./public/index.html'),
      }),
      new ReactRefreshPlugin(),
      new webpack.HotModuleReplacementPlugin({}),
      // new RunScriptWebpackPlugin({
      //     name: 'bundle.js',
      //     // nodeArgs: ['--preserve-symlinks'],
      //     cwd: pcwd,
      // }),
  ],
};

let finalConfig = config;


module.exports = finalConfig;
