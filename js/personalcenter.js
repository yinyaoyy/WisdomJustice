$(function() {
	var status = $.checkLoginStatus();
	var request = $.GetRequest();
	if(status) {
		$.getSecPageNav();
		setupNav(request.navActive);
		initCaseTable()
		getConsultation('', '1', '10', '', '', '');
		getComplaint('', 1, 10);
		renderUserInfo()
		$('.pro-btn').bind('click', Common.alertComplaintBox);

		getDraft('1', '', '', '')
	} else {
		window.stop()
		$.notice('请登陆后进行操作！', 2000)
		history.back(-1)
	}
})
//初始化我的案件及时间控件
function initCaseTable() {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#caseTime',
			range: '~'
		});
	});
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#draftTime',
			range: '~'
		});
	});
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#zxTime',
			range: '~'
		});
	});
	getActType();
	bindCaseSearch();
	var procDefKey = $('#caseType').find('option:selected').val();
	var status = $('#caseStatus').find('option:selected').val();
	getCase(procDefKey, 1, 10, '', '', status, '');
}
//案件类型act_type
function getActType() {
	$.getDataDic('act_type', function(data) {
		var list = data.body;
		$('#caseType').append($('<option value="">全部</option>'))
		$.each(list, function(i, el) {
			var $opt = $('<option value="' + el.value + '">' + el.label + '</option>');
			$('#caseType').append($opt);
		})
	})
}
//绑定个人中心搜索按钮
function bindCaseSearch() {
	//案件搜索
	$('#case-search-btn').bind('click', function() {
		var procDefKey = $('#caseType').find('option:selected').val();
		var status = $('#caseStatus').find('option:selected').val();
		var title = $('#caseTitle').val();
		var startTime = $('#caseTime').val().split(' ~ ')[0];
		var endTime = $('#caseTime').val().split(' ~ ')[1] == undefined ? '' : $('#caseTime').val().split(' ~ ')[1];
		getCase(procDefKey, '1', 10, startTime, endTime, status, title);
	})
	//草稿搜索
	$('#draft-search-btn').bind('click', function() {
		var title = $('#draftTitle').val();
		var startTime = $('#draftTime').val().split(' ~ ')[0];
		var endTime = $('#draftTime').val().split(' ~ ')[1] == undefined ? '' : $('#draftTime').val().split(' ~ ')[1];
		getDraft('1', startTime, endTime, title)
	})
	//咨询搜索
	$('#zx-search-btn').bind('click', function() {
		var title = $('#zxTitle').val();
		var beginDate = $('#zxTime').val().split(' ~ ')[0];
		var endDate = $('#zxTime').val().split(' ~ ')[1] == undefined ? '' : $('#zxTime').val().split(' ~ ')[1];
		var isComment = $('#isComment').find('option:selected').val();
		getConsultation(isComment, '1', '10', title, beginDate, endDate)
	})
}
//获取投诉列表
function getComplaint(isComment, pageNo, pageSize) {
	$.loadData('/api/100/610/10', '{"isComment":"' + isComment + '","pageSize":"' + pageSize + '","pageNo":"' + pageSize + '"}', function(data) {
		//		console.log(data)
		if(data.status == 0) {
			var list = data.body.list;
			if(list != undefined && list != null && list != '') {
				$('#complaintCount').html(data.body.count);
				layui.use('laypage', function() {
					var laypage = layui.laypage;
					//执行一个laypage实例
					laypage.render({
						elem: 'complaintPagination',
						count: data.body.count,
						groups: 10,
						curr: pageNo,
						theme: '#1296D6',
						limit: 10,
						first: '首页',
						last: '尾页',
						jump: function(obj, first) {
							$('#complaint-list tbody').find('tr').remove();
							$.each(list, function(i, el) {
								console.log(el)
								var isComment = '';
								switch(el.isComment) {
									case "0":
										isComment = "未回复"
										break;
									case "1":
										isComment = "已回复"
										break;
									default:
										isComment = "已回复"
										break;
								}
								$tr = $('<tr id="' + el.id + '"><td>' + el.title + '</td><td>' + el.createDate + '</td><td>' + isComment + '</td><td><button class="view-qa-btn">查看</button></td></tr>')
								$tr.find('.view-qa-btn').bind('click', function(e) {
									e.stopPropagation();
									var id = $(this).parent().parent().attr('id');
									$('#complaint').hide();
									$('#complaint-detail').show();
									$.loadData('/api/100/610/50', '{"id":"' + id + '"}', function(data) {
										renderComplaintDetail(data.body)
									}, true)
								})
								$('#complaint-list tbody').append($tr)
							})
							//首次不执行
							if(!first) {
								$('#complaint-list tbody').find('tr').remove();
								getComplaint('', obj.curr, 10)
							}
						}
					})
				})
			} else {
				$('.layui-box').remove();
				$('#complaintCount').html('0');
				$('#complaint-list tbody').append('<tr><td colspan="4" style="text-align:center;">暂无数据</td></tr>')
			}
		} else {
			
			$('#complaintCount').html('0');
			$('#complaint-list tbody').append('<tr><td colspan="4" style="text-align:center;">暂无数据</td></tr>')
		}
	}, true, true)
}
//获取留言列表
function getConsultation(isComment, pageNo, pageSize, title, beginDate, endDate) {
	console.log('{"isComment":"' + isComment + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","title":"' + title + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '"}')
	$.loadData('/api/100/600/70', '{"isComment":"' + isComment + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","title":"' + title + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '"}', function(data) {
		console.log(data)
		if(data.status == 0) {
			var list = data.body.list;
			if(list != undefined && list != null && list != '') {
				$('#consultationPageCount').html(data.body.count)
				layui.use('laypage', function() {
					var laypage = layui.laypage;
					//执行一个laypage实例
					laypage.render({
						elem: 'qaPagination',
						count: data.body.count,
						groups: 5,
						curr: pageNo,
						theme: '#1296D6',
						limit: 10,
						first: '首页',
						last: '尾页',
						jump: function(obj, first) {
							$('#consultation-result-list tbody').find('tr').remove();
							$.each(list, function(i, el) {
								var isComment = '';
								switch(el.isComment) {
									case "0":
										isComment = "未回复"
										break;
									case "1":
										isComment = "已回复"
										break;
									default:
										break;
								}
								$tr = $('<tr id="' + el.id + '"><td>' + el.title + '</td><td>' + el.createDate + '</td><td>' + isComment + '</td><td><button class="view-qa-btn">查看</button></td></tr>')
								$tr.find('.view-qa-btn').bind('click', function(e) {
									e.stopPropagation();
									var id = $(this).parent().parent().attr('id');
									$('#replied').hide();
									$('#qa-detail').show();
									$.loadData('/api/100/600/30', '{"id":"' + id + '"}', function(data) {
										renderQADetail(data.body)
									}, true, true)
								})
								$('#consultation-result-list tbody').append($tr)
							})
							//首次不执行
							if(!first) {
								$('#consultation-result-list tbody').find('tr').remove();
								getConsultation(isComment, obj.curr, 10, title, beginDate, endDate)
							}
						}
					})
				})
			} else {
				$('.layui-box').remove();
				$('#consultationPageCount').html('0');
				$('#consultation-result-list tbody').find('tr').remove();
				$('#consultation-result-list tbody').append('<tr><td colspan="4" style="text-align:center;">暂无数据</td></tr>')
			}
		} else {
			
			$('#consultationPageCount').html('0');
			$('#consultation-result-list tbody').find('tr').remove();
			$('#consultation-result-list tbody').append('<tr><td colspan="4" style="text-align:center;">暂无数据</td></tr>')
		}
	}, true, true)
}


