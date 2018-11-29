$(function() {
	$('#fast-btn').bind('click', alertLegalAidFastForm);
})
//弹出投诉窗口
function alertLegalAidFastForm() {
	var $legalAidFastForm =
		$('<form class="quick-box layui-form" action="">' +
			'<div class="title-box">' +
			'<div class="title">' +
			'<span class="title-word">法律服务快速登记表</span>' +
			'<span class="title-line"></span>' +
			'</div>' +
			'<img src="img/lr-title.png">' +
			'<div class="close-btn">x</div>' +
			'</div>' +
			'<div class="quick-content">' +
			'<div class="p-user">' +
			'<ul>' +
			'<li>' +

			'<div class="title">姓名</div>' +
			'<input type="text" id="fastName" />' +
			'</li>' +
			'<li>' +
			'<img src="img/red-star.png">' +
			'<div class="title required">手机号码</div>' +
			'<input type="text" id="fastPhone" lay-verify="required|phone"/>' +
			'</li>' +
			'<li>' +
			'<img src="img/red-star.png">' +
			'<div class="title required">案件类别</div>' +
			'<select lay-ignore name="" id="fastTyper" class="area" lay-verify="required"></select>' +
			'</li>' +
			'<li>' +
			'<img src="img/red-star.png">' +
			'<div class="title required">案件类型</div>' +
			'<select lay-ignore name="" id="fastType" class="town" lay-verify="required"></select>' +
			'</li>' +
			'<li class="fastArear">' +
			'<div class="title">案件标题</div>' +
			'<input type="text" id="fastTitle" class="fastTitle"/>' +
			'</li>' +
			'<li class="fastArear">' +
			'<img src="img/red-star.png">' +
			'<div class="title required">案发地区</div>' +
			'<select lay-ignore name="" class="area" id="fastAread" lay-verify="required"></select>' +
			'</li>' +

			'<li>' +
			'<p>案发简要说明</p>' +
			'<textarea id="fastContentId" class="fastContent" name="" rows="" cols=""></textarea>' +
			'</li>' +
			'</ul>' +

			'</div>' +
			'<div class="bottom">' +
			'<button type = "submit" class = "submit" id = "fastSubmitBtn"  lay-submit lay-filter="submitForm"> 快速登记 </button>' +
			'</div>' +
			'</div>');
	$('body').append($legalAidFastForm);
	//获取案发地区 
	getAreaTown();
	//获取案件类别和案件类型
	RenderType();
	//弹出页面的位置
	var w = document.documentElement.clientWidth || document.body.clientWidth;
	var h = document.documentElement.clientHeight || document.body.clientHeight;
	var left = (w - 800) / 2 + 'px';
	var top = (h - 380) / 2 + 'px';
	if((h - 380) <= 0) {
		top = '15px';
	}

	$('.quick-box').show().css({
		'left': left,
		'top': top,
		'position': 'fixed'
	})

	//点击关闭
	$('.close-btn').bind('click', function() {
		$('.quick-box').remove();
	})

	//获取案件类别和案件类型
	function RenderType() {
		$.getDataDic('oa_case_classify', function(data) {
			//console.log(data);
			$.each(data.body, function(index, val) {
				var $option = $('<option id="' + val.value + '">' + val.label + '</option>');
				$('#fastTyper').append($option);
			});
			$.getCascadeDic('oa_case_classify', $('#fastTyper').find('option:selected').attr('id'), function(data) {
				//console.log(data);
				$.each(data.body, function(index, val) {
					var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
					$('#fastType').append($opt);
				});
			})
			$('#fastTyper').bind('change', function() {
				//先清除
				$('#fastType').find('option').remove();
				var parentId = $(this).find('option:selected').attr('id');
				$.getCascadeDic('oa_case_classify', parentId, function(data) {
					//console.log(data);
					$.each(data.body, function(index, val) {
						var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
						$('#fastType').append($opt);
					});
				})
			})
		})

	}

	//获取案发地区
	function getAreaTown() {
		$.getArea('', function(data) {
			//console.log(data);
			$('#fastAread').find('option').remove();
			//地区
			$.each(data, function(index, val) {
				var $opt = $('<option id="' + val.id + '">' + val.name + '</option>');
				$('#fastAread').append($opt);
			});
		})
	}

	//表单验证
	layui.use(['form', 'layer'], function() {
		var form = layui.form,
			layer = layui.layer;

		//提交表单
		form.on('submit(submitForm)', function(data) {
			var accuserName = $('#fastName').val();
			var accuserPhone = $('#fastPhone').val();
			var caseClassify = $('#fastTyper option:selected').attr('id');
			var caseType = $('#fastType option:selected').attr('id');
			var id = $('#fastAread option:selected').attr('id');
			var caseTitle = $('#fastTitle').val();
			var caseReason = $('#fastContentId').val();
			console.log('{"accuserName":"' + accuserName + '", "accuserPhone":"' + accuserPhone + '", "caseClassify":"' + caseClassify + '", "caseType":"' + caseType + '", "caseCounty":{ "id":"' + id + '" }, "caseTitle":"' + caseTitle + '", "caseReason":"' + caseReason + '"}')
			$.loadData('/api/100/630/10', '{"accuserName":"' + accuserName + '", "accuserPhone":"' + accuserPhone + '", "caseClassify":"' + caseClassify + '", "caseType":"' + caseType + '", "caseCounty":{ "id":"' + id + '" }, "caseTitle":"' + caseTitle + '", "caseReason":"' + caseReason + '"}', function(data) {
				console.log(data)
				if(data.status == 0) {
					$.notice('提交成功！', 2000);
					$('.quick-box').remove();
				}
			})
			return false
		})
	})
}