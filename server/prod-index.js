// const app = require('./app.jsx').default;

const path = require('path');
const webpack = require('webpack');

const React = require('react');

const { default: App } = require('../src/App.tsx');
const clientBuildPath = path.resolve(__dirname, '');

let AppEl = App;

const express = require('express');
const staticLoader = require('./static-loader');
const universalLoader = require('./universal-loader');

const PORT = process.env.SERVER_PORT || 3002;

function createReactAppExpress(options) {
  const app = express();
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
