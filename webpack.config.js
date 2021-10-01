const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin')
const nodeExternals = require('webpack-node-externals')

const serverConfig = {
    target: 'node',
    entry: {
        Server: path.join(__dirname, 'src', 'server', 'index.js'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'dist', 'server'),
    },
    externals: [
        nodeExternals(),
    ],
    node: {
        // need this when working with express
        __dirname: false, // otherwise __dirname returns incorrectly
        __filename: false, // otherwise __filename returns incorrectly
    },
    devtool: false,
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].bundle.js.map',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            },
        ],
    },
}

const clientConfig = {
    target: 'web',
    entry: {
        App: path.join(__dirname, 'src', 'client', 'index.js'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'dist', 'client'),
    },
    devtool: false,
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new webpack.EnvironmentPlugin(['BASEURL']),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].bundle.js.map',
            exclude: ['Dependencies.bundle.js'],
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'TAN LOOLS',
        }),
        new HtmlWebpackPartialsPlugin([
            {
                path: path.join(__dirname, 'src', 'client', 'templates', 'head.html'),
                location: 'head',
            },
            {
                path: path.join(__dirname, 'src', 'client', 'templates', 'body.html'),
                location: 'body',
            },
        ]),
        new CompressionPlugin({
            test: /\.(js|css|html|svg)$/,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            },
            {
                test: /(\.css$)/,
                loaders: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/',
                },
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: 'Dependencies',
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'Dependencies',
                    chunks: 'all',
                },
            },
        },
    },
}

module.exports = [serverConfig, clientConfig]
