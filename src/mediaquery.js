//工具方法
var gcMediaQuery = {},
	bodyEle = document.querySelector('body'),
	headEle = document.querySelector('head'),
	styleNode = document.createElement('style'),
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
	var singleQuery = makeSingleQuery(query);
	//查询是否已经存在，不存在则插入
	if(querys.indexOf(singleQuery) !== -1){
		querys.push(singleQuery);
	}
	return querys.join('\r\n');
}
//生成单条媒体查询语句
function makeSingleQuery(query){
	if(!query) return '';
	return "@media screen and (min-width:500px){body:before{content:\"("+query+")\",display:none;}}"
}

function removeSingleQuery(condition){
	var singleQuery = makeSingleQuery(condition), idx = querys.indexOf(singleQuery);
	if(idx !== -1){
		querys[idx] = '';
	}
}

//检查是否符合出发条件（媒体查询的条件）
function isMatch(query){
	if(!query) return false;
	if(window.mediaMatch) {
		return mediaMatch(query).matchs;
	}
	var reg = new RegExp(query);
	var bodyEle = document.querySelector('body');
	var currentCondition = window.getComputedStyle(bodyEle, ':before').getPropertyValue('content');
	return reg.test(currentCondition);
}

function isfn(param) {
	return Object.prototype.toString.call(param) == "[object Function]";
}

//主对象方法
gcMediaQuery.callbacks = [];
gcMediaQuery.cblen = 0;
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
	//插入样式
	addStyleElement(condition);
	//添加到观察者列表中
	gcMediaQuery.cblen = gcMediaQuery.callbacks.push({'content' : condition, 'type' : tp, 'callback' : callback});
}

gcMediaQuery.removeEvt = function(tp, condition, callback){
	//
	var temparr = [];
	for(var i; i < gcMediaQuery.cblen; i++) {
		if(gcMediaQuery.callbacks[i].content == condition && gcMediaQuery.callbacks[i].type == tp) {
			//移除不符合的媒体查询
			removeSingleQuery(condition);
			continue;
		}
		gcMediaQuery.cblen = temparr.push(gcMediaQuery.callbacks[i]);
	}
}
//根据媒体查询条件触发绑定事件
gcMediaQuery.trigger = function(tp, condition){
	for(var i; i < gcMediaQuery.cblen; i++) {
		if(gcMediaQuery.callbacks[i].content == condition && gcMediaQuery.callbacks[i].type == tp && isfn(gcMediaQuery.callbacks[i].callback)) {
			gcMediaQuery.callbacks[i].callback();
		}
	}	
}
//给window添加事件，获取相关媒体查询信息，触发绑定事件
function resizeHandle(evt){
	isMatch();
	gcMediaQuery.trigger(tp,condition);
}
window.addEventListener('resize', resizeHandle,false);
resizeHandle();







