"use strict";

const Graph = (function(){
	function _createPointData(line_data){
		let points = [];
		let pointsdic = {};
		let id_count = 0;
		line_data.forEach(line=>{
			line.stations.forEach(station=>{
				if(pointsdic[station.name]==undefined){
					points.push({
						id:id_count,
						name:station.name,
						edges2:[],
						o_connects:[]
					});
					pointsdic[station.name]=id_count++;
				}
			});
		});
		return {points, pointsdic};
	}
	function _createPointAndEdgeData(line_data, o_connects){
		let {points,pointsdic} = _createPointData(line_data, o_connects);
		let id_count = 0;
		let edges = [];
		line_data.forEach(line=>{
			let stations = line.stations;
			for(let i=0,a,b;a=stations[i],b=stations[i+1];i++){
				let a_id = pointsdic[a.name];
				let b_id = pointsdic[b.name];
				let edge_id = id_count++;
				edges.push({
					id:edge_id,
					value:Math.abs(a.km-b.km),
					points:[a_id,b_id],
					name:line.name
				});
				points[a_id].edges2.push({to:b_id,id:edge_id});
				points[b_id].edges2.push({to:a_id,id:edge_id});
			}
		});
		for(let i=0; i < points.length; i++){
			points[i].edges2.sort((x,y)=>edges[y.id].value-edges[x.id].value);
		}
		o_connects.forEach(coc=>{
			coc.map(name=>pointsdic[name]).forEach((id,j,arr)=>{
				//console.log(id,j,arr);
				points[id].o_connects = arr.slice(0,j).concat(arr.slice(j+1));
			});
		});

		return {points,edges};
	}

	class Graph{
		constructor(line_data, o_connects){
			let {points,edges} = _createPointAndEdgeData(line_data, o_connects);
			this.points = points;
			this.edges = edges;
			return this;
		}
		findPoint(name){
			let points = this.points;
			let [a,b] = (typeof name=="string")?["name","id"]:["id","name"];
			for(let i=0; i<points.length; i++)
				if(points[i][a]==name)
					return points[i][b];
			return -1;
		}
	}
	return Graph;
})();
