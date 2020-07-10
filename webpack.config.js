const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {
    const config = {
        // 중복되는 옵션들...
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
            })
        ]
    }

    // 개발용
    if (this.opts.mode === 'development') {
        return merge(config, {
            //추가 개발용 옵션
            devtool: 'eval',
            devServer: {
                open: false,
                hot: true
            }
        })

    // 제품용
    } else {
        return merge(config, {
            //추가 제출용 옵션
            devtool: 'cheap-module-source-map',
            plugins: [
                new CleanWebpackPlugin()
            ]
        })
    }

}