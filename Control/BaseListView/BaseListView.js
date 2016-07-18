/**
 * List View 基类
 * 基于tableview实现
 * 需要将tableView封装到一个node上，这样才能实现背景红色块移动动效
 */

st.Control.BaseListView = cc.Node.extend({
    ctor: function() {
        this._super();

        this.eventLock = false;//事件锁定
        this.m_bKeyEvent = false;//当前是否是按键操作

        this.m_datas = new Array();

        this.setContentSize(this.makeViewSize());

        this.m_listWidget = new st.Control.BaseListViewWidget(this);
        this.m_listWidget.setLocalZOrder(2);
        st.attachNodes(this, this.m_listWidget, {
            desc: "lb",
            offset: cc.p(0, 0),
            sc: false
        });

        this.m_viewSize = this.makeViewSize();
        this.m_cellSize = this.makeCellSize();

        this.m_focusDataIdx = 0;//数据焦点
        this.m_focusCellIdx = 0;//cell位置焦点

        this.m_focused = true; //是否被聚焦

        this.m_adjustLastFocusOffset = 0;//是否纠正最后的聚焦的cell偏移

        this.m_focusFrame = cc.Node.create();
        this.m_focusFramePosOffset = cc.p(0, 0);
        this.m_focusFramePosDesc = "lt";
        this.setFocusFrame(this.m_focusFrame);
    },

    onEnter: function() {
        this._super();

        //可见的cell数量
        this.m_visibleCellCount = this.m_viewSize.height / this.m_cellSize.height;

        this.m_minOffset_y = this.m_listWidget.minContainerOffset().y;
        this.m_maxOffset_y = this.m_listWidget.maxContainerOffset().y;

        this.updateCellFocus();
    },

    /**
     * 纠正最后的聚焦的cell
     * @param {[type]} offset 1 代表向上偏移一个cell
     */
    setAdjustLastFocusOffset:function(offset){
        this.m_adjustLastFocusOffset = offset;
    },

    //设置焦点框
    setFocusFrame:function(focusFrame){
        this.m_focusFrame = focusFrame;
        this.m_focusFrame.setAnchorPoint(cc.p(0.5, 0.5));

        this.m_focusFramePosDesc = "lt";
        this.m_focusFramePosOffset = cc.p(this.makeCellSize().width / 2, 0 - this.makeCellSize().height / 2);
        st.attachNodes(this, this.m_focusFrame, {
            desc: this.m_focusFramePosDesc,
            offset: this.m_focusFramePosOffset,
            sc: false
        });

        this.m_focusFrame.setVisible(false);
    },

    //设置焦点序列 @bAdd 序列号增减
    setFocusIdx: function(bAdd) {
        var oldIdx = this.m_focusDataIdx;
        if (bAdd) {
            if(this.m_focusDataIdx >= this.m_datas.length - 1) return;
            if (this.m_focusCellIdx < (this.m_visibleCellCount - 1 - this.m_adjustLastFocusOffset)) {
                //移动焦点框
                this.m_focusCellIdx++;
                this.m_focusDataIdx++;
                this.updateFocusFramePos(this.m_focusDataIdx - 1);
            } else{
                //滑动listview
                this.m_focusDataIdx++;
                this.scrollListView(true);
            }
        } else {
            if (this.m_focusCellIdx > 0) {
                this.m_focusCellIdx--;
                this.m_focusDataIdx--;
                this.updateFocusFramePos(this.m_focusDataIdx + 1);
            } else if (this.m_focusDataIdx > 0) {
                this.m_focusDataIdx--;
                this.scrollListView(false);
            } else if(this.m_focusDataIdx <= 0){
                return; 
            }
        }
        if(oldIdx != this.m_focusDataIdx){
            if(this.onFocusChangeListener){
                this.onFocusChangeListener(this.m_focusDataIdx);
            }
        }

        setTimeout(function(){
            this.updateCellFocus(oldIdx);
        }.bind(this), 100);
    },

    updateFocusFramePosImmediately:function(){
        //移动
        var _offset = cc.p(this.m_focusFramePosOffset.x,
            this.m_focusFramePosOffset.y - this.m_focusCellIdx * this.m_cellSize.height);
        var newPos = st.NodeUtil.getPosByDesc(this, {
            desc: this.m_focusFramePosDesc,
            offset: _offset,
            sc: false
        });
        //var move =  cc.MoveTo.create(0.4, newPos).easing(cc.easeExponentialOut());

        //this.m_focusFrame.stopAllActions();
        this.m_focusFrame.setPosition(newPos); 

        if (this.m_datas.length <= 0) {
            this.m_focusFrame.setVisible(false);
        } else if (this.m_focused) {
            this.m_focusFrame.setVisible(true);
        }
    },

    //更新焦点框位置
    updateFocusFramePos: function(oldFocusIdx) {
        //移动
        var _offset = cc.p(this.m_focusFramePosOffset.x,
            this.m_focusFramePosOffset.y - this.m_focusCellIdx * this.m_cellSize.height);
        var newPos = st.NodeUtil.getPosByDesc(this, {
            desc: this.m_focusFramePosDesc,
            offset: _offset,
            sc: false
        });
        var move =  cc.MoveTo.create(0.4, newPos).easing(cc.easeExponentialOut());

        //放大
        //var scale = cc.ScaleTo.create(0.03, 1.0, 1.0);

        this.m_focusFrame.stopAllActions();
        this.m_focusFrame.runAction(move);
    },

    //滑动listview
    scrollListView: function(bAdd) {
        this.m_minOffset_y = this.m_listWidget.minContainerOffset().y;
        var offset_y = this.m_listWidget.getContentOffset().y;
        if (bAdd) { //向上滑一格
            offset_y = this.m_minOffset_y + ((this.m_focusDataIdx + 1 + this.m_adjustLastFocusOffset) - this.m_visibleCellCount) * this.m_cellSize.height;
        } else { //向下滑一格
            offset_y = this.m_minOffset_y + (this.m_focusDataIdx - this.m_focusCellIdx) * this.m_cellSize.height;
        }

        this.m_listWidget.setContentOffsetInDuration(cc.p(0, offset_y), 1.0);

        this.updateFocusFramePos();
    },

    //@override
    makeViewSize: function() {
        return cc.size(500, 500);
    },

    //@override
    makeCellSize: function() {
        return cc.size(500, 100);
    },

    //override
    createCell: function(idx) {
        
    },

    getCurCell: function(){
        return this.m_listWidget.cellAtIndex(this.m_focusDataIdx);
    },

    getCellByIdx:function(dataIdx){
        return this.m_listWidget.cellAtIndex(dataIdx);
    },

    onTableCellClick: function(dataIdx) {
        if(this.onCellClickedListener){
            this.onCellClickedListener(dataIdx, this.m_focusCellIdx);
        }
    },

    //焦点变化监听
    setOnFocusChangeListener:function(listener){
        this.onFocusChangeListener = listener;
    },

    //点击cell事件监听
    setOnCellClickedListener:function(listener){
        this.onCellClickedListener = listener;
    },

    //override
    setDatas: function(datas) {
        this.m_datas = datas;
        this.m_listWidget.setDatas(datas);
    },

    /**
     * 刷新数据显示
     * @param  {[type]} recoverStatus 
     * {
     *     dataIdx: 数据序列号 
     *     posIdx: 位置序列号
     *  }
     */
    refreshDataAndReload: function(recoverStatus) {
        this.m_focusFrame.setVisible(false);

        if (recoverStatus) {
            this.m_focusDataIdx = recoverStatus.dataIdx;
            this.m_focusCellIdx = recoverStatus.posIdx;
        } else {
            this.m_focusDataIdx = 0;
            this.m_focusCellIdx = 0;
        }

        this.m_listWidget.reloadData();

        if(this.onFocusChangeListener){
            this.onFocusChangeListener(this.m_focusDataIdx);
        }

        if (this.m_focusDataIdx > 0) {
            this.m_minOffset_y = this.m_listWidget.minContainerOffset().y;
            var offset_y = this.m_listWidget.getContentOffset().y;
            offset_y = this.m_minOffset_y + (this.m_focusDataIdx - this.m_focusCellIdx) * this.m_cellSize.height;
            this.m_listWidget.setContentOffsetInDuration(cc.p(0, offset_y), 0.1);
            setTimeout(function(){
                //this.updateFocusFramePos();
                this.updateFocusFramePosImmediately();
                this.updateCellFocus();
            }.bind(this), 200);
        }else{
            //this.updateFocusFramePos();
            this.updateFocusFramePosImmediately();
            this.updateCellFocus();
        }
    },

    //滚到指定数据位
    scrollByIdx:function(focusDataIdx, focusCellIdx){
        var oldIdx = this.m_focusDataIdx;

        this.m_focusDataIdx = focusDataIdx;
        
        if(this.m_visibleCellCount - 1 - this.m_adjustLastFocusOffset < 0){
            this.m_focusCellIdx = 0
        }else if(focusCellIdx > this.m_visibleCellCount - 1 - this.m_adjustLastFocusOffset){
            this.m_focusCellIdx = this.m_visibleCellCount - 1 - this.m_adjustLastFocusOffset;
        }else{
            this.m_focusCellIdx = focusCellIdx;
        }

        if (this.m_focusDataIdx >= 0) {
            this.m_minOffset_y = this.m_listWidget.minContainerOffset().y;
            var offset_y = this.m_listWidget.getContentOffset().y;
            offset_y = this.m_minOffset_y + (this.m_focusDataIdx - this.m_focusCellIdx) * this.m_cellSize.height;

            this.m_listWidget.setContentOffsetInDuration(cc.p(0, offset_y), 1.0);
            setTimeout(function(){
                this.updateFocusFramePosImmediately();
                this.updateCellFocus(oldIdx);
            }.bind(this), 200);
        }else{
            this.updateFocusFramePos();
            this.updateCellFocus(oldIdx);
        }
    },

    //获取当前list状态信息，包括焦点位置，数据位置
    getCurStatus: function() {
        var status = {};
        status.dataIdx = this.m_focusDataIdx;
        status.posIdx = this.m_focusCellIdx;
        return status;
    },

    updateCellFocus:function(oldFocusIdx){
        if(oldFocusIdx || oldFocusIdx === 0){
            var curCell = this.m_listWidget.cellAtIndex(oldFocusIdx);
            if(curCell){
                curCell.onLostFocus();
            }
        }
        
        var newCell = this.m_listWidget.cellAtIndex(this.m_focusDataIdx);
        if(newCell && this.m_focused){
            newCell.onGetFocus();
        }
    },

    onGetFocus: function() {
        this.m_focused = true;
        this.m_focusFrame.setVisible(true);
    },

    onLostFocus: function() {
        this.m_focused = false;
        this.m_focusFrame.setVisible(false);
    },

    onEventTimeOut:function(){
        this.eventLock = false;
    },

    //处理按键事件,listview比较特殊，需要对它的事件响应做速度上的控制，最慢0.1秒一个
    dispatchEvent: function(event) {
        this.m_bKeyEvent = true;
        if(this.m_timeOut){
            clearTimeout(this.m_timeOut);
        }
        this.m_timeOut = setTimeout(function(){
            this.m_bKeyEvent = false;
        }.bind(this), 1000);

        if(this.eventLock) return;
        this.eventLock = true;
        
        if(event.getEventType() === cc.EventListener.KEYBOARD){
            var _event = event.getEvent();
            switch (_event) {
                case st.KeyEvent_Up:
                    this.setFocusIdx(false);
                    break;
                case st.KeyEvent_Down:
                    this.setFocusIdx(true);
                    break;
                case st.KeyEvent_Enter:
                    if(this.onCellClickedListener){
                        this.onCellClickedListener(this.m_focusDataIdx, this.m_focusCellIdx);
                    }
                    break;
            }
        }
        

        if(this.m_eventTimeOut){
            clearTimeout(this.m_eventTimeOut);
        }
        this.m_eventTimeOut = setTimeout(this.onEventTimeOut.bind(this), 20);
    }
});


