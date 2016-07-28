/*
 * Node 相关操作接口
 */
NameSpace.register("st.NodeUtil");

/**
 * @param parentNode
 * @param childNode
 * @param posDesc   ｛desc，offset,sc｝ desc描述了位置。 用'c'中，'l''r''t''b'表示left,right,top,bottom，代表9个相对位置。  offset对相对位置做修正。
 * sc(screen) === true 当parentNode是Layer或scene的时候使用
 * pc(parent-child) 当不需要addChild的时候使用
 * @param cfgObj     用于设置zOrder与tag  cfgObj应该有｛tag,zOrder｝属性
 */
st.NodeUtil.attachNodes = function(parentNode, childNode, posDesc, cfgObj) {

    st.assert(parentNode, 'attachNodes,need parentNode', childNode);
    st.assert(childNode, 'attachNodes,need childNode', parentNode);

    st.assert(parentNode.addChild, 'parentNode.addChild error', parentNode);

    if (posDesc) {
        var _pos = st.NodeUtil.getPosByDesc(parentNode, posDesc);
        childNode.setPosition(_pos);
    }

    if (cfgObj) {
        childNode.setLocalZOrder(cfgObj.zOrder);
        childNode.setTag(cfgObj.tag);
    }

    parentNode.addChild(childNode);
};

//更新节点状态
st.NodeUtil.updateNodeState = function (childNode, posDesc, cfgObj) {
    st.assert(childNode, 'attachNodes,need childNode', childNode);

    var parentNode = childNode.getParent();

    st.assert(parentNode, 'updateNodeState, not have parent!', parentNode);

    if (posDesc) {
        var _pos = st.NodeUtil.getPosByDesc(parentNode, posDesc);
        childNode.setPosition(_pos);
    }


    if (cfgObj) {
        childNode.setLocalZOrder(cfgObj.zOrder);
        childNode.setTag(cfgObj.tag);
    }
};

st.NodeUtil.getPosByDesc = function(parentNode, posDesc) {
    var _pos = cc.p(0, 0);

    if (posDesc) {

        var _base = posDesc.base || posDesc.desc;

        if (posDesc.sc === true) {
            _pos = this.getPointOfScreen(_base);

        } else {


            if (_base === 'c') {
                _pos = this.getPointOfNodeCenter(parentNode);
            } else if (_base.contains('c') && _base.contains('l')) {
                _pos = this.getPointOfNodeCenterLeft(parentNode);
            } else if (_base.contains('c') && _base.contains('r')) {
                _pos = this.getPointOfNodeCenterRight(parentNode);
            } else if (_base.contains('c') && _base.contains('t')) {
                _pos = this.getPointOfNodeCenterTop(parentNode);
            } else if (_base.contains('c') && _base.contains('b')) {
                _pos = this.getPointOfNodeCenterBot(parentNode);
            } else if (_base.contains('l') && _base.contains('t')) {
                _pos = this.getPointOfNodeLeftTop(parentNode);
            } else if (_base.contains('r') && _base.contains('t')) {
                _pos = this.getPointOfNodeRightTop(parentNode);
            } else if (_base.contains('l') && _base.contains('b')) {
                _pos = this.getPointOfNodeLeftBot(parentNode);
            } else if (_base.contains('r') && _base.contains('b')) {
                _pos = this.getPointOfNodeRightBot(parentNode);

            } else {
                st.assert(false, 'unknow desc', posDesc);
            }
        }


        if (_pos) {

            if (posDesc.offset) {
                if (posDesc.offset.x) {
                    _pos.x += posDesc.offset.x;
                }

                if (posDesc.offset.y) {
                    _pos.y += posDesc.offset.y;
                }

            }
        }

    }
    return _pos;
};

