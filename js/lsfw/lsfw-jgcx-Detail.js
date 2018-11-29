$(function() {
	var request = $.GetRequest();
	getDetail(request.id, request.categoryid);
	$.getSecPageNav();
});

function getDetail(id, categoryid) {
	//	console.log(categoryId);
	console.log(id);
	$.loadData('/api/100/500/50', '{"categoryId": "' + categoryid + '","id":"' + id + '"}', function(data) {
		console.log(data);
		var data = data.body;
		var defaultSrc = "img/mediation/mrjg.jpg";
		var imageUrl = data.imageUrl == '' ? defaultSrc : data.imageUrl;
		$msg = $('<div class="banner">' +
			'<div class="content-wrapper">' +
			'<div class="lawyer">' +
			'<div class="lawyer-detail">' +
			'<div class="lawyer-img">' +
			'<img class="userImg" src="' + SERVERFILEPORT + '' + data.imageUrl + '" onerror="$.organNotFind()" />' +
			'</div>' +
			'<div class="lawyer-detail-msg">' +
			'<div class="lawyer-name">' +
			'<span id="name">' + data.agencyName + '</span>' +
			'<span id="type"></span>' +
			'</div>' +
			'<div class="lawyer-msg">' +
			'<ul>' +
			'<li><span class="title">负责人：</span><span id="leader">' + data.personName + '</span></li>' +
			'<li><span class="title">所属地区：</span><span id="areaed">' + data.area.name + '</span></li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'<div class="lawyer-mobile">' +
			'<div class="mobile">' +
			'<p id="mobile-num">' + data.agencyPhone + '</p>' +
			'</div>' +

			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="lawyer-info">' +
			'<div class="content-wrapper">' +
			'<div class="info-list">' +
			'<div class="list-title">' +
			'<div class="title-text">机构信息</div>' +
			'</div>' +
			'<div class="info-box">' +
			'<ul>' +
			'<li><span class="title">执业证号：</span><span id="status">' + data.no + '</span></li>' +
			'<li><span class="title">执业年限：</span><span id="status">' + data.practisingYear + '</span></li>' +
			'<li><span class="title">主管机关：</span><span id="expertise">' + data.mainOrgans + '</span></li>' +
			'<li><span class="title">组织形式：</span><span id="mechanism">' + data.licenseForm + '</span></li>' +
			'<li><span class="title">执业状态：</span><span id="status">' + data.status + '</span></li>' +
			'<li><span class="title">团队规模：</span><span id="status">' + data.teamSize + '</span></li>' +
			'<li><span class="title">传真号码：</span><span id="expertise">' + data.fax + '</span></li>' +
			'<li><span class="title">电子邮箱：</span><span id="mechanism">' + data.email + '</span></li>' +
			'<li><span class="title">邮政编码：</span><span id="status">' + data.zipCode + '</span></li>' +
			'<li class="w90"><span class="title">机构地址：</span><span id="status">' + data.agencyAddress + '</span></li>' +
			'<li><span class="title">业务专长：</span><span id="expertise">' + data.businessExpertise + '</span></li>' +
			'<li class="intro"><span class="title">机构简介：</span>' +
			'<span id="introduce" class="introduce"> ' + data.introduction + '</span>' +
			'</li>' +
			'</ul>' +
			'</div>' +
			'<div class="jqmap"style="width:100%;height:400px;border-top:2px solid #1296D6;position:relative;">' +
			'<div id="jgmap" style="width:100%;height:400px;"></div>' +
			'<div id="left-panel" class="" style="height: 206px;">' +
			'<div id="searchbox" class="clearfix">' +
			'<div id="searchbox-container">' +
			'<div id="route-searchbox-content" class="searchbox-content route-searchbox-content drive">' +
			'<div class="route-header">' +
			'<div class="searchbox-content-common route-tabs">' +
			'<div class="tab-item drive-tab" data-index="drive"> <i></i><span>驾车</span> </div>' +
			'<div class="tab-item bus-tab" data-index="bus"> <i></i><span>公交</span> </div>' +
			'<div class="arrow-wrap"></div>' +
			'</div>' +
			'<div class="searchbox-content-button right-button cancel-button loading-button" data-title="关闭路线" data-tooltip="3"> </div>' +
			'</div>' +
			'<div class="routebox">' +
			'<div class="searchbox-content-common routebox-content">' +
			'<div class="routebox-revert" title="切换起终点">' +
			'<div class="routebox-revert-icon"> </div>' +
			'</div>' +
			'<div class="routebox-inputs">' +
			'<div class="routebox-input route-start">' +
			'<div class="route-input-icon"> </div> <input autocomplete="off" maxlength="256" placeholder="输入起点" id="route-start-input" class="route-start-input" type="text" value="" >' +
			'<div class="input-clear" title="清空" style="display: none;"> </div>' +
			'</div>' +
			'<div class="routebox-input route-end">' +
			'<div class="route-input-icon"> </div> <input autocomplete="off" maxlength="256" placeholder="输入终点" class="route-end-input" type="text" value="">' +
			'<div class="input-clear" title="清空" style="display: none;"> </div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:100%;height:auto; display:none;"></div>' +
			'</div>' +
			'<button id="search-button" data-title="搜索" data-tooltip="2"></button>	' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>');

		$('.nav').after($msg);
		var coord = data.coordinate
		renderMarker(data.agencyName, coord);
	},true)
}

//加载路线信息
function renderMarker(name, coord) {
	var point = coord.split(',');
	var map = new BMap.Map("jgmap"); // 创建地图实例  
	var c;
	if(coord=="暂无"||coord==''){
		c=new BMap.Point(116.093697,43.932341)
	}else{
		c=new BMap.Point(point[0], point[1]);
	}
	map.enableScrollWheelZoom(true);
	map.centerAndZoom(c, 13); // 初始化地图，设置中心点坐标和地图级别  
	map.clearOverlays();
	var marker = new BMap.Marker(c);
	map.addOverlay(marker);
	$('.route-end-input').val(name).attr('readonly', 'readonly')
	//驾车BMAP_DRIVING_POLICY_LEAST_TIME
	//公交BMAP_TRANSIT_POLICY_LEAST_TIME
	$("#search-button").click(function() {
		var startPlace = $('.route-start-input').val();
		map.clearOverlays();
		// 创建地址解析器实例
		var myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上,并调整地图视野
		myGeo.getPoint(startPlace, function(point) {
			if(point) {
				var index = $('#route-searchbox-content').attr('class');
				console.log(index.indexOf('drive'))
				console.log(index.indexOf('walk'))
				if(index.indexOf('bus') != -1) {
					var transit = new BMap.TransitRoute(map, {
						renderOptions: {
							map: map
						}
					});
					transit.search(new BMap.Point(point.lng, point.lat), new BMap.Point(c.lng, c.lat));
				} else if(index.indexOf('drive') != -1) {
					var driving = new BMap.DrivingRoute(map, {
						renderOptions: {
							map: map,
							autoViewport: true
						}
					});
					driving.search(new BMap.Point(point.lng, point.lat), new BMap.Point(c.lng, c.lat));
				} else {
					$.notice('未搜索到相关路线!', 2000)
				}

			} else {
				$.notice('您选择的地址没有解析到结果!', 2000)
			}
		}, "锡林郭勒盟");
	});
	//搜索事例
	function G(id) {
		return document.getElementById(id);
	}
	var ac = new BMap.Autocomplete( //建立一个自动完成的对象
		{
			"input": "route-start-input",
			"location": map
		});

	ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
		var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if(e.fromitem.index > -1) {
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

		value = "";
		if(e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
		var _value = e.item.value;
		console.log(e)
		myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
		G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

		setPlace();
	});

	function setPlace() {
		map.clearOverlays(); //清除地图上所有覆盖物
		function myFun() {
			var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
			map.centerAndZoom(pp, 18);
			map.addOverlay(new BMap.Marker(pp)); //添加标注
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
			onSearchComplete: myFun
		});
		local.search(myValue);
	}
	//绑定切换公交驾车
	$('.tab-item').bind('click', function(e) {
		var index = $(this).data('index');
		$('#route-searchbox-content').attr('class', 'searchbox-content route-searchbox-content ' + index)
	})
}