//虚拟键盘
st.STControl.VirtualKeyBoard_KeyEvent_Ascii = 1;//字符
st.STControl.VirtualKeyBoard_KeyEvent_Clear = 2;//清空
st.STControl.VirtualKeyBoard_KeyEvent_Back = 3;//回删

st.STControl.VirtualKeyBoard = cc.Node.extend({
	ctor:function(){
		this._super();

		this.setContentSize(cc.size(1198, 456));

		var bg = cc.Scale9Sprite.create("res/images/fkb_bg.9.png");
		bg.setContentSize(cc.size(1920, 460));
        st.attachNodes(this, bg, {
            desc: "c",
            offset: cc.p(0, 0),
            sc: false
        });

		this.m_focusIdx = 0;//按键焦点

		this.m_keys = [
			[{keyValue: "1", keySize: 1}, {keyValue: "4", keySize: 1}, {keyValue: "7", keySize: 1}, {keyValue: ".",keySize: 1}],
			[{keyValue: "2", keySize: 1}, {keyValue: "5", keySize: 1}, {keyValue: "8", keySize: 1}, {keyValue: "0",keySize: 4}],
			[{keyValue: "3", keySize: 1}, {keyValue: "6", keySize: 1}, {keyValue: "9", keySize: 1}],
			[{keyValue: "删除", keySize: 2}, {keyValue: "清空", keySize: 2}, {keyValue: "加入", keySize: 3}]
		];

		for(var i = 0; i < this.m_keys.length; i++){
			for(var j = 0 ; j < this.m_keys[i].length; j++){
				if(this.m_keys[i][j].keySize === 0) continue;
				var keyItem = new st.STControl.VirtualKeyBoard.key(this.m_keys[i][j]);
				keyItem.setAnchorPoint(cc.p(0, 1));
				keyItem.setLocalZOrder(1);
				st.attachNodes(this, keyItem, {
		            desc: "lt",
		            offset: cc.p(i * 326, 0 - j * 114),
		            sc: false
		        });

		        this.m_keys[i][j].keyPos = keyItem.getPosition();
		        this.m_keys[i][j].keyContentSize = keyItem.getContentSize();
				this.m_keys[i][j].keyObj = keyItem;
			}
		}

		//按键焦点背景
		this.m_focusFrame = cc.Scale9Sprite.create("res/images/nkp_keyboard_focused.png");
		this.m_focusFrame.setPosition(this.m_keys[0][0].keyPos);
		this.m_focusFrame.setContentSize(this.m_keys[0][0].keyContentSize);
		this.m_focusFrame.setAnchorPoint(cc.p(0, 1));
		this.addChild(this.m_focusFrame);
		//st.debugRect(this.m_focusFrame);
	},

	getKeys: function () {
		return this.m_keys;
	},

	onGetFocus:function(){
		this.m_focusFrame.setVisible(true);
		this.updateFocusIdx(0);
	},

	onLostFocus:function(){
		this.m_focusFrame.setVisible(false);
	},

	//更新虚拟键盘焦点
	updateFocusIdx:function(m_key){
		//var row = this.m_focusIdx % 3;//行
		//var column = Math.floor(this.m_focusIdx / 3);//列
		var pos = m_key.keyPos;
		var move = cc.moveTo(0.4, pos);
		var scale = cc.scaleTo(0.4, m_key.keyContentSize.width / 326,
			m_key.keyContentSize.height / 113);

		this.m_focusFrame.stopAllActions();
		this.m_focusFrame.runAction(cc.spawn(move, scale).easing(cc.easeExponentialOut()));
	},

	//监听虚拟键盘事件
	setOnKeyBoardEventListener:function(callFunc){
		this.m_onKeyBoardEventFunc = callFunc;
	},

	//监听键盘失去焦点事件
	setOnLostFocusListener:function(callFunc){
		this.m_onLostFocusFunc = callFunc;
	},

	dispatchEvent:function(event){
        var eventKey = event.getEvent();
        var row = 0;//行
		var column = 0;//列
        switch(eventKey)
        {
            case st.KeyEvent_Up:
            	if(this.m_focusIdx % 3 !== 0){
            		this.m_focusIdx--;
            	}else{
            		this.onLostFocus();
            		this.m_onLostFocusFunc(eventKey);
            	}
            	this.updateFocusIdx();
            	break;
            case st.KeyEvent_Down:
            	if(this.m_focusIdx % 3 < 2){
            		this.m_focusIdx++;
            	}
            	row = this.m_focusIdx % 3;//行
				column = Math.floor(this.m_focusIdx / 3);//列
            	if(column === 8 && row === 2){
            		this.m_focusIdx -= 3;
            	}
            	this.updateFocusIdx();
            	break;
            case st.KeyEvent_Left:
            	if(this.m_focusIdx > 2){
            		this.m_focusIdx -= 3;
            	}
            	row = this.m_focusIdx % 3;//行
				column = Math.floor(this.m_focusIdx / 3);//列
            	if(column === 8 && row === 2){
            		this.m_focusIdx -= 3;
            	}
            	this.updateFocusIdx();
            	break;
            case st.KeyEvent_Right:
            	column = Math.floor(this.m_focusIdx / 3);//列
            	if(column < 12){
            		this.m_focusIdx += 3;
            	}
            	row = this.m_focusIdx % 3;//行
				column = Math.floor(this.m_focusIdx / 3);//列
            	if(column === 8 && row === 2){
            		this.m_focusIdx += 3;
            	}
            	this.updateFocusIdx();
            	break;
            case st.KeyEvent_Enter:
            	row = this.m_focusIdx % 3;//行
				column = Math.floor(this.m_focusIdx / 3);//列
            	if(column === 7 && row === 2){
            		this.m_onKeyBoardEventFunc({
            			keyEvent : st.STControl.VirtualKeyBoard_KeyEvent_Clear,
            			keyValue : null
            		});
            	}else if(column === 9 && row === 2){
            		this.m_onKeyBoardEventFunc({
            			keyEvent : st.STControl.VirtualKeyBoard_KeyEvent_Back,
            			keyValue : null
            		});
            	}else{
            		this.m_onKeyBoardEventFunc({
            			keyEvent : st.STControl.VirtualKeyBoard_KeyEvent_Ascii,
            			keyValue : this.m_keys[column][row].keyValue
            		});
            	}
            	break;
        }
    }
});

//键盘按键
st.STControl.VirtualKeyBoard.key = cc.Node.extend({
	ctor:function(key){
		this._super();

		//326 * 114  220 * 114  220 * 228

		switch(key.keySize){
			case 1:
				this.setContentSize(cc.size(326, 114));
				break;
			case 2:
				this.setContentSize(cc.size(220, 114));
				break;
			case 3:
				this.setContentSize(cc.size(220, 228));
				break;
			case 4:
				this.setContentSize(cc.size(326 * 2, 114));
		}

		var keyTxt = cc.LabelTTF.create(key.keyValue, "Arial", 40);

		var target = this.getContentSize();
    	var rectangle = [cc.p(0, 0),cc.p(target.width, 0), 
    		cc.p(target.width, target.height),
        	cc.p(0, target.height)];

    	var border = new cc.DrawNode();
    	border.setContentSize(this.getContentSize());
    	border.setAnchorPoint(cc.p(0.5, 0.5));
    	border.drawPoly(rectangle, null, 1, cc.color(255, 255, 255, 100));
    	st.attachNodes(this, border, {
            desc: "c",
            offset: cc.p(0, 0),
            sc: false
        });

       	st.attachNodes(this, keyTxt, {
            desc: "c",
            offset: cc.p(0, 0),
            sc: false
        });
	}
});