st.NodeUtil.getPointOfScreen = function(desc) {

    var _sizeAll = cc.director.getVisibleSize();
    var _oriPoint = cc.director.getVisibleOrigin();

    var _pos;
    if (desc === 'c') {
        _pos = cc.p(_sizeAll.width / 2, _sizeAll.height / 2);
    } else if (desc.contains('c') && desc.contains('l')) {
        _pos = cc.p(0, _sizeAll.height / 2);
    } else if (desc.contains('c') && desc.contains('r')) {
        _pos = cc.p(_sizeAll.width, _sizeAll.height / 2);
    } else if (desc.contains('c') && desc.contains('t')) {
        _pos = cc.p(_sizeAll.width / 2, _sizeAll.height);
    } else if (desc.contains('c') && desc.contains('b')) {
        _pos = cc.p(_sizeAll.width / 2, 0);
    } else if (desc.contains('l') && desc.contains('t')) {
        _pos = cc.p(0, _sizeAll.height);
    } else if (desc.contains('r') && desc.contains('t')) {
        _pos = cc.p(_sizeAll.width, _sizeAll.height);
    } else if (desc.contains('l') && desc.contains('b')) {
        _pos = cc.p(0, 0);
    } else if (desc.contains('r') && desc.contains('b')) {
        _pos = cc.p(_sizeAll.width, 0);

    } else {
        st.assert(false, 'unknow desc', desc);
    }

    return cc.p(
        _oriPoint.x + _pos.x,
        _oriPoint.y + _pos.y
    );
};

st.NodeUtil.getPointOfNodeCenter = function(node) {

    var _size = node.getContentSize();
    return cc.p(_size.width / 2, _size.height / 2);

};


st.NodeUtil.getPointOfNodeCenterLeft = function(node) {

    var _size = node.getContentSize();
    return cc.p(0, _size.height / 2);

};

st.NodeUtil.getPointOfNodeCenterTop = function(node) {

    var _size = node.getContentSize();
    return cc.p(_size.width / 2, _size.height);

};

st.NodeUtil.getPointOfNodeCenterRight = function(node) {

    var _size = node.getContentSize();
    return cc.p(_size.width, _size.height / 2);

};

st.NodeUtil.getPointOfNodeCenterBot = function(node) {

    var _size = node.getContentSize();
    return cc.p(_size.width / 2, 0);

};


st.NodeUtil.getPointOfNodeLeftTop = function(node) {

    var _size = node.getContentSize();
    return cc.p(0, _size.height);

};

st.NodeUtil.getPointOfNodeLeftBot = function(node) {

    //var _size = _parent.getContentSize();
    return cc.p(0, 0);

};

st.NodeUtil.getPointOfNodeRightTop = function(node) {

    var _size = node.getContentSize();
    return cc.p(_size.width, _size.height);

};

st.NodeUtil.getPointOfNodeRightBot = function(node) {

    var _size = node.getContentSize();
    return cc.p(_size.width, 0);

};


//描绘Node边框，方便调试
st.NodeUtil.makeDebugBoundRect = function(node, c4f0) {
    var _color0 = cc.color(0, 0, 0, 200); //no color
    var _color1 = c4f0 || cc.color(255, 0, 0, 0); //blue

    var _nodeSize = node.getContentSize();

    //这里先描画内部坐标原点
    var _drawRectNode = cc.DrawNode.create();
    _drawRectNode.setContentSize(_nodeSize);
    _drawRectNode.drawPoly(
        [
            cc.p(0, 0),
            cc.p(0, _nodeSize.height),
            cc.p(_nodeSize.width, _nodeSize.height),
            cc.p(_nodeSize.width, 0)
        ],
        _color0, //inside color
        2,
        _color1 //border color
    );
    _drawRectNode.setVisible(true);

    node.addChild(_drawRectNode, 2, 1);
};

//描绘Node锚点，方便调试
st.NodeUtil.makeDebugPoint = function(node, c4f0, c4f1) {
    var _color0 = c4f0 || cc.color(0, 0, 255, 0); //red original
    var _color1 = c4f1 || cc.color(0, 255, 0, 0); //green _anchorPoint

    //这里先描画内部坐标原点
    var _debugZeroPoint = cc.DrawNode.create();
    _debugZeroPoint.setContentSize(cc.size(7, 7));
    _debugZeroPoint.drawDot(cc.p(0, 0), 7, _color0);
    _debugZeroPoint.setVisible(true);

    node.addChild(_debugZeroPoint, 2, 1);

    //anchorPoint
    var _anchorPoint = cc.DrawNode.create();
    _anchorPoint.setContentSize(cc.size(5, 5));
    _anchorPoint.drawDot(cc.p(0, 0), 5, _color1);
    _anchorPoint.setVisible(true);

    var _size = node.getContentSize();

    _anchorPoint.setPosition(
        cc.p(_size.width * node.getAnchorPoint().x, _size.height * node.getAnchorPoint().y)
    );

    node.addChild(_anchorPoint, 2, 1);
};

