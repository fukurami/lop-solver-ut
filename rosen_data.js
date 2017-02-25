"use strict";

const ROSEN = (function(){

var rosen_data = [
	{name:"銀座線",stations:[
		{name:"青山一丁目",km:1.4},
		{name:"赤坂見附",km:2.7},
		{name:"溜池山王",km:3.6},
		{name:"銀座",km:5.9},
		{name:"日本橋",km:7.3}
	]},
	{name:"丸ノ内線",stations:[
		{name:"新宿三丁目",km:16.3},
		{name:"四ツ谷",km:13.7},
		{name:"赤坂見附",km:12.4},
		{name:"国会議事堂前",km:11.5}
	]},
	{name:"丸ノ内線",stations:[
		{name:"霞ケ関",km:10.8},
		{name:"銀座",km:9.8},
		{name:"大手町",km:8.1},
		{name:"本郷三丁目",km:5.6},
		{name:"後楽園",km:4.8},
		{name:"池袋",km:0}
	]},
	{name:"日比谷線",stations:[
		{name:"中目黒",km:0},
		{name:"霞ケ関",km:7},
		{name:"日比谷",km:8.2},
		{name:"銀座",km:8.6},
		{name:"茅場町",km:11.1},
		{name:"北千住",km:20.3}
	]},
	{name:"東西線",stations:[
		{name:"中野",km:0},
		{name:"飯田橋(東西線)",km:8},
		{name:"九段下(東西線)",km:8.7},
		{name:"大手町",km:10.7},
		{name:"日本橋",km:11.5},
		{name:"茅場町",km:12},
		{name:"西船橋",km:30.8}
	]},
	{name:"千代田線",stations:[
		{name:"代々木上原",km:0},
		{name:"明治神宮前",km:2.2},
		{name:"表参道",km:3.1},
		{name:"国会議事堂前",km:6.4},
		{name:"霞ケ関",km:7.2}
	]},
	{name:"千代田線",stations:[
		{name:"日比谷",km:8},
		{name:"大手町",km:9.4},
		{name:"根津",km:13.1},
		{name:"北千住",km:19.3}
	]},
	{name:"有楽町線",stations:[
		{name:"市ケ谷",km:17.5},
		{name:"永田町",km:19.3}
	]},
	{name:"半蔵門線",stations:[
		{name:"渋谷",km:0},
		{name:"表参道",km:1.3},
		{name:"青山一丁目",km:2.7},
		{name:"永田町",km:4.1},
		{name:"九段下",km:6.7},
		{name:"大手町",km:8.8},
		{name:"押上",km:16.8},
	]},
	{name:"南北線",stations:[
		{name:"目黒",km:0},
		{name:"白金高輪",km:2.3},
		{name:"溜池山王",km:5.7},
		{name:"永田町",km:6.6},
		{name:"四ツ谷",km:7.9},
		{name:"市ケ谷",km:8.9},
		{name:"飯田橋",km:10},
		{name:"後楽園",km:11.4},
		{name:"東大前",km:12.7}
	]},
	{name:"副都心線",stations:[
		{name:"池袋",km:11.3},
		{name:"新宿三丁目",km:16.6},
		{name:"明治神宮前",km:19.2},
		{name:"渋谷",km:20.2}
	]},
	{name:"浅草線",stations:[
		{name:"三田",km:8},
		{name:"大門",km:9.5}
	]},
	{name:"三田線",stations:[
		{name:"白金高輪",km:2.3},
		{name:"三田",km:4},
		{name:"神保町",km:9.6},
		{name:"春日",km:11.3}
	]},
	{name:"新宿線",stations:[
		{name:"新宿",km:0},
		{name:"九段下",km:5},
		{name:"神保町",km:5.6},
		{name:"森下",km:9.5}
	]},
	{name:"大江戸線",stations:[
		{name:"都庁前",km:0},
		{name:"春日",km:6.8},
		{name:"本郷三丁目(大江戸線)",km:7.6},
		{name:"森下",km:12.7},
		{name:"大門",km:20},
		{name:"新宿",km:27.8},
		{name:"都庁前",km:28.6}
	]},
	{name:"京王新線",stations:[
		{name:"新宿",km:0},
		{name:"笹塚",km:3.6}
	]},
	{name:"京王線",stations:[
		{name:"笹塚",km:3.6},
		{name:"明大前",km:5.2}
	]},
	{name:"井の頭線",stations:[
		{name:"明大前",km:4.9},
		{name:"下北沢",km:3.0},
		{name:"駒場東大前",km:1.4}
	]},
	{name:"小田急線",stations:[
		{name:"下北沢",km:4.9},
		{name:"代々木上原",km:3.5}
	]},
	{name:"大井町線",stations:[
		{name:"旗の台",km:3.2},
		{name:"大岡山",km:4.8},
		{name:"自由が丘",km:6.3},
		{name:"二子玉川",km:10.4}
	]},
	{name:"田園都市線", stations:[
		{name:"渋谷",km:0},
		{name:"二子玉川",km:9.4}
	]},
	{name:"東横線",stations:[
		{name:"渋谷",km:0},
		{name:"中目黒",km:2.2},
		{name:"自由が丘",km:7},
		{name:"田園調布",km:8.2},
		{name:"多摩川",km:9}
	]},
	{name:"東急多摩川線",stations:[
		{name:"多摩川",km:0},
		{name:"蒲田",km:5.6}
	]},
	{name:"池上線",stations:[
		{name:"旗の台",km:3.1},
		{name:"蒲田",km:10.9}
	]},
	{name:"目黒線",stations:[
		{name:"目黒",km:0},
		{name:"大岡山",km:4.3},
		{name:"田園調布",km:6.5}
	]},
	{name:"東武伊勢崎線",stations:[
		{name:"押上",km:1.1},
		{name:"北千住",km:7.1}
	]},
	{name:"徒歩連絡",stations:[
		{name:"永田町",km:0},
		{name:"赤坂見附",km:0}
	]},
	{name:"徒歩連絡",stations:[
		{name:"国会議事堂前",km:0},
		{name:"溜池山王",km:0}
	]},
	{name:"JR接続",stations:[
		{name:"北千住",km:0},
		{name:"北千住(JR)",km:0}
	]}
];

var jr_data = [
	{name:"北千住JR西船橋",stations:[
		{name:"北千住",km:0},
		{name:"西船橋",km:1004.4}
	]},
	{name:"北千住JR中野",stations:[
		{name:"北千住(JR)",km:0},
		{name:"中野",km:1017.3}
	]},
	{name:"西船橋JR中野",stations:[
		{name:"西船橋",km:0},
		{name:"中野",km:996.7}
	]}
];

var main_stations = ["本郷三丁目","本郷三丁目(大江戸線)","東大前","根津","駒場東大前","代々木上原"];

var o_connects=[
	["九段下","九段下(東西線)"],
	["飯田橋","飯田橋(東西線)"],
	["中野","北千住(JR)","西船橋"],
	["北千住","北千住(JR)"]
];

return {
	rosen_data,
	jr_data,
	main_stations,
	o_connects
};

})();
