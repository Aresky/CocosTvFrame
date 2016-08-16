/**
 * 代码运行性能测试辅助
 */
NameSpace.register("st.PerformanceUtil");

st.PerformanceUtil.satrtTime = 0;

st.PerformanceUtil.start = function(){
	st.PerformanceUtil.satrtTime = new Date().getTime();

}

st.PerformanceUtil.step = function(stepIndex){
	var timeStamp = new Date().getTime();
	var offset = timeStamp - st.PerformanceUtil.satrtTime;
	st.log("Performance step_"+stepIndex+" cost:" + offset +" ms");

	st.PerformanceUtil.satrtTime = timeStamp;
}