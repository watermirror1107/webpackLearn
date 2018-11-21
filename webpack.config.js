//const webpack=require('webpack');
const path = require('path');
//extract-text-webpack-plugin插件可以吧打包在js里面的css抽出来单独引用
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    //环境
    mode: 'production',//process.env.NODE_ENV === 'production'
    //调试工具
    devtool: 'eval-source-map',
    entry: __dirname + '/app/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    //webpack的服务器
    devServer: {
        contentBase: './public',//本地服务i其所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,//热更
    },
    //取消提示
    performance: {
        hints: false,
    },
    //遇到webpack不试别的模块用loader
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                // query: {
                // 	presets: ['env'],
                // },
                exclude: /node_modules/, //屏蔽插件里面的编译，当然有时候插件里面也可能会有ES6，有时候需要对个别插件包编译一下
                //include: [resolve('src'), resolve('node_modules/swiper'), resolve('node_modules/dom7')],
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!postcss-loader!less-loader'
                }),
                exclude: /node_modules/,
                // loader: 'style-loader!css-loader?modules!less-loader!postcss-loader',//简写
                // !感叹号是分割符，表示两个工具都参与处理。
                // ?问号，其实跟url的问号一样，就是后面要跟参数的意思。
                //注意顺序style css最后才是Less不然会报错
            }
        ]
    },
    //插件
    plugins: [
        new ExtractTextPlugin({filename: "style.css"}),
    ]
};