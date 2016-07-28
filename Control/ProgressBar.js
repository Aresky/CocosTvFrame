/**
 * 进度条基础控件,只支持scale9图片
 */

st.Control.ProgressBar = st.Control.BaseControl.extend({
    ctor: function(size, frontImg, backImg) {
    	this._super();

    	this.m_percent = 0; 

    	this.m_size = size;
    	this.setContentSize(this.m_size);

        var imgSize = backImg.getContentSize();
        backImg.setCapInsets(cc.rect(imgSize.width / 2, imgSize.height / 2, 1, 1));
        frontImg.setCapInsets(cc.rect(imgSize.width / 2, imgSize.height / 2, 1, 1));

    	//背景
    	this.m_bg = backImg;
  		this.m_bg.setContentSize(this.m_size);

    	st.attachNodes(this, this.m_bg, {
            desc: "c",
            offset: cc.p(0,0),
            sc: false
        });


    	//前景
        this.m_frontWidth = frontImg.getContentSize().width;
    	this.m_front = frontImg;
    	this.m_front.setAnchorPoint(0, 0.5);
        this.m_front.setScale(0.0, 1.0);

        st.attachNodes(this, this.m_front, {
            desc: "lc",
            offset: cc.p(0,0),
            sc: false
        });

    },

    onEnter:function(){
        this._super();
        this.setPercent(0);
    },

    //设置进度百分比，0 - 1
    setPercent:function(percent){
        var speed = 0.05;//每秒0.3
    	this.m_percent = percent;
    	if(this.m_percent === 0){
    		this.m_front.setVisible(false);
    	}else{
    		this.m_front.setVisible(true);
            var scaleTo = cc.scaleTo(percent / speed, percent * (this.m_size.width / this.m_frontWidth), 1.0);
            this.m_front.runAction(scaleTo.easing(cc.easeExponentialOut()));
    	}
    }

});