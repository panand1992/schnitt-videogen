const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/js/index.js',
    mode: 'production',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                },
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    output: {
        clean: true,
        filename: 'main-bundle.js',
        path: path.resolve(__dirname, 'public/js')
    },
    plugins: [
        new Dotenv({
            path: "./.env.prod"
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};