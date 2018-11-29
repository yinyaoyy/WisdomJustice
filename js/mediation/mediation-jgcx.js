$(function() {
	var request = $.GetRequest();
	var serverId = request.id;
	getAreaTown();
	getService(request,serverId);
	$.getSecPageNav();

	//点击搜索按钮
	$('.search-btn').on('click', function() {
		var categoryId = $('.breUl').find(".active").attr('id');
		var name = $('#filter-input').val();
		var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
		var townID = $.checkElValue($('.xz-list').find(".active"), 'id');
		getList(categoryId, 1, 10, name, areaID, 'false', townID, '');
	});
	renderBread(request)
})

function renderBread(request) {
	$('.bread ul').append('<li><a href="sec-page.html?serviceId=' + request.pServiceId + '&siteName=' + request.siteName + '">' + decodeURI(decodeURI(request.siteName)) + '</a></li><li>机构查询</li>')
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
				//var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
				//var townID = $.checkElValue($('.xz-list').find(".active"), 'id');
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

	}, true);
}

//获取详细信息
function getList(categoryId, pageNo, pageSize, name, areaId, isEvaluate, townId, isMongolian) {

	var areaId = areaId == '' ? "" : areaId;
	var pageNo = pageNo == undefined ? '1' : pageNo;
	var pageSize = pageSize == undefined ? 10 : pageSize;
	//console.log('{"categoryId": "' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"' + townId + '","isMongolian":"' + isMongolian + '"}')
	$.loadData('/api/100/500/20', '{"categoryId": "' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"' + townId + '","isMongolian":""}', function(data) {
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
						$('.result-list').find('ul').remove()
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
							var name = val.personName;
							var agencyName = val.agencyName;
							var phone = val.agencyPhone == undefined ? '' : val.agencyPhone;
							var defaultSrc = "img/mediation/mrjg.jpg";
							var imageUrl = val.imageUrl == '' ? defaultSrc : val.imageUrl;
							var $li;
							switch(categoryId) {
								case '12':
									$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
										'<div class="mediator">' +
										'<div class="mediator-top">' +
										'<img class="userImg" src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.organNotFind()" />' +
										'<div class="name" title="' + agencyName + '">' + agencyName + '</div>' +
										'</div>' +
										'<div class="mediator-bottom">' +
										'<ul>' +
										'<li>所长：' + name + '</li>' +
										'<li>联系电话：' + val.agencyPhone + '</li>' +
										'<li title="' + val.agencyAddress + '">地址：' + val.agencyAddress + '</li>' +
										'<li>所属地区：' + val.area.name + '</li>' +
										'</ul>' +
										'</div>' +
										'</div>' +
										'</li>');
									$li.bind('click', function() {
										$.openSecPage('mediation-jgcx-sfsDetail.html', {
											'id': $(this).attr('id'),
											'categoryid': $(this).data('categoryid')
										}, 4)
									})
									break;
								case '10':
									$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
										'<div class="mediator">' +
										'<div class="mediator-top">' +
										'<img class="userImg" src="' + SERVERFILEPORT + '' + data.imageUrl + '" onerror="$.organNotFind()"/>' +
										'<div class="name" title="' + agencyName + '">' + agencyName + '</div>' +
										'</div>' +
										'<div class="mediator-bottom">' +
										'<ul>' +
										'<li>机构证号：' + val.no + '</li>' +
										'<li>负责人：' + name + '</li>' +
										'<li>联系电话：' + val.agencyPhone + '</li>' +
										'<li>所属地区：' + val.town.name + '</li>' +
										'<li title="' + val.agencyAddress + '">地址：' + val.agencyAddress + '</li>' +
										'</ul>' +
										'</div>' +
										'</div>' +
										'</li>');
									$li.bind('click', function() {
										$.openSecPage('mediation-jgcx-rmtjDetail.html', {
											'id': $(this).attr('id'),
											'categoryid': $(this).data('categoryid')
										}, 4)
									})
									break;
								default:
									$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
										'<div class="mediator">' +
										'<div class="mediator-top">' +
										'<img class="userImg" src="' + SERVERFILEPORT + '' + data.imageUrl + '" onerror="$.organNotFind()"/>' +
										'<div class="name" title="' + val.agencyName + '">' + val.agencyName + '</div>' +
										'</div>' +
										'<div class="mediator-bottom">' +
										'<ul>' +
										'<li>负责人：' + name + '</li>' +
										'<li>联系电话：' + val.agencyPhone + '</li>' +
										'<li>所属地区：' + val.area.name + '</li>' +
										'<li title="' + val.agencyAddress + '">地址：' + val.agencyAddress + '</li>' +
										'</ul>' +
										'</div>' +
										'</div>' +
										'</li>');
									$li.bind('click', function() {
										$.openSecPage('mediation-jgcx-jcflDetail.html', {
											'id': $(this).attr('id'),
											'categoryid': $(this).data('categoryid')
										}, 4)
									})
									break;
							}

							$ul.append($li);
						});
						$('.result-list').append($ul);
						//首次不执行
						if(!first) {
							$('.result-list').find('ul').remove()
							getList(categoryId, obj.curr, 10, name, areaId, isEvaluate, townId, '')
						}
					}
				});
			});
		} else {
			$('.layui-box').remove();
			$('.result-list').css('border-top', '1px solid #cccccc')
			$('#search-count').html(' 0 ')
			$('.result-list').html('<div id="nodata" style="width:100%;height:250px;text-align:center;margin-top:50px;"><img style="width:200px;" src="img/nodata.jpg"/></div>')
		}
	}, true, true)
}

//获取旗县乡镇
function getAreaTown() {
	$.getArea('', function(data) {
		console.log(data)
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
				getList(categoryId, 1, 10, name, areaID, 'false', townID, '');
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
				//选择乡镇查找
				$('#xzId').on('click', 'li', function(e) {
					e.stopPropagation();
					$(this).addClass("active").siblings().removeClass("active");
					var categoryId = $('.breUl').find(".active").attr('id');
					var name = $('#filter-input').val();
					var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
					var townID = $.checkElValue($(this), 'id');
					getList(categoryId, 1, 10, name, areaID, 'false', townID, '');
				});
			})
			getList(categoryId, 1, 10, name, areaID, 'false', '', '');
		});
	})
}