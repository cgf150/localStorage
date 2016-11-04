/*	
	title:本地缓存 API
	维护者邮箱:cgf_150@163.com
*/
	//方法
		/*
			set(name,value,time)		//设置某条缓存 (time格式: 设置天数--'day:2' 或者 设置分钟-- 'min:2'  time为可选参数，默认会设置在1天后过期)
			get(name)			//取某条缓存
			cycle()				//删除过期缓存  - 页面加载后自动运行
			clear()				//清空缓存(！慎用)
			remove(name)		//删除某条缓存
		*/
	//使用
		//myStorage.set(name,value);

window.myStorage=(function(win,dom){
	var is={},arr=['String','Array','Boolean','Number','Object'],storage=localStorage,j2s=JSON.stringify,j2p=JSON.parse,tempStr='[',returnStr='';
	
	if(typeof window.localStorage == undefined){
		return console.warn('your browser did\'t support the localstorage!')
	}

	//添加/修改缓存
	function fnSet(name,value,time){
		var now=new Date();
		var futuretime=new Date();
		if(typeof time != 'undefined'){
			var timeArr=time.split(':');
			var type=timeArr[0];
			var timeStr=timeArr[1];
			switch(type){	//目前为了省事只设置了分钟和天数，有需要的朋友可以自行补充
				case 'min':
				futuretime.setMinutes(now.getMinutes()+parseFloat(timeStr));
				break;
				case 'day':
				futuretime.setDate(now.getDate()+parseFloat(timeStr));
				break;
				default:
				futuretime.setDate(now.getDate()+parseFloat(timeStr));
				console.warn('the time format is "min" or "day",and you set '+type+' ,now we set the day for you')
				break;
			}
		}else{
			futuretime.setDate(now.getDate()+1);	
		}

		storage.setItem(name,deliver(value)+':-:'+futuretime.getTime());
	}

	//获取缓存
	function fnGet(name){
		var getVal=storage.getItem(name);
		if(getVal==null){
			return console.log('the localstorage did\'t have'+name);
		}
		if((getVal.split(':-:')).lenght>1){
			return eval('('+getVal.split(':-:')[0]+')');
		}
		return getVal.split(':-:')[0];
		
	}

	//删除缓存
	function fnRemove(name){
		storage.removeItem(name);
	}

	//删除过期缓存
	function fnRecycle(){
		for(var i in storage){
			if(isDated(storage[i])){
				var delName=i;
				fnRemove(delName);
			}
		}
	}

	//清空缓存
	function fnClear(){
		var bConfirm=confirm('are you sure to clear all the localstorage ?');
		if(bConfirm){
			storage.clear();
		}
	}

	//设置缓存时判断传入值，把传入值变成字符串存储
	function deliver(value){
		var str=value;
		if(is.String(str)||is.Boolean(str)){
			str="'"+str+"'";
		}else if(is.Number(str)){
			str=str;
		}else if(is.Object(str)){
			str=j2s(str);
		}else if(is.Array(str)){
			for(var i=0,len=str.length;i<len;i++){
				if(i==len-1){
					tempStr+=deliver(str[i])+']';
				}else{
					tempStr+=deliver(str[i])+',';
				}
			}
			returnStr=tempStr;
			tempStr='[';
			return returnStr;
		}
		return str;
	}

	//判断是缓存否过期
	function isDated(storageItem){
		var nowDate=new Date();
		nowDate=nowDate.getTime();
		var itemArr=storageItem.split(':-:');
		if(itemArr.length>1){
			var timeCuo=parseInt(itemArr[1]);
			if(nowDate-timeCuo>0){
				return true;
			}
		}
		return false;
	}

	//常用类型检查
	(function(){
		for(var i=0,len=arr.length;i<len;i++){
			(function(sType){
				is[sType]=function(value){
					return Object.prototype.toString.call(value)=='[object '+sType+']';
				}
			})(arr[i])
		}
	})();

	fnRecycle();

	return {
		set:fnSet,
		get:fnGet,
		remove:fnRemove,
		clear:fnClear,
		cycle:fnRecycle
	}
})(window,document);
