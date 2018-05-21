const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/Index.ts',
    output: {
        filename: 'XmWebRtc.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};
