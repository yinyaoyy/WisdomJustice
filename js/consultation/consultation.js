$(function() {
	$.getSecPageNav();
	$('.leaving-btn').bind('click', alertConsultationBox);
	$('.search-leaving-btn').bind('click', function() {
		$.openSecPage('consultation-list.html', {})
	})
})
//弹出咨询窗口
function alertConsultationBox() {
	var status = $.checkLoginStatus();
	if(status) {
		var codeOk = false; // 用来判断验证码是否验证成功
		var $leavingbox =
			$('<form class="leaving-box layui-form" actiion="">' +
				'<div class="title"><img src="img/consultation/consultation-title.png" /><div class="close-btn">x</div></div>' +
				'<div class="leaving-box-content">' +
				'<div class="q-user">' +
				'<ul>' +
				'<li><div class="title">提问人</div><input type="" name="" id="questioner" value="" readonly="readonly"/></li>' +
				'<li><div class="title">所在地区</div><select name="" id="areaId" value="" lay-ignore></select></li>' +
				'<li><div class="title">业务类型</div><select name="" id="parentCase" lay-ignore></select></li>' +
				'<li><div class="title">问题类型</div><select id="childCase" name="" lay-ignore></select></li>' +
				'</ul>' +
				'</div>' +
				'<div class="q-q">' +
				'<p>问题标题</p>' +
				'<input id = "title" type="text" lay-verify="required"/>' +
				'<p>详细内容</p>' +
				'<textarea id="contentId" style="resize:none" lay-verify="required"></textarea>' +
				'</div>' +
				'<div class="q-mobile">' +
				'<label for="phoneId">手机号</label><input type="text" name="" id="phoneId" value="" readonly="readonly"/>' +
				'<label for="codeInput">验证码</label><input type="text" name="" id="codeInput" value="" lay-verify="required|validateCode"/>' +
				'<img id="codeImg" src="' + SERVERPORT + '/servlet/validateCodeServlet" alt="" style="" />' +
				'</div>' +
				'<div class="notes">' +
				'<p>咨询须知</p>' +
				'<ol type="1">' +
				'<li>本栏目是为群众提供法律咨询服务板块，解答内容仅供参考，不具备任何法律效力。</li>' +
				'<li>本栏目内容全部公开，请不要填写您个人或他人隐私。</li>' +
				'<li>不要包含侮辱，诽谤及违法性语言。</li>' +
				'</ol>' +
				'</div>' +
				'<div class="submit">' +
				'<label for="checkboxId"><input lay-ignore type="checkbox" id="checkboxId" value=""lay-verify="advisoryNotice" style="display:inline-block;"/>我已阅读并同意上方的咨询须知</label>' +
				'<button class="submit-btn" id="submitForm" lay-submit lay-filter="submitForm">提交</button>' +
				'</div></div></form>');
		$('body').append($leavingbox);
		renderCaseType();
		//获取验证码
		$('#codeImg').bind('click', function() {
			var timestamp = new Date().getTime();
			$('#codeImg').attr("src", SERVERPORT + "/servlet/validateCodeServlet?timestamp=" + timestamp + "$_sid=" + $.cookie('token'));
		})
		$('#codeInput').bind('blur', function() {
			var timestamp = new Date().getTime();
			var validateCode = $('#codeInput').val();
			console.log(validateCode);
			$.ajax({
				url: SERVERPORT + "/servlet/validateCodeServlet?validateCode=" + validateCode,
				type: 'get',
				data: {
					'jeesite.session.id': $.cookie('jeesite.session.id')
				},
				success: function(data) {
					console.log(data);
					if(data == 'false') {
						$("#codeInput").css('border', '1px solid red');
						codeOk = false;
					} else {
						$("#codeInput").css('border', '1px solid green');
						codeOk = true;
					}
				}
			})
		});
					console.log(codeOk)
		layui.use(['form', 'layer'], function() {
			var form = layui.form,
				layer = layui.layer;
			form.verify({
				advisoryNotice: function(value, item) {
					if(!$('#checkboxId').prop('checked')) {
						return '请阅读并同意上方的咨询须知';
					}
				},
				validateCode:function(value,item){
					if(!codeOk){
						return '请填写正确验证码'
					}
				}
			});
			form.on('submit(submitForm)', function(data) {
				var type = $("#parentCase option:selected").attr('id');
				var problemType = $("#childCase option:selected").attr('id');
				var title = $("#title").val();
				var content = $("#contentId").val();
				var phone = $("#phoneId").val();
				var area = $('#areaId option:selected').attr('id');
				var query = '{"type":"' + type + '","problemType":"' + problemType + '","title":"' + title + '","content":"' + content + '","phone":"' + phone + '","area":{"id":"' + area + '"}}'
				$.loadData('/api/100/600/20', query, function(data) {
					if(data.status == '0') {
						$.notice("您已经提交成功了!", 2000);
						$('.leaving-box').hide();
						$('#submitForm').attr('disabled','disabled').css('cursor','not-allow')
					} else {
						$('#submitForm').attr('disabled',false).css('cursor','pointer')
						$.notice(data.msg, 2000)
					}
				}, true)
				console.log(query)
				return false;
			})
		})
		var w = document.documentElement.clientWidth || document.body.clientWidth;
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		var left = (w - 800) / 2 + 'px';
		var top = (h - 600) / 2 + 'px';
		if((h - 600) <= 0) {
			top = '15px';
		}
		$('.leaving-box').show().css({
			'left': left,
			'top': top
		})
		$('.close-btn').bind('click', function() {
			$('.leaving-box').remove()
		})
	} else {
		window.stop()
		$.notice('请先登录再进行操作！', 2000)
		return;
	}

}
//留言业务类型二级联动
function renderCaseType() {
	$.getDataDic('cms_guestbook_type', function(data) {
		console.log(data);
		$.each(data.body, function(index, val) {
			var $option = $('<option id="' + val.value + '">' + val.label + '</option>');
			$('#parentCase').append($option);
		});
		$.getCascadeDic('cms_guestbook_type', $('#parentCase').find('option:selected').attr('id'), function(data) {
			console.log(data);
			$.each(data.body, function(index, val) {
				var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
				$('#childCase').append($opt);
			});
		})
		$('#parentCase').bind('change', function() {
			//先清除
			$('#childCase').find('option').remove();
			var parentId = $(this).find('option:selected').attr('id');
			$.getCascadeDic('cms_guestbook_type', parentId, function(data) {
				console.log(data);
				$.each(data.body, function(index, val) {
					var $opt = $('<option id="' + val.value + '">' + val.label + '</option>');
					$('#childCase').append($opt);
				});
			})
		})
	})

	//留言咨询获取所在地区
	$.getArea('', function(data) {
		//		console.log(data);
		$.each(data, function(index, val) {
			var $opt = $('<option id="' + val.id + '">' + val.name + '</option>');
			$('#areaId').append($opt);
		});
	})

	//提问人和号码渲染
	$.loadData('/api/100/400/50', '', function(data) {
		console.log(data);
		if(data.status == 0) {
			$('#questioner').val(data.body.realname);
			$('#phoneId').val(data.body.mobile);
		}
	}, true)
}