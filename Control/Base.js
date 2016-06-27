
st.Control.BaseControl = cc.Node.extend({
	name: "st.Control.BaseControl",

    ctor: function() {
    	this._super();

    	this.m_focused = false;
    },

    //处理得到焦点
    onGetFocus:function(){
        this.m_focused = true;
    },

    //处理失去焦点
    onLostFocus:function(){
        this.m_focused = false;
    },

    isFocused:function(){
        return this.m_focused;
    },

    //设置确认点击回调
    setOnClickListener:function(cb){
    	this.m_clickCallBack = cb;
    },

    //响应确认点击
    onEnterClick:function(){
        st.dump("this.m_clickCallBack",this.m_clickCallBack);
        st.dump("this.m_focused", this.m_focused);
    	if(this.m_clickCallBack && this.m_focused){
    		this.m_clickCallBack();
    	}
    },

    dispatchEvent:function(event){
        var eventKey = event.getEvent();
        if(eventKey === st.KeyEvent_Enter){
            this.onEnterClick();
        }
    }
});