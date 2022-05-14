const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        historyApiFallback: {
            rewrites: [
                {from: /^\/meeting\//, to: '/meeting.html'},
                {from: /^\/404$/, to: '/404.html'}
            ]
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080'
            }
        },
        port: 8081
    },
});
