//事件管理器


st.EventManager = {

	//初始化
	initEventManage: function() {
		//按键事件监听
		this.m_eventQueue = []; //按键事件队列，最多存储五个

		//添加按键事件监听
		cc.eventManager.addListener(this.keyListener, -1);
		
		setInterval(this.dispatchEvent.bind(this), 0);

		this.m_listenerKeyAction = st.KeyEventAction_Down;

		//添加切换前后台事件监听
		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){  
		    var event = new st.Model.EventModel(-1, st.CustomEvent_ToBack, cc.EventListener.CUSTOM);
		    var curScene = st.SceneManage.getCurSceneObj();
				if (curScene && curScene.dispatchEvent) {
					curScene.dispatchEvent(event);
				}
		}.bind(this));  
		
		cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){  
		    var event = new st.Model.EventModel(-1, st.CustomEvent_ToFront, cc.EventListener.CUSTOM);
		    var curScene = st.SceneManage.getCurSceneObj();
				if (curScene && curScene.dispatchEvent) {
					curScene.dispatchEvent(event);
				}
		}.bind(this)); 
	},

	//设置按键监听动作类型
	setKeyListenerAction:function(action){
		this.m_listenerKeyAction = action;
	},

	getKeyListenerAction:function(){
		return this.m_listenerKeyAction;
	},

	//分发处理事件
	dispatchEvent: function() {
		var event = this.shiftEvent();
		if (event) {
			this.m_curDialog = st.SceneManage.getCurDialog();
			if(this.m_curDialog){
				this.m_curDialog.dispatchEvent(event);
			}else{
				var curScene = st.SceneManage.getCurSceneObj();
				if (curScene && curScene.dispatchEvent) {
					curScene.dispatchEvent(event);
				}
			}
			//临时的，for微鲸本地播放的旧按键响应逻辑
			if(! (curScene instanceof st.Scene.MusicPlayerScene)){
				if(_listLayer){
					_listLayer.dispatchEvent(event);
				} else {
					keyController.keyDown(event.getKey());
				}
			}
			
		}
	},

	//事件压入队列
	pushEvent: function(event) {
		if (this.m_eventQueue.length < 5) {
				this.m_eventQueue.push(event);
		}
	},

	//事件出队列
	shiftEvent: function() {
		if (this.m_eventQueue.length > 0) {
			return this.m_eventQueue.shift();
		}

		return null;
	},

	//按键事件监听
	keyListener: cc.EventListener.create({ //按键监听
		event: cc.EventListener.KEYBOARD,

		onKeyPressed: function(key, event){
			st.log("onKeyPressed key:" + key);
			//play effect
			//cc.audioEngine.playEffect("res/effect2.mp3");

			var listenerKeyAction = st.EventManager.getKeyListenerAction();
			if(listenerKeyAction && (listenerKeyAction & st.KeyEventAction_Down)){
				this.dispatchListener(key, cc.EventListener.KEYBOARD, st.KeyEventAction_Down);
			}
		},

		onKeyReleased: function(key, event) {
			st.log("onKeyReleased key:" + key);

			var listenerKeyAction = st.EventManager.getKeyListenerAction();
			if(listenerKeyAction && (listenerKeyAction & st.KeyEventAction_Up)){
				this.dispatchListener(key, cc.EventListener.KEYBOARD, st.KeyEventAction_Up);
			}
		},

		onKeyLongPress: function(key, event){
			st.log("onKeyLongPress key:" + key);

			var listenerKeyAction = st.EventManager.getKeyListenerAction();
			if(listenerKeyAction && (listenerKeyAction & st.KeyEventAction_LongPress)){
				this.dispatchListener(key, cc.EventListener.KEYBOARD, st.KeyEventAction_LongPress);
			}
		},

		dispatchListener:function(key, evetnType, actionType){
			var eventObj = null;
			var event = null;
			switch (key) {
				case cc.KEY.dpadCenter:
				case cc.KEY.enter:
				case 160: //leshi
					event = st.KeyEvent_Enter;
					break;
				case cc.KEY.back:
					event = st.KeyEvent_Back;
					break;
				case cc.KEY.menu:
					event = st.KeyEvent_Menu;
					break;
				case cc.KEY.dpadUp:
					event = st.KeyEvent_Up;
					break;
				case cc.KEY.dpadDown:
					event = st.KeyEvent_Down;
					break;
				case cc.KEY.dpadLeft:
					event = st.KeyEvent_Left;
					break;
				case cc.KEY.dpadRight:
					event = st.KeyEvent_Right;
					break;
				}
				eventObj = new st.Model.EventModel(key, event, evetnType, actionType);
					st.EventManager.pushEvent(eventObj);
		}
	}),


	//添加触摸事件监听
	addTouchListener:function(target, swallowTouches){
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
	        onTouchBegan:function(touch, event){
	        	var target = event.getCurrentTarget();
	        	target.b_moveed = false;

	        	var ret = target.containsPoint(touch.getLocation());
	        	
	   			return ret;
	        },

	        onTouchEnded:function(touch, event){
	        	var target = event.getCurrentTarget();
	        	if(!target.b_moveed){
	        		target.onTouchClick(touch, event);
	        	}
	        },

	        onTouchMoved:function (touches, event) {
	        	st.log("onTouchMoved");
	            target.b_moveed = true;
	        }	
		});

		listener.setSwallowTouches(swallowTouches);
		cc.eventManager.addListener(listener, target);
	}

}
