const we = require('./welcome');
const html = require('./common.html');
we()
function render() {
    document.querySelector('#app').innerHTML = html;
}
render();
// if (module.hot) {//当热更开启时，修改对应的文件welcome执行对应的逻辑
// 	module.hot.accept(['./welcome.js'], () => {
// 		console.log('update了');
// 	})
// }
