"use strict";
const LopSolver = (function(){

class RouteTracer{
	constructor(){
		this.routes = [];
		this.value = 0;
		this.time = performance.now();
		return this;
	}
	add(stack,value){
		let d = value-this.value;
		if(d>0){
			console.log(value, stack);
			this.routes = [stack];
			this.value = value;
		}
		/*else if(d===0){
			console.log(value, stack);
			this.routes.push(stack);
		}*/
	}
	result(graph){
		return {
			routes:this.routes.map(
				s=>stack_toString(s,graph)
			),
			routes_withValue:this.routes.map(
				s=>stack_toString_withValue(s,graph)
			),
			value:this.value,
			routes_raw:this.routes,
			time:performance.now()-this.time,
			toString:function(f_withValue){
				return this.routes_raw.map(st=>(f_withValue)? stack_toString_withValue(st,graph):stack_toString(st,graph)).join("\n");
			}
		};
	}
}

function stack_toString(stk,graph){
	let arr = [];
	stk.replace(/([pe])(\d+)/g,function(match,p1,p2){
		p2 = parseInt(p2,10);
		arr.push(p1==="p"?graph.points[p2].name:"["+graph.edges[p2].name+"]");
	});
	return arr.join(" - ");
}
function stack_toString_withValue(stk, graph){
	let {points,edges} = graph;
	let arr = [];
	let val = 0;
	stk.replace(/([pe])(\d+)/g, function(match,p1,p2){
		p2=parseInt(p2,10);
		let str="";
		if(p1=="e"){
			val += edges[p2].value;
			str = "["+edges[p2].name+"]";
		}
		else if(p1=="p"){
			str = points[p2].name+"<"+(/*Math.round(val*10)*/val/10)+"km>";
		}
		arr.push(str);
	});
	return arr.join(" - ");
}
function stack_addPoint(stk,pi){
	return stk + "p" + pi.toString(10);
}
function stack_addPointAndEdge(stk,ei,pi){
	return stk + "e" + ei.toString(10) + "p" + pi.toString(10);
}

function getValueFromStack(stk,graph){
	let val = 0;
	stk.replace(/e(\d+)/g, function(match,p1){
		val += graph.edges[p1|0].value;
	});
	return val/10;
}

function clone_array_1d(arr){
	let newa = [];
	let len = arr.length;
	for(let i=0;i<len;i++){
		newa[i]=arr[i];
	}
	return newa;
}

class LopSolver{
	constructor(graph){
		this.graph = graph;
	}
	search(begin_point_id,end_point_id,end_point_id2){
		const POINTS = this.graph.points;
		const EDGES = this.graph.edges;
		const tracer = new RouteTracer();
		const search_inner = (current_point_id,flags,stack,value,fend)=>{
			let c_edges = POINTS[current_point_id].edges2.filter(edge=>
				flags[edge.to]
			);
			let len = c_edges.length;
			if(current_point_id===end_point_id||current_point_id==end_point_id2){
				tracer.add(stack,value);
				if(fend) return;
				fend=true;
			}
			if(len===0){
					return;
			}
			c_edges.forEach(edge=>{
				const nx_edge_id =	edge.id;
				const nx_point_id = edge.to;
				const nx_flags = clone_array_1d(flags);
				nx_flags[nx_point_id] = false;
				POINTS[nx_point_id].o_connects.forEach(oci=>{nx_flags[oci]=false});
				search_inner(nx_point_id,nx_flags,
					stack_addPointAndEdge(stack,nx_edge_id,nx_point_id),
					value + EDGES[nx_edge_id].value,fend
				);
			})
		}
		let flags = Array(POINTS.length).fill(true);
		flags[begin_point_id]=false;
		search_inner(
			begin_point_id,
			flags,
			stack_addPoint("",begin_point_id),
			0,
			(end_point_id==-1||end_point_id2==-1)
		);
		return tracer.result(this.graph);
	}
}

LopSolver.stackUtil = {
	toString(stack,graph,f_withValue){
		if(stack.constructor!=Array){
			stack = [stack];
		}
		return stack.map(st=>(f_withValue)? stack_toString_withValue(st,graph):stack_toString(st,graph)).join("\n");
	},
	getValue(stack,graph){
		return getValueFromStack(stack,graph);
	}
};

return LopSolver;
})();
