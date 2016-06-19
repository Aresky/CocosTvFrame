/*
* Notification 事件机制，用于模块间通信
* 按键事件不要使用这种事件处理机制	
*/

// forexample
// st.notify.addObserver(this, this.test, st.Const_Notification_Event_test);
// st.notify.postNotification(st.Const_Notification_Event_test);

st.Notification = st.Notification || cc.NotificationCenter.getInstance();

//*****************Notification相关事件******************
st.Notification.EVENT_COCOSTVFRAME_NULL = 0;
st.Notification.EVENT_CUSTOM = 1000;

