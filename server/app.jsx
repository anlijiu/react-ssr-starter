const path = require('path');

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

function createReactAppExpress(options) {
  const app = express();
  staticLoader(app, options);
  // universalLoader(app, options);
  // startWebpackDevServer(app, options);
  return app;
}

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

export default app;
