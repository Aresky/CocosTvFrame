/*
* 带有icon的按钮控件
*/
st.Control.IconButton = st.Control.Button.extend({
    name:"st.Control.IconButton",

    ctor: function(normalSprite, focusSprite, size, text) {
    	this._super(normalSprite, focusSprite, size, text);

    	this.m_checked = false;
    },

    onGetFocus:function(){
        this.m_normalBg.setVisible(false);
        this.m_focusBg.setVisible(true);
        this.m_isFocused = true;
    },
    
    onLostFocus:function(){
        this.m_normalBg.setVisible(true);
        this.m_focusBg.setVisible(false);
        this.m_isFocused = false;
    },

    setCheckedIcon:function(iconSprite){
    	this.m_checkedIcon = iconSprite;
    	st.attachNodes(this, this.m_checkedIcon, {
            desc: "lc",
            offset: cc.p(40, 0),
            sc: false
        });
        this.m_checkedIcon.setVisible(this.m_checked);
    },

    setChecked:function(checked){
    	this.m_checked = checked;
    	this.m_checkedIcon.setVisible(this.m_checked);
    }
});