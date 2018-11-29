$(function(){
	$.setParentIframeHeight()
})
$.extend({
	setParentIframeHeight:function(){
		var parentIframe = parent.document.getElementById('iframe')
		var childHeight = document.body.scrollHeight
		console.log(childHeight)
	}
})