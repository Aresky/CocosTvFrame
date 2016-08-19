/*
* 智能label，提供自适应，滚动，截字等功能
*/

//forexanmple:
//this.textLabel = new st.STControl.AutoTextLabel("美国队长美国队长美国队长","Arial","32");
//this.textLabel.setLabelSize(cc.size(280,40));
//this.textLabel.setLabelText("skdjsas   sdjlaksjdljasl ddadasdasdasda");

st.Control.AutoTextLabel = st.Control.BaseControl.extend({
    name: "st.Control.AutoTextLabel",

    ctor: function(text) {
        this._super();

        this.m_bCutEnable = true;//是否截字
        //this.m_bScrollEnable = false;//字幕滚动

        this.m_oriText = text;//原始文字
        this.init();    
    },

    ctor: function(text, fontName, fontSize) {
        this._super();

        this.m_bCutEnable = true;//是否截字

        this.m_oriText = text;
        this.m_fontName = fontName;
        this.m_fontSize = fontSize;

        this.init();
    },

    init:function(){

        var fontDef = new cc.FontDefinition();

        fontDef.fontName = this.m_fontName ? this.m_fontName : "Arial"
        fontDef.fontSize = this.m_fontSize ? this.m_fontSize : "32"

        this.textlabel = new cc.LabelTTF(this.m_oriText,  fontDef);
        this.textlabel.setAnchorPoint(cc.p(0, 0.5));
        this.setContentSize(this.textlabel.getContentSize());

        st.attachNodes(this, this.textlabel, {
            desc: "cl",
            offset: cc.p(0,0),
            sc: false
        });
    },

    setLabelSize:function(size){
        this.setContentSize(size);

        st.NodeUtil.updateNodeState(this.textlabel,{
            desc: "cl",
            offset: cc.p(0,0),
            sc: false
        });

        //截字处理
        this._cutText();
    },

    //设置是否能够截字
    setTextCutEnable:function(bEnable){
        this.m_bCutEnable = bEnable;

        //截字处理
        this._cutText();
    },

    //判断是否需要截字处理
    _needCut:function(){
        this.textlabel.setString(this.m_oriText);
        if(this.m_bCutEnable && this.textlabel.width > this.width){
            return true;
        }
    },

    _cutText:function(){
        if(!this._needCut()) return;

        var _width = 0;
        var _endIdx = this.m_oriText.length - 1;
        
        do{
            var cutedText = this.m_oriText.substr(0, --_endIdx);
            this.textlabel.setString(cutedText+"...");
        }while(this.textlabel.width > this.width)
    },

    //设置label显示文字
    setString:function(text){
        this.m_oriText = text;
        this.textlabel.setString(text);

        //截字处理
        this._cutText();
    },

    setOpacity:function(opacity){
        this.textlabel.setOpacity(opacity);
    }

    // //设置text对齐方式
    // setTextAlignMent:function(){

    // }
});