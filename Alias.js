/*
* 别名系统
*/

//DEBUG
st.log = st.LogUtil.log;
st.dump = st.LogUtil.dump;
st.warn = st.LogUtil.warn;
st.assert = st.LogUtil.assert;

st.notify = st.Notification;


//Node
st.attachNodes = st.Utils.Node.attachNodes;
st.updateNodes = st.Utils.Node.updateNodeState;
st.debugRect = st.Utils.Node.makeDebugBoundRect;


//Models
// st.Model.EventModel = st.Model.EventModel;

//ViewFactory
// st.Button = st.ViewFactory.createButton;
// st.TextView = st.ViewFactory.createTextView;
// st.EditBox = st.ViewFactory.createEditBox;
// st.Sprite = st.ViewFactory.createSprite;