//获取我的案件
function getCase(procDefKey, pageNo, pageSize, beginDate, endDate, caseType, title) {
	console.log('{"procDefKey":"' + procDefKey + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '","status":"' + caseType + '","title":"' + title + '"}')
	var procDefKey = procDefKey == undefined ? '' : procDefKey;
	$.loadData('/api/100/530/70', '{"procDefKey":"' + procDefKey + '","pageNo":"' + pageNo + '","pageSize":"' + pageSize + '","beginDate":"' + beginDate + '","endDate":"' + endDate + '","status":"' + caseType + '","title":"' + title + '"}', function(data) {
		console.log(data)
		if(data.status == 0) {
			$('#caseList tbody').find('tr').remove()
			var list = data.body.list;
			if(list != undefined && list != null && list != '') {
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
							$('#caseList tbody').find('tr').remove()
							$('#pageCount').html(data.body.count)
							$.each(list, function(i, val) {

								//受理中已结案
								var nowTaskName = '';
								if(val.task.endTime == '' || val.task.endTime == undefined || val.task.endTime == null) {
									nowTaskName = val.taskName;
								} else {
									nowTaskName = '已结案';
								}
								var $tr = $('<tr' +
									' id="' + val.businessId +
									'" data-procinsid="' + val.procInsId +
									'" data-procdefid="' + val.procDefId +
									'" data-procdefkey="' + val.procDefKey +
									'" data-taskdefinitionkey="' + val.taskDefKey +
									'" data-taskid="' + val.taskId +
									'" data-taskname="' + val.task.taskName +
									'" data-version="' + val.version +
									'">' +
									'<td class="title-text" title="' + val.vars.map.title + '">' + val.vars.map.title + '</td>' +
									'<td width="170" >' + val.task.createTime + '</td>' +
									'<td width="120">' + val.procDefName + '</td>' +
									'<td width="150" class="title-text" title="' + nowTaskName + '">' + nowTaskName + '</td>' +
									'<td width="160" class="table-control"><button class="viewCase">查看</button></td></tr>');
								if(val.task.endTime != '' && val.task.endTime != undefined && val.task.endTime != null) {
									var $pjBtn = $('<button class="pjCase" id="' + val.commentId + '">评价</button>');
									$tr.find('.table-control').append($pjBtn);
									//评价按钮
									if(val.isEvaluate != '1') {
										$tr.find('.pjCase').bind('click', function() {
											alertEvaBox(val)
										})
									} else {
										$tr.find('.pjCase').attr('disabled', 'disabled').css({
											'cursor': 'not-allowed',
											'background-color': '#ccc'
										}).attr('title', '已评价');
									}
								}

								$('#caseList tbody').append($tr);

								var _this = $(this);

							});

							$('.viewCase').bind('click', function() {
								var pageLink = '';
								var businessId = $(this).parent().parent().attr('id')
								var procInsId = $(this).parent().parent().data('procinsid');
								var procDefId = $(this).parent().parent().data('procdefid');
								var procDefKey = $(this).parent().parent().data('procdefkey');
								var taskDefKey = $(this).parent().parent().data('taskdefinitionkey');
								var taskId = $(this).parent().parent().data('taskid');
								var taskName = $(this).parent().parent().data('taskname');
								var version = $(this).parent().parent().data('version');
								if(procDefKey == 'people_mediation') {
									$.openSecPage('view-mediation.html', {
										'businessId': businessId,
										'procInsId': procInsId,
										'procDefId': procDefId,
										'procDefKey': procDefKey,
										'taskDefKey': taskDefKey,
										'taskName': encodeURI(encodeURI(taskName)),
										'taskId': taskId,
										'version': version
									})
								} else if(procDefKey == 'legal_aid') {
									$.openSecPage('legalaid-apply.html', {
										'businessId': businessId,
										'procInsId': procInsId,
										'procDefId': procDefId,
										'procDefKey': procDefKey,
										'taskDefKey': taskDefKey,
										'taskName': encodeURI(encodeURI(taskName)),
										'taskId': taskId,
										'version': version
									})
								}

							})
							//首次不执行
							if(!first) {
								$('.result-list').find('ul').remove()
								//								console.log(procDefKey + "+" + obj.curr + "+" + 10 + "+" + beginDate + "+" + endDate + "+" + caseType + "+" + title)
								getCase(procDefKey, obj.curr, 10, beginDate, endDate, caseType, title)
							}
						}
					});
				});
			} else {
				$('.layui-box').remove();
				$('#pageCount').html('0');
				$('#caseList tbody').append('<tr><td colspan="5" style="text-align:center;">暂无数据</td></tr>')
			}
		} else {
			
			$('#pageCount').html('0');
			$('#caseList tbody').append('<tr><td colspan="5" style="text-align:center;">暂无数据</td></tr>')
		}
	}, true, true)
}

