$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getAreaTown();
		var name = request.name == '' || request.name == undefined || request.name == null ? $('#filter-input').val() : decodeURI(decodeURI(request.name));
	
	getList(6, 1, 10, name, '', 'false', '', '')

	//点击搜索按钮
	$('.search-btn').on('click', function() {
		var categoryId = $('.breUl').find(".active").attr('id');
		var name = $('#filter-input').val();
		var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
		var townID = $.checkElValue($('.xz-list').find(".active"), 'id');
		getList(6, 1, 10, name, areaID, 'false', townID, '');
	});
	renderBread(request)
})
function renderBread(request){
	$('.bread ul').append('<li><a href="sec-page.html?serviceId='+request.pServiceId+'&siteName='+request.siteName+'">'+decodeURI(decodeURI(request.siteName))+'</a></li><li>满意度评价</li>')
}

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
					limit: 10,
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
							var mydid = val.id;
							var defaultSrc = "img/mediation/mrry.jpg";
							var imageUrl = val.imageUrl == '' ? defaultSrc : val.imageUrl
							var $li;
							$li = $('<li id="' + id + '" data-categoryid="' + categoryId + '" data-mydid="' + mydid + '">' +
								'<div class="user-img">' +
								'<img src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.userNotFind()" />' +
								'</div>' +
								'<div class="user-name">' + val.personName + '</div>' +
								'<div class="user-info">' +
								'<p>执业证号：<span>' + val.no + '</span></p>' +
								'<p><span>' + val.roleId + '</span></p>' +
								'<p class="overflow" title="' + val.agencyName + '"><span>' + val.agencyName + '</span></p>' +
								'</div>' +
								'<div class="control-list">' +
								'<button class="btn" id="' + id + '" data-categoryid="' + categoryId + '" data-mydid="' + mydid + '">查看评价</button>' +
								'<div class="star-list">' +
								'<img src="img/star_'+ val.evaluation +'.png">' +
								'</div>' +
								'</div>' +
								'</li>');
							$li.find('.btn').bind('click', function() {
								$.openSecPage('mediation-mydDetail.html', {
									'id': $(this).attr('id'),
									'categoryid': $(this).data('categoryid'),
									'mydid': $(this).data('mydid')
								},4)
							})
							
							$ul.append($li);

							$('.myd-member-list').append($ul);

							//首次不执行
							if(!first) {
								$('.result-list').find('ul').remove()
								getList(categoryId, obj.curr, 10, name, areaId, isEvaluate, townId, isMongolian)
							}
						});

					}
				});
			})

		} else {
			$('.layui-box').remove();
			$('.myd-member-list').find('ul').remove()
			$('.myd-member-list').css('border-top', '1px solid #cccccc')
			$('#search-count').html(' 0 ')
			$('.myd-member-list').html('<div id="nodata" style="width:100%;height:250px;text-align:center;margin-top:50px;"><img style="width:200px;" src="img/nodata.jpg"/></div>')
		}

	}, true,true)
}

//获取地区
function getAreaTown() {
	$.getArea('', function(data) {
		//添加全部
		$('.qx-list').append('<li id="">全部</li>');
		//初始化获取地区
		$.each(data, function(index, val) {
			var $qxLi = $('<li id="' + val.id + '">' + val.name + '</li>');
			$('.qx-list').append($qxLi);
			$('.qx-list').find('li:first').addClass("active");
		});
		//地区改变点击事件
		$('.qx-list').find('li').on('click', function(e) {
			e.stopPropagation();
			$(this).addClass("active").siblings().removeClass("active");
			var name = $('#filter-input').val();
			var areaID = $.checkElValue($(this), 'id');

			getList(6, 1, 10, name, areaID, 'false', '', '');
		});
	})
}