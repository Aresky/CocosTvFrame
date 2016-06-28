/*
* debug相关接口
*
*/
NameSpace.register("st.LogUtil");

st.LogUtil.log = function(logStr){
	if(!st.release){
		cc.log(logStr);
	}
}

st.LogUtil.dump = function(name, obj){
	st.LogUtil.log("["+name +"]  "+ st.LogUtil.toJsonString(obj));
}

st.LogUtil.toJsonString = function (obj, maxLevel, level) {
	
	if (maxLevel === undefined) {
		maxLevel = 10;
	}

	if (level === undefined) {
		level = 0;
	}

	if (level === maxLevel) {
		//  cc.log('0ver');
		return "" + obj + '???';
	}

	var _SPACE = '    ';


	if (obj === null) {
		return '\"' + obj + '\"';
	}

	if (typeof obj === 'string') {
		return '\"' + obj + '\"';
	} else if (typeof obj === 'function') {
		return "Function";
	} else if (typeof obj === 'native code') {
		return "native code";
	}
	else if (typeof obj !== 'object') {
		return "" + obj ;
	}
	else{
		var _lastPre = "";

		for (var i = 0; i < level; i++) {
			_lastPre += _SPACE;
		}
		var _pre = _lastPre + _SPACE;

		var _ret = '{' + '\n';

		var _isEmptyObj = true;

		for (var _tmp in obj) {
			if (i === 0) {
				i++;
			}

			if (!obj.hasOwnProperty(_tmp)  ) {
				continue;
			}

			_isEmptyObj = false;

			var objValue = st.LogUtil.toJsonString(obj[_tmp], maxLevel, level + 1);

			if (objValue.indexOf('function') >= 0) {
				//objValue += 'function777';
				//continue;
			}
			if (objValue === 'Function') {
				// continue;
			}

			_ret += _pre;
			if (!obj.hasOwnProperty(_tmp)) {
				_ret += "prototype.";

			} else {

			}

			var _type = typeof(obj[_tmp]);

			_ret += _tmp;
			_ret += '[' + _type;
			_ret += ']';
			_ret += " : ";
			_ret += objValue;
			_ret += ' ,\n';
		}
		_ret += _lastPre + '}';

		if(_isEmptyObj){
			_ret = '{}';
		}
		return _ret;
	}
};

st.LogUtil.warn = function (usrTag, msg) {
    if(arguments.length >= 2){	
    	st.LogUtil.log("WARN-" + usrTag + "  " + msg);
    }else{
    	msg = usrTag;
    	st.LogUtil.log("WARN  " + msg);
    }
};

st.LogUtil.assert = function (expression, msg, info0, info1) {

    function _printLastCallStack() {

        var count = 0;
        var fun = arguments.callee;
        do {
            if (
                count >=3   && count < 10
                ) {
                var _funcStr = '' + fun;
                st.warn('stack-' + count,_funcStr);     //只取前100个
            }
            else{
                if(count >= 10){
                    break;
                }
            }
            fun = fun.arguments.callee.caller;    //如果有递归，那么这里就会无限循环

            count++;

        } while (fun);
    }


    function _createLastCallStackString() {

        var _ret = '';

        var count = 0;
        var fun = arguments.callee;
        do {
            if (
                count >=3 && count < 10
                ) {
                var _funcStr = '' + fun;
                _ret += _funcStr;
            }
            else{
                if(count >= 10){
                    break;
                }
            }
            fun = fun.arguments.callee.caller;    //如果有递归，那么这里就会无限循环

            count++;

        } while (fun);

        return _ret;
    }

    if (expression === null || expression === undefined || expression === false) {

        var params = '\n' + '------------err msg------------' + '\n'
            + st.LogUtil.toJsonString({
                expression: expression,
                msg: msg,
                info0: info0,
                info1: info1
            })
            + '------------create ------------\n'
            + _createLastCallStackString();

        st.warn('assert',params);

        //st.View.Dialog.ErrorDialog.show(params + '\n');
 
        if (st.assertExit !== true) {
            return;
        }

        st.Utils.Sys.exit();
    }
};