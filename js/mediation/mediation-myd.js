$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	var serverId = request.id;
	var categoryId = request.categoryId;
	//var name = $('#ser-input').val();
	//console.log(name);
	getService(request,serverId);
	getAreaTown();
	//getList(categoryId, 1, 10, name, '', 'false', '', '')
	
	//点击搜索按钮
	$('.search-btn').on('click', function() {
		var categoryId = $('.breUl').find(".active").attr('id');
		var name = $('#filter-input').val();
		var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
		var townID = $.checkElValue($('.xz-list').find(".active"), 'id');
		getList(categoryId, 1, 10, name, '', 'false', '', '');
	});
	renderBread(request)
})
function renderBread(request){
	$('.bread ul').append('<li><a href="sec-page.html?serviceId='+request.pServiceId+'&siteName='+request.siteName+'">'+decodeURI(decodeURI(request.siteName))+'</a></li><li>满意度评价</li>')
}
//获取服务详情
function getService(request,serverId) {
	$.loadData('/api/100/8030/70', '{"serverId": "' + serverId + '"}', function(data) {
		console.log(data);
		var data = data.body.dictList;
		$.each(data, function(index, val) {
			var $li = $('<li id="' + val.value + '">' + val.label + '</li>');

			//点击服务详情
			$li.on('click', function(e) {
				$('.qx-list').find('li:first').addClass("active").siblings().removeClass("active");
				$('.xz-list').find('li:first').addClass("active").siblings().removeClass("active");
				e.stopPropagation();
				$(this).addClass("active").siblings().removeClass("active");
				var categoryId = $('.breUl').find(".active").attr('id');
				var name = $('#filter-input').val();
				
				getList(categoryId, 1, 10, name, '', 'false', '', '');
				$('.qx-list').find('li:first').addClass("active");
				$('.xz-list').find('li:first').addClass("active");
			});

			$('.bre').find('.breUl').append($li);
			$('.bre').find('.breUl').find('li').first().addClass('active');
			//			var categoryId = $('.breUl').find(".active").attr('id');
		});
		var categoryId = $('.breUl').find(".active").attr('id');
		var name = request.name == '' || request.name == undefined || request.name == null ? $('#filter-input').val() : decodeURI(decodeURI(request.name));
		getList(categoryId, 1, 10, name, '', 'false', '', '');

	},true);
}



//获取详细信息
function getList(categoryId, pageNo, pageSize, name, areaId, isEvaluate, townId, isMongolian) {
	var pageNo = pageNo == undefined ? '1' : pageNo;
	var pageSize = pageSize == undefined ? 10 : pageSize;
	console.log('{"categoryId":"' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"' + townId + '","isMongolian":"' + isMongolian + '"}');
	$.loadData('/api/100/500/20', '{"categoryId":"' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"' + townId + '","isMongolian":"' + isMongolian + '"}', function(data) {
		$('#search-count').html(' ' + data.body.count + ' ');
		console.log(data)
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
							var defaultSrc = "img/mediation/rt-user.png";
							var imageUrl = val.imageUrl == '' ? defaultSrc : val.imageUrl
							var $li;
							switch (categoryId){
								case '11':
									$li = $('<li id="' + id + '" data-categoryid="' + categoryId + '" data-mydid="' + mydid + '">' +
									'<div class="user-img">' +
									'<img class="userImg" src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.userNotFind()" />' +
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
									break;
								case '13':
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
									break;
								case '14':
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
									break;
								default:
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
									break;
							}
					
							
							$ul.append($li);
							
							$('.myd-member-list').append($ul);
							
							
							//首次不执行
							if(!first) {
								$('.myd-member-list').find('ul').remove()
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

//获取旗县乡镇
function getAreaTown() {
	$.getArea('', function(data) {
		//添加全部
		$('.qx-list').append('<li id="">全部</li>');
		$('.xz-list').append('<li id="">全部</li>');
		//初始化获取旗县
		$.each(data, function(index, val) {
			var $qxLi = $('<li id="' + val.id + '">' + val.name + '</li>');
			$('.qx-list').append($qxLi);
			$('.qx-list').find('li:first').addClass("active");
		});
		//初始化获取乡镇
		$.getArea('', function(data) {
			$.each(data, function(index, val) {
				$xzLi = $('<li id="' + val.id + '">' + val.name + '</li>');
				$('.xz-list').find('li:first').addClass("active");
				$('.xz-list').append($xzLi);
			})
			//乡镇点击事件
			$('.xz-list').find('li').on('click', function(e) {
				e.stopPropagation();
				$(this).addClass("active").siblings().removeClass("active");
				var categoryId = $('.breUl').find(".active").attr('id');
				var name = $('#filter-input').val();
				var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
				var townID = $.checkElValue($(this), 'id');
				var isMongolian = $(".choose input:checked").attr('value');
				getList(categoryId, 1, 10, name, areaID, 'false', townID, isMongolian);
				$('.choose').find('input').first().prop("checked", true);
			});
		})
		//旗县改变点击事件
		$('.qx-list').find('li').on('click', function(e) {
			e.stopPropagation();
			$(this).addClass("active").siblings().removeClass("active");
			var categoryId = $('.breUl').find(".active").attr('id');
			var name = $('#filter-input').val();
			var areaID = $.checkElValue($(this), 'id');
			$('.xz-list').find('li:first').addClass("active");
			$('.choose').find('input').first().prop("checked", true);
			$('.xz-list').find('li').remove();
			//根据旗县获取乡镇信息
			$.getArea(areaID, function(data) {
				$li = $('<li id="" class="active">全部</li>');
				$('.xz-list').append($li);
				console.log(data)
				$.each(data, function(index, val) {
					$xzLi = $('<li id="' + val.id + '">' + val.name + '</li>');
					$('.xz-list').append($xzLi);
				})
				
			})
			//选择乡镇查找对应的人员信息
				$('#xzId').on('click', 'li', function(e) {
					e.stopPropagation();
					$(this).addClass("active").siblings().removeClass("active");
					var categoryId = $('.breUl').find(".active").attr('id');
					var name = $('#filter-input').val();
					var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
					var townID = $.checkElValue($(this), 'id');
					getList(categoryId, 1, 10, name, areaID, 'false', townID, '');
					$('.choose').find('input').first().prop("checked", true);
				});
			getList(categoryId, 1, 10, name, areaID, 'false', '', '');
		});
	})
}