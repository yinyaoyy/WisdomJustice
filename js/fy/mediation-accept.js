$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getCaseType();
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
			renderTableForm(data.body.businessData)
		}, true)
}
//获取民族
function getCaseType() {
	$.getDataDic('ethnic', function(data) {
		var ethnicList = data.body;
		$.each(ethnicList, function(index, val) {
			$opt = $('<option id="' + val.value + '" value="' + val.value + '" >' + val.label + '</option>')
			$('.ethnic').append($opt)
		})
	})

}
//渲染表单信息
function renderTableForm(req) {
	console.log(req)
	$('#accuserName').val(req.oaPeopleMediationApply.accuserName);
	$('#accuserIdcard').val(req.oaPeopleMediationApply.accuserIdcard);
	$('#accuserSex').find("option[value = '" + req.oaPeopleMediationApply.accuserSex + "']").attr("selected", "selected");
	$('#accuserBirthday').val(req.oaPeopleMediationApply.accuserBirthday);
	$('#accuserEthnic').find("option[value = '" + req.oaPeopleMediationApply.accuserEthnic + "']").attr("selected", "selected");
	$('#accuserCounty').val(req.oaPeopleMediationApply.accuserCounty.name)
	$('#accuserTown').val(req.oaPeopleMediationApply.accuserTown.name)
	$('#accuserOccupation').val(req.oaPeopleMediationApply.accuserOccupation);
	$('#accuserDomicile').val(req.oaPeopleMediationApply.accuserDomicile);
	$('#accuserAddress').val(req.oaPeopleMediationApply.accuserAddress);
	$('#accuserPostCode').val(req.oaPeopleMediationApply.accuserPostCode);
	$('#accuserPhone').val(req.oaPeopleMediationApply.accuserPhone);
	$('#defendantName').val(req.oaPeopleMediationApply.defendantName);
	$('#defendantIdcard').val(req.oaPeopleMediationApply.defendantIdcard);
	$('#defendantSex').find("option[value = '" + req.oaPeopleMediationApply.defendantSex + "']").attr("selected", "selected");
	$('#defendantBirthday').val(req.oaPeopleMediationApply.defendantBirthday);
	$('#defendantEthnic').find("option[value = '" + req.oaPeopleMediationApply.defendantEthnic + "']").attr("selected", "selected");
	$('#defendantCounty').val(req.oaPeopleMediationApply.defendantCounty.name);
	$('#defendantTown').val(req.oaPeopleMediationApply.defendantTown.name);
	$('#defendantOccupation').val(req.oaPeopleMediationApply.defendantOccupation);
	$('#defendantDomicile').val(req.oaPeopleMediationApply.defendantDomicile);
	$('#defendantAddress').val(req.oaPeopleMediationApply.defendantAddress);
	$('#defendantPostCode').val(req.oaPeopleMediationApply.defendantPostCode);
	$('#defendantPhone').val(req.oaPeopleMediationApply.defendantPhone);
	$("#caseSource").val(req.caseSourceDesc);
	$("#hasMongol").val(req.hasMongolDesc);
	$("#caseRank").val(req.caseRankDesc);
	$("#caseTime").val(req.caseTime);
	$("#caseCounty").val(req.oaPeopleMediationApply.caseCounty.name);
	$("#caseTown").val(req.oaPeopleMediationApply.caseTown.name);
	$("#caseArea").val(req.caseArea);
	$("#caseInvolveCount").val(req.caseInvolveCount);
	$("#caseType").val(req.oaPeopleMediationApply.caseTypeDesc);
	$("#caseTitle").val(req.oaPeopleMediationApply.caseTitle);
	$("#disputeSituation").val(req.disputeSituation);
	
	$('#mediator').val(req.oaPeopleMediationApply.mediator.name);
	$('#peopleMediationCommittee').val(req.oaPeopleMediationApply.peopleMediationCommittee.name);
	if(req.caseFile != undefined && req.caseFile != '' && req.caseFile != null) {
		var fileList = req.caseFile.substring(1, req.caseFile.length).split('|');
		console.log(fileList)
		$.each(fileList, function(i, el) {
			var fileName = decodeURI(el.split('/')[el.split('/').length - 1]);
			var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
			$('.uploaded-list').append($listItem)
		})
	}
}