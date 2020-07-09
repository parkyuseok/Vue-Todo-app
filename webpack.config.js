const path = require('path')
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    // 진입점
    entry: {
        app: path.join(__dirname, 'main.js')
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
        new VueLoaderPlugin()
    ]
}