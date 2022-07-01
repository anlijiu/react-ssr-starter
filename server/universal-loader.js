// module.exports = universalLoader;
const createUniversalMiddleware =  require('./universal')
const stringRenderer = require('./renderer/string-renderer')
const streamRenderer = require('./renderer/stream-renderer')

function universalLoader(app, options) {
  const universalMiddleware = createUniversalMiddleware(options);
  app.use('/', universalMiddleware);
  return app;
}

module.exports = universalLoader;
universalLoader.stringRenderer = stringRenderer;
universalLoader.streamRenderer = streamRenderer;

// export default universalLoader;
// export { stringRenderer, streamRenderer };