//案件已办理弹出评价框
function alertEvaBox(caseDetail) {
	console.log(caseDetail)
	var $pjbox =
		$('<div class="pj-box">' +
			'<div class="top-box">' +
			'<div class="tit">' +
			'<span class="tit-word">我&nbsp;的&nbsp;评&nbsp;价</span>' +
			'</div>' +
			'<img src="img/lr-title.png">' +
			'<div class="close-btn">x</div>' +
			'</div>' +
			'<div class="pj-content">' +
			'<div class="starBox">' +

			'</div>' +
			'</div>' +
			'<div class="bottom">' +
			'<span class="line"></span>' +
			'<input type="submit" class="submit" id="tj-Btn" data-commentid="' + caseDetail.commentId + '">' +
			'</div>' +
			'</div>');
	$('body').append($pjbox);

	//判断人调和法援
	var type = '';
	if(caseDetail.procDefKey == "legal_aid") {
		type = "3"
	} else if(caseDetail.procDefKey == "people_mediation") {
		type = "4"
	}

	var data = caseDetail.evaluatedList;

	$.each(data, function(i, val) {
		var $star = $('<div class="star" id="' + val.beEvaluatedUserId + '" data-type="' + type + '">' +
			'<div class="name">' +
			'<p><span>' + val.name + '</span><span>' + val.roleName + '</span></p>' +
			'</div>' +
			'<div class="star-list" >' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'</div>' +
			'<textarea class="pj" id="contId" name="" rows="" cols="" maxlength="50" placeholder="请输入评价内容,最多50个字符..."></textarea>' +
			'</div>')

		//星级评价
		$star.find('.star-list span').bind('click', function(e) {
			e.stopPropagation();
			var activeIndex = $(this).index();
			$.each($(this).parent().find('span'), function(i, el) {
				if($(el).index() <= activeIndex) {
					$(el).addClass('active').removeClass('unactive')
				} else {
					$(el).addClass('unactive')
				}
			})
		})
		$('.starBox').append($star);
	})

	//弹出页面的位置
	var w = document.documentElement.clientWidth || document.body.clientWidth;
	var h = document.documentElement.clientHeight || document.body.clientHeight;
	var left = (w - 400) / 2 + 'px';
	var top = (h - 205) / 2 + 'px';
	if((h - 400) <= 0) {
		top = '15px';
	}

	$('.pj-box').show().css({
		'left': left,
		'top': top,
		'position': 'fixed'
	})

	//点击关闭
	$('.close-btn').bind('click', function() {
		$('.pj-box').remove();
	})

	//提交评价
	$pjbox.find('#tj-Btn').bind('click', function() {
		var commentId = $(this).data('commentid')
		var evaluatedList = [];
		var list = $('.pj-box').find('.star');
		$.each(list, function(i, el) {
			var pjobj = {
				"prescription": $(el).find('.star-list span.active').length + "",
				"proposal": $(el).find("#contId").val(),
				"beEvaluatedUserId": $(el).attr('id')
			}
			evaluatedList.push(pjobj)
		});
		console.log(evaluatedList)
		var prescription = $('.star-list span.active').length;
		var proposal = $("#contId").val();

		//console.log(prescription)
		if(prescription == 0) {
			$.notice('请选择星级评价！', 2000)
		} else {
			var strList = JSON.stringify(evaluatedList);
			console.log('{"commentId":"' + commentId + '","evaluatedList":"' + strList + '", "type":"' + type + '"}');
			$.loadData('/api/100/600/100', '{"commentId":"' + commentId + '","evaluatedList":' + strList + ', "type":"' + type + '"}', function(data) {
				console.log(data);
				if(data.status == 0) {
					$.notice('提交成功！', 2000)
					$('.pj-box').remove();
					//禁用评价按钮
					$('#' + commentId).attr('disabled', 'disabled').css({
						'cursor': 'not-allowed',
						'background-color': '#ccc'
					})
				}
			})
		}

	})
}
//获取草稿箱
function getDraft(pageNo, beginDate, endDate, title) {
	$.loadData('/api/100/540/80', '{"pageNo":"' + pageNo + '","pageSize":"10","beginDate":"' + beginDate + '","endDate":"' + endDate + '","caseTitle":"' + title + '"}', function(data) {
		var count = data.body.list == undefined ? 0 : data.body.list.length;
		$('#draft-pageCount').html(count)
		console.log(data)
		if(data.status == 0) {
			$('#draftList tbody').find('tr').remove()
			var list = data.body.list;
			if(list != undefined && list != null && list != '') {
				layui.use('laypage', function() {
					var laypage = layui.laypage;
					//执行一个laypage实例
					laypage.render({
						elem: 'draft-pagination',
						count: data.body.count,
						groups: 5,
						curr: pageNo,
						theme: '#1296D6',
						limit: 10,
						first: '首页',
						last: '尾页',
						jump: function(obj, first) {
							$('#draftList tbody').find('tr').remove();
							$.each(list, function(i, val) {
								var nowTaskName = '草稿';

								var $tr = $('<tr id="' + val.id + '" data-procdefkey="' + val.procDefKey + '">' +
									'<td class="title-text" title="' + val.title + '">' + val.title + '</td>' +
									'<td width="150" >' + val.beginDate + '</td>' +
									'<td width="120">' + val.taskName + '</td>' +
									'<td width="150" class="title-text" title="' + nowTaskName + '">' + nowTaskName + '</td>' +
									'<td width="100"><button class="viewCase">查看</button></td></tr>')
								$('#draftList tbody').append($tr)
							});
							$('.viewCase').bind('click', function() {
								var pageLink = '';
								var businessId = $(this).parent().parent().attr('id')
								var procDefKey = $(this).parent().parent().data('procdefkey');
								console.log(businessId)
								if(procDefKey == 'mediation') {
									$.openSecPage('view-mediation.html', {
										'businessId': businessId,
										'procDefKey': procDefKey
									})
								} else if(procDefKey == 'legal') {
									$.openSecPage('legalaid-apply.html', {
										'procDefKey': procDefKey,
										'businessId': businessId,
										'taskDefKey': 'aid_start'
									})
								}

							})
							//首次不执行
							if(!first) {
								$('#draftList tbody').find('tr').remove();
								getCase(obj.curr, beginDate, endDate, title)
							}
						}
					});
				});
			} else {
				$('.layui-box').remove();
				$('#pageCount').html('0');
				$('#draftList tbody').append('<tr><td colspan="5" style="text-align:center;">暂无数据</td></tr>')
			}
		} else {
			
			$('#pageCount').html('0');
			$('#draftList tbody').append('<tr><td colspan="5" style="text-align:center;">暂无数据</td></tr>')
		}
	}, true, true)
}
//左侧导航
function setupNav(navActive) {
	//	console.log(navActive)
	var allAFor = $('.content-tab').find('li a');
	if(navActive != '' && navActive != undefined && navActive != null) {
		$.each(allAFor, function(i, el) {
			var forAttr = $(el).data('for')
			if(forAttr == navActive) {
				$(this).addClass('active').parent().siblings().find('.active').removeClass('active expanded').siblings('.sub-ul').hide()
				$('#' + navActive).show();
				$('.content-title').html($(this).html())
			}
			$(el).bind('click', function() {
				var afor = $(this).data('for');
				if(afor != '' && afor != undefined && afor != null) {
					/*******具体切换操作*******/
					$('.content-title').html($(this).html())
					$('.sec-content').remove()
					/*************************/
					var forPoint = $(this).data('for');
					$('#' + forPoint).show().siblings('.tab-content').hide();
					$('.sec-detail').hide();
					$(this).addClass('active').parent().siblings().find('.active').removeClass('active expanded').siblings('.sub-ul').hide()
				} else {
					return
				}
			})
		})
	} else {
		$('.content-tab').find('li a').first().addClass('active');
		var navActive = $('.content-tab').find('li a.active')
		$('.content-title').html(navActive.html())
		$('#' + navActive.data('for')).show();
		$.each(allAFor, function(i, el) {
			$(el).bind('click', function() {
				var afor = $(this).data('for');
				if(afor != '' && afor != undefined && afor != null) {
					/*******具体切换操作*******/
					$('.content-title').html($(this).html())
					$('.sec-content').remove()
					/*************************/
					var forPoint = $(this).data('for');
					$('#' + forPoint).show().siblings('.tab-content').hide();
					$('.sec-detail').hide();
					$(this).addClass('active').parent().siblings().find('.active').removeClass('active expanded').siblings('.sub-ul').hide()
				} else {
					return
				}
			})
		})
	}
}
//渲染留言咨询详情
function renderQADetail(res) {
	console.log(res)
	var $secDetail = $('#qa-detail');
	var $qaContent = $('<div id="qa-content" class="sec-content"></div>');
	$('.goback-qa').bind('click', function() {
		$('#replied').show();
		$secDetail.hide();
		$('#qa-content').remove();
	})
	var $qbox = $('<div class="detail-q">' +
		'<div class="q-title">' + res.title + '</div>' +
		'<div class="q-msg">' + res.content + '</div>' +
		'<div class="q-time">咨询时间：<span id="q-time">' + res.createDate + '</span></div>' +
		'</div>')
	$qaContent.append($qbox)
	var commentList = res.commentList;
	if(commentList != '' && commentList != undefined && commentList != null) {
		$.each(commentList, function(i, el) {
			var evaSrc = '';
			if(el.isEvaluate == '1') {
				console.log('1')
				evaSrc = 'img/star_' + el.guestbookEvaluate.prescription + '.png';
			} else {
				evaSrc = 'img/pj.png';
			}
			var $qaBox = $(
				'<div class="qa-box">' +
				'<div class="a-msg">' +
				'<div class="name">' + el.createUser.name + '</div>' +
				'<div class="msg">' + el.content + '</div>' +
				'<div class="pj-btn" data-hfid="' + el.id + '" data-ryid="' + el.createUser.id + '"><img src="' + evaSrc + '"/></div>' +
				'</div>' +
				'<div class="detail-thumbs">' +
				'<div class="re-time">回复时间：<span id="re-time">' + el.createDate + '</span></div>' +
				'<div id="good" class="thumbsUp" data-thumbs="true" data-num="' + el.thumbsUpTrue + '">' +
				'<img src="img/consultation/good.png" alt="" />' +
				' <span id="goodConut">( ' + el.thumbsUpTrue + ' )</span>' +
				'</div>' +
				'<div id="diss" class="thumbsUp" data-thumbs="false" data-num="' + el.thumbsUpFalse + '">' +
				'<img src="img/consultation/diss.png" alt="" />' +
				' <span id="dissConut">( ' + el.thumbsUpFalse + ' )</span>' +
				'</div>' +
				'<button class="closely-btn">追问</button>' +
				'<div class="reClosely">' +
				'<textarea class="closelyTextarea"></textarea>' +
				'<button class="closelyTextareaBtn"  data-commentid="' + el.id + '" data-guestbookid="' + el.guestbookId + '" >提交</button>' +
				'</div>' +
				'</div>' +
				'</div>'
			);
			$qaBox.find('.thumbsUp').bind('click', function() {
				var commentId = el.id;
				var _this = $(this);
				$.giveThumbs(commentId, $(this).data('thumbs'), function(data) {
					if(data.body == '0') {
						$.notice('您已经点赞过了！', 2000)
					} else if(data.body == '1') {
						_this.find('span').html('( ' + (parseInt(_this.data('num')) + 1) + ' )')
						$.notice('提交成功！', 2000)
					}
				})
			})
			var $closelyQABox = $('<div class="qa-closely"></div>')
			if(el.guestbookCommentReList != '' && el.guestbookCommentReList != undefined && el.guestbookCommentReList != null) {
				$.each(el.guestbookCommentReList, function(i, el) {
					var $closelyQA;
					switch(el.commentType) {
						case '0':
							$closelyQA = $('<div class="closely-q">' + el.content + '<div class="closely-time">' + el.createDate + '</div></div>')
							break;
						case '1':
							$closelyQA = $('<div class="closely-a">' + el.content + '<div class="closely-time">' + el.createDate + '</div></div>')
							break;
					}
					$closelyQABox.append($closelyQA)
				});
				$qaBox.find('.a-msg').after($closelyQABox)
			}
			$qaBox.find('.closely-btn').bind('click', function(e) {
				e.stopPropagation();
				$(this).siblings('.reClosely').toggle();
			})
			$qaBox.find('.closelyTextareaBtn').bind('click', function() {
				var content = $(this).siblings('textarea').val();
				var _this = $(this);
				if(content == '' || content == undefined || content == null) {
					$.notice('追问内容不能为空！', 2000)
				} else {
					$.loadData('/api/100/600/40', '{"commentId":"' + $(this).data('commentid') + '","guestbookId":"' + $(this).data('guestbookid') + '","content":"' + content + '"}', function(data) {
						console.log(data)
						if(data.status == 0) {
							_this.parent().parent().siblings('.qa-closely').append('<div class="closely-q">' + content + '</div>')
							_this.parent('.reClosely').toggle();
							$.notice('提交成功!', 2000)
						} else {
							$.notice(data.msg, 2000)
						}
					}, true)
				}

			})
			if(el.isEvaluate != '1') {
				$qaBox.find('.pj-btn').append('<p>评价</p>')
				$qaBox.find('.pj-btn').bind('click', function() {
					alertPjBox($(this).data('hfid'), $(this).data('ryid'))
				})
			} else {
				$qaBox.find('.pj-btn').css('cursor', 'default').attr('title', el.guestbookEvaluate.proposal)
			}
			$qaContent.append($qaBox)
		});
	} else {
		$qaContent.append('<p style="width:100%;height:40px;line-height:40px;text-align:center;color:#1296D6">暂无回复</p>')
	}
	$secDetail.append($qaContent)
}

