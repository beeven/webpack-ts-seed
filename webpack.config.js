const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin")

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: ['./src/main.ts', './src/index.html'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader:'style-loader',
                    'css-loader'
                ]
            },
            { 
                test: /\.less$/, // .less and .css
                use: [ 
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 
                    'css-loader', 
                    'less-loader'
                ],
            },
            {
                test: /index.html$/,
                use: ["file-loader","extract-loader",{
                    loader: "html-loader",
                    options: {
                        attrs: ["img:src", "link:href"]
                    }
                }]
            }
        ]
    },
    plugins: isProduction ? [new MiniCssExtractPlugin()] : [new HtmlWebpackPlugin()],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
      }
};