$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getCaseInfo(request);
	$('#right-fixed-nav').remove()
	$('input').attr('readonly', 'readonly');
	$('select').attr('disabled', 'disabled');
	$('textarea').attr('readonly', 'readonly');
})
//获取已有表单信息
function getCaseInfo(request) {
	$.loadData('/api/100/540/40', '{' +
		'"procInsId":"' + request.procInsId + '",' +
		'"procDefId":"' + request.procDefId + '",' +
		'"procDefKey":"' + request.procDefKey + '",' +
		'"taskId":"' + request.taskId + '",' +
		'"taskName":"' + request.taskName + '",' +
		'"taskDefKey":"' + request.taskDefKey + '"' +
		'}',
		function(data) {
			console.log(data)
			renderTableForm(data.body.businessData)
		}, true)
}
//渲染表单
function renderTableForm(req){
	$('#mediateDate').val(req.mediateDate)
	$('#mediatePlace').val(req.mediatePlace)
	$('#inquirer').val(req.oaPeopleMediationExamine.inquirer)
	$('#respondent').val(req.oaPeopleMediationExamine.respondent)
	$('#participants').val(req.oaPeopleMediationExamine.participants)
	$('#recorder').val(req.oaPeopleMediationExamine.recorder)
	$('#caseTitle').val(req.oaPeopleMediationApply.caseTitle)
	$('#mediateRecord').val(req.mediateRecord)
	$('#peopleMediationCommittee').val(req.oaPeopleMediationApply.peopleMediationCommittee.name)
	$('#mediator').val(req.oaPeopleMediationApply.mediator.name)
	console.log(fileList)
	if(req.caseFile != undefined && req.caseFile != '' && req.caseFile != null) {
		var fileList = req.caseFile.substring(1, req.caseFile.length).split('|');
		$.each(fileList, function(i, el) {
			var fileName = decodeURI(el.split('/')[el.split('/').length - 1]);
			var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
			$('.uploaded-list').append($listItem)
		})
	}
}
