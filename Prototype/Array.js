
//数组是否包含
Array.method('hasItem', function (input) {

    if(this.indexOf(input) != -1){
        return true;
    }
    return false;
});

//数组删除元素
Array.method("delete", function(input){
	for (var i = 0; i < this.length; i++) {
        if (this[i] === input ) {
            this.splice(i , 1);
        }
    }
});

//取数组最后一个元素
Array.method("getLast", function(){
	return this[this.length - 1];
});

//获取数组最大index
Array.method("getMaxIndex", function(){
    return this.length - 1;
});