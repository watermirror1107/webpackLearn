const webpack = require('webpack');
const path = require('path');
//extract-text-webpack-plugin插件可以吧打包在js里面的css抽出来单独引用
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//页面模板哈希值引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//清除多余哈希值打包出来的文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
//optimize-css-assets-webpack-plugin压缩css

function resolve(dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	//环境
	mode: 'production',//process.env.NODE_ENV === 'production'
	//调试工具
	devtool: 'eval-source-map',
	entry: {
		'pageOne':__dirname + '/app/main.js',
		'pageTwo':__dirname + '/app/main2.js'
	},//多页面入口
	output: {
		path: __dirname + '/dist',//输出目录
		//前面加JS就会生成一个JS文件夹来放JS
		filename: 'js/[name]-[hash].js',//多入口打包的时候不想把多个文件打包成一个，就需要占位符，有name,hash,chunkhash,chunkhash类似于版本hash，如果这个文件没有改动打包的时候chunkhash是不会变化的；
		//publicPath:''//给引用的这写文件加上绝对路径，比如CDN加速之类的
	},
	//webpack的服务器
	devServer: {
		port: 3000,
		contentBase: './public',//本地服务i其所加载的页面所在的目录
		historyApiFallback: true,//不跳转
		inline: true,//自动刷新
		hot: true,//热更
		open:true//启动后自动打开浏览器
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
				loader: 'babel-loader',
				// query: {
				// 	presets: ['env'],
				// },
				exclude:  path.resolve(__dirname,'node_modules'), //路径必须是绝对路径,(includes里面也必须是绝对路径)屏蔽插件里面的编译，当然有时候插件里面也可能会有ES6，有时候需要对个别插件包编译一下
				//include: [resolve('src'), resolve('node_modules/swiper'), resolve('node_modules/dom7')],
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader?importLoaders=1!postcss-loader!less-loader',
				}),
				exclude: path.resolve(__dirname,'node_modules'),
				// loader: 'style-loader!css-loader?modules!less-loader!postcss-loader',//简写
				// !感叹号是分割符，表示两个工具都参与处理。
				// ?问号，其实跟url的问号一样，就是后面要跟参数的意思。
				//注意顺序loader的顺序，顺序是从右到左；css最后才是Less不然会报错
			}
		],
	},
	//插件
	plugins: [
		new ExtractTextPlugin({
			filename: 'css/style.[contentHash:8].css',
			allChunks: true,
		}),//把css拿出来单独引入
		new webpack.BannerPlugin('头皮发麻'),//在打包后的js头部加入注释
		//如果是多入口单页面输出只要一个htmlwebapckplugin就够了，多个页面多个输出就需要多个htmlwebpackplugin
		new HtmlWebpackPlugin({   //new 一个这个插件的实例，并传入相关的参数
			template: __dirname + '/public/index.html', //生成页面时候需要的模板页面
			minify: {
				removeComments: true,//移除注释
				collapseWhitespace: true,//移除多余空格
				removeAttributeQuotes: true,//删除属性双引号
			},
			inject:'head',//把JS放进head标签里面,可选择自己先要放入的位置，注意引用顺序
			title:'webpack is best!',//随便定义想要传递给模板页面的参数
			blueTeeth:'蓝牙',
			filename:'pageOne.html',//生成页面名
			chunks:['pageOne']//入口分支名，和entry里面的一致,当需要多个入口打包生成不同页面的时候就需要用到这个属性
		}),
		//多入口多页面输出，可以同一个模板也可以不同模板
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.html',
			inject:'body',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
			},
			filename:'pageTwo-[hash].html',//生成页面名
			chunks:['pageTwo']
		}),
		new CleanWebpackPlugin('dist', { //删除之前打包的dist下面的所有文件
			root: __dirname,
			verbose: true,
			dry: false,
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),//为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
		new webpack.HotModuleReplacementPlugin(), //热加载插件,上面webpack-dev-server里面已经开启了热更
	],
};