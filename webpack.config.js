const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const config = {
    entry: {
        'index': ['./assets/js/index.js', './assets/sass/base/index.scss']
    },
    output: {
        path: path.resolve(__dirname, "public/js"),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?url=false',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ["./assets/sass"]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "../css/[name].css",
            chunkFilename: "[id].css"
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    resolve: {
        extensions: [
            '.mjs',
            '.js',
            '.jsx'
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    }
}

module.exports = config;