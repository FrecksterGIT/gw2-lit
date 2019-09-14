const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const dist = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './src/index.ts',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    watch: process.env.NODE_ENV !== 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.json'
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: dist
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(path.join(dist, 'index.html')),
            template: `!!ejs-loader!${path.resolve('./src/index.html')}`,
            inject: true,
            compile: true,
        }),
    ],
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: process.env.NODE_ENV === 'production' ? [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    ecma: 6,
                    extractComments: true
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
            }),
        ] : [],
    },
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap',
    devServer: {
        contentBase: dist,
        compress: true,
        overlay: {
            errors: true
        },
        disableHostCheck: true,
        port: 8080,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            https: true
        }
    }
};
