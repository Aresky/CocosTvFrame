/**
 * 焦点管理
 */

st.FocusManager = {
	
	/**
	 * 当场景或者视图需要使用焦点管理的时候就调用此接口注册
	 * @focusMatrix 焦点矩阵图,是一个二维数组
	 * [[0, 1, 2],
	 * 	[0, 1, 2],
	 * 	[0, 1, 2]]
	 * @curFocusIdx 当前焦点 {row:0, column:0}
	 */
	registFocusManager:function(registerName, focusMatrix, curFocusIdx){
		st.assert(registerName, "registerName is undefined!");

		//焦点管理注册者集合
		if(!this.m_registers){
			this.m_registers = {};
		}

		this.m_registers[registerName] = new st.FocusManager.registerModel(focusMatrix, curFocusIdx);

		this.checkOut(registerName);
	},

	unregistFocusManager:function(){
		this.m_focusMatrix = null;

		cc.sys.garbageCollect();
	},

	checkOut:function(registerName){
		st.assert(this.m_registers[registerName], "can not checkout focusMatrix of "+registerName);

		//焦点矩阵图,是一个二维数组
		this.m_focusMatrix = this.m_registers[registerName].getFocusMatrix();

		//当前焦点
		this.m_curFocusIdx = this.m_registers[registerName].getCurFocusIdx();
	},

	/**
	 * 添加需要管理焦点的节点
	 * @param {[type]} row   行
	 * @param {[type]} colum 列
	 */
	add:function(row, column, node){
		if(!this.m_focusMatrix[row]){
			this.m_focusMatrix[row] = new Array();
		}
		this.m_focusMatrix[row][column] = node;
	},

	remove:function(row, column){
		this.m_focusMatrix[row][column] = null;
	},

	/**
	 * 获取当前聚焦的节点
	 */
	getCurFocusNode:function(){
		var row = this.m_curFocusIdx.row;
		var column = this.m_curFocusIdx.column;
		return this.m_focusMatrix[row][column];
	},

	getNodeByIdx:function(focusIdx){
		var row = focusIdx.row;
		var column = focusIdx.column;
		return this.m_focusMatrix[row][column];
	},

	dispatchEvent:function(eventModel){
		var event = eventModel.getEvent();
		var oldFocusIdx = {row:this.m_curFocusIdx.row, column:this.m_curFocusIdx.column};
        switch (event) {
            case st.KeyEvent_Up:

                break;
            case st.KeyEvent_Down:
            	this.m_curFocusIdx.row++;
                break;
            case st.KeyEvent_Left:
                break;
            case st.KeyEvent_Right:
            	this.m_curFocusIdx.column++;
                break;
            case st.KeyEvent_Enter:
            	this.getCurFocusNode().onClick();
            	return;
        }
        st.dump("oldFocusIdx", oldFocusIdx);
        st.dump("this.m_curFocusIdx", this.m_curFocusIdx);
        this.getNodeByIdx(oldFocusIdx).onLostFocus();
        this.getCurFocusNode().onGetFocus();
	}
}

st.FocusManager.registerModel = function(focusMatrix, curFocusIdx){
	//焦点矩阵图,是一个二维数组
	this.m_focusMatrix = focusMatrix;

	//当前焦点
	this.m_curFocusIdx = curFocusIdx;

	this.getFocusMatrix = function(){
		return this.m_focusMatrix;
	};

	this.getCurFocusIdx = function(){
		return this.m_curFocusIdx;
	}
}
