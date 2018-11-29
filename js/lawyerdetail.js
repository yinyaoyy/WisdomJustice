$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getItemDetail(request.agencyid, request.categoryid)
})
//获取页面详情
function getItemDetail(id, categoryid) {
	$.loadData('/api/100/500/50', '{"categoryId":"' + categoryid + '","id":"' + id + '"}', function(data) {
		var item = data.body
		console.log(item)
		$('#name').html(item.name);
		$('#type').html();
		$('#sex').html(item.sex == 2 ? '女' : '男');
		$('#age').html(item.age);
		$('#edu').html(item.education);
		$('#nation').html(item.ethnic);
		$('#outlook').html(item.politicalFace);
		$('#mobile-num').html(item.mobile);
		$('#year').html(item.practisingYear + '年');
		$('#expertise').html();
		$('#status').html();
		$('#mechanism').html();
		$('#card').html();
		$('#category').html();
		$('#office').html();
	},true)
}