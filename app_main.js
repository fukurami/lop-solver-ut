"use strict";

const LopApp = (function(){
	let _f_ready = false;
	let rosenx10 = function (rosen){//各路線のkmを10倍する。value計算時に/=10するのを忘れずに。
		return rosen.map(r=>{
			r.stations = r.stations.map(s=>{
				s.km = Math.round(s.km*10); return s;
			});	return r;
		});
	};
	return {
		init:function(){
			let [rosen_data,jr_data] = [ROSEN.rosen_data,ROSEN.jr_data,rosen_data_slim].map(rosenx10);
			let o_connects = ROSEN.o_connects;
			this.main_stations = ROSEN.main_stations;
			this.main_graph = new Graph(rosen_data, o_connects);
			this.jr_graph = new Graph(rosen_data.concat(jr_data), o_connects);
			this.slim_graph = new Graph(rosen_data_slim, []);
			this.main_solver = new LopSolver(this.main_graph);
			this.jr_solver = new LopSolver(this.jr_graph);
			this.slim_solver = new LopSolver(this.slim_graph);
			_f_ready = true;
		},
		calc:function(bp,ep1,ep2,inc_jr,use_slim){
			if(!_f_ready) return Promise.reject("App not ready.");
			let solver = inc_jr?this.jr_solver:this.main_solver;
			let graph = inc_jr?this.jr_graph:this.main_graph;
			if(use_slim){
				solver = this.slim_solver;
				graph = this.slim_graph;
			}
			if(!bp || (!ep1&&!ep2)) return Promise.reject("駅が選択されていません")
			let [bpi,epi1,epi2] = [bp,ep1,ep2].map(p=>graph.findPoint(p));
			return new Promise((resolve,reject)=>{
				if(bpi==-1 || (epi1==-1&&epi2==-1)){
					let str = [bpi,epi1,epi2].filter(v=>v==-1).map(v=>graph.points[v].name).join(", ");
					reject("駅「"+str+"」が見つかりません");
					return;
				}
				console.time("solver");
				let result = solver.search(bpi,epi1,epi2);
				console.timeEnd("solver");
				result.value /= 10; //km合計を1/10する
				resolve(result);
			});
		},
		getSelectorStations:function(){
			if(!_f_ready) return [""];
			return [""].concat(this.main_stations.concat(this.jr_graph.points.map(p=>p.name).filter(s=>this.main_stations.indexOf(s)==-1)));
		}
	};
})();