//list控件
st.Control.BaseListViewWidget = st.Control.BaseListViewWidget || cc.TableView.extend({
    //override
    name: 'st.Control.BaseListViewWidget',

    ctor: function(listener) {
        this.m_listener = listener;
        this.arrayModel = new Array(); //数据
        this.m_datas = new Array();

        this._super(this, cc.size(0, 0));

        st.assert(this.createCell, 'need override this.createCell');
        st.assert(this.makeViewSize, 'need override this.makeViewSize');

        this.initWithViewSize(this.makeViewSize());
        this.setDataSource(this);
        this.setDelegate(this);
        this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.setBounceable(false);
    },

    onEnter: function() {
        this._super();

        this.m_minOffset_y = this.minContainerOffset().y;
        this.m_maxOffset_y = this.maxContainerOffset().y;

    },


    onExit: function() {
        this._super();
    },

    //设置tableview 数据
    setDatas: function(datas) {
        this.arrayModel = datas;
    },

    //override
    createCell: function(idx) {
        return this.m_listener.createCell(idx);
    },

    //override
    makeViewSize: function() {
        return this.m_listener.makeViewSize();
    },

    //override
    makeCellSize: function() {
        return this.m_listener.makeCellSize();
    },

    //override
    tableCellAtIndex: function(table, idx) {
        try {
            var cell = table.dequeueCell();

            if (!cell) {
                cell = this.createCell(idx);
            }
            cell.onLostFocus();
            cell.updateCell(this.arrayModel[idx], idx);

        } catch (e) {
            this.warnException(e);
        }
        return cell;
    },

    //override
    numberOfCellsInTableView: function(table) {

        try {
            return this.arrayModel.length;
        } catch (e) {
            st.warn(e);
        }

    },

    //override
    tableCellSizeForIndex: function(table, idx) {
        return this.makeCellSize();
    },

    scrollViewDidScroll: function() {

        //说明是按键操作
        if(this.m_listener.m_bKeyEvent){
            return;
        }

        if(this.m_timeOut){
            clearTimeout(this.m_timeOut);
        }

        //this.m_timeOut = setTimeout(this.onAfterScrollView.bind(this) ,50);
    },

    // onAfterScrollView:function(){

    //     var cellHeight = this.makeCellSize().height;
    //     // this.m_minOffset_y = this.minContainerOffset().y;
    //     var offset_y = this.getContentOffset().y;
    //     var offset_y_abs = Math.abs(offset_y);
    //     // var curCell = null;
    //     // offset_y = this.m_minOffset_y + (this.m_focusDataIdx - this.m_focusCellIdx) * this.m_cellSize.height; 
        
    //     var yu = offset_y_abs % cellHeight;
    //     if(yu > 0 &&  yu >= cellHeight / 2){
    //         //向下回弹
    //         this.setContentOffset(cc.p(0, offset_y - (cellHeight - offset_y_abs % cellHeight)));
    //     }else if(yu > 0 && yu < cellHeight / 2){
    //         //向上回弹
    //         this.setContentOffset(cc.p(0, offset_y + (offset_y_abs % cellHeight)));
    //     }

    //     this.onOffsetFinished();
    // },

    // onOffsetFinished:function(){
    //     var cellHeight = this.makeCellSize().height;
    //     var offset_y = this.getContentOffset().y;
    //     var minOffset_y = this.minContainerOffset().y;

    //     var curFocusIdx = (offset_y - minOffset_y) / cellHeight + this.m_listener.m_focusCellIdx;
    //     st.dump("curFocusIdx", curFocusIdx);

    //     this.m_listener.m_focusDataIdx = curFocusIdx;

    //     var curCell = this.cellAtIndex(curFocusIdx);
    //     curCell.focusAction();

    //     for(var i = 0; i < this.arrayModel.length; i++){
    //         curCell = this.cellAtIndex(i);
    //         if(curCell && i != curFocusIdx){
    //             curCell.restore();
    //         }
    //     }

    // },

    tableCellTouched:function(table, cell){
        this.m_listener.onTableCellClick(cell.getIdx());
    }


});