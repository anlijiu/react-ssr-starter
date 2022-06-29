const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../../config/webpack.config.client.dev.js');

const serverBuildHost = 'localhost';
const serverBuildPort = 3002;
console.log("  webpackConfig.entry : ", webpackConfig.entry);
webpackConfig.entry = [                                                        
    `webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true`,        
    ...webpackConfig.entry,
];    
console.log("  after webpackConfig.entry : ", webpackConfig.entry);
const compiler = webpack(webpackConfig);

function devServer(options) {
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

    console.log("devServer in !!!!! devMiddleware: ", devMiddleware);
    console.log("devServer in !!!!! hotMiddleware: ", hotMiddleware);

    async function serve(req, res, next) {
        let hasNext = await devMiddleware(req, res, next);
        await hotMiddleware(req, res, next);
        return next();
    }
    return serve;
}

module.exports = devServer;