//留言咨询弹出评价窗口
function alertPjBox(commentId, id) {
	var $pjbox =
		$('<div class="pjbox">' +
			'<div class="tit-box">' +
			'<div class="tit">' +
			'<span class="tit-word">我&nbsp;的&nbsp;评&nbsp;价</span>' +
			'</div>' +
			'<img src="img/lr-title.png">' +
			'<div class="close-btn">x</div>' +
			'</div>' +
			'<div class="pj-content">' +
			'<div class="q-t-half">' +
			'<p>评价内容</p>' +
			'<textarea class="pj" id="contId" name="" rows="" cols="" maxlength="50" placeholder="最多输入50个字符"></textarea>' +
			'<p style="margin-top:10px">星级评价</p>' +
			'<div class="star-list">' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'<span class="unactive"></span>' +
			'</div>' +
			'</div>' +
			'<div class="bottom">' +
			'<input type="submit" class="submit" id="tjBtn">' +
			'</div>' +
			'</div>' +
			'</div>');
	$('body').append($pjbox);

	//弹出页面的位置
	var w = document.documentElement.clientWidth || document.body.clientWidth;
	var h = document.documentElement.clientHeight || document.body.clientHeight;
	var left = (w - 400) / 2 + 'px';
	var top = (h - 205) / 2 + 'px';
	if((h - 400) <= 0) {
		top = '15px';
	}

	$('.pjbox').show().css({
		'left': left,
		'top': top,
		'position': 'fixed'
	})

	//星级评级
	var stars = $('.star-list').find('span');
	stars.bind('click', function(e) {
		e.stopPropagation();
		var activeIndex = $(this).index();
		$.each(stars, function(i, el) {
			if($(el).index() <= activeIndex) {
				$(el).addClass('active').removeClass('unactive')
			} else {
				$(el).addClass('unactive')
			}
		})
	})

	//点击关闭
	$('.close-btn').bind('click', function() {
		$('.pjbox').remove();
	})

	//提交评价
	$pjbox.find('#tjBtn').bind('click', function() {

		var prescription = $('.star-list span.active').length;
		var proposal = $("#contId").val();
		console.log(prescription)
		console.log('"commentId":"' + commentId + '","prescription":"' + prescription + '","proposal":"' + proposal + '","beEvaluatedUser":{"id":"' + id + '"},"type":"1"')
		if(prescription == 0) {
			$.notice('请选择星级评价！', 2000)
		} else {
			$.loadData('/api/100/600/60', '{"commentId":"' + commentId + '","prescription":"' + prescription + '","proposal":"' + proposal + '","beEvaluatedUser":{"id":"' + id + '"},"type":"1"}', function(data) {
				console.log(data)
				if(data.status == 0) {
					$.notice('提交成功！', 2000)
					$('.pjbox').remove();
					$('.pj-btn').each(function(i, el) {
						if($(el).data('hfid') == commentId) {
							$(el).find('img').attr('src', 'img/star_' + prescription + '.png').attr('title', proposal)
							$(el).find('p').remove();
						}
					})
				}
			})
		}
	})
}

