"use strict";

(function(){

function createSelector(elm){
	let stations = LopApp.getSelectorStations();
	let options = stations.map(st=>$("<option>").attr("value",st).text(st));
	elm.append(...options);
}
function do_calc(){
	let sts = $("#sl-start-station").val();
	let ste1 = $("#sl-end-station1").val();
	let ste2 = $("#sl-end-station2").val();
	let f_include_jr = $("#cb-include-jr").prop("checked");
	calc_start();
	let f_use_slim = $("#cb-use-slim").prop("checked");
	LopApp.calc(sts,ste1,ste2,f_include_jr,f_use_slim).then(result=>{
		//on resolve
		calc_end();
		proc_result(result);
	}, e=>{
		//on reject
		calc_end();
		error_handler(e);
	});
}
let f_calc = false;
function calc_start(){
	$("#btn-calc").prop("disabled",true);
	f_calc = true;
	$("#ta-result").val("計算しています...")
}
function calc_end(){
	$("#btn-calc").prop("disabled",false);
	f_calc = false;
}

function result_template(value, routes_string, time){
	return `最長距離: ${value}km (計算時間:${time/1000}秒)\n最長経路:\n${routes_string}`;
}
//let current_result = {value:0,routes:[],routes_withValue:[],routes_raw:[]};
let current_result;
function proc_result(result){
	_proc_result(result);
	$("#ta-stack").val(JSON.stringify(result.routes_raw));
	current_result = result;
}
function _proc_result(result){
	let str = result.toString($("#cb-with-value").prop("checked"));
	//(($("#cb-with-value").prop("checked"))?result.routes_withValue:result.routes).join("\n");
	let result_str = result_template(result.value, str, result.time);
	//console.log(result.toString());
	$("#ta-result").val(result_str);
}
function error_handler(e){
	$("#ta-result").val("Error! "+e);
}
function switch_result(){
	/*if($("#ta-stack").val()=="") return;
	let f_withValue = $("#cb-with-value").prop("checked");
	let stack = JSON.parse($("#ta-stack").val());
	//console.log(stack);
	let graph = $("#cb-include-jr").prop("checked")?LopApp.jr_graph:LopApp.main_graph;
	let str = LopSolver.stackUtil.toString(stack,graph,f_withValue);
	let val = stack[0]?LopSolver.stackUtil.getValue(stack[0],graph):0;
	$("#ta-result").val(result_template(val,str));*/
	if(!current_result) return;
	_proc_result(current_result);
}

$(document).ready(function() {
	LopApp.init();
	[$("#sl-start-station"),$("#sl-end-station1"),$("#sl-end-station2")].forEach(createSelector);
	$("#btn-calc").on("click",do_calc);
	$("#cb-with-value").on("click",switch_result);
});

})();
