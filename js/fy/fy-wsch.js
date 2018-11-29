$(function() {
	$.getSecPageNav();
	renderTime();
	var request = $.GetRequest();
	getColumn(request.servertype, request.sourceId)
	bindSearch()
	renderBread(request)
})
function renderBread(request){
	$('.bread ul').append('<li><a href="sec-page.html?serviceId='+request.pServiceId+'&siteName='+request.siteName+'">'+decodeURI(decodeURI(request.siteName))+'</a></li><li>文书表格</li>')
}
//获取栏目
function getColumn(serverType, sourceId) {
	$.loadData('/api/100/300/50', '{"categoryType":"' + 5 + '"}', function(data) {
		console.log(data)
		var columnList = data.body;
		console.log(columnList)
		if(columnList != '' && columnList != undefined && columnList != null) {
			$('.left-list ul').find('li').remove();
			$.each(columnList, function(index, val) {
				var $li = $('<li id="' + val.id + '" data-sourceId="' + val.sourceId + '">' + val.name + '</li>');
				$li.bind('click', function() {
					getActiveColumnList($(this).data('sourceid'), 1, '', '', '');
					$(this).addClass('active').siblings('li').removeClass('active')
					//清除筛选条件
					$('#wsbg-title').val('');
					$('#beginEndTime').val('')
				})
				$('.left-list ul').append($li)
			});
			if(sourceId != undefined && sourceId != '' && sourceId != null) {
				var list = $('.left-list ul').find('li');
				$.each(list, function(i, el) {
					if($(this).data('sourceid') == sourceId) {
						$(this).addClass('active');
					}
				});
			} else {
				$('.left-list ul').find('li').first().addClass('active');
			}
			getActiveColumnList($('.left-list ul').find('.active').data('sourceid'), 1, '', '', '')
		}
	}, true)
}
//获取激活栏目下列表
function getActiveColumnList(sourceId, pageNo, beginDate, endDate, title) {
	console.log('{"pageNo":' + pageNo + ',"pageSize":"6","categoryId":"' + sourceId + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '","title":"' + title + '"}')
	$.loadData('/api/100/601/20', '{"pageNo":' + pageNo + ',"pageSize":"15","categoryId":"' + sourceId + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '","title":"' + title + '"}', function(data) {
		var list = data.body.list;
		console.log(list)
		if(list != null && list != '' && list != undefined) {
			$('.result-table tbody').find('tr').remove()
			layui.use('laypage', function() {
				var laypage = layui.laypage;
				//执行一个laypage实例
				laypage.render({
					elem: 'pagination',
					count: data.body.count,
					groups: 5,
					curr: pageNo,
					theme: '#1296D6',
					limit: 15,
					first: '首页',
					last: '尾页',
					jump: function(obj, first) {
						$.each(list, function(index, val) {
							var $tr = $('<tr>' +
								'<td>00' + (index + 1) + '</td>' +
								'<td class="title" id="' + val.id + '" title="' + val.title + '">' + val.title + '</td>' +
								'<td>' + val.createByName + '</td>' +
								'<td>' + val.siteName + '</td>' +
								'<td>' + val.createDate.substr(0, 10) + '</td>' +
								'<td><a href="' + SERVERFILEPORT + val.files.substring(1, val.files.length) + '" class="downloadThis">附件下载</a></td>' +
								'</tr>')
							$('.result-table').find('tbody').append($tr)
							$tr.find('.title').bind('click', function(e) {
								e.stopPropagation();
								$.openSecPage('newsIndex.html', {
									'id': $(this).attr('id')
								},4)
							})
						})

						//首次不执行
						if(!first) {
							$('.result-table tbody').find('tr').remove()
							getActiveColumnList($('.left-list ul').find('.active').data('sourceid'), obj.curr)
						}
					}
				});
			});

		} else {
			$('.layui-box').remove();
			$('.result-table tbody').find('tr').remove();
			$('.result-table').append('<tr><td colspan="6" style="text-align:center;">暂无数据</td></tr>')
		}
	}, true, true)
}
//渲染时间
function renderTime() {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#beginEndTime',
			range: '~'
		});
	});
}
//绑定搜索
function bindSearch() {
	$('#search-wsbg').bind('click', function() {
		var title = $('#wsbg-title').val();
		var startTime = $('#beginEndTime').val().split(' ~ ')[0];
		var endTime = $('#beginEndTime').val().split(' ~ ')[1] == undefined ? '' : $('#beginEndTime').val().split(' ~ ')[1];
		getActiveColumnList($('.left-list ul').find('.active').data('sourceid'), '1', startTime, endTime, title)
	})
}