/**
 * 基础场景类
 */
st.Control.BaseScene = cc.Scene.extend({
	ctor:function(){
		this._super();
	},

	//设置背景
	setBackGround:function(bg){
		var backGround = null;
		if(bg.contains("/")){
			backGround = cc.Sprite.create(bg);
		}else{
			backGround = cc.Sprite.createWithSpriteFrameName(bg);
		}
		
		st.attachNodes(this, backGround, {
			desc: "c",
			offset: cc.p(0, 0),
			sc: true
		});
	}
});