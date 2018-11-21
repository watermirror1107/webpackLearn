//const webpack=require('webpack');
const path = require('path');

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
				//xinclude: [resolve('src'), resolve('node_modules/swiper'), resolve('node_modules/dom7')],
			},
			{
				test:/\.less$/,
				loader: ['less-loader','css-loader','style-loader'],
			}
		]
	},
};