//渲染投诉建议
function renderComplaintDetail(res) {
	//	console.log(res)
	var $secDetail = $('#complaint-detail');
	var $qaContent = $('<div id="complaint-content" class="sec-content"></div>');
	$('.goback-complaint').bind('click', function() {
		$('#complaint').show();
		$secDetail.hide();
		$('#complaint-content').remove();
	})
	var $qbox = $('<div class="detail-q">' +
		'<div class="q-title">' + res.title + '</div>' +
		'<div class="q-msg">' + res.content + '</div>' +
		'<div class="q-time">投诉时间：<span id="q-time">' + res.createDate + '</span></div>' +
		'</div>')
	$qaContent.append($qbox)
	var commentList = res.commentList;
	console.log(commentList)
	if(commentList != '' && commentList != undefined && commentList != null) {
		$.each(commentList, function(i, el) {
			var $qaBox = $(
				'<div class="qa-box">' +
				'<div class="a-msg">' +
				'<div class="name">' + el.createUser.name + '</div>' +
				'<div class="msg">' + el.content + '</div>' +
				'</div>' +
				'<div class="detail-thumbs">' +
				'<div class="re-time">回复时间：<span id="re-time">' + el.createDate + '</span></div>' +
				'<button class="closely-btn">追问</button>' +
				'<div class="reClosely">' +
				'<textarea class="closelyTextarea"></textarea>' +
				'<button class="closelyTextareaBtn"  data-commentid="' + el.id + '" data-guestbookid="' + el.guestbookId + '" >提交</button>' +
				'</div>' +
				'</div>' +
				'</div>'
			);
			var $closelyQABox = $('<div class="qa-closely"></div>')
			if(el.guestbookCommentReList != '' && el.guestbookCommentReList != undefined && el.guestbookCommentReList != null) {
				$.each(el.guestbookCommentReList, function(i, el) {
					var $closelyQA;
					switch(el.commentType) {
						case '0':
							$closelyQA = $('<div class="closely-q">' + el.content + '<div class="closely-time">' + el.createDate + '</div></div>')
							break;
						case '1':
							$closelyQA = $('<div class="closely-a">' + el.content + '<div class="closely-time">' + el.createDate + '</div></div>')
							break;
					}
					$closelyQABox.append($closelyQA)
				});
				$qaBox.find('.a-msg').after($closelyQABox)
			}
			$qaBox.find('.closely-btn').bind('click', function(e) {
				e.stopPropagation();
				$(this).siblings('.reClosely').toggle();
			})
			$qaBox.find('.closelyTextareaBtn').bind('click', function() {
				var content = $(this).siblings('textarea').val();
				var _this = $(this);
				if(content == '' || content == undefined || content == null) {
					$.notice('追问内容不能为空！', 2000)
				} else {
					$.loadData('/api/100/600/40', '{"commentId":"' + $(this).data('commentid') + '","guestbookId":"' + $(this).data('guestbookid') + '","content":"' + content + '"}', function(data) {
						console.log(data)
						if(data.status == 0) {
							_this.parent().parent().siblings('.qa-closely').append('<div class="closely-q">' + content + '</div>')
							_this.parent('.reClosely').toggle();
							$.notice('提交成功!', 2000)
						} else {
							$.notice(data.msg, 2000)
						}
					}, true)
				}
			})
			$qaContent.append($qaBox)
		});
	} else {
		$qaContent.append('<p style="width:100%;height:40px;line-height:40px;text-align:center;color:#1296D6">暂无回复</p>')
	}
	$secDetail.append($qaContent)
}

