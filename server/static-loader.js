// module.exports = staticLoader;
const express = require('express');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');

function staticLoader(app, options) {
  const { clientBuildPath } = options;

  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Serve static assets
  // if (process.env.NODE_ENV === 'development') {
  //   // Connect proxy to Create React App dev server
  //   const serviceName = process.env.SERVICE_NAME || 'localhost';
  //   const clientPort = process.env.CLIENT_PORT || 3001;
  //   app.use(
  //     ['**/*.*', '/static', '/sockjs-node'],
  //     createProxyMiddleware({
  //       target: `http://${serviceName}:${clientPort}`,
  //       changeOrigin: true,
  //       ws: true,
  //     })
  //   );
  //   console.log('Connected to CRA Client dev server');
  // } else {
    app.use(
      express.static(clientBuildPath, {
        index: false,
        immutable: true,
        maxAge: 31536000 * 1000,
      })
    );
  // }

  return app;
}

export default staticLoader;
