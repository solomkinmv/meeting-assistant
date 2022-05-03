const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
};

// module.exports = {
//     entry: "./src/index.ts",
//     output: {
//         filename: "./dist/bundle.js",
//     },
//     // Enable sourcemaps for debugging webpack's output.
//     devtool: "source-map",
//     resolve: {
//         // Add '.ts' and '.tsx' as resolvable extensions.
//         extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
//     },
//     module: {
//         rules: [
//             // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
//             { test: /\.tsx?$/, loader: "ts-loader" },
//             // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
//             { test: /\.js$/, loader: "source-map-loader" },
//         ],
//     },
//     // Other options...
// };
