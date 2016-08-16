/**
 * 网格视图基础控件，瀑布流展示方式
 */

st.Control.BaseGridView = st.Control.BaseListView.extend({
	/**
	 * @param  {number} columnItemNum 列item的数量
	 * @param {[type]} columnItemClass 子网格视图构造类
	 */
	ctor: function(columnItemSize, columnItemNum, columnItemClass) {
		this._super();

		//列item的size
		this.m_columnItemSize = columnItemSize;

		//列item 数量
		this.m_columnItemNum = columnItemNum;

		//子网格视图构造类
		this.m_columnItemClass = columnItemClass;

		this.m_edgeFlag = false; //是否边缘跳转

		this.m_preferedIdx = -1; //左右边缘跳转时推荐idx

	},

	// onGetFocus: function() {
	// 	if (this.m_focused) return;

	// 	this.updateFocusIdx(this.m_focusDataIdx);

	// 	this.m_focused = true;
	// },

	onLostFocus: function(keyEvent) {
		if (!this.m_focused) return;
		if (this.getCurCell()) {
			this.getCurCell().onLostFocus();
		}
		this.m_focused = false;

		if (this.m_onLostFocusFunc) {
			this.m_onLostFocusFunc(keyEvent);
		}
	},

	setOnItemClickListener: function(listener) {
		this.m_onItemClickListener = listener;

		this.setOnCellClickedListener(function(focusDataIdx, focusCellIdx) {
			var focusItem = this.getCurCell();
			var columnItemFocusIdx = focusItem.getColumnItemFocusIdx();

			if (this.m_onItemClickListener) {
				this.m_onItemClickListener(this.m_datas[focusDataIdx][columnItemFocusIdx]);
			}
		}.bind(this));
	},

	setOnLostFocusListener: function(callBack) {
		this.m_onLostFocusFunc = callBack;
	},

	//override
	makeViewSize: function() {
		return cc.size(1550, 96 * 10);
	},

	//override
	makeCellSize: function() {
		return cc.size(1550, 96);
	},

	//override
	createCell: function(idx) {
		return new st.Control.BaseGridItem(this.makeCellSize(), this.m_columnItemSize,
			this.m_columnItemNum, this.m_columnItemClass, this.m_datas[idx]);
	},

	getCurStatus: function() {

		var status = {};
		status.dataIdx = this.m_focusDataIdx * this.m_columnItemNum + this.getCurCell().getColumnItemFocusIdx();
		status.posIdx = this.m_focusCellIdx;
		return status;
	},

	//override
	setDatas: function(datas) {
		var convertArray = new Array();
		var childArray = new Array();
		for (var i = 0; i < datas.length; i++) {
			childArray.push(datas[i]);

			if (childArray.length === this.m_columnItemNum) {
				convertArray.push(childArray);
				childArray = new Array();
			} else if (datas.length === (i + 1)) {
				convertArray.push(childArray);
			}
		}

		this._super(convertArray);
	},

	//更新焦点
	updateCellFocus: function(oldFocusIdx) {
		var oldCell = null;
		if (oldFocusIdx || oldFocusIdx === 0) {
			var oldCell = this.getCellByIdx(oldFocusIdx);
			if (oldCell) {
				oldCell.onLostFocus();
			}
		}

		var newCell = this.getCurCell();
		if (newCell) {
			newCell.onLostFocus();
			var referenceIdx = 0;
			if (oldCell) {
				referenceIdx = oldCell.getColumnItemFocusIdx();
			}
			if (this.m_preferedIdx != -1) {
				referenceIdx = this.m_preferedIdx;
			}
			newCell.onGetFocus(referenceIdx, this.focusChangedCB.bind(this));
			newCell.setLocalZOrder(1);
		}

		this.m_preferedIdx = -1;
	},

	refreshDataAndReload: function(recoverStatus) { //pos1,6
		if (!recoverStatus) {

			recoverStatus = {};
			recoverStatus.dataIdx = 0;
			recoverStatus.posIdx = 0;
		}
		this.m_preferedIdx = recoverStatus.dataIdx % this.m_columnItemNum;
		recoverStatus.dataIdx = Math.floor(recoverStatus.dataIdx / this.m_columnItemNum);
		this._super(recoverStatus);
	},

	scrollByIdx: function(_focusDataIdx, focusCellIdx) {
		var focusDataIdx = Math.floor(_focusDataIdx / this.m_columnItemNum);
		this.m_preferedIdx = _focusDataIdx % this.m_columnItemNum;
		this._super(focusDataIdx, focusCellIdx);
	},

	onFocusEdge: function(eventKey) {
		var curCell = this.getCurCell();
		var columnItemFocusIdx = curCell.getColumnItemFocusIdx();

		var dataIdx = this.m_focusDataIdx * this.m_columnItemNum + columnItemFocusIdx;
		var cellIdx = this.m_focusCellIdx;

		if (eventKey === st.KeyEvent_Left && this.m_focusDataIdx > 0) {

			dataIdx -= 1;

			if (this.m_focusCellIdx > 0) {
				cellIdx = this.m_focusCellIdx - 1;
			}

			this.scrollByIdx(dataIdx, cellIdx);

		} else if (eventKey === st.KeyEvent_Right && this.m_focusDataIdx < this.m_datas.length - 1) {

			dataIdx += 1;

			if (this.m_focusCellIdx < this.m_visibleCellCount - 1 - this.m_adjustLastFocusOffset) {
				cellIdx = this.m_focusCellIdx + 1;
			}

			this.scrollByIdx(dataIdx, cellIdx);
		}
	},

	dispatchEvent: function(event) {
		var eventKey = event.getEvent();
		this.m_preferedIdx = -1;
		if (eventKey === st.KeyEvent_Left || eventKey === st.KeyEvent_Right) {
			var curCell = this.getCurCell();
			if (!curCell) {
				return;
			}
			if ((eventKey === st.KeyEvent_Left && curCell.getColumnItemFocusIdx() === 0) || (eventKey === st.KeyEvent_Right && curCell.getColumnItemFocusIdx() >= this.m_columnItemNum - 1)) {
				if (this.onFocusEdge) {
					this.m_preferedIdx = eventKey === st.KeyEvent_Left ? this.m_columnItemNum - 1 : 0;
					this.onFocusEdge(eventKey);
				}
			} else {

				curCell.dispatchEvent(event, this.focusChangedCB.bind(this));
					
			}
		} else {
			this._super(event);
		}
	},

	getFocusData: function(){
		var focusItem = this.getCurCell();
		var columnItemFocusIdx = focusItem.getColumnItemFocusIdx();
		return this.m_datas[this.m_focusDataIdx][columnItemFocusIdx]
	},

    setOnFocusChangeListener:function(listener){
        this.onFocusChangeListener = listener;
    },

    focusChangedCB: function(){
    	//cc.log("focus changed cb");
    	if(this.onFocusChangeListener){
    		this.onFocusChangeListener();
    	}
    },
    onExit: function(){
        this._super();

        this.removeAllChildren(true);
    }
});