//获取个人信息
function renderUserInfo() {
	$.loadData('/api/100/400/50', '', function(data) {
		console.log(data)
		if(data.status == 0) {
			var data = data.body;
			$('#real-name').html(data.realname);
			$('#loginName').html(data.loginName);
			$('#role').html(data.roleList[0].office.name);
			$('#myBirthday').val(data.birthday);
			$('#mob').val(data.mobile);
			$("#xb").find("option[value = '" + data.sex + "']").attr("selected", "selected");
			$("#edc").find("option[value = '" + data.education + "']").attr("selected", "selected");
			//加载地区乡镇
			getAreaTown(data.area.id, data.townarea.id);
			//加载时间选择器
			renderTime();
			//加载职业下拉框
			renderOccupation(data.userSourceType);
			//提交我的信息
			updateUserInfo();
		} else if(data.status == 403000) {
			$.notice('登录已失效', 2000)
		}
	}, true)
}

//加载时间
function renderTime() {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#myBirthday',
			//range: '~'
		});
	});
}

//获取职业下拉框内容
function renderOccupation(occuValue) {
	$.getDataDic('sys_user_source_type', function(data) {
		console.log(data);
		$.each(data.body, function(index, val) {
			var $option = $('<option value="' + val.value + '">' + val.label + '</option>');
			$('#occu').append($option);
		});
		$("#occu").find("option[value = '" + occuValue + "']").attr("selected", "selected");
	})
}

