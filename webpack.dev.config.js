const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dist = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    watch: true,
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
    devServer: {
        contentBase: dist,
        compress: true,
        port: 8080
    }
};