st.NodeUtil.makeDebugBound = function(node) {
    st.NodeUtil.makeDebugBoundRect(node);
    st.NodeUtil.makeDebugPoint(node);
};

st.NodeUtil.replaceNode = function(ccbNode, nodeTag, newNode,noReplaceAnchor,noScale){
	var oldNode = ccbNode.getChildByTag(nodeTag);
	var newNodeAnchor = newNode.getAnchorPoint();
	st.assert(oldNode, "xs.Utils.Node.replaceNode oldNode error!", nodeTag);

	newNode.setPosition(oldNode.getPosition());
	newNode.setAnchorPoint(oldNode.getAnchorPoint());
	newNode.setTag(oldNode.getTag());
	newNode.setLocalZOrder(oldNode.getLocalZOrder());
	if(noScale){
		newNode.setScale(oldNode.getScale());
	}
	oldNode.removeFromParent();
	ccbNode.addChild(newNode);
	if(noReplaceAnchor){
		newNode.setAnchorPoint(newNodeAnchor);
	};
};

//坐标系之间坐标转换
//@ targetNode 需要转换到的目标坐标系Node
//@ oriNode 源Node  @ pos 需要转换的坐标
st.NodeUtil.convertPoint = function(targetNode, oriNode, pos) {
    var worldPos = oriNode.convertToWorldSpace(pos);
    var targetPos = targetNode.convertToNodeSpace(worldPos);
    return targetPos;
}

//立体焦点 @node 需要添加聚焦效果的node， @bAdd true为增加焦点，false为去掉焦点
st.NodeUtil.setStereoFocus = function(node,type, duration, scaleValue) {
	if(node.stereoFocused){
		return;
	}
    node.stereoFocused = true;

    var board_tag = 1000;
    var bottom_tag = 1001;

    var board = node.getChildByTag(board_tag);
    var bottom = node.getChildByTag(bottom_tag);
    if (board && bottom) { //已有立体效果
        return;
    }

    if(!scaleValue){
        scaleValue = 1.08;
    }

    //记录初始坐标
    node.recodeOriPos();
    node.oldZOrder = node.getLocalZOrder();

    //边框
    var board = cc.Scale9Sprite.createWithSpriteFrameName("focusBoard.png");
    var offset = cc.p(0,0);
    switch(type){
        case "gameClass":
        	board = st.Sprite({img:"res/gameClassification/touying.png",anchorPoint:cc.p(0.5,0.5)});
        	offset = cc.p(20,10);
        	break;
        default:
        	board.setInsetLeft(100);
    	    board.setInsetRight(100);
    	    board.setInsetTop(100);
    	    board.setInsetBottom(100);
    	    break;
    }
    board.setTag(board_tag);
    board.setLocalZOrder(10000);

    var tempSize = node.getContentSize();

    board.setContentSize(cc.size(tempSize.width + 96 * 2, tempSize.height + 96 * 2));

    st.attachNodes(node, board, {
        desc: "c",
        offset: offset,
        sc: false
    });

    //底部
    var bottom = null;
    if (node.getColorType() === 1) {
        bottom = cc.Sprite.createWithSpriteFrameName("hongdi.png");
    } else {
        bottom = cc.Sprite.createWithSpriteFrameName("landi.png");
    }
    bottom.setTag(bottom_tag);
    bottom.setLocalZOrder(10001);
    bottom.setAnchorPoint(cc.p(0.5, 1));
    bottom.setScaleX(tempSize.width / bottom.getContentSize().width);
    st.attachNodes(node, bottom, {
        desc: "cb",
        offset: cc.p(0, 0),
        sc: false
    });
    

    var tempPos = node.getPosition();
    var anchor = node.getAnchorPoint();
    var scaleOffset = cc.size(tempSize.width * (scaleValue - 1), 
        (tempSize.width + bottom.getContentSize().height) * (scaleValue - 1));
    var moveTo = cc.MoveTo.create(duration, cc.p(tempPos.x - (0.5 - anchor.x)*scaleOffset.width, 
                                            tempPos.y + 50 + (anchor.y - 0.5)*scaleOffset.height));

    var scale = cc.ScaleTo.create(duration, scaleValue);
    node.runAction(cc.Spawn.create(moveTo, scale));

    node.setLocalZOrder(node.getLocalZOrder()+1);
}

