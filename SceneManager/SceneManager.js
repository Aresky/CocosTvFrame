/*
 *	场景管理
 */

st.SceneManage = {
		name: "st.SceneManage",
		m_sceneStack: new Array(),
		status: new Array(),
		m_bLoading : false,

		//场景切换
		replaceScene: function(nextSceneClass, args, transitionClass, transitionType) {
			st.dump("arguments", arguments);

			var nextScene = null;
			if(arguments.length === 1){
				nextScene = new nextSceneClass();

				this.m_sceneStack.push({
					sceneClass: nextSceneClass,
					sceneObj: nextScene
				});
			}else if(arguments.length === 2){
				nextScene = new nextSceneClass(arguments[1]);

				this.m_sceneStack.push({
					sceneClass: nextSceneClass,
					sceneObj: nextScene,
					param: arguments[1]
				});
			}else if(arguments.length === 4){
				nextScene = new nextSceneClass(arguments[1]);

				this.m_sceneStack.push({
					sceneClass: nextSceneClass,
					sceneObj: nextScene,
					param: arguments[1]
				});

				var transition = new transitionClass(1.0, nextScene, transitionType);
				cc.director.replaceScene(transition);
				return;
			}

			if(nextScene){
				cc.director.replaceScene(nextScene);
			}
		},

		//返回上一个场景
		goBack: function() {
			this.m_sceneStack.pop();
			var curSceneInfo = this.m_sceneStack.pop();
			var preSceneClass = curSceneInfo.sceneClass;
			if (preSceneClass) {
				if (curSceneInfo.param) {
					this.replaceScene(preSceneClass, curSceneInfo.param);
				} else {
					this.replaceScene(preSceneClass);
				}
			}
		},

		//获取当前显示的的场景信息（类和对象）
		getCurScene: function() {
			return this.m_sceneStack[this.m_sceneStack.length - 1];
		},

		//获取当前现实的场景对象
		getCurSceneObj: function() {
			return this.m_sceneStack[this.m_sceneStack.length - 1].sceneObj;
		},

		//清空场景栈
		clearSceneStack:function(){
			this.m_sceneStack = new Array();
		},

		//===============================loading================================

		//在当前场景上显示loading, st.SceneManage.showLoading(true);
		showLoading: function(bNoMask) {
			if(this.m_bLoading) return;
			var loading = new st.View.LoadingView();
			loading.setTag(1101);
			var curScene = cc.director.getRunningScene();

			if (!bNoMask) {
				//蒙版
				var mask = cc.Scale9Sprite.createWithSpriteFrameName("1-1-3.png");
				mask.setContentSize(cc.director.getVisibleSize());
				mask.setTag(1100);
				st.attachNodes(curScene, mask, {
					desc: "c",
					offset: cc.p(0, 0),
					sc: true
				});
			}

			st.attachNodes(curScene, loading, {
				desc: "c",
				offset: cc.p(0, 0),
				sc: true
			});

			this.m_bLoading = true;
		},

		//隐藏loading
		hideLoading: function() {
			var curScene = cc.director.getRunningScene();
			var mask = curScene.getChildByTag(1100);
			var loading = curScene.getChildByTag(1101);
			if (mask) {
				mask.removeFromParent();
			}
			if (loading) {
				loading.removeFromParent();
			}
			this.m_bLoading = false;
		},

		isShowLoading:function(){
			return this.m_bLoading;
		},

		//=============================状态暂存==============================
		/**
		 *
		 * @param key
		 * @param defValue
		 * @desc 读取场景保持的状态，但是不会清除
		 * @returns {*|null}
		 */
		loadStatus: function (key, defValue) {
			var _defValue = defValue || null;
			return this.status[key] || _defValue;
		},

		/**
		 *
		 * @param key
		 * @param defValue
		 * @desc 读取场景保持的状态，并且会清除
		 * @returns {*|null}
		 */
		loadStatusAndClear: function (key, defValue) {
			var _ret = this.loadStatus(key, defValue);
			this._clearStatus(key);
			return _ret;
		},

		/**
		 *
		 * @param key
		 * @param value
		 * @desc 保存场景的状态
		 */
		saveStatus: function (key, value) {
			this.status[key] = value;
		},

		/**
		 * @param key
		 * @private
		 */
		_clearStatus: function (key) {
			this.status[key] = null;
		},

		/**
		 * @desc 清除所有保持的场景的状态
		 */
		removeAllStatus:function(){
			for(var i = this.status.length - 1;i >= 0;i--){
				this.status[i] = null;
			}
		},

		//=============================toast================================

		//显示提示信息
		//@msgType 1 加速 2 清理 3 手柄 4 网络
		showToast: function(msg, msgType){
			var curScene = cc.director.getRunningScene();
			var toast = new st.View.ToastWidget(msg, msgType);
			st.attachNodes(curScene, toast, {
				desc: "cb",
				offset: cc.p(0, 105),
				sc: true
			});
		},

		//显示当前版本信息
		showVersionInfo:function(){
			var curScene = cc.director.getRunningScene();
			var infoLabel = new cc.LabelTTF("当前版本号:"+st.version, "Arial", 22);
			infoLabel.setAnchorPoint(cc.p(1, 0));
			st.attachNodes(curScene, infoLabel, {
				desc: "rb",
				offset: cc.p(-30, 30),
				sc: true
			});
		},

		//============================对话框=================================
		showDialog:function(dialogClass, args, callBack){
			if(this.m_curDialog){
				this.hideDialog();
			}
			var curScene = cc.director.getRunningScene();
			this.m_curDialog = new dialogClass(args, callBack);
			this.m_curDialog.setAnchorPoint(cc.p(0.5,0.5));
			this.m_curDialog.setVisible(false);
			this.m_curDialog.setScale(0.2);
			st.attachNodes(curScene, this.m_curDialog, {
				desc: "c",
				offset: cc.p(0, 0),
				sc: true
			});
			this.m_curDialog.runAction(cc.sequence(cc.show(), cc.scaleTo(0.4, 1.0)).easing(cc.easeExponentialOut()));
			return this.m_curDialog;
		},

		hideDialog:function(){
			if(this.m_curDialog){
				this.m_curDialog.removeFromParent();
				this.m_curDialog = null;
			}
		},

		getCurDialog:function(){
			return this.m_curDialog;
		},

		//===========================显示图片相关=============================

		/**
		 * 图片显示管理者
		 */
		picShowManage:function(obj, focusIdx){
			if(true){
				st.Js2Java.picShowManage(obj, focusIdx);
				return;
			}
			this.picDatas = obj;
			st.dump("this.picDatas", this.picDatas);
			this.nowPosition = focusIdx;
			this.isAutoPlayPic = false;
			this.changePic(0, this.isAutoPlayPic);
		},

		/**
		 * 获得当前需要显示的图片
		 */
		getNowNeedShowPic:function(){
			this.nowShowPic = this.picDatas[this.nowPosition];
			return this.nowShowPic ;
		},

		/**
		 * 将图片展示相关的标识都设置为初始状态
		 */
		initPicData:function(){
			this.picDatas = null;
			this.nowPosition = -1;
			this.nowShowPic = "";
			this.picPlayScenc = null;
			this.isAutoPlayPic = false;
		},

		getPicPlayScene:function(){
			return this.picPlayScenc;
		},

		/**
		 * 切换图片
		 */
		changePic:function(moveTo, isAutoPlay, backToTheFirst){
			if(!backToTheFirst){
				var hopePosition = this.nowPosition + moveTo;
				if(!(0 <= hopePosition && hopePosition <= this.picDatas.length -1)){
					return;
				}
				this.nowPosition = hopePosition;
			}else{
				this.nowPosition = 0;
			}
			var obj = this.getNowNeedShowPic();
			obj.mPosition = this.nowPosition;
			obj.moveTo = moveTo ;
			if(this.nowPosition != 0){
				obj.canLeft = true;
			}
			if(this.nowPosition != this.picDatas.length -1){
				obj.canRight = true;
			}
			obj.isAutoPlayPic = this.isAutoPlayPic;
			this.picPlayScenc = new st.Scene.PicturePlayScene(obj);
//			cc.director.replaceScene(this.picPlayScenc);
			var transition = null;
			if(isAutoPlay){
				transition = this.randomTransition(this.picPlayScenc);
				//transition = new cc.TransitionPageTurn(1, this.picPlayScenc, cc.TRANSITION_ORIENTATION_LEFT_OVER);//右下
			}else{
				st.log("moveTo_ " + moveTo);
				if(moveTo>=0){
					//左下往右上
					
					//左上往右下
					//cc.TRANSITION_ORIENTATION_DOWN_OVER
					//cc.TRANSITION_ORIENTATION_RIGHT_OVER
					//右下往左上 
					//cc.TRANSITION_ORIENTATION_UP_OVER
					//cc.TRANSITION_ORIENTATION_LEFT_OVER
					
					transition = new cc.TransitionPageTurn(1, this.picPlayScenc, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
				}else{
					transition = new cc.TransitionPageTurn(1, this.picPlayScenc, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				}
			}
			st.log("replaceScene");
			cc.director.replaceScene(transition);
		},

		/**
		 * 将非即将展示的图片从内存中移除
		 * 将可能即将展示的图片加载到内存中
		 */
		dealWithImg:function(moveTo){
			var val = 1;//加载当前展示图片的前几张后后几张

			var start = 0;
			if(this.nowPosition - val >= start){
				start = this.nowPosition - val;
			}
			var end = this.picDatas.length -val;
			if(this.nowPosition + val <= end){
				end = this.nowPosition + 1;
			}

			//doRemove
			var index = -1;
			if(moveTo>0){//下标右移
				if(this.isAutoPlayPic){
					if(this.nowPosition == 0){
						index = this.picDatas.length - 1 - val;
					}else if(this.nowPosition == 1){
						index = this.picDatas.length - 1;
					}else{
						index = this.nowPosition - val - 1;
					}
				}else{
					index = this.nowPosition - val - 1;
				}
			}else if(moveTo<0){//下标左移
				index = this.nowPosition + val + 1;
			}
			st.log("now_ " + this.nowPosition);
			st.log("remove_ " + index);
			if(0 <= index && index < this.picDatas.length){
				st.log("remove_ suc");
				this.doRemoveImg(index);
			}

			//doLoad
			for (start; start <= end; start++) {
				this.doLoadImg(start);
			}
			if(this.isAutoPlayPic && this.nowPosition == this.picDatas.length-1){
				this.doLoadImg(0);
			}
		},

		doRemoveImg:function(index){
			st.log("doRemove_ " + index);
			var removePath = this.picDatas[index].m_filePath;
			cc.textureCache.removeTextureForKey(removePath);
		},

		doLoadImg:function(start){
			st.log("doLoad_ " + start);
			var loadPath = this.picDatas[start].m_filePath;
			cc.textureCache.addImageAsync(loadPath, function(texture) {
				if (texture instanceof cc.Texture2D) {
//					st.dump("cacheInfo~~~_ ",cc.textureCache.getCachedTextureInfo());
				}
			});
		},

		/**
		 * 随机过渡方式
		 */
		randomTransition:function(sceneObj){
			var transition = null;
			var random = (0 + Math.random()*9).toFixed(0);
			var time = 1;
			st.log("random:"+random);
			switch(random){
			case "0"://从外围渐变进入
				transition = new cc.TransitionCrossFade(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "1"://从右边头翻转进入
				transition = new cc.TransitionFlipAngular(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "2"://上下移动 
				transition = new cc.TransitionSplitCols(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "3"://从右边立体缩小翻转进入 
				transition = new cc.TransitionZoomFlipAngular(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "4"://渐变
				transition = new cc.TransitionFade(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "5"://翻页 
				transition = new cc.TransitionPageTurn(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "6"://翻页
				transition = new cc.TransitionZoomFlipX(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "7"://渐远 
				transition = new cc.TransitionShrinkGrow(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			case "8"://右移 
				transition = new cc.TransitionSlideInR(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
				break;
			default:
				transition = new cc.TransitionCrossFade(time, sceneObj, cc.TRANSITION_ORIENTATION_LEFT_OVER);
			break;
			}
			return transition;
		},

		/**
		 * 设置自动播放图片
		 */
		setAutoPlayPic:function(isAuto){
			this.isAutoPlayPic = isAuto;
			if(this.picPlayScenc){
				this.picPlayScenc.autoPlaySetChange(isAuto);
				if(this.nowPosition == this.picDatas.length - 1){
					if(this.isAutoPlayPic){
						this.doLoadImg(0);
					}else{
						this.doRemoveImg(0);
					}
				}
			}
		},

		/**
		 * 是否自动播放图片
		 */
		checkAutoPlayPic:function(){
			return this.isAutoPlayPic;
		},

		/**
		 * 回到展示文件列表的场景
		 */
		backToPicListScenc:function(){
			st.log("backToPicListScenc~");
			this.initPicData();

			var curSceneInfo = this.m_sceneStack.pop();
			var preSceneClass = curSceneInfo.sceneClass;
			if (preSceneClass) {
				if (curSceneInfo.param) {
					this.replaceScene(preSceneClass, curSceneInfo.param);
				} else {
					this.replaceScene(preSceneClass);
				}
			}
		}

};