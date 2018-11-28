import we from './welcome';
we();
import html from './common.html';
function render() {
	document.querySelector('#app').innerHTML=html;
}
render();