//取消立体焦点效果
st.NodeUtil.unStereoFocus = function(node, duration) {
    if(!node.stereoFocused){
        return;
    }
    node.stereoFocused = false;
    
    var board_tag = 1000;
    var bottom_tag = 1001;
    var board = node.getChildByTag(board_tag);
    var bottom = node.getChildByTag(bottom_tag);

    if (board && bottom) { //已有立体效果
        board.removeFromParent();
        bottom.removeFromParent();

        var tempPos = node.getOriPosition();
        var moveTo = cc.MoveTo.create(duration, tempPos);
        var scale = cc.ScaleTo.create(duration, 1.0);
        node.runAction(cc.Spawn.create(moveTo, scale));


        if(node.getLocalZOrder() > 0){
            node.setLocalZOrder(node.oldZOrder);
        }
    }
}

st.NodeUtil.setFocused = function(node, actiontType){
    if(node.stereoFocused){
        return;
    }
    node.stereoFocused = true;

    var scaleValue = 1.1;
    var duration = 1.0;
    var tempSize = node.getContentSize();
    var board_tag = 1000;

    //记录初始坐标
    node.recodeOriPos();
    node.oldZOrder = node.getLocalZOrder();

    var board = cc.Scale9Sprite.createWithSpriteFrameName("1-11.png");
    board.setTag(board_tag);

    board.setInsetLeft(50);
    board.setInsetRight(52);
    board.setInsetTop(50);
    board.setInsetBottom(50);

    board.setContentSize(cc.size(tempSize.width + 38 * 2, tempSize.height + 36 * 2));

    st.attachNodes(node, board, {
        desc: "c",
        offset: cc.p(0 , 0),
        sc: false
    });

    var tempPos = node.getPosition();
    var anchor = node.getAnchorPoint();
    var scaleOffset = cc.size(tempSize.width * (scaleValue - 1), tempSize.height * (scaleValue - 1));
    var moveTo = cc.MoveTo.create(duration, cc.p(tempPos.x - (0.5 - anchor.x)*scaleOffset.width, 
                                            tempPos.y + (anchor.y - 0.5)*scaleOffset.height));
    
    var scale = cc.ScaleTo.create(duration, scaleValue);
    cc.director.getActionManager().removeAllActionsFromTarget(node);
    node.runAction(cc.Spawn.create(moveTo, scale).clone().easing(cc.easeExponentialOut()));

    node.setLocalZOrder(node.getLocalZOrder()+1);
},

st.NodeUtil.setUnFocused = function(node){
    if(!node.stereoFocused){
        return;
    }
    node.stereoFocused = false;
    
    var duration = 0.5;
    var board_tag = 1000;
    var board = node.getChildByTag(board_tag);

    if (board) {
        board.removeFromParent();

        var tempPos = node.getOriPosition();
        var moveTo = cc.MoveTo.create(duration, tempPos);
        var scale = cc.ScaleTo.create(duration, 1.0);
        cc.director.getActionManager().removeAllActionsFromTarget(node);
        node.runAction(cc.Spawn.create(moveTo, scale).clone().easing(cc.easeExponentialOut()));

        if(node.getLocalZOrder() > 0){
            node.setLocalZOrder(node.oldZOrder);
        }
    }
},

st.NodeUtil.clearFocusInfo = function(node){
    if(!node.stereoFocused){
        return;
    }
    node.stereoFocused = false;

    var board_tag = 1000;
    var board = node.getChildByTag(board_tag);

    if (board) {
        board.removeFromParent();

        var tempPos = node.getOriPosition();
        node.setScale(1.0);
        node.setPosition(tempPos);

        if(node.getLocalZOrder() > 0){
            node.setLocalZOrder(node.oldZOrder);
        }
    }
}

