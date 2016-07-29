/*
* 原型扩展
*/

Object.prototype.method = function (name, func) {

    this.prototype[name] = func;

    return this;
};

//焦点是否在自身区域内
Object.method("containsPoint", function(point){
	if(this.getContentSize){
		var localPos = this.convertToNodeSpace(point);

		var size = this.getContentSize();
		
		var rect = cc.rect(0, 0, size.width, size.height);
	
		return cc.rectContainsPoint(rect, localPos);

	}else{
		st.log("Object not found getContentSize");
	}

	return false;
	
});