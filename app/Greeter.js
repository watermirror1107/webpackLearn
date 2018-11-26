const config=require('./config.json');
function f() {
	console.log(config);
	console.log('fun');
	a()
}
let a=()=>{
	console.log('arrow1')
};
module.exports=f;

