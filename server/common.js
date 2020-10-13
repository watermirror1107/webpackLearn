const webpack = require('webpack');
const path = require('path');
//extract-text-webpack-plugin插件可以吧打包在js里面的css抽出来单独引用
//mini-css-extract-plugin是extract-text-webpack-plugin升级版
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//压缩css用于webpack4以上版本 optimize-css-assets-webpack-plugin压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//页面模板哈希值引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//清除多余哈希值打包出来的文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
//开启gzip打包
const CompressionWebpackPlugin = require('compression-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

__dirname=__dirname+'/../';//注意路径

module.exports = {
    //环境
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',//修改场景
    entry: {
        first: __dirname + '/app/main.js',
        second:  __dirname + '/app/main2.js',
        third: __dirname + '/app/main3.js',
    },//入口
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name]-[hash].js',
        publicPath: '',
    },
    //取消提示
    performance: {
        hints: false,
    },
    //遇到webpack不识别的模块用loader
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'cache-loader!babel-loader',//这里可以使用loaders后面接一个数组，cache-loader是用来提高打包速度的，让bebel-loader的处理结果保存到缓存里面，下次直接去读取cache里面即可,第一次打包可能会比较久
                // query: {             //query也可以在.babelrc里面配置或者在package.json里面配置，一共三个地方可配置
                // 	presets: ['latest'],//需要安装最新的ES编译插件babel-preset-latest
                // },
                exclude: path.resolve(__dirname, 'node_modules'), //路径必须是绝对路径,(includes里面也必须是绝对路径)屏蔽插件里面的编译，当然有时候插件里面也可能会有ES6，有时候需要对个别插件包编译一下,用以下的includes
                //include: [resolve('src'), resolve('node_modules/swiper'), resolve('node_modules/dom7')],
            },
            {
                test: /\.less$/,
                loader:
                    ExtractTextPlugin.extract({
                        fallback: process.env.NODE_ENV === 'production' ? 'css-hot-loader' : 'style-loader',
                        use: 'css-loader!postcss-loader!less-loader',//postcss-loader是给浏览器兼容的样式加前缀，?importLoaders=1y因为处理的是less所以不需要给css-loader加上?importLoaders=1参数
                    }),
                exclude: path.resolve(__dirname, 'node_modules'),
                // loader: 'style-loader!css-loader?modules=true!less-loader!postcss-loader',//简写
                // !感叹号是分割符，表示两个工具都参与处理。
                // ?问号，其实跟url的问号一样，就是后面要跟参数的意思,也可以吧参数放在query里面，但是这样的话只能一个给当前这个loader加参数
                //注意顺序style css最后才是Less不然会报错
            },
            {
                test: /\.html$/,
                loader: 'html-loader',//模板loader
                exclude: path.resolve(__dirname, 'public'),
            },
            {
                test: /\.(jpg|png|gif|svg)$/i,
                loader: 'url-loader?name=assets/[name]-[hash:5].[ext]&limit=20000!image-webpack-loader',        //这里可以用image-webpack-loader压缩图片,url-loader可以吧大小在Limit范围之内的图片变成base64减少http请求
                // query: {
                // 	limit:'20000',
                // 	name:''
                // },
            },
        ],
    },
    //插件
    plugins: [
        new CompressionWebpackPlugin({//开启gzip
            filename: '[path].gz[query]',//生产的文件名
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10,//只处理比这个值大的资源。按字节计算
            minRatio: 0.8//只有压缩率比这个值小的资源才会被处理（minRatio = 压缩大小 / 原始大小）
        }),
        new ExtractTextPlugin({
            filename: 'css/style.css',
            allChunks: true,
        }),
        //把css拿出来单独引入,不然CSS就会被写入头部的style标签里面
        new OptimizeCssAssetsPlugin({ //压缩CSS
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {safe: true, discardComments: {removeAll: true}},
            canPrint: true,
        }),
        //new webpack.BannerPlugin('头皮发麻'),//在打包后的js头部加入注释
        new HtmlWebpackPlugin({
            inject: true,//是否开启自动引入打包后的资源，如果关闭需要手动引入
            //手动引入方式,不要同时开启inject不然会造成双重引入
            //<% for ( var k in htmlWebpackPlugin.files.chunks ) { %>
            //<script src="<%= htmlWebpackPlugin.files.chunks[k].entry %>"></script>
            //<% } %>
            template: __dirname + '/public/template.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            excludeChunks: ['third'],//如果有多个入口又不想全部引入就用这个排除某个chunks
        }),
        new CleanWebpackPlugin('dist', {
            root: __dirname,
            verbose: true,
            dry: false,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),//为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.HotModuleReplacementPlugin(), //热加载插件,上面webpack-dev-server里面已经开启了热更
    ],
};