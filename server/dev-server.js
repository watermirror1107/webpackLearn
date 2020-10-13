const commonConfig = require('./common');
const merge = require('webpack-merge');
let obj1 = {
    //调试工具找到问题的出处sourcemap
    devtool: 'eval-source-map',//开启source-map
    //webpack的服务器
    devServer: {
        port: 3000,
        //watchContentBase:true,//自动刷新，跟热更冲突
        //quiet: true,//除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。建议不要开启，不然出错不知道哪里找
        contentBase: './public/',//本地服务其所加载的页面所在的目录
        historyApiFallback: true,//任意的 404 响应都可能需要被替代为模板首页,也可以传入一个对象参数来重写路由 rewrites: [{ from: /^\/$/, to: '/views/landing.html' },{ from: /^\/subpage/, to: '/views/subpage.html' },{ from: /./, to: '/views/404.html' }]
        compress: true,//开启gzip，这个是测试服务器用的，不需要配合CompressionWebpackPlugin插件，插件是拿来打包用的
        inline: true,
        hot: true,//开启热更
        clientLogLevel: 'none',//关闭log日志
        headers: {'name': 'jason'}//给所有的Http请求添加一个统一的请求头
    },
};
module.exports = merge(obj1, commonConfig);
