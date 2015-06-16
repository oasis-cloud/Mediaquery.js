//工具方法
var gcMediaQuery = {},
	bodyEle = document.querySelector('body'),
	headEle = document.querySelector('head'),
	styleNode = document.createElement('style'),
	until = {},
	token = null，
	querys = [],

	styleNode.type = 'text/css';


function addStyleElement(query){
	styleNode.innerText = makeStyleText(query);
	bodyEle.appendChild(styleNode);
}
//组织stye元素的监测字符串
//@media screen and (min-width:500px){body:before{content:"(min-width:500px)",display:none;}}
function makeStyleText(query){
	//匹配条件，然后组织,需要防止重复
	if(!query) return '';
	var singleQuery = makeSingleQuery(query),
		len = querys.length, i = len;
	for(;i > 0;i--) {
		if(querys.indexOf(singleQuery) !== -1) continue;
		querys.unshift(singleQuery);
	}
	return querys.join('\r\n');
}
//生成单条媒体查询语句
function makeSingleQuery(query){
	if(!query) return '';
	return "@media screen and (min-width:500px){body:before{content:\"("+query+")\",display:none;}}"
}
//检查是否符合出发条件（媒体查询的条件）
function isMatch(query){
	if(!query) return false;
	if(window.mediaMatch) {
		return mediaMatch(query).matchs;
	}
	var reg = new RegExp(query);
	return reg.test(query);
}
//主对象方法

//支持多个条件添加同一事件
gcMediaQuery.match = function(condition, callback){
	gcMediaQuery.addEvt('match', condition, callback);
}

gcMediaQuery.unmatch = function(condition, callback){
	gcMediaQuery.addEvt('unmatch', condition, callback);
}

//支持多个条件移除同一事件
gcMediaQuery.offmatch = function(condition, callback){
	gcMediaQuery.removeEvt('match', condition, callback);
}

gcMediaQuery.offunmatch = function(condition, callback){
	gcMediaQuery.removeEvt('unmatch', condition, callback);
}

gcMediaQuery.addEvt = function(tp, condition, callback){
	//添加到观察者列表中
}

gcMediaQuery.removeEvt = function(tp, condition, callback){
	//从观察者列表中移除
}
//根据媒体查询条件触发绑定事件
gcMediaQuery.trigger ＝ function(condition){

}
//给window添加事件，获取相关媒体查询信息，触发绑定事件
function resizeHandle(evt){
	
}
window.addEventListener('resize', resizeHandle,false);








