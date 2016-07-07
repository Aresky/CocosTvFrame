/**
 * 网格视图单行item视图
 */
st.Control.BaseGridItem = cc.TableViewCell.extend({
    ctor: function(cellSize, columnItemSize, columnItemNum, columnItemClass) {
        this._super();

        this.m_cellSize = cellSize;

        this.m_columnItemSize = columnItemSize;

        this.setContentSize(cellSize);

        this.m_data = null;

        //列焦点序列号
        this.m_columnItemFocusIdx = 0;

        //列item 数量
        this.m_columnItemNum = columnItemNum;

        this.m_columnItemClass = columnItemClass;

        this.initView();

    },

    initView: function() {
        var start_x = (this.m_cellSize.width - this.m_columnItemSize.width * this.m_columnItemNum) / 2;
        this.m_columnItems = new Array();
        for (var i = 0; i < this.m_columnItemNum; i++) {
            var columnItem = new this.m_columnItemClass(this.m_columnItemSize);
            columnItem.setAnchorPoint(cc.p(0.5, 0.5));
            st.attachNodes(this, columnItem, {
                desc: "lc",
                offset: cc.p(start_x + this.m_columnItemSize.width / 2 + i * this.m_columnItemSize.width, 0),
                sc: false
            });
            columnItem.setVisible(false);
            this.m_columnItems.push(columnItem);
        };
    },

    recodeOriPos: function() {
        this.m_oriPos = this.getPosition();
    },

    getOriPosition: function() {
        return this.m_oriPos;
    },

    getColumnItemFocusIdx: function() {
        return this.m_columnItemFocusIdx;
    },

    setColumnItemFocusIdx: function(idx) {
        this.m_columnItems[this.m_columnItemFocusIdx].onLostFocus();
        this.m_columnItemFocusIdx = idx;
        this.m_columnItems[this.m_columnItemFocusIdx].onGetFocus();
    },

    //处理获取焦点
    onGetFocus: function(columnFocusIdx) {
        if (columnFocusIdx !== null && columnFocusIdx !== undefined) {
            if (columnFocusIdx > this.m_data.length - 1) {
                this.m_columnItemFocusIdx = this.m_data.length - 1;
            } else {
                this.m_columnItemFocusIdx = columnFocusIdx;
            }
        }
        this.m_columnItems[this.m_columnItemFocusIdx].onGetFocus();
    },

    //处理失去焦点
    onLostFocus: function() {
        this.m_columnItems[this.m_columnItemFocusIdx].onLostFocus();
    },

    //@override
    updateCell: function(_data, idx) {
        this.m_data = _data;

        for (var i = 0; i < this.m_columnItemNum; i++) {
            this.m_columnItems[i].setVisible(false);
            if (_data[i] !== null && _data[i] !== undefined) {
                this.m_columnItems[i].setVisible(true);
                this.m_columnItems[i].updateData(this.m_data[i]);
            }
        }

    },

    /**
     * 设置列item的焦点
     * @param  {bool} direction 方向 true为left, false为right
     */
    updateColumnItemPos: function(direction) {
        var oldItem = null;
        var newItem = null;
        if (direction && this.m_columnItemFocusIdx > 0) {
            oldItem = this.m_columnItems[this.m_columnItemFocusIdx--];
            newItem = this.m_columnItems[this.m_columnItemFocusIdx];
            //st.ActionManager.runSkipAction(oldItem, newItem, 0.06, 1.0);
        } else if (!direction && this.m_columnItemFocusIdx < this.m_data.length - 1) {
            oldItem = this.m_columnItems[this.m_columnItemFocusIdx++];
            newItem = this.m_columnItems[this.m_columnItemFocusIdx];
            //st.ActionManager.runSkipAction(oldItem, newItem, 0.06, 1.0);
        }
        if (oldItem) {
            oldItem.onLostFocus();
        }
        if (newItem) {
            newItem.onGetFocus();
        }
    },

    dispatchEvent: function(event) {
        var eventKey = event.getEvent();
        switch (eventKey) {
            case st.KeyEvent_Left:
                this.updateColumnItemPos(true);
                break;
            case st.KeyEvent_Right:
                this.updateColumnItemPos(false);
                break;
        }
    }
});