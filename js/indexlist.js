$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getColumn(request.categoryType,'');
})
//获取栏目
function getColumn(categoryType, serviceId) {
	var titleText;
	if(categoryType != undefined && categoryType != null && categoryType != '') {
		if(categoryType == 1) {
			titleText = '政策发布';
			var $li = $('<li>' + titleText + '</li>')
			$('.bread ul').append($li)
		} else {
			titleText = '服务动态';
			var $li = $('<li>' + titleText + '</li>')
			$('.bread ul').append($li)
		}
		$('.title-img p').html(titleText)
		$.loadData('/api/100/300/50', '{"categoryType":"' + categoryType + '"}', function(data) {
			var columnList = data.body;
			console.log(columnList)
			if(columnList != '' && columnList != undefined && columnList != null) {
				$('.left-list ul').find('li').remove();
				$.each(columnList, function(index, val) {
					var $li = $('<li id="' + val.id + '" data-sourceId="' + val.sourceId + '">' + val.name + '</li>');
					$li.bind('click', function() {
						getActiveColumnList(categoryType, $(this).data('sourceid'), 1);
						$(this).addClass('active').siblings('li').removeClass('active')
					})
					$('.left-list ul').append($li)
				});
				$('.left-list ul').find('li').first().addClass('active');
				getActiveColumnList(categoryType, $('.left-list ul').find('.active').data('sourceid'), 1)

			}
		}, true)
	} else {
		$.loadData('/api/100/8030/30', '{"serverId":"' + serviceId + '"}', function(data) {
			var body = data.body;
			var columnList;
			$('.left-list ul').find('li').remove();
			$.each(body, function(index, val) {
				if(val.hasOwnProperty('columnList')) {
					columnList = val.columnList;
				}
			});
			$.each(columnList, function(index, val) {
				var $li = $('<li id="' + val.id + '">' + val.name + '</li>');
				$li.bind('click', function() {
					$.loadData('/api/100/601/20', '{"pageNo":"1","pageSize":"7","categoryType":"' + $(this).attr('id') + '","isAll":false}', function(data) {
						var list = data.body.list;
						if(list != null && list != '' && list != undefined) {
							$('.list-right').find('ul').remove()
							var $ul = $('<ul></ul>');
							$.each(list, function(index, val) {
								console.log(val)
								var $li = $('<li id=' + val.id + '>' +
									'<div class="head">' +
									'<div class="title">' + val.title + '</div>' +
									'<div class="time">' + val.createDate.substr(0, 10) + '</div>' +
									'</div>' +
									'<div class="describe">' + val.description + '</div>' +
									'</li>');
								$li.bind('click', function() {
									$.openSecPage('newsIndex.html', {
										'id': $(this).attr('id')
									},4)
								})
								$ul.append($li)
							});
							$('.list-right').append($ul);
						}

					}, true)
					$(this).addClass('active').siblings('li').removeClass('active')
				})
				$('.left-list ul').append($li)
			});
		}, true)
	}
}
//获取激活栏目下列表
function getActiveColumnList(categoryType, sourceId, pageNo) {
	$.loadData('/api/100/601/40', '{"pageNo":"' + pageNo + '","pageSize":"8","categoryType":"' + categoryType + '","sourceId":"' + sourceId + '"}', function(data) {
		var list = data.body.list;
		if(list != null && list != '' && list != undefined) {
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
						$('.nodata').remove()
						$('.list-right').find('ul').remove()
						var $ul = $('<ul></ul>');
						$.each(list, function(index, val) {
							var $li = $('<li id=' + val.id + '>' +
								'<div class="head">' +
								'<div class="title">' + val.title + '</div>' +
								'<div class="time">' + val.createDate.substr(0, 10) + '</div>' +
								'</div>' +
								'<div class="describe">' + val.description + '</div>' +
								'</li>');
							$li.bind('click', function() {
								$.openSecPage('newsIndex.html', {
									'id': $(this).attr('id')
								},4)
							})
							$ul.append($li)
						});
						$('.list-right').append($ul);
						//首次不执行
						if(!first) {
							$('.nodata').remove()
							$('.list-right').find('ul').remove()
							getActiveColumnList(categoryType, sourceId, obj.curr)
						}
					}
				});
			});
		} else {
			$('.layui-box').remove();
			$('.nodata').remove()
			$('.list-right').find('ul').remove();
			$('.list-right').append('<div class="nodata" style="box-shadow: 5px 5px 5px 5px #CCCCCC;width:100%;height:600px;line-height:40px;text-align:center;font-size:13px;color:#1296D6;">暂无数据</div>')
		}
	}, true)
}