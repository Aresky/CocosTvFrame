
//虚拟输入框
st.STControl.VirtualEditBox = cc.Node.extend({
	ctor:function(){
		this._super();

		this.m_head = "IP地址                            ";
		this.m_text = "";

		this.setContentSize(cc.size(940, 96));

		var border = cc.Scale9Sprite.create("res/images/fkb_btn_focused.png");
		border.setContentSize(cc.size(940, 96));
		st.attachNodes(this, border, {
            desc: "c",
            offset: cc.p(0, 0),
            sc: false
        });

		this.m_content = cc.LabelTTF.create(this.m_head, "Arial", 40);
		//this.m_content.setOpacity(150);
		this.m_content.setAnchorPoint(cc.p(0, 0.5));
		st.attachNodes(this, this.m_content, {
            desc: "cl",
            offset: cc.p(100, 0),
            sc: false
        });

        //光标
		// this.m_cursor = cc.Scale9Sprite.create("res/images/white.png");
		// this.m_cursor.setContentSize(cc.size(1, 40));
		// this.m_cursor.setAnchorPoint(cc.p(0.5, 0.5));
		// st.attachNodes(this, this.m_cursor, {
  //           desc: "cl",
  //           offset: cc.p(100, 0),
  //           sc: false
  //       });
  //       this.m_cursor.runAction(cc.repeatForever(cc.sequence(cc.FadeOut.create(0.5), cc.FadeIn.create(0.5))));

      
	},

	reset:function(){
		//this.m_content.setString("请输入影片首字母，例如\"蚁人\"，即输入\"YR\"");
		//this.m_content.setOpacity(150);
	},

	setOnEditBoxInfoChanged:function(func){
		this._onEditBoxInfoChanged = func;
	},

	getText:function(){
		return this.m_text;
	},

	setText:function(_text){
		this.m_text = _text;
		this.m_content.setString(this.m_head + this.m_text);
	},

	preDispatchText:function(_text){
		//如果已输入的最后一个字符是点号就不允许输入点号
		if((_text.length > 0 && _text[_text.length - 1] === ".")){
			return _text.substr(0, _text.length - 1);
		}

		//屏蔽第一个字符输入点号的情况
		if(_text.length === 1 && _text[_text.length -1] === "."){
			return "";
		}

		//如果输满四个ip段就不允许再输入
		var txtArray = _text.split(".");
		if(txtArray.length == 4 && txtArray[txtArray.length - 1].length > 3){
			_text = _text.substr(0, _text.length - 1);
			return _text;
		}

		//如果一个ip段输入满三个字母就自动添加点号
		txtArray = _text.split(".");
		//st.dump("txtArray", txtArray);
		if(txtArray.length > 0 && txtArray[txtArray.length - 1].length >= 3
			&& txtArray.length < 4){
			_text += ".";
		}

		return _text;
	},

	//接收虚拟键盘事件
	receiveVirtualKeyEvent:function(keyEvent){
		switch(keyEvent.keyEvent){
			case st.STControl.VirtualKeyBoard_KeyEvent_Ascii:
				this.m_text += keyEvent.keyValue;
				this.m_text = this.preDispatchText(this.m_text);
				this.m_content.setString(this.m_head + this.m_text);

				this._onEditBoxInfoChanged(this.m_content.getString());
				break;
			case st.STControl.VirtualKeyBoard_KeyEvent_Clear:
				this.m_text = "";
				this.m_content.setString(this.m_head + this.m_text);
				break;
			case st.STControl.VirtualKeyBoard_KeyEvent_Back:
				if(this.m_text.length > 0){
					this.m_text = this.m_text.substring(0, this.m_text.length - 1);
					this.m_content.setString(this.m_head + this.m_text);
				}else{
					this.m_content.setString(this.m_head + "");
				}
				this._onEditBoxInfoChanged(this.m_content.getString());
				break;
		}
	}
});