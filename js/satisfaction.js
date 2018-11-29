$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	var categoryId = request.categoryId;
	var name = $('#ser-input').val();
	console.log(name);
	getList(categoryId, 1, 8, name, '', 'false', '', '')
})

//获取详细信息
function getList(categoryId, pageNo, pageSize, name, areaId, isEvaluate, townId, isMongolian) {
	var pageNo = pageNo == undefined ? '1' : pageNo;
	var pageSize = pageSize == undefined ? 10 : pageSize;
	console.log('{"categoryId": "' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"' + townId + '","isMongolian":"' + isMongolian + '"}')
	$.loadData('/api/100/500/20', '{"categoryId":"' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"' + townId + '","isMongolian":"' + isMongolian + '"}', function(data) {
		console.log(data)
		$('#search-count').html(' ' + data.body.count + ' ');
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
					limit: 8,
					first: '首页',
					last: '尾页',
					jump: function(obj, first) {
						$('.myd-member-list').find('ul').remove()
						var $ul = $('<ul></ul>');
						$.each(list, function(index, val) {
							var adr = val.agencyAddress;
							var newText;
							if(adr != '' && adr != undefined && adr != null) {
								newText = $.calcTextLength(adr, 94)
							} else {
								newText = '';
							}
							var id = val.agencyId;
							var $li;
							if(categoryId == 11) {
								$li = $('<li>' +
									'<div class="user-img">' +
									'<img src="img/fy/user-default.png" alt="" />' +
									'</div>' +
									'<div class="user-name">' + val.personName + '</div>' +
									'<div class="user-info">' +
									'<p>工号：<span>' + val.no + '</span></p>' +
									'<p><span>' + val.roleId + '</span></p>' +
									'<p class="overflow" title="' + val.agencyName + '"><span>' + val.agencyName + '</span></p>' +
									'</div>' +
									'<div class="control-list">' +
									'<button>查看评价</button>' +
									'<div class="star-list">' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'</div>' +
									'</div>' +
									'</li>');
							} else {
								$li = $('<li>' +
									'<div class="user-img">' +
									'<img src="img/fy/user-default.png" alt="" />' +
									'</div>' +
									'<div class="user-name">' + val.personName + '</div>' +
									'<div class="user-info">' +
									'<p>工号：<span>' + val.no + '</span></p>' +
									'<p><span>' + val.roleId + '</span></p>' +
									'<p class="overflow" title="' + val.agencyName + '"><span>' + val.agencyName + '</span></p>' +
									'</div>' +
									'<div class="control-list">' +
									'<button>查看评价</button>' +
									'<div class="star-list">' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'<span class="active"></span>' +
									'</div>' +
									'</div>' +
									'</li>');
							}
							//满意度星星
//							var starNum = Math.floor(Math.random() * 3 + 3);
//							console.log(starNum)
//							if(starNum == 3) {
//								$li.find('.star-list span:lt(3)').removeClass('unactive').addClass('active')
//							} else if(starNum == 4) {
//								$li.find('.star-list span:lt(4)').removeClass('unactive').addClass('active')
//							} 	else if(starNum == 5){
////								$('.star-list span:gt(4)').removeClass('active').addClass('unactive')
//								$li.find('.star-list span').removeClass('unactive').addClass('active')
//							}
//							$li.find('.star-list').find('span').eq(starNum-1).prevAll().removeClass('unactive').addClass('active')
							$ul.append($li);
							
							$('.myd-member-list').append($ul);
							
							
							//首次不执行
							if(!first) {
								$('.result-list').find('ul').remove()
								getList(categoryId, obj.curr, 8, name, areaId, isEvaluate, townId, isMongolian)
							}
						});
					}
				});
			})

		} else {
			$('.layui-box').remove();
			$('.result-list').css('border-top', '1px solid #cccccc')
			$('#search-count').html(' 0 ')
			$('.result-list').html('<div id="nodata" style="width:100%;height:250px;text-align:center;margin-top:50px;"><img style="width:120px;" src="img/noData.jpg"/></div>')
		}
		
	}, true)
}

