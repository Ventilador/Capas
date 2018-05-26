import * as path from 'path';
import { Config } from 'webpack-config';
import { CheckerPlugin } from 'awesome-typescript-loader';
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HOST = 'localhost';
const GUI_PORT = 3000;
const MW_URL = 'localhost'
module.exports = new Config().merge({
    resolve: { extensions: ['.ts', '.js'] },
    resolveLoader: {
        modules: ['node_modules']
    },
    devtool: 'eval',
    plugins: [
        new CheckerPlugin(),
        new OpenBrowserPlugin({ url: `http://${HOST}:${GUI_PORT}` }), // open default browser
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: false
        }),
    ],
    entry: {
        app: './src/index.ts'
    },
    output: {
        path: path.resolve(process.cwd(), './app'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [
                'awesome-typescript-loader'
            ],
            exclude: /node_modules/
        }, {
            test: /\.html$/,
            exclude: /index\.html/,
            use: [{
                loader: 'html-loader',
                options: {
                    root: path.join(__dirname, '..', 'src/assets').replace(/^([A-Z]:)/, v => v.toUpperCase()),
                    attrs: [
                        'img:src',
                        'proteus-data-and-reporting-sub-menu:icon-path',
                        'link:href'
                    ]
                }
            }],
        },
        {
            test: /\.less$/,
            use: ['style-loader', 'css-loader?sourceMap', 'less-loader?sourceMap']
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader?sourceMap']
        },
        { include: /\.json$/, loaders: ["json-loader"] }]
    },
    devServer: {
        contentBase: "build/",
        host: "0.0.0.0",
        public: `${HOST}:${GUI_PORT}`,
        port: GUI_PORT,
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        }
    }
});
