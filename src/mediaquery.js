//工具方法
var gcMediaQuery = {},
	bodyEle = document.querySelector('body'),
	headEle = document.querySelector('head'),
	styleNode = document.createElement('style'),
	querys = [],//用于组织没提查询
	isresize = false,
	RELATION = {};//条件关系


	styleNode.type = 'text/css';


function addStyleElement(query){
	styleNode.innerText = makeStyleText(query);
	headEle.appendChild(styleNode);
}
//组织stye元素的监测字符串
//@media screen and (min-width:500px){body:before{content:"(min-width:500px)",display:none;}}
function makeStyleText(query){
	//匹配条件，然后组织,需要防止重复
	if(!query) return '';
	var singleQuery = makeSingleQuery(query);

	//查询是否已经存在，不存在则插入
	if(querys.indexOf(singleQuery) == -1){
		querys.push(singleQuery);
	}
	
	return 'body:before{content:"normal",display:none;}' + querys.join('\r\n');
}
//生成单条媒体查询语句
function makeSingleQuery(query){
	if(!query) return '';
	return "@media screen and (min-width:500px){body:before{content:\""+query+"\";display:none;}}"
}

function removeSingleQuery(condition){
	var singleQuery = makeSingleQuery(condition), idx = querys.indexOf(singleQuery);
	if(idx !== -1){
		querys[idx] = '';
	}
}

function isfun(param) {
	return Object.prototype.toString.call(param) == "[object Function]";
}

//主对象属性初始化
gcMediaQuery.callbacks = [];
gcMediaQuery.cblen = 0;
gcMediaQuery.allMatchs = {'tp':'','condition':''};


gcMediaQuery.isMatch = function(query){
	if(!query) return false;
	if(window.matchMedia) {
		return matchMedia(query).matches;
	}
	var reg = new RegExp(query);
	var currentCondition = window.getComputedStyle(bodyEle, ':before').getPropertyValue('content');	
	return reg.test(currentCondition);
}
//检查是否符合出发条件（媒体查询的条件）

gcMediaQuery.getMatch = function(token){
	var i, query = null;
	for(i in RELATION) {
		query = RELATION[i].query;
		if(!query) continue;
		gcMediaQuery.allMatchs = {'tp':'','query':query};
		//当匹配，match触发
		if(gcMediaQuery.isMatch(query) && RELATION[i].tp == 'match'){
			gcMediaQuery.allMatchs = RELATION[i];
		}
		//当不匹配，unmatch触发
		if(!gcMediaQuery.isMatch(query) && RELATION[i].tp == 'unmatch'){
			gcMediaQuery.allMatchs.tp = 'unmatch';
			gcMediaQuery.allMatchs.query = query;
		}
		//当匹配，并且之前触发了unmatch，则转化为match触发
		if(gcMediaQuery.isMatch(query) && RELATION[i].tp == 'unmatch'){
			gcMediaQuery.allMatchs.tp = 'match';
			gcMediaQuery.allMatchs.query = query;
		}
	}
}

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

// gcMediaQuery.offunmatch = function(condition, callback){
// 	gcMediaQuery.removeEvt('unmatch', condition, callback);
// }

gcMediaQuery.addEvt = function(tp, condition, callback){
	var token = null;
	token = escape(tp + condition).replace(/[%|-]+/g, '');
	//保存条件关系
	RELATION[token] = {'tp':tp, 'query':condition};
	//插入样式
	if(tp != 'unmatch'){
		addStyleElement(condition);
	}
	//添加到观察者列表中
	
	gcMediaQuery.callbacks[token] = {'content' : condition, 'type' : tp, 'callback' : callback};
	//
	resizeHandle(token);
}

gcMediaQuery.removeEvt = function(tp, condition, callback){
	//
	var token = null;
	token = escape(tp + condition).replace(/[%|-]+/g, '');

	if(gcMediaQuery.callbacks[token].content == condition && gcMediaQuery.callbacks[token].type == tp) {
		//移除不符合的媒体查询
		removeSingleQuery(condition);
	}
	delete gcMediaQuery.callbacks[token];
			
}
//根据媒体查询条件触发绑定事件
gcMediaQuery.trigger = function(param){
	var token = null;
	//匹配则生成对应的token，之后调用回调用
	console.log(gcMediaQuery.allMatchs)
	console.log(param.tp)
	if(param.tp !== '' && param.tp == 'match') {
		token = escape(param.tp + param.query).replace(/[%|-]+/g, '');
		console.log(token)
	}
	if(param.tp !== '' && param.tp == 'unmatch') {
		token = escape(param.tp + param.query).replace(/[%|-]+/g, '');	
	}
	//
	if(gcMediaQuery.callbacks[token] && isfun(gcMediaQuery.callbacks[token].callback)){
		gcMediaQuery.callbacks[token].callback.call(null);
		return;
	}
}
//给window添加事件，获取相关媒体查询信息，触发绑定事件
function resizeHandle(){
	gcMediaQuery.getMatch();

	gcMediaQuery.trigger(gcMediaQuery.allMatchs);
}
window.addEventListener('resize', resizeHandle,false);








