$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	console.log(request.mydid)
	getTop(request.id, request.categoryid);
	mydDetail(1, 10, request.mydid, '', '', '', '')
	renderTime()
	renderType()
	bindSearch(request.mydid)
})

//获取上部分人员信息
function getTop(id, categoryid) {

	var pageNo = pageNo == undefined ? '1' : pageNo;
	var pageSize = pageSize == undefined ? 10 : pageSize;

	$.loadData('/api/100/500/50', '{"categoryId": "' + categoryid + '","id":"' + id + '"}', function(data) {
		console.log(data)
		var data = data.body;
		var defaultSrc = "img/mediation/mrry.jpg";
		var imageUrl = data.imageUrl == '' ? defaultSrc : data.imageUrl;
		$msg = $('<div class="banner">' +
			'<div class="content-wrapper">' +
			'<div class="lawyer">' +
			'<div class="lawyer-detail">' +
			'<div class="lawyer-img">' +
			'<img class="userImg" src="' + SERVERFILEPORT + '' + data.imageUrl + '" onerror="$.userNotFind()" />' +
			'</div>' +
			'<div class="lawyer-detail-msg">' +
			'<div class="lawyer-name">' +
			'<span id="name">' + data.personName + '</span>' +
			'<span id="type">' + data.roleId + '</span>' +
			'</div>' +
			'<div class="lawyer-msg">' +
			'<ul>' +
			'<li title="' + data.agencyName + '"><span class="title">所属机构：</span><span>' + data.agencyName + '</span></li>' +
			'<li><span class="title">所属地区：</span><span>' + data.area.name + '</span></li>' +
			'<li><span class="title">联系电话：</span><span>' + data.agencyPhone + '</span></li>' +
			'<li><span class="title">执业证号：</span><span>' + data.no + '</span></li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>')

		$('.nav').after($msg);
	}, true)

}

//加载时间
function renderTime() {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#timeSole',
			range: '~'
		});
	});
}

//获取类型下拉框内容
function renderType() {
	$.getDataDic('evaluate_type', function(data) {
		console.log(data);
		$.each(data.body, function(index, val) {
			var $option = $('<option id="' + val.value + '">' + val.label + '</option>');
			$('#mydtype').append($option);
		});
	})
}

//获取满意度详细信息
function mydDetail(pageNo, pageSize, id, type, prescription, beginDate, endDate) {
	var pageNo = pageNo == undefined ? '1' : pageNo;
	var pageSize = pageSize == undefined ? 10 : pageSize;
	console.log('{"pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","id":"' + id + '","type":"' + type + '","prescription":"' + prescription + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '"}')
	$.loadData('/api/100/600/90', '{"pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","id":"' + id + '","type":"' + type + '","prescription":"' + prescription + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '"}', function(data) {
		console.log(data)
		$('#search-count').html(' ' + data.body.count + ' ');
		console.log(data.body.count)
		var list = data.body.list;
		if(list != undefined && list != null && list != '') {
			$('#nodata').remove()
			layui.use('laypage', function() {
				var laypage = layui.laypage;
				//执行一个laypage实例
				laypage.render({
					elem: 'pagination',
					count: data.body.count,
					groups: 5,
					curr: pageNo,
					theme: '#1296D6',
					limit: 10,
					first: '首页',
					last: '尾页',
					jump: function(obj, first) {
						$('.table tbody').find('tr').remove()

						$.each(list, function(index, val) {
							var $tr;
							var index = index + 1;
							var num = (pageNo -1)*pageSize +index;
							$tr = $('<tr>' +
								'<td>'+ num +'</td>' +
								'<td>法律援助</td>' +
								'<td><div class="star-list"><img src="img/star_' + val.prescription + '.png"></div></td>' +
								'<td class="pj-content"><div class="proposal">' + val.proposal + '</div><em>' + val.proposal + '</em></td>' +
								'<td>' + val.createBy.name + '</td>' +
								'<td><span>' + val.createDate + '</span></td>' +
								'</tr>')
							
							$('.table').find('tbody').append($tr);
							console.log($(".table tbody").find('.pj-content'))
							
							//评价内容显示框
							$(".table tbody").find('.pj-content').hover(function() {
								$(this).find("em").css('display','block');
							}, function() {
								$(this).find("em").css('display','none');
							});
							
							//首次不执行
							if(!first) {
								$('.table tbody').find('tr').remove()
								mydDetail(obj.curr, 10, id, type, prescription, beginDate, endDate)
							}
						});
					}
				});

			})

		} else {
			$('.layui-box').remove();
			$('.table tbody').find('tr').remove();
			$('.table').append('<tr><td style="border-right:none" colspan="6" style="text-align:center;">暂无数据</td></tr>')
		}

	}, true)
}

//绑定搜索
function bindSearch(id) {
	$('#find-btn').bind('click', function() {

		var type = $('#mydtype option:selected').attr('id');
		var prescription = $('#star option:selected').attr('value');
		console.log(prescription)
		var startTime = $('#timeSole').val().split(' ~ ')[0];
		var endTime = $('#timeSole').val().split(' ~ ')[1] == undefined ? '' : $('#timeSole').val().split(' ~ ')[1];
		mydDetail(1, 10, id, type, prescription, startTime, endTime)
	})
}