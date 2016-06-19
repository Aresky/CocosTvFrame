/*
* 事件model
*/

st.Model.EventModel = cc.Class.extend({
	ctor:function(key, event , eventType, extra){

		this.m_key = key;//键值
		this.m_event = event;//事件
		this.m_type = eventType;//事件类型, cc.EventListener.KEYBOARD....
		this.m_extra = extra;//扩展数据，cc.EventListener.KEYBOARD下表示keydown， keyup， longpress

		return true;
	},

	getKey:function(){
		return this.m_key;
	},

	getEvent:function(){
		return this.m_event;
	},

	getEventType:function(){
		return this.m_type;
	},

	getActionType:function(){
		return this.m_extra;
	}
});