// const app = require('./app.jsx').default;

const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../config/webpack.config.client.dev.js');
webpackConfig.entry = [                                                        
    `webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true`,        
    ...webpackConfig.entry,
];    
console.log("  after webpackConfig.entry : ", webpackConfig.entry);
const compiler = webpack(webpackConfig);

const devMiddleware = webpackDevMiddleware(compiler, {
    // logLevel: 'silent',
    // publicPath: '/dist/web',
    publicPath: '/',
    serverSideRender: true,
    writeToDisk(filePath) {
        return true;
    }
});

const hotMiddleware = webpackHotMiddleware(compiler, {
    // eslint-disable-next-line
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 5000
});

const React = require('react');

const { default: App } = require('../src/App.tsx');
const clientBuildPath = path.resolve(__dirname, 'public');

let AppEl = App;

const express = require('express');
import staticLoader from './static-loader';
// const staticLoader =  require('./static-loader');
import universalLoader from './universal-loader';
// const universalLoader = require('./universal-loader');
// const startWebpackDevServer =  require('./dev-server');

// const devServer = require('./middleware').devServer;

const PORT = process.env.SERVER_PORT || 3002;

function createReactAppExpress(options) {
  const app = express();
  app.use(devMiddleware);
  app.use(hotMiddleware);
  staticLoader(app, options);
  universalLoader(app, options);
  return app;
}

async function start() {

    const app = createReactAppExpress({
        clientBuildPath,
        universalRender: () => <AppEl />
    });

    if (module.hot) {
        module.hot.accept('../src/App', () => {
            const { default: App } = require('../src/App');
            AppEl = App;
            console.log('✅ Server hot reloaded App');
        });
    }

    app.listen(PORT, () => {
        console.log(`CRA Server Default listening on port ${PORT}!`);
    });
}

start();

