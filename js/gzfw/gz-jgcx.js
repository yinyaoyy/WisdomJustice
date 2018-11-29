$(function() {
	var request = $.GetRequest();
	getAreaTown();
	$.getSecPageNav();
		var name = request.name == '' || request.name == undefined || request.name == null ? $('#filter-input').val() : decodeURI(decodeURI(request.name));
	var areaID = $.checkElValue($('.qx-list').find(".active"), 'id');
	getList(3, 1, 10, name, areaID, 'false', '', '');

	//点击搜索按钮
	$('.search-btn').on('click', function() {
		var name = $('#filter-input').val();
		getList(3, 1, 10, name, '', 'false', '', '');
	});
	renderBread(request)
})
function renderBread(request){
	$('.bread ul').append('<li><a href="sec-page.html?serviceId='+request.pServiceId+'&siteName='+request.siteName+'">'+decodeURI(decodeURI(request.siteName))+'</a></li><li>机构查询</li>')
}
//获取详细信息
function getList(categoryId, pageNo, pageSize, name, areaId, isEvaluate, townId, isMongolian) {

	var areaId = areaId == '' ? "" : areaId;
	var pageNo = pageNo == undefined ? '1' : pageNo;
	var pageSize = pageSize == undefined ? 10 : pageSize;
	console.log('{"categoryId": "' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"' + townId + '","isMongolian":"' + isMongolian + '"}')
	$.loadData('/api/100/500/20', '{"categoryId": "' + categoryId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","name":"' + name + '","areaId":"' + areaId + '","isEvaluate":"' + isEvaluate + '","townId":"","isMongolian":"' + isMongolian + '"}', function(data) {
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
							var phone = val.agencyPhone == undefined ? '' : val.agencyPhone;
							var defaultSrc = "img/mediation/mrjg.jpg";
							var imageUrl = val.imageUrl == '' ? defaultSrc : val.imageUrl
							$li = $('<li class="mediator-li" id="' + id + '" data-categoryid="' + categoryId + '">' +
								'<div class="mediator">' +
								'<div class="mediator-top">' +
								'<img class="userImg" src="' + SERVERFILEPORT + '' + val.imageUrl + '" onerror="$.organNotFind()" />' +
								'<div class="name">' + val.agencyName + '</div>' +
								'</div>' +
								'<div class="mediator-bottom">' +
								'<ul>' +
								'<li>负责人：'+ val.personName +'</li>'+
								'<li>执业证号：'+ val.no +'</li>'+
								'<li>服务时间：'+ val.worktime +'</li>'+
								'<li>团队规模：'+ val.teamSize +'</li>'+
								'<li>业务专长：'+ val.businessExpertise +'</li>'+
								'<li>联系电话：'+ val.agencyPhone +'</li>'+
								'<li>联系地址：'+ val.agencyAddress +'</li>'+	
								'</ul>' +
								'</div>' +
								'</div>' +
								'</li>');
							$li.bind('click', function() {
								$.openSecPage('gz-jgcx-Detail.html', {
									'id': $(this).attr('id'),
									'categoryid': $(this).data('categoryid')
								},4)
							})

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
			getList(3, 1, 10, name, areaID, 'false', '', '');
		});
	})
}