const commonConfig = require('./common');
const merge = require('webpack-merge');
let obj1={
    //调试工具找到问题的出处sourcemap
    devtool: 'eval-source-map',//开启source-map
    //webpack的服务器
    devServer: {
        port: 3000,
        contentBase: './public/',//本地服务其所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        compress: true,//开启gzip，这个是测试服务器用的，不需要配合CompressionWebpackPlugin插件，插件是拿来打包用的
        // inline: false,
        hot: true,//开启热更
        noInfo: false
    },
};
module.exports = merge(obj1, commonConfig);