//获取地区乡镇
function getAreaTown(areaId, townId) {
	if(areaId != '' && areaId != undefined && areaId != null) {
		$.getArea('', function(data) {
			$('.diqu').find('option').remove();
			//初始化地区
			var $selOpt = $('<option>--请选择--</option>');
			$('.diqu').append($selOpt);
			$.each(data, function(index, val) {
				var $opt = $('<option value="' + val.id + '">' + val.name + '</option>');
				$('.diqu').append($opt);
			});
			$('#diquId').find('option[value="' + areaId + '"]').attr("selected", "selected");
		}, false)
		//初始化乡镇
		var $selOpt = $('<option>请选择--</option>');
		$('.xz').append($selOpt);
		$.getArea(areaId, function(data) {
			$.each(data, function(index, val) {
				$xzOpt = $('<option value="' + val.id + '">' + val.name + '</option>');
				$('.xz').append($xzOpt);
			})
			$('#xzId').find('option[value="' + townId + '"]').attr("selected", "selected");
		}, false)
		//地区改变加载乡镇
		$('#diquId').bind('change', function() {
			var $xz = $(this).parent().siblings('td').find('.xz');
			$xz.find('option').remove();
			var parentId = $(this).find("option:selected").val();
			$.getArea(parentId, function(data) {
				//console.log(data);
				var $selOpt = $('<option>--请选择--</option>');
				$('.xz').append($selOpt);
				$.each(data, function(index, val) {
					$xzOpt = $('<option value="' + val.id + '">' + val.name + '</option>');
					$xz.append($xzOpt);
				})
				$('#xzId').find('option[value="' + townId + '"]').attr("selected", "selected");
			}, false)
		})

	} else {
		//初始化地区
		$.getArea('', function(data) {
			$('.diqu').find('option').remove();
			var $selOpt = $('<option>--请选择--</option>');
			$('.diqu').append($selOpt);
			$.each(data, function(index, val) {
				var $opt = $('<option value="' + val.id + '">' + val.name + '</option>');
				$('.diqu').append($opt);
			});
		}, false)
		//初始化乡镇
		var $selOpt = $('<option>--请选择--</option>');
		$('.xz').append($selOpt);
		var diquId = $('.diqu').find("option:selected").val();
		$.getArea(areaId, function(data) {
			$('.xz').find('option').remove();
			var $selOpt = $('<option>--请选择--</option>');
			$('.xz').append($selOpt);
			$.each(data, function(index, val) {
				var $opt = $('<option value="' + val.id + '">' + val.name + '</option>');
				$('.xz').append($opt);
			});
		}, false)
		//地区改变加载乡镇
		$('#diquId').bind('change', function() {
			var $xz = $(this).parent().siblings('td').find('.xz');
			$xz.find('option').remove();
			var parentId = $(this).find("option:selected").val();
			$.getArea(parentId, function(data) {
				//console.log(data);
				var $selOpt = $('<option>--请选择--</option>');
				$('.xz').append($selOpt);
				$.each(data, function(index, val) {
					$xzOpt = $('<option value="' + val.id + '">' + val.name + '</option>');
					$xz.append($xzOpt);
				})
				$('#xzId').find('option[value="' + townId + '"]').attr("selected", "selected");
			}, false)
		})
	}

}

//提交绑定个人信息
function updateUserInfo() {
	//保存我的信息
	$('#personal-info').find('#keep').bind('click', function() {
		var mobile = $('#mob').val();
		var userSourceType = $('#occu option:selected').attr('value');
		var birthday = $('#myBirthday').val();
		var sex = $("#xb option:selected").attr('value');
		var education = $('#edc option:selected').attr('value');
		var aid = $('#diquId option:selected').attr('value');
		var tid = $('#xzId option:selected').attr('value');
		console.log('{"mobile":"' + mobile + '","userSourceType":"' + userSourceType + '","birthday":"' + birthday + '","userExpand":{"sex":"' + sex + '","education":"' + education + '"},"area":{"id":"' + aid + '"},"townarea":{"id":"' + tid + '"}}')
		$.loadData('/api/100/700/60', '{"mobile":"' + mobile + '","userSourceType":"' + userSourceType + '","birthday":"' + birthday + '","userExpand":{"sex":"' + sex + '","education":"' + education + '"},"area":{"id":"' + aid + '"},"townarea":{"id":"' + tid + '"}}', function(data) {
			console.log(data)
			if(data.status == 0) {
				$.notice('保存成功！', 2000)
			}
		})
	})
}