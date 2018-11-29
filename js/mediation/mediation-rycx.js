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
		var isMongolian = $(".choose input:checked").attr('value');
		getList(categoryId, 1, 10, name, areaID, 'false', townID, isMongolian);
	});

	//根据蒙汉双通查找人员信息
	$('.choose').on('change', 'input', function(e) {
		var categoryId = $('.breUl').find(".active").attr('id');
		var name = $('#filter-input').val();
		var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
		var townID = $.checkElValue($('.xz-list').find(".active"), 'id');
		var isMongolian = $(".choose input:checked").attr('value');
		getList(categoryId, 1, 10, name, areaID, 'false', townID, isMongolian);
	});
	renderBread(request)
})
function renderBread(request){
	$('.bread ul').append('<li><a href="sec-page.html?serviceId='+request.pServiceId+'&siteName='+request.siteName+'">'+decodeURI(decodeURI(request.siteName))+'</a></li><li>人员查询</li>')
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
				$(".choose input:first").attr("checked", true);
				e.stopPropagation();
				$(this).addClass("active").siblings().removeClass("active");
				var categoryId = $('.breUl').find(".active").attr('id');
				var name = $('#filter-input').val();
				//var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
				//var townID = $.checkElValue($('.xz-list').find(".active"), 'id');
				var isMongolian = $(".choose input:checked").attr('value');
				getList(categoryId, 1, 10, name, '', 'false', '', '');
				$('.qx-list').find('li:first').addClass("active");
				$('.xz-list').find('li:first').addClass("active");
				console.log($('.choose').find('input').first())
				$('.choose').find('input').first().prop("checked", true);
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

	var areaId = areaId == '' ? "" : areaId;
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
					count: parseInt(data.body.count),
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
							var defaultSrc = "img/mediation/mrry.jpg";
							var imageUrl = val.imageUrl == '' ? defaultSrc : val.imageUrl
							var $li;
							switch(categoryId) {
								case '11':
									$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
										'<div class="mediator">' +
										'<div class="mediator-top">' +
										'<img class="userImg" src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.userNotFind()">' +
										'<img class="medal" src="img/mediation/jinpai.png">' +
										'<div class="name">' + name + '</div>' +
										'</div>' +
										'<div class="mediator-bottom">' +
										'<ul>' +
										'<li>性 别：' + val.sex + '</li>' +
										'<li>民 族：' + val.ethnic + '</li>' +
										'<li>电 话 ：' + phone + '</li>' +
										'<li>蒙汉双通：' + val.isMongolian + '</li>' +
										'<li title="' + val.agencyName + '">所属机构：' + agencyName + '</li>' +
										'<li>所属地区：' + val.area.name + '</li>' +
										'</ul>' +
										'</div>' +
										'</div>' +
										'</li>');
									$li.bind('click', function() {
										$.openSecPage('mediation-rycx-rmtjDetail.html', {
											'id': $(this).attr('id'),
											'categoryid': $(this).data('categoryid')
										},4)
									})
									break;
								case '13':
									$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
										'<div class="mediator">' +
										'<div class="mediator-top">' +
										'<img class="userImg" src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.userNotFind()">' +
										'<img class="medal" src="img/mediation/jinpai.png">' +
										'<div class="name">' + name + '</div>' +
										'</div>' +
										'<div class="mediator-bottom">' +
										'<ul>' +
										'<li>性 别：' + val.sex + '</li>' +
										'<li>民 族：' + val.ethnic + '</li>' +
										'<li>电 话 ：' + phone + '</li>' +
										'<li>执业证号：' + val.no + ' </li>' +
										'<li>蒙汉双通：' + val.isMongolian + '</li>' +
										'<li title="' + agencyName + '">所属机构：' + agencyName + '</li>' +
										'<li>所属地区：' + val.area.name + '</li>' +
										'</ul>' +
										'</div>' +
										'</div>' +
										'</li>');
									$li.bind('click', function() {
										$.openSecPage('mediation-rycx-jcflDetail.html', {
											'id': $(this).attr('id'),
											'categoryid': $(this).data('categoryid')
										},4)
									})
									break;

								case '14':
									$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
										'<div class="mediator">' +
										'<div class="mediator-top">' +
										'<img class="userImg" src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.userNotFind()">' +
										'<img class="medal" src="img/mediation/jinpai.png" alt="" />' +
										'<div class="name">' + name + '</div>' +
										'</div>' +
										'<div class="mediator-bottom" style="height:160px">' +
										'<ul>' +
										'<li>性 别：' + val.sex + '</li>' +
										'<li>民 族：' + val.ethnic + '</li>' +
										'<li>电 话：' + phone + '</li>' +
										'<li>蒙汉双通：' + val.isMongolian + '</li>' +
										'<li>所属地区：' + val.area.name + '</li>' +
										'<li>所属机构：' + agencyName + '</li>' +
										'</ul>' +
										'</div>' +
										'</div>' +
										'</li>');
									$li.bind('click', function() {
										$.openSecPage('mediation-rycx-rmjdDetail.html', {
											'id': $(this).attr('id'),
											'categoryid': $(this).data('categoryid')
										},4)
									})
									break;
								default:
									$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
										'<div class="mediator">' +
										'<div class="mediator-top">' +
										'<img class="userImg" src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.userNotFind()">' +
										'<img class="medal" src="img/mediation/jinpai.png">' +
										'<div class="name">' + name + '</div>' +
										'</div>' +
										'<div class="mediator-bottom">' +
										'<ul>' +
										'<li>性 别：' + val.sex + '</li>' +
										'<li>民 族：' + val.ethnic + '</li>' +
										'<li>电 话 ：' + phone + '</li>' +
										'<li title="' + val.agencyAddress + '">地 址：' + val.agencyAddress + '</li>' +
										'<li>蒙汉双通：' + val.isMongolian + '</li>' +
										'<li title="' + agencyName + '">所属机构：' + agencyName + '</li>' +
										'<li>所属地区：' + val.area.name + '</li>' +
										'</ul>' +
										'</div>' +
										'</div>' +
										'</li>');
									$li.bind('click', function() {
										$.openSecPage('mediation-rycx-sfsDetail.html', {
											'id': $(this).attr('id'),
											'categoryid': $(this).data('categoryid')
										},4)
									})
									break;
							}
							$ul.append($li);
						});
						$('.result-list').append($ul);
						//首次不执行
						if(!first) {
							$('.result-list').find('ul').remove()
							getList(categoryId, obj.curr, 10, name, areaId, isEvaluate, townId, isMongolian)
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
			})
			getList(categoryId, 1, 10, name, areaID, 'false', '', '');
		});
	})
}