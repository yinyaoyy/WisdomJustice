$(function() {
	var request = $.GetRequest();
	getDetail(request.id, request.categoryid);
	$.getSecPageNav();
});

function getDetail(id, categoryid) {
	$.loadData('/api/100/500/50', '{"categoryId": "' + categoryid + '","id":"' + id + '"}', function(data) {
		console.log(data);
		var data = data.body;
		var defaultSrc = "img/mediation/mrry.jpg";
		var imageUrl = data.imageUrl == '' ? defaultSrc : data.imageUrl;
		$msg = $('<div class="banner">' +
			'<div class="content-wrapper">' +
			'<div class="lawyer">' +
			'<div class="lawyer-detail">' +
			'<div class="lawyer-img">' +
			'<img class="userImg" src="' + SERVERFILEPORT + '' + data.imageUrl + '" onerror="$.userNotFind()">' +
			'</div>' +
			'<div class="lawyer-detail-msg">' +
			'<div class="lawyer-name">' +
			'<span id="name">' + data.personName + '</span>' +
			'<span id="type"></span>' +
			'</div>' +
			'<div class="lawyer-msg">' +
			'<ul>' +
			'<li><span class="title">性 别：</span><span id="sex">' + data.sex + '</span></li>' +
			'<li><span class="title">年龄：</span><span id="age">' + data.age + '</span></li>' +
			'<li><span class="title">学历：</span><span id="edu">' + data.education + '</span></li>' +
			'<li><span class="title">民 族：</span><span id="nation">' + data.ethnic + '</span></li>' +
			'<li><span class="title">政治面貌：</span><span id="outlook">' + data.politicalFace + '</span></li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'<div class="lawyer-mobile">' +
			'<div class="mobile">' +
			'<p id="mobile-num">' + data.agencyPhone + '</p>' +
			'</div>' +

			'<div class="contact">' +
			'<button class="contact-Btn">在线咨询</button>' +
			'<button class="contact-btn">给TA留言</button>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="lawyer-info">' +
			'<div class="content-wrapper">' +
			'<div class="info-list">' +
			'<div class="list-title">' +
			'<div class="title-text">个人信息</div>' +
			'</div>' +
			'<div class="info-box">' +
			'<ul>' +
			'<li><span class="title">执业证号：</span><span id="status">' + data.no + '</span></li>' +
			'<li><span class="title">职业类别：</span><span id="mechanism">' + data.type +'</span></li>' +
			'<li><span class="title">职业状态：</span><span id="status">' + data.status + '</span></li>' +
			'<li><span class="title">蒙汉双通：</span><span id="expertise">' + data.isMongolian + '</span></li>' +
			'<li><span class="title">法援律师：</span><span id="mechanism">' + data.isAidLawyer + '</span></li>' +
			'<li><span class="title">所属地区：</span><span id="mechanism">' + data.area.name + '</span></li>' +
			'<li><span class="title">所属机构：</span><span id="status">' + data.agencyName + '</span></li>' +
			'<li class="w90"><span class="title">联系地址：</span><span id="expertise">' + data.agencyAddress + '</span></li>' +
			'<li class="w90"><span class="title">业务专长：</span><span id="expertise">' + data.businessExpertise + '</span></li>' +
			
			'<li><span class="title">主管机关：</span><span id="status">' + data.mainOrgans + '</span></li>' +
			
			
			
			
			'<li class="intro"><span class="title">个人简介：</span><span id="introduce" class="introduce">' + data.introduction + '</span></li>' +
			'</ul>' +
			'</div>' +
			'</div>' +

			'</div>' +
			'</div>');

		$('.nav').after($msg);
		$('.contact-btn').bind('click', function() {
			var ryId = data.id;
			Common.alertConsultationBox(ryId);
		});
		
	},true)
}