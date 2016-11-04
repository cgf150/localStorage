# localStorage
本地缓存API封装
	
#title:本地缓存 API
#维护者邮箱:cgf_150@163.com

#方法
		set(name,value,time)		//设置某条缓存 (time格式: 设置天数--'day:2' 或者 设置分钟-- 'min:2'  time为可选参数，默认会设置在1天后过期)
		get(name)			//取某条缓存
		cycle()				//删除过期缓存  - 页面加载后自动运行
		clear()				//清空缓存(！慎用)
		remove(name)		//删除某条缓存

#使用
		myStorage.set(name,value);