// st.NodeUtil.flipFocusBoard = function(node, duration){
//     var board_tag = 1000;
//     var board = node.getChildByTag(board_tag);

//     if(board){
//         // 正面z轴起始角度为90度（向左旋转90度），然后向右旋转90度
//         var orbitAction_1 = cc.orbitCamera(duration / 2, 1, 0, -90, -90, 0, 0);
//         var orbitAction_2 = cc.orbitCamera(duration / 2, 1, 0, 0, -90, 0, 0);
//         board.runAction(cc.sequence(orbitAction_2, orbitAction_1).easing(cc.easeExponentialOut()));
//     }
// }


//屏幕截图
//@lbPoint  截图起始点左下角坐标
//@blurSize 截图尺寸
st.NodeUtil.screenShot = function(lbPoint, blurSize){
    var winSize = cc.winSize;
    var curScene = cc.director.getRunningScene();

    var rend = new cc.RenderTexture(winSize.width, winSize.height);
    rend.begin();
    curScene.visit();
    rend.end();

    var ret = rend.saveToFile("shot.jpg", cc.IMAGE_FORMAT_JPEG);

    if(ret){
        jsb.fileUtils.addSearchPath(jsb.fileUtils.getWritablePath());
        //return cc.Sprite.create(jsb.fileUtils.fullPathForFilename("shot.jpg"));
    }

    return cc.Sprite.createWithTexture(rend.getSprite().getTexture(), 
                cc.rect(lbPoint.x, lbPoint.y, blurSize.width, blurSize.height), false);
}

//生成高斯模糊图
//@_sprite  图片地址或者sprite对象
st.NodeUtil.blurSpriteWithPath = function(_sprite){

    //测试用高斯模糊算法
    var gaussianBlurShader = function(){
        var shader = cc.GLProgram.create("res/shader/blur.vsh", "res/shader/gaussian_blur.fsh");
        shader.retain();
        shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        shader.link();
        shader.updateUniforms();

        return shader;        
    };

    if( 'opengl' in cc.sys.capabilities ) {
        var sprite = null;
        if(_sprite instanceof cc.Sprite){
            sprite = _sprite;
        }else if(_sprite instanceof String){
            sprite = cc.Sprite.create(spritePath);
        }else{
            return null;
        }

        var textureSize = cc.size(sprite.getContentSize().width * sprite.getScaleX(), 
            sprite.getContentSize().height * sprite.getScaleY());

    
        var blurShader = gaussianBlurShader();
        sprite.setShaderProgram(blurShader);
        sprite.setAnchorPoint(cc.p(0, 0));
        var rend = new cc.RenderTexture(textureSize.width, textureSize.height);
        if (!rend) return null;
    
        rend.begin();
        sprite.visit();
        rend.end();

        //sprite.retain();

        //return sprite;

        // var ret = rend.saveToFile("render.png", cc.IMAGE_FORMAT_PNG);
        // if(ret){
        //     // st.dump("jsb.fileUtils.getWritablePath()", jsb.fileUtils.getWritablePath());
        //     // jsb.fileUtils.addSearchPath("/sdcard/", false);
        //     // st.dump("getSearchPaths", jsb.fileUtils.getSearchPaths());
        //     // st.dump("filePath", jsb.fileUtils.fullPathForFilename("render.png"));
        //     return cc.Sprite.create(jsb.fileUtils.getWritablePath()+"/render.png");
        // }
        rend.getSprite().getTexture().setAntiAliasTexParameters();
        var ret = cc.Sprite.createWithTexture(rend.getSprite().getTexture(), 
            cc.rect(0, 0, textureSize.width, textureSize.height), false);
        ret.setFlippedY(true);
        return ret;
    }
}

//sprite倒影特效处理
st.NodeUtil.invertedSprite = function(_sprite){
    var textureSize = _sprite.getContentSize();
    var shader = cc.GLProgram.create("res/shader/blur.vsh", "res/shader/test.fsh");
    shader.retain();
    shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
    shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
    shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
    shader.link();
    shader.updateUniforms();

    _sprite.setShaderProgram(shader);

}
