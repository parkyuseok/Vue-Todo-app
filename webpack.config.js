const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
require('@babel/polyfill')

module.exports = {
    // 진입점
    entry: {
        app: [
            '@babel/polyfill',
            path.join(__dirname, 'main.js')
        ]
    },
    // 결과물에 대한 설정
    output: {
        filename: '[name].js', //app.js
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            // ... other rules
            {
              test: /\.vue$/,
              use: 'vue-loader'
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                'vue-style-loader',
                'css-loader'
                ]
            }
        ]
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html')
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: 'assets/',
                    to: ''
                }
            ]
        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        open: false,
        hot: true
    },
    //(개발용)build 시간이 최대한 줄어들고, 디버깅이 가능해진다. (단점: 용량이 커짐)
    devtool: 'eval'
}