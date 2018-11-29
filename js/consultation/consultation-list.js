$(function() {
	var request = $.GetRequest();
	var problemType = request.problemType == null || request.problemType == '' || request.problemType == undefined ? '':request.problemType;
	var type= request.type == null || request.type == '' || request.type == undefined ? '':request.type;
	$.getSecPageNav();
	getAllConsultationList(1, problemType, type,'');
	renderCaseType(type, problemType);
	getCount()
	//点击查询按钮
	$('#con-btn').on('click', function() {
		var title = $('#con-input').val();
		console.log(title)
		var problemType = $('#c-select').find("option:selected").attr('id');
		console.log(problemType)
		var type = $('#p-select').find("option:selected").attr('id');
		getAllConsultationList(1, problemType, type, title);
	});
})

//获取咨询条数
function getCount() {
	$.loadData('/api/100/600/10', '{"pageNo":"1","pageSize":"1","problemType":"","type":"","title":""}', function(data) {
		$('.knowledge-count #count').html(data.body.count)		
	})	
}
//分页获取所有留言列表
function getAllConsultationList(pageNo, problemType, type, title) {
	console.log('{"pageNo":"' + pageNo + '","pageSize":"10","problemType":"' + problemType + '","type":"' + type + '","title":"' + title + '"}')
	$.loadData('/api/100/600/10', '{"pageNo":"' + pageNo + '","pageSize":"10","problemType":"' + problemType + '","type":"' + type + '","title":"' + title + '"}', function(data) {
		console.log(data)
		var list = data.body.list;
		//console.log(list)
		
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
					limit: 10,
					first: '首页',
					last: '尾页',
					jump: function(obj, first) {
						$('#nodata').remove()
						$('.detail-list').find('ul').remove()
						var $ul = $('<ul></ul>');
						$.each(list, function(index, val) {
							var problemType = encodeURI(encodeURI(val.problemType))
							var $li = $('<li id=' + val.id + ' data-problemtype="' + val.problemType + '">' +
								'<div class="head">' +
								'<div class="title">' + val.title + '</div>' +
								'<div class="time">' + val.createDate + '</div>' +
								'</div>' +
								'<div class="describe"><span id="problemType">' + val.typeDesc+ ' - '+val.problemTypeDesc + '</span></div>' +
								'</li>');
							$li.bind('click', function() {
								$.openSecPage('consultation-detail.html', {
									'id': $(this).attr('id'),
									'problemType': $(this).data('problemtype')
								},4)
							})
							$ul.append($li)
						});
						$('.detail-list .title-text').after($ul);
						//首次不执行
						if(!first) {
							$('#nodata').remove()
							$('.detail-list').find('ul').remove()
							getAllConsultationList(obj.curr, '', '', '')
						}
					}
				});
			});
		} else {
			$('.layui-box').remove();
			$('#nodata').remove();			
			$('.detail-list').find('ul').remove();
			$('.detail-list').append('<div id="nodata" style="width:100%;height:250px;text-align:center;margin-top:50px;"><img style="width:200px;" src="img/nodata.jpg"/></div>')
		}
	}, true,true)
}

//搜索类型二级联动
function renderCaseType(type, problemType) {
	$.getDataDic('cms_guestbook_type', function(data) {
		console.log(data);
		$.each(data.body, function(index, val) {
			var $option = $('<option id="' + val.value + '">' + val.label + '</option>');
			$('#p-select').append($option);
		});
		//console.log(type);
		//console.log(problemType);
		$("#p-select").find("option[id = '" + type + "']").attr("selected", "selected");
		
		$.getCascadeDic('cms_guestbook_type', $('#p-select').find('option:selected').attr('id'), function(data) {
			console.log(data);
			$.each(data.body, function(index, val) {
				var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
				$('#c-select').append($opt);
			});
			$("#c-select").find("option[id = '" + problemType + "']").attr("selected", "selected");
		})
		$('#p-select').bind('change', function() {
			//先清除
			$('#c-select').find('option').remove();
			var $selOpt = $('<option id="">--请选择--</option>');
		    $('#c-select').append($selOpt);
			var parentId = $(this).find('option:selected').attr('id');
			$.getCascadeDic('cms_guestbook_type', parentId, function(data) {
				console.log(data);
				$.each(data.body, function(index, val) {
					var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
					$('#c-select').append($opt);
				});
			})
		})
	})
}
