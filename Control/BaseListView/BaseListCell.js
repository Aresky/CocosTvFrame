/*
*  list view 基类, 以红色背景色聚焦的，例如文件列表界面
*/


st.Control.BaseListCell = cc.TableViewCell.extend({
    name:"st.Control.BaseListCell",

    ctor : function(data, cellSize) {
        this._super();

        this.setContentSize(cellSize);

        this.m_contentNode = cc.Node.create();
        this.m_contentNode.setContentSize(cellSize);
        this.m_contentNode.setAnchorPoint(cc.p(0.5, 0.5));
    
        st.attachNodes(this, this.m_contentNode, {
            desc: "lb",
            offset: cc.p(cellSize.width / 2, cellSize.height / 2),
            sc: false
        });
    },

    onEnter : function() {
        this._super();
    },

    onExit : function() {
        this._super();
    },

    //还原
    restore:function(duration){
        this.m_contentNode.setScale(1.0);
    },

    //@override
    updateCell: function(model, idx) {

    },

    //@override 聚焦动效
    focusAction:function(){
        st.log("focusAction");   
    },

    //@override 失焦动效
    unfocusAction:function(){
        st.log("unfocusAction");
    }
});