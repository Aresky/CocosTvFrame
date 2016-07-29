String.prototype.startWith = function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
}  

String.prototype.endWith = function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}

String.prototype.contains = function(str){     
  	if(this.indexOf(str) != -1){
  		return true;
  	}  
  	return false;
}

/* 字符插入
* @str 源串
* @flg 待插入的字符
* @offset 插入位置
*/
String.prototype.insert = function(flg, offset){
    var temp_1 = this.substring(0, offset + 1);
    var temp_2 = this.substring(offset + 1);
    return temp_1 + flg + temp_2;
}