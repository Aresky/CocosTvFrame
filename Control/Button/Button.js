/*
* 按钮控件
* 两个背景图切换来指示按钮状态
*/
st.Control.Button = st.Control.BaseControl.extend({
	name: "st.STControl.Button",

    ctor: function(normalSprite, focusSprite, size, text, labelSize) {
    	this._super();

        if(size){
            this.setContentSize(size);
        }else{
            this.setContentSize(cc.size(176, 76));
        }     

    	//普通背景
        this.m_normalBg = normalSprite;
        this.m_normalBg.setContentSize(this.getContentSize());
    	this.m_normalBg.setAnchorPoint(cc.p(0.5, 0.5));
    	st.attachNodes(this, this.m_normalBg, {
            desc: "c",
            offset: cc.p(0, 0),
            sc: false
        });

    	//聚焦背景
    	this.m_focusBg = focusSprite;
        this.m_focusBg.setContentSize(this.getContentSize());
    	this.m_focusBg.setAnchorPoint(cc.p(0.5, 0.5));
    	st.attachNodes(this, this.m_focusBg, {
            desc: "c",
            offset: cc.p(0, 0),
            sc: false
        });
        this.m_focusBg.setVisible(false);

        //按钮文字
        this.m_textLabel = new cc.LabelTTF("", "Arial", labelSize||32);
        this.m_textLabel.setLocalZOrder(1);
        st.attachNodes(this, this.m_textLabel, {
            desc: "c",
            offset: cc.p(0, 0),
            sc: false
        });
        this.m_textLabel.setString(text);
    },

    setButtonSize:function(size){
        this.setContentSize(size);
    },

    setText:function(text){
    	this.m_textLabel.setString(text);
    },
    
    setTextColor:function(color){
    	this.m_textLabel.setColor(color);
    },

    onGetFocus:function(){
        this._super();

        this.m_normalBg.setVisible(false);
        this.m_focusBg.setVisible(true);
        this.m_isFocused = true;
        this.stopAllActions();
        this.runAction(cc.scaleTo(0.6, 1.1).easing(cc.easeExponentialOut()));
    },
    
    onLostFocus:function(){
        this._super();

        this.m_normalBg.setVisible(true);
        this.m_focusBg.setVisible(false);
        this.m_isFocused = false;
        this.stopAllActions();
        this.runAction(cc.scaleTo(0.6, 1.0).easing(cc.easeExponentialOut()));
    },

    ifFocused:function(){
        return this.m_isFocused;
    }
});
