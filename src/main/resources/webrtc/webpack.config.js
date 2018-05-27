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
    },
    plugins: [
        new webpack.BannerPlugin(" XmWebRtc \n version: 1.0 \n COPYRIGHT © 2018 杭州雄迈信息技术有限公司"),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
