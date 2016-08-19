/*
* 按钮控件
* 背景不变， 以放大加阴影来指示按钮状态
*/
st.Control.ScaleButton = st.Control.Button.extend({
    name:"st.Control.ScaleButton",

    ctor: function(normalSprite, focusSprite, size, text) {
    	this._super(normalSprite, focusSprite, size, text);
    }
});