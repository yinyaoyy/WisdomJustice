$(function() {
	$('.pro-btn').bind('click', alertComplaintBox);
})
//弹出投诉窗口
function alertComplaintBox() {
	var $complaintbox =
		$('<div class="complaint-box">' +
			'<div class="title-box">' +
			'<div class="title">' +
			'<span class="title-word">投&nbsp;诉&nbsp;建&nbsp;议</span>' +
			//'<span class="title-line"></span>' +
			'</div>' +
			'<img src="img/lr-title.png">' +
			'<div class="close-btn">x</div>' +
			'</div>' +
			'<div class="complaint-content">' +
			'<div class="p-user">' +

			'<ul>' +
			'<li><div class="title">投诉人</div><input type="text" id="complaintName" readonly="readonly" /></li>' +
			'<li><div class="title">所在地区</div><select name="" class="area" id="complaintArea"></select></li>' +
			//			'<li><div class="title">手机号</div><input type="text" id="phone" readonly="readonly"/></li>' +
			//			'<li><div class="title">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</div><select name="" id="sex">' +
			//			'<option value="1">男</option><option value="2">女</option></select></li>' +
			'</ul>' +
			//'<span class="line"></span>' +
			'</div>' +
			'<div class="b-user">' +
			'<ul style="height:120px;">' +
			'<li><div class="title">被投诉人</div><input type="text" /></li>' +
			'<li><div class="title">执业证号</div><input type="text" id="number" /></li>' +
			'<li><div class="title">所在地区</div><select name="" id="areaId" class="area"></select></li>' +
			'<li><div class="title">所属乡镇</div><select name="" id="townId" class="town"></select></li>' +
			'<li><div class="title">人员类别</div><select name="" class="cate" id="cate"></select></li>' +
			'<li class="org">' +
			'<div class="title">所属机构</div>' +
			'<div class="orgDiv search-select">' +
			'<input type="text" style="" class="organization" id="organId"/>' +
			'<ul type="text" id="orgUl">' +
			'</ul>' +
			'</div></li>' +
			'</ul>' +
			'<span class="line"></span>' +
			'</div>' +
			'<div class="q-t">' +
			'<div class="q-t-title">' +
			'<div class="q-t-half">' +
			'<p>投诉标题</p>' +
			'<input type="text" id="title" />' +
			'</div>' +
			'<div class="q-t-half">' +
			'<p>投诉事项</p>' +
			'<select name="" class="matter" id="matter"></select>' +
			'</div>' +
			'</div>' +
			'<p>详细内容</p>' +
			'<textarea id="contentId" name="" rows="" cols=""></textarea>' +
			'<div class="identify">' +
			'<label for="codeInput">验证码</label><input type="text" name="" id="codeInput" value="" />' +
			'<img id="codeImg" src="http://123.178.194.50:9306/WisdomJustice/servlet/validateCodeServlet" alt="" style="" />' +
			'<div class="anony-box">' +
			'<input type="checkbox" class="anony" id="anonymous"/>匿名</div>' +
			'</div>' +
			'</div>' +
			'<div class="word">' +
			'<p>欢迎您对我们的工作进行监督和建议</p>' +
			'<p>我们将您的意见视作提高服务质量、更好的为您做好工作。</p>' +
			'<p>我们将及时处理并将结果反馈给您!</p>' +
			'</div>' +
			'<div class="bottom">' +
			'<button type="submit" class="submit" id="submitBtn">提交</button>' +
			'<button type="reset" class="reset">重置</button>' +
			'</div></div></div>');
	$('body').append($complaintbox);
	//获取乡镇机构调用方法 
	getAreaTown();

	//弹出页面的位置
	var w = document.documentElement.clientWidth || document.body.clientWidth;
	var h = document.documentElement.clientHeight || document.body.clientHeight;
	var left = (w - 800) / 2 + 'px';
	var top = (h - 600) / 2 + 'px';
	if((h - 600) <= 0) {
		top = '15px';
	}

	$('.complaint-box').show().css({
		'left': left,
		'top': top
	})

	//点击关闭
	$('.close-btn').bind('click', function() {
		$('.complaint-box').remove();
	})

	//投诉人和号码渲染
	$.loadData('/api/100/400/50', '', function(data) {
		console.log(data);
		if(data.status == 0) {
			$('#complaintName').val(data.body.realname);
			$('#phone').val(data.body.mobile);
		}
	},true)

	//投诉事项的渲染
	$.getDataDic('cms_complaint_shixiang', function(data) {
		console.log(data);
		var data = data.body;
		$.each(data, function(index, val) {
			var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
			$('.matter').append($opt);
		});
	})
	
	//人员类别的渲染
	$.getDataDic('cms_complaint_worker', function(data) {
		console.log(data);
		var data = data.body;
		$.each(data, function(index, val) {
			var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
			$('.cate').append($opt);
		});
	})
	
	//获取地区乡镇,所属机构
	function getAreaTown() {
		$.getArea('', function(data) {
			console.log(data);
			$('.area').find('option').remove();
			//地区
			$.each(data, function(index, val) {
				var $opt = $('<option id="' + val.id + '">' + val.name + '</option>');
				$('.area').append($opt);
			});
			//乡镇
			var qxId = $('.area').find("option:selected").attr('id');
			$.getArea(qxId, function(data) {
				console.log(data);
				$.each(data, function(index, val) {
					$townOpt = $('<option id="' + val.id + '">' + val.name + '</option>');
					$('.town').append($townOpt);
				})
				var $townID = $('#townId').find("option:selected").attr('id');
			})
			//地区改变
			$('#areaId').bind('change', function() {
				var $town = $(this).parent().siblings('li').find('.town');
				//				console.log($town);
				$town.find('option').remove();
				var parentId = $(this).find("option:selected").attr('id');
				//console.log(parentId);
				$.getArea(parentId, function(data) {
					console.log(data);
					$.each(data, function(index, val) {
						$townOpt = $('<option id="' + val.id + '">' + val.name + '</option>');
						$town.append($townOpt);
					})
					var $townId = $('#townId').find("option:selected").attr('id');
					$.loadData('/api/100/700/50', '{"area":{"id":"' + $townId + '"}}', function(data) {
						console.log(data);
						$("#orgUl").find("li").remove();
						$.each(data.body, function(index, val) {
							$orgLi = $('<li id="' + val.id + '">' + val.name + '</li>');
							$("#orgUl").append($orgLi);
						})
						var townID = $('#townId').find("option:selected").attr('id');
						$('.orgDiv').bindSelectSearch('organId', 'orgUl', function() {})
					},true)
				})

			})

			//改变乡镇
			$('#townId').bind('change', function() {
				var townID = $('#townId').find("option:selected").attr('id');
				//				$('.orgDiv').bindSelectSearch('organId', 'orgUl', function() {
				//获取机构
				$.loadData('/api/100/700/50', '{"area":{"id":"' + townID + '"}}', function(data) {
					console.log(data);
					$("#orgUl").find("li").remove();
					$.each(data.body, function(index, val) {
						$orgLi = $('<li id="' + val.id + '">' + val.name + '</li>');
						$("#orgUl").append($orgLi);
					})
					$('.orgDiv').bindSelectSearch('organId', 'orgUl', function() {})
				},true)

				//				})

			})
		})
	}

	//获取验证码
	$('#codeImg').bind('click', function() {
		var timestamp = new Date().getTime();
		$('#codeImg').attr("src", SERVERPORT + "/servlet/validateCodeServlet?timestamp=" + timestamp);
	})

	$complaintbox.find('#submitBtn').bind('click', function() {
		var complaintName = $('#complaintName').val();
		var complaintArea = $('#complaintArea option:selected').attr('id');
		var content = $("#contentId").val();
		var title = $("#title").val();
		var phone = $("#phone").val();
		var sex = $("#sex option:selected").attr('value');
		var no = $("#number").val();
		var areaId = $('#areaId option:selected').attr('id');
		var townId = $('#townId option:selected').attr('id');
		var organization = $('#organId').data('id');
		var anonymous = $('#anonymous').is(':checked');
		var query = '{"content":"' + content + '","title":"' + title + '","name":"' + complaintName + '","phone":"' + phone + '","sex":"' + sex + '","no":"","area":{"id":"' + complaintArea + '"}, "townarea":{"id":""},"noarea":{"id":"' + areaId + '"},"notown":{"id":"' + townId + '"}, "anonymous":"' + anonymous + '","organization":{"id":"' + organization + '"},"nonumber":"' + no + '"}';
		console.log(query)
		$.loadData('/api/100/610/30', query, function(data) {
			console.log(data)			
			if(data.status == 1000) {
				$.notice('data.msg', 2000)
			}
			if(data.status == 1190) {
				$.notice('data.msg', 2000)
			}
			if(data.status == 0) {
				$.notice('您已经提交成功了!', 2000)
				$('.complaint-box').remove();
				
			}
		},true)
	})

}