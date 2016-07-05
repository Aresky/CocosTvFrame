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
		}
};