const webpack=require('webpack');
const path = require('path');
//extract-text-webpack-plugin插件可以吧打包在js里面的css抽出来单独引用
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//页面模板哈希值引入插件
const HtmlWebpackPlugin=require('html-webpack-plugin');
//清除多余哈希值打包出来的文件
const cleanWebpack=require('clean-webpack-plugin');
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
        filename: 'bundle-[hash].js',
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
        new ExtractTextPlugin({filename: "style.css"}),//把css拿出来单独引入
        new webpack.BannerPlugin('头皮发麻'),//在打包后的js头部加入注释
        new HtmlWebpackPlugin({
            template: __dirname + "/public/index.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),//为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        //new webpack.optimize.minimize()//压缩JS代码；
        //new webpack.HotModuleReplacementPlugin() //热加载插件,上面webpack-dev-server里面已经开启了热更
    ]
};