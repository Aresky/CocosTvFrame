/*
 * 远程图片数据管理,管理图片数据的下载
 */

st.DataManage._remoteImageManageInstance = null;

st.DataManage.RemoteImageManage = cc.Class.extend({
	name: "st.DataManage.RemoteImageManage",

	ctor: function() {
		this.m_downLoadedList = []; //缓存已经请求过的图片链接
		this.m_downLoadWaitStack = []; //待下载栈



		// {
		//	 url:"", 图片链接
		// 	 callBack:func 下载完成回调	 
		// }
		this.m_downLoadStack = []; //缓存所有图片的请求，请求完成时需要删掉

		//图片下载监听
		st.notify.addObserver(this, this.onDownImageSucess, st.Const_Notification_Event_DownImageSucess);
	},

	//获取图片
	loadImg: function(url, imageArea, callBack) {
		if (this.m_downLoadedList.indexOf(url) != -1) {
			//已请求过
			var cachedTex = cc.textureCache.getTextureForKey(url);
			if (cachedTex) {
				callBack(cachedTex);
			} else {
				this.addInWaitingStack(url, callBack);
				cc.director.getScheduler().unscheduleCallbackForTarget(this, this._disPatchDownLoadList);
				cc.director.getScheduler().scheduleCallbackForTarget(this, this._disPatchDownLoadList, 0.2, -1);
			}
		} else {
			//没有请求过
			this.m_downLoadedList.push(url);
			st.Net.requestImageWhitUrl(url, function(texture) {
				callBack(texture);
			});
		}
	},

	//获取图片
	_loadImgSprite: function(url, imageArea, callBack) {
		st.log("loadImgSprite:" + url);
		if (this.m_downLoadedList.indexOf(url) != -1) {
			//已请求过
			st.log("已请求过");
			var cachedTex = cc.textureCache.getTextureForKey(url);
			st.dump("cachedTex", cachedTex);
			if (cachedTex) {
				if (cachedTex instanceof cc.Texture2D) {
					var textureHeight = cachedTex.getPixelsHigh();
					var textureWidth = cachedTex.getPixelsWide();
					var sprite = new cc.Sprite(cachedTex, cc.rect(0, 0, textureWidth, textureHeight));
					callBack(sprite);
					st.log("111");
				} else {
					st.log("222");
					return null;
				}
			} else {
				st.log("333");
				this.addInWaitingStack(url, callBack);
				cc.director.getScheduler().unscheduleCallbackForTarget(this, this._disPatchDownLoadList);
				cc.director.getScheduler().scheduleCallbackForTarget(this, this._disPatchDownLoadList, 0.2, -1);
			}
		} else {
			//没有请求过
			st.log("没有请求过");
			this.m_downLoadedList.push(url);
			st.Net.requestImageWhitUrl(url, function(texture) {
				if (texture instanceof cc.Texture2D) {
					var textureHeight = texture.getPixelsHigh();
					var textureWidth = texture.getPixelsWide();
					var sprite = new cc.Sprite(texture, cc.rect(0, 0, textureWidth, textureHeight));
					callBack(sprite);
				} else {
					return null;
				}
			});
		}
	},

	//下载图片(通过java下载)
	loadImgSprite: function(url, imageArea, callBack) {
		//java通过url下载图片，下载完成之后会发送通知
		//先检查textureCache里是否已经有此图片
		var cachedTex = cc.textureCache.getTextureForKey(url);
		if (cachedTex) {
			if (cachedTex instanceof cc.Texture2D) {

			} else {
				st.log("图片纹理缓存有问题！url:" + url);
				return null;
			}
		} else {
			//如果没有再检查sd卡缓存中是否有此图片文件，有就异步加载进textureCache
			var filePath = st.js2java.checkImageExist(url);
			if (filePath === "") {
				//没有,去下载
				st.log("没有,去下载");
				var req = {};
				req.url = url;
				req.callBack = callBack;

				this.m_downLoadStack.push(req);

				st.js2java.downLoadImage(url);
			} else {
				//有,异步加载进textureCache
				st.log("有,异步加载进textureCache");
				this.loadImgAsync(filePath, callBack);
			}
		}
	},

	//处理图片下载完成
	onDownImageSucess:function(url){
		var index = 0;
		for(var key in this.m_downLoadStack){
			var obj = this.m_downLoadStack[key];
			if(obj && obj.url === url){
				//异步加载此图片
				var filePath = st.js2java.checkImageExist(url);
				this.loadImgAsync(filePath, obj.callBack);
				index = key;

				break;
			}
		}

		this.m_downLoadStack.splice(index, 1);
	},

	//每隔一定时间检查cache是否有要下载的图
	_disPatchDownLoadList: function() {
		for (var key in this.m_downLoadWaitStack) {
			var tmpObj = this.m_downLoadWaitStack[key];
			if (tmpObj && tmpObj.url != "") {
				st.dump("tmpObj", tmpObj);
				var ret = st.Net.requestImageWhitUrl(tmpObj.url, tmpObj.cb);
			}
		}
		this.removeFromWaitingStack();
	},

	addInWaitingStack: function(url, callBack) {
		var tmpObj = {
				url: url,
				cb: callBack
		};
		if (this.m_downLoadWaitStack.indexOf(tmpObj) === -1) {
			this.m_downLoadWaitStack.push(tmpObj);
		}
	},

	removeFromWaitingStack: function() {
		var index = -1;
		for (var i = 0; i < this.m_downLoadWaitStack.length; i++) {
			var cachedTex = cc.textureCache.getTextureForKey(this.m_downLoadWaitStack[i].url);
			if (cachedTex) {
				index = i;
				break;
			}
		}
		if (index != -1) {
			st.dump("index", index);
			this.m_downLoadWaitStack.splice(index, 1);
		}
	},

	//异步加载纹理
	loadImgAsync: function(filePath, cb) {
		cc.log("" + filePath);
		cc.textureCache.addImageAsync(filePath, function(texture) {
			if (texture instanceof cc.Texture2D) {
				cc.log("loadImgAsync success!");
				var textureHeight = texture.getPixelsHigh();
				var textureWidth = texture.getPixelsWide();
				var sprite = new cc.Sprite(texture, cc.rect(0, 0, textureWidth, textureHeight));
				cb(sprite);
		
				//st.dump("loadImgAsync", cc.textureCache.getCachedTextureInfo());
				return;
			}else{
				cc.log("loadImgAsync failure!");
			}
		});
	}


});

st.DataManage.RemoteImageManage.getInstance = function() {
	if (!st.DataManage._remoteImageManageInstance) {
		st.DataManage._remoteImageManageInstance = new st.DataManage.RemoteImageManage();
		return st.DataManage._remoteImageManageInstance;
	} else {
		return st.DataManage._remoteImageManageInstance;
	}
}