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
	$('#agreementCode').val(req.oaPeopleMediationAgreement.agreementCode)
	$('#visitDate').val(req.visitDate)
	$('#visitCause').val(req.visitCause)
	$('#accuserName').val(req.oaPeopleMediationApply.accuserName)
	$('#defendantName').val(req.oaPeopleMediationApply.defendantName)
	$('#returnVisitPerson').val(req.oaPeopleMediationApply.mediator.name)
	$('#caseTitle').val(req.oaPeopleMediationApply.caseTitle)
	$('#visitSituation').val(req.visitSituation)
	$('#peopleMediationCommittee').val(req.oaPeopleMediationApply.peopleMediationCommittee.name)
	$('#mediator').val(req.oaPeopleMediationApply.mediator.name)
	if(req.caseFile != undefined && req.caseFile != '' && req.caseFile != null) {
		var fileName = decodeURI(el.split('/')[el.split('/').length - 1]);
		$.each(fileList, function(i, el) {
			var fileName = el.split('/')[el.split('/').length - 1];
			var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
			$('.uploaded-list').append($listItem)
		})
	}
}
