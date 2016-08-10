//设计分辨率
st.DesignSize = cc.size(1920, 1080);

//platform
st.Const_Platform_Android = 3;

//***********************按键相关***********************
//自定义按键code
// cc.KEY.mi_up = 158;
// cc.KEY.mi_down = 159;
// cc.KEY.mi_left = 156;
// cc.KEY.mi_right = 157;
// cc.KEY.mi_enter = 161;

//按键事件
st.KeyEvent_Up 	  = 1;
st.KeyEvent_Down  = 2;
st.KeyEvent_Left  = 3;
st.KeyEvent_Right = 4;
st.KeyEvent_Menu  = 5;
st.KeyEvent_Enter = 6;
st.KeyEvent_Back  = 7;

//按键事件动作类型
st.KeyEventAction_Down = 1;
st.KeyEventAction_Up = 1 << 1;
st.KeyEventAction_LongPress = 1 << 2;


//自定义事件
st.CustomEvent_ToBack  = 1;
st.CustomEvent_ToFront = 2;

//Notification事件
st.Const_Notification_Event_Default = 1001;

st.Const_Notification_Event_DownImageSucess = st.Const_Notification_Event_Default + 1;
