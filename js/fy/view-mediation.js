$(function() {
	var status = $.checkLoginStatus();
	var request = $.GetRequest();
	if(status) {
		$.getSecPageNav();
		var request = $.GetRequest();
		//	calcProcItem(request);
		renderForm(request)
	} else {
		window.stop()
		$.notice('请登陆后进行操作！', 2000)
		setTimeout(function() {
			top.location.href = 'index.html';
		}, 2000)
	}
})

//获取流程节点渲染页面
function renderForm(request) {
	var procInsId = request.procInsId == undefined ? '' : request.procInsId;
	var businessId = request.businessId == undefined ? '' : request.businessId;
	$.loadData('/api/100/540/51', '{"procInsId":"' + procInsId + '"}', function(data) {
		console.log(data)
		var linkList = {
			'mediation_start': 'mediation-apply.html',
			'mediation_dengji': 'mediation-accept.html',
			'mediation_diaocha': 'mediation-investigation.html',
			'mediation_tiaojie': 'mediation-record.html',
			'mediation_xieyi': 'mediation-agreement.html',
			'mediation_huifang': 'mediation-returnvisit.html',
			'mediation_juanzong': 'mediation-archive.html'
		}
		var procList = data.body;
		var nowTaskDefKey = '';
		$.each(procList, function(i, el) {
			var pcUrl = '';
			var status = '';
			$.each(linkList, function(i, val) {
				if(el.taskDefKey == i) {
					pcUrl = val
				}
			});
			var $procItem = $('<div class="process-item" data-href="' + pcUrl + '" data-taskDefKey="' + el.taskDefKey + '">' +
				'<div class="item-desc">' +
				'<p>' + el.taskName + '</p>' +
				'</div>' +
				'</div>')
			switch(el.status) {
				case '0':
					status = 'unfinished';
					$procItem.css('cursor', 'not-allowed');
					break;
				case '1':
					status = 'now';
					nowTaskDefKey = el.comment == '' ? 'mediation_start' : el.comment;
					$procItem.data('businessid', el.businessId)
					$procItem.data('procinsid', el.procInsId)
					$procItem.data('procdefid', el.procDefId)
					$procItem.data('procdefkey', el.procDefKey)
					$procItem.data('taskid', el.taskId)
					$procItem.data('taskdefkey', nowTaskDefKey)
					$procItem.data('taskname', encodeURI(encodeURI(el.taskName)))
					$procItem.data('status', el.status)
					$procItem.css('cursor', 'not-allowed');
					break;
				case '2':
					status = 'finished';
					if(el.taskDefKey == 'mediation_start') {
						nowTaskDefKey = 'mediation_shenhe';
					}
					$procItem.data('businessid', el.businessId)
					$procItem.data('procinsid', el.procInsId)
					$procItem.data('procdefid', el.procDefId)
					$procItem.data('procdefkey', el.procDefKey)
					$procItem.data('taskid', el.taskId)
					$procItem.data('taskdefkey', el.taskDefKey)
					$procItem.data('taskname', encodeURI(encodeURI(el.taskName)))
					$procItem.data('status', el.status)
					$procItem.bind('click', function() {
						$('#iframe').attr('src', $(this).data('href') + '?businessId=' + el.businessId + '&procInsId=' + el.procInsId + '&procDefId=' + el.procDefId + '&procDefKey=' + el.procDefKey + '&taskDefKey=' + el.taskDefKey + '&taskName=' + encodeURI(encodeURI(el.taskName)) + '&taskId=' + el.taskId + '&status=' + el.status)
						$.calcIframeHeight()
					})
					break;
				default:
					break;
			}
			$procItem.css('left', (i * 100 - 10) + 'px');
			$procItem.addClass(status);
			$('.process-bar').append($procItem);
		})
		if(request.procInsId != '' && request.procInsId != undefined && request.procInsId != null) {
			//个人中心已有流程进入
			if(request.taskDefKey == 'mediation_start' || request.taskDefKey == 'mediation_shenhe' || request.taskDefKey == 'mediation_zhiding' || request.taskDefKey == 'mediation_xiugai') {
				var now = $('.process-bar').find('.now');
				$('#iframe').attr('src', $('.process-bar').find('.now').data('href') + '?businessId=' + request.businessId + '&procInsId=' + now.data('procinsid') + '&procDefId=' + now.data('procdefid') + '&procDefKey=' + now.data('procdefkey') + '&taskDefKey=' + nowTaskDefKey + '&taskName=' + encodeURI(encodeURI(now.data('taskname'))) + '&taskId=' + now.data('taskid') + '&status=' + now.data('status'));
				$.calcIframeHeight()
			} else {
				var now = $('.process-bar').find('.finished').last();
				$('#iframe').attr('src', now.data('href') + '?businessId=' + now.data('businessid') + '&procInsId=' + now.data('procinsid') + '&procDefId=' + now.data('procdefid') + '&procDefKey=' + now.data('procdefkey') + '&taskDefKey=' + now.data('taskdefkey') + '&taskName=' + encodeURI(encodeURI(now.data('taskname'))) + '&taskId=' + now.data('taskid') + '&status=' + now.data('status'));
				$.calcIframeHeight()
			}
		} else {
			//首次或草稿申请流程
			console.log(request)
			$('#iframe').attr('src', $('.process-bar').find('.now').data('href') + '?businessId=' + request.businessId + '&procInsId=&procDefId=&procDefKey=' + request.procDefKey + '&taskDefKey=' + nowTaskDefKey + '&taskName=""&taskId=&status=1');
			$.calcIframeHeight()
		}

	}, true)
}
//function calcProcItem(request) {
//	//渲染流程节点进度条
//	var version;
//	if(request.version != '' && request.version != undefined && request.version != null) {
//		version = request.version
//	} else {
//		version = '';
//	}
//	$.loadData('/api/100/8030/60', '{"procDefKey":"people_mediation","version":"' + version + '"}', function(data) {
//		var procItemList = data.body;
//		$.each(procItemList, function(i, el) {
//			var pcUrl = el.pcUrl;
//			var taskDefKey = el.taskDefKey;
//			var descTitle = el.name.substr(0, 4);
//			var descTableName = el.name.replace('人民调解', '')
//			var $procItem = $('<div class="process-item" data-href="' + pcUrl + '" data-taskDefKey="' + taskDefKey + '">' +
//				'<div class="item-desc">' +
//				'<p>' + descTitle + '</p>' +
//				'<p>' + descTableName + '</p>' +
//				'</div>' +
//				'</div>')
//			$procItem.css('left', (i * 100 - 10) + 'px')
//			$('.process-bar').append($procItem)
//		});
//		if(request.procInsId != '' && request.procInsId != undefined && request.procInsId != null) {
//			$.loadData('/api/100/540/50', '{"procInsId":"' + request.procInsId + '"}', function(data) {
//				//循环渲染进度条
//				$.each(data.body, function(i, el) {
//					switchProcItem(el, el.status, request, request.procInsId)
//				})
//			})
//		} else {
//			switchProcItem({
//				"taskDefKey": "mediation_start"
//			}, '1', request, request.procInsId)
//		}
//	})
//}
////根据状态宣言进度条状态
//function switchProcItem(info, status, request, procInsId) {
//	console.log(info)
//	var ItemStatus = '';
//	$('.process-item').each(function(i, el) {
//		if($(el).data('taskdefkey').indexOf(info.taskDefKey) >= 0) {
//			if(status == '2') {
//				$(el).attr('title', '已完成')
//				ItemStatus = 'finished';
//				$(el).data('businessid', info.businessId)
//				$(el).data('procinsid', procInsId)
//				$(el).data('procdefid', info.procDefId)
//				$(el).data('procdefkey', info.procDefKey)
//				$(el).data('taskid', info.taskId)
//				$(el).data('taskname', encodeURI(encodeURI(info.taskName)))
//				$(el).data('status', status)
//				$(el).bind('click', function() {
//					$('#iframe').attr('src', $(this).data('href') + '?businessId=' + now.attr('id') + '&procInsId=' + $(this).data('procinsid') + '&procDefId=' + $(this).data('procdefid') + '&procDefKey=' + $(this).data('procdefkey') + '&taskDefKey=' + $(this).data('finalstatus') + '&taskName=' + encodeURI(encodeURI($(this).data('taskname'))) + '&taskId=' + $(this).data('taskid') + '&status=' + $(this).data('status'))
//					$.calcIframeHeight()
//				})
//			} else if(status == '1') {
//				$(el).attr('title', '正在进行中')
//				ItemStatus = 'now';
//				$(el).data('businessid', info.businessId)
//				$(el).data('procinsid', procInsId)
//				$(el).data('procdefid', info.procDefId)
//				$(el).data('procdefkey', info.procDefKey)
//				$(el).data('taskid', info.taskId)
//				$(el).data('taskname', info.taskName)
//				$(el).data('status', status)
//
//			} else {
//				$(el).attr('title', '未完成')
//				return;
//			}
//			$(el).addClass(ItemStatus)
//			$(el).data('finalstatus', info.taskDefKey)
//
//		}
//	})
//	//初始化加载表单
//	if(info.taskDefKey == 'mediation_start' || info.taskDefKey == 'mediation_shenhe' || info.taskDefKey == 'mediation_zhiding' || info.taskDefKey == 'mediation_xiugai') {
//		var now = $('.process-bar').find('.now');
//		$('#iframe').attr('src', $('.process-bar').find('.now').data('href') + '?businessId=' + request.businessId + '&procInsId=' + now.data('procinsid') + '&procDefId=' + now.data('procdefid') + '&procDefKey=' + request.procDefKey + '&taskDefKey=' + request.finalstatus + '&taskName=' + encodeURI(encodeURI(now.data('taskname'))) + '&taskId=' + now.data('taskid'));
//		$.calcIframeHeight()
//	} else {
//		var now = $('.process-bar').find('.finished').last();
//		$('#iframe').attr('src', now.data('href') + '?businessId=' + now.data('businessid') + '&procInsId=' + now.data('procinsid') + '&procDefId=' + now.data('procdefid') + '&procDefKey=' + now.data('procdefkey') + '&taskDefKey=' + now.data('finalstatus') + '&taskName=' + encodeURI(encodeURI(now.data('taskname'))) + '&taskId=' + now.data('taskid'));
//		$.calcIframeHeight()
//	}
//
//}