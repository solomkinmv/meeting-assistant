const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/scripts/index.ts',
        meetingAssistant: './src/scripts/meeting-assistant.ts'
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/template/index.html',
            filename: './index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/template/meeting.html',
            filename: './meeting.html',
            chunks: ['meetingAssistant']
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/template/404.html',
            filename: './404.html',
            chunks: []
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ],
    },
};
