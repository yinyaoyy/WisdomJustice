$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getArea(request.categoryid)
	getList(request.categoryid, '', request.areaid, 1, 4);
	$('#search-jg').bind('click', function() {
		var searchText = $('#search-text').val();
		var areaId = $('.filter-select option:selected').attr('id');
		console.log(areaId)
		getList(request.categoryid, searchText, request.areaid, 1, 4)
	})
})
//加载点信息
function renderMarker(list) {
	var map = new BMap.Map("sfdt-map"); // 创建地图实例  
	var c = new BMap.Point(116.092732, 43.939162);
	map.enableScrollWheelZoom(true);
	map.centerAndZoom(c, 7); // 初始化地图，设置中心点坐标和地图级别  
	map.clearOverlays();
	var data = [];
	$.each(list, function(index, val) {
		if(val != undefined && val != '' && val != null) {
			var point = val.coordinate.split(',');
			data.push(new BMap.Point(point[0], point[1])); // 创建点坐标  
			var marker = new BMap.Marker(new BMap.Point(point[0], point[1]));
			map.addOverlay(marker);
			var opts = {
				width: 200, // 信息窗口宽度
				height: 100, // 信息窗口高度
				title: val.agencyName // 信息窗口标题
			}
			var infoWindow = new BMap.InfoWindow("<p>地址：" + val.agencyAddress + "</p><p>电话：" + val.agencyPhone + "</p>", opts); // 创建信息窗口对象 
			marker.addEventListener("click", function() {
				map.openInfoWindow(infoWindow, new BMap.Point(point[0], point[1])); //开启信息窗口
			});
		}
		return;
	});
}
//获取筛选地区
function getArea(categoryid) {
	$.getArea('', function(areaList) {
		$.each(areaList, function(index, val) {
			$opt = $('<option id="' + val.id + '">' + val.name + '</option>')
			$('.filter-select').append($opt)
		})
		$('.filter-select').find('option[id="'+categoryid+'"]').attr('selected','selected')
	})
	
}
//获取详细信息
function getList(categoryId, name, areaId, pageNo, pageSize) {
	var areaId = areaId == '' ? "" : areaId;
	var pageNo = pageNo == undefined ? '1' : pageNo;
	var pageSize = pageSize == undefined ? 10 : pageSize;
	console.log('{"categoryId":"' + categoryId + '","name":"' + name + '","areaId":"' + areaId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '"}')
	$.loadData('/api/100/500/20', '{"categoryId": "' + categoryId + '","name":"' + name + '","areaId":"' + areaId + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '"}', function(data) {
		console.log(data)
		var list = data.body.list;
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			//执行一个laypage实例
			laypage.render({
				elem: 'pagination',
				count: data.body.count,
				groups: 4,
				curr: pageNo,
				theme: '#1296D6',
				limit: 4,
				first: false,
				last: false,
				jump: function(obj, first) {
					$('.filter-list').find('li').remove()
					var coordList = [];
					$.each(list, function(index, val) {
						var $li = $('<li>' +
							'<div class="list-left">' +
							'<img src="img/chinese.jpg" alt="" />' +
							'<button>申请法援</button>' +
							'</div>' +
							'<div class="list-right">' +
							'<div class="list-header">' +
							'<p class="title" title="' + val.agencyName + '">' + val.agencyName + '</p>' +
							'<p class="more">详情</p>' +
							'</div>' +
							'<p class="adr">地址：' + val.agencyAddress + '</p>' +
							'<p class="phone">联系电话：' + val.agencyPhone + '</p>' +
							'</div>' +
							'</li>')
						$('.filter-list').append($li)
						coordList.push(val.coordinate)
					});
					renderMarker(list)
					//首次不执行
					if(!first) {
						$('.filter-list').find('li').remove()
						getList(categoryId, name, areaId, obj.curr, 4);
						renderMarker(list)
					}
				}
			});
		});
	}, true)
}