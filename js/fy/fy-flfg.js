$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	renderTime()
	getColumn(request.sourceId)
	bindSearch()
	renderBread(request)
})
function renderBread(request){
	$('.bread ul').append('<li><a href="sec-page.html?serviceId='+request.pServiceId+'&siteName='+request.siteName+'">'+decodeURI(decodeURI(request.siteName))+'</a></li><li>法律法规</li>')
}
//获取栏目
function getColumn(sourceId) {
	$.loadData('/api/100/300/50', '{"categoryType":"3"}', function(data) {
		console.log(data)
		var columnList = data.body;
		console.log(columnList)
		if(columnList != '' && columnList != undefined && columnList != null) {
			$('.left-list ul').find('li').remove();
			$.each(columnList, function(index, val) {
				var $li = $('<li id="' + val.id + '" data-sourceId="' + val.sourceId + '">' + val.name + '</li>');
				$li.bind('click', function() {
					getActiveColumnList($(this).data('sourceid'),  1,'','','');
					$(this).addClass('active').siblings('li').removeClass('active');
					//清除筛选条件
					$('#flfg-title').val('');
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
			getActiveColumnList($('.left-list ul').find('.active').data('sourceid'), 1,'','','')
		}
	}, true)
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
//获取激活栏目下列表
function getActiveColumnList(sourceId, pageNo,beginDate,endDate,title) {
	$.loadData('/api/100/601/20', '{"pageNo":' + pageNo + ',"pageSize":"8","categoryId":"' + sourceId + '","beginDate":"'+beginDate+'","endDate":"'+endDate+'","title":"'+title+'"}', function(data) {
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
							getActiveColumnList(sourceId, obj.curr,'','','');
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
	},true,true)
}
//绑定搜索
function bindSearch() {
	$('#search-flfg').bind('click', function() {
		var title = $('#flfg-title').val();
		var startTime = $('#beginEndTime').val().split(' ~ ')[0];
		var endTime = $('#beginEndTime').val().split(' ~ ')[1] == undefined ? '' : $('#beginEndTime').val().split(' ~ ')[1];
		getActiveColumnList($('.left-list ul').find('.active').data('sourceid'), '1', startTime, endTime, title)
	})
}
