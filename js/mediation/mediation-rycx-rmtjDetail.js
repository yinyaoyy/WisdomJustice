$(function() {
	var request = $.GetRequest();
	getDetail(request.id, request.categoryid);
	$.getSecPageNav();
});

function getDetail(id, categoryid) {
	//	console.log(categoryId);
	console.log(id);
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
			'<img class="userImg" src="' + SERVERFILEPORT + '' + data.imageUrl + '" onerror="$.userNotFind()"/>' +
			'</div>' +
			'<div class="lawyer-detail-msg">' +
			'<div class="lawyer-name">' +
			'<span id="name">'+ data.personName +'</span>' +
			'<span id="type"></span>' +
			'</div>' +
			'<div class="lawyer-msg">' +
			'<ul>' +
			'<li><span class="title">性 别：</span><span id="sex">'+ data.sex +'</span></li>' +
			'<li><span class="title">年龄：</span><span id="age">'+ data.age +'</span></li>' +
			'<li><span class="title">学历：</span><span id="edu">'+ data.education +'</span></li>' +
			'<li><span class="title">民 族：</span><span id="nation">'+ data.ethnic +'</span></li>' +
			'<li><span class="title">政治面貌：</span><span id="outlook">'+ data.politicalFace +'</span></li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'<div class="lawyer-mobile">' +
			'<div class="mobile">' +
			'<p id="mobile-num">'+ data.agencyPhone +'</p>' +
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
			'<li><span class="title">执业年限：</span><span id="year">'+ data.practisingYear +'</span></li>' +
			'<li><span class="title">所属地区：</span><span id="expertise">'+ data.area.name +'</span></li>' +
			'<li><span class="title">调委会职务：</span><span id="status">'+ data.roleId +'</span></li>' +
			'<li class="jg"><span class="title">所属机构：</span><span id="status">'+ data.agencyName +'</span></li>'+
			'<li><span class="title">蒙汉双通：</span><span id="mechanism">'+ data.isMongolian +'</span></li>' +
			'<li class="intro"><span class="title">个人简介：</span><span id="introduce" class="introduce">'+ data.introduction +'</span></li>' +
			'</ul>' +
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