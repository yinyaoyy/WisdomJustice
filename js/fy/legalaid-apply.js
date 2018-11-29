$(function() {
	var status = $.checkLoginStatus();
	var request = $.GetRequest();
	if(status) {
		$.getSecPageNav();
		var request = $.GetRequest();
		$.renderTime('birth')
		getArea()
		getCaseType()
		initForm(request)
	} else {
		window.stop()
		$.notice('请登陆后进行操作！', 2000)
		setTimeout(function(){
			top.location.href='index.html';
		},2000)
		
	}
})

//获取进度条
function calcProcItem(request) {
	var version;
	if(request.version != '' && request.version != undefined && request.version != null) {
		version = request.version
	} else {
		version = '';
	}
	$.loadData('/api/100/8030/60', '{"procDefKey":"legal_aid","version":"' + version + '"}', function(data) {
		var procItemList = data.body;
		$.each(procItemList, function(i, el) {
			var taskDefKey = el.taskDefKey;
			var $procItem = $('<div class="process-item" data-taskDefKey="' + taskDefKey + '">' +
				'<div class="item-desc">' +
				'<p>' + el.name + '</p>' +
				'</div>' +
				'</div>')
			$procItem.css('left', (i * 120 - 10) + 'px').css('cursor', 'not-allowed')
			$('.process-bar').append($procItem)
		});
		if(request.procInsId != '' && request.procInsId != undefined && request.procInsId != null) {
			$.loadData('/api/100/540/50', '{"procInsId":"' + request.procInsId + '"}', function(data) {
				//循环渲染进度条
				$.each(data.body, function(i, el) {
					switchProcItem(el, el.status, request, request.procInsId)
				})
			}, true)
		} else {
			switchProcItem({
				"taskDefKey": "aid_start"
			}, '1', '', request.procInsId)
		}
	}, true)
}
//根据状态渲染进度条状态
function switchProcItem(info, status, request, procInsId) {
	//	console.log(info)
	var ItemStatus = '';
	$('.process-item').each(function(i, el) {
		if($(el).data('taskdefkey').indexOf(info.taskDefKey) >= 0) {
			if(status == '2') {
				$(el).attr('title', '已完成')
				ItemStatus = 'finished';
			} else if(status == '1') {
				$(el).attr('title', '正在进行中')
				ItemStatus = 'now';
			} else {
				$(el).attr('title', '未完成')
				return;
			}
			$(el).addClass(ItemStatus)
			$(el).data('finalstatus', info.taskDefKey)

		}
	})
	//初始化加载表单
	if(info.taskDefKey == 'mediation_start' || info.taskDefKey == 'mediation_shenhe' || info.taskDefKey == 'mediation_zhiding' || info.taskDefKey == 'mediation_xiugai') {
		var now = $('.process-bar').find('.now');
		$('#iframe').attr('src', $('.process-bar').find('.now').data('href') + '?businessId=' + now.data('businessid') + '&procInsId=' + now.data('procinsid') + '&procDefId=' + now.data('procdefid') + '&procDefKey=' + now.data('procdefkey') + '&taskDefKey=' + now.data('finalstatus') + '&taskName=' + encodeURI(encodeURI(now.data('taskname'))) + '&taskId=' + now.data('taskid'));
		$.calcIframeHeight()
	} else {
		var now = $('.process-bar').find('.finished').last();
		$('#iframe').attr('src', now.data('href') + '?businessId=' + now.data('businessid') + '&procInsId=' + now.data('procinsid') + '&procDefId=' + now.data('procdefid') + '&procDefKey=' + now.data('procdefkey') + '&taskDefKey=' + now.data('finalstatus') + '&taskName=' + encodeURI(encodeURI(now.data('taskname'))) + '&taskId=' + now.data('taskid'));
		$.calcIframeHeight()
	}

}

function initForm(request) {
	//adi_approve 法援人员审批
	//aid_update 申请人修改
	//aid_apply_zhiding 申请人是否指定承办人
	//aid_ky_zhiding  指定承办人
	//aid_zhuren 承办机构审核
	//aid_chengbanren_shouli 承办人是否受理
	//aid_chengbanren_banli 承办人办理
	//aid_pingjia 第三方评价
	//aid_chengbanren_butie 承办人申领补贴
	console.log(request.taskDefKey)
	calcProcItem(request)
	switch(request.taskDefKey) {
		case undefined:
			$btnList = $('<button id="save" data-issubmit="0" lay-submit lay-filter="submitForm">暂时保存</button> ' +
				'<button id="submitForm" data-issubmit="1" lay-submit lay-filter="submitForm">提交申请</button>');
			$('.btn-list').append($btnList)
			$('#lawOffice').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('#lawyer').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('#serviceDB').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('.layui-upload').css('display', 'inline-block')
			if(request.businessId != '' && request.businessId != null && request.businessId != undefined) {
				getCaseInfo(request);
			}
			validateForm(request);
			layui.use('layer', function() {
				var layer = layui.layer;
				layer.msg('您是申请人还是代理人？', {
					time: false,
					btnAlign: 'c',
					shade: 0.1,
					btn: ['我是申请人', '我是代理人', ],
					btn1: function(index, layero) {
						$.loadData('/api/100/400/50', '', function(data) {
							if(data.status == '0') {
								console.log(data)
								$('#proposerName').val(data.body.realname).attr('disabled', 'disabled').css('cursor', 'not-allowed');
								if(data.body.birthday != '' && data.body.birthday != null && data.body.birthday != undefined) {
									$('#birth').val(data.body.birthday);
								}
								$('#idCard').val(data.body.papernum).attr('disabled', 'disabled').css('cursor', 'not-allowed');
								$('#area').find('option[id=' + data.body.area.id + ']').attr('selected', 'selected')
								$('#phone').val(data.body.mobile).attr('disabled', 'disabled').css('cursor', 'not-allowed');
								$("#proxyName").attr('disabled', 'disabled').css('cursor', 'not-allowed');
								$("input[name='proxyType']").attr('disabled', 'disabled').css('cursor', 'not-allowed');
								$("#proxyIdCard").attr('disabled', 'disabled').css('cursor', 'not-allowed');
								layer.close(layer.index);
							} else {
								$.notice(data.msg, 2000)
							}
						})
					},
					btn2: function(index, layero) {
						$.loadData('/api/100/400/50', '', function(data) {
							console.log(data)
							if(data.status == '0') {
								$('#proxyName').val(data.body.realname).attr('disabled', 'disabled')
								$('#proxyIdCard').val(data.body.papernum).attr('disabled', 'disabled').css('cursor', 'not-allowed');
								layer.close(layer.index);
							} else {
								$.notice(data.msg, 2000)
							}
						})
					}
				});
			})
			break;
		case 'aid_start':
			$btnList = $('<button id="save" data-issubmit="0" lay-submit lay-filter="submitForm">暂时保存</button> ' +
				'<button id="submitForm" data-issubmit="1" lay-submit lay-filter="submitForm">提交申请</button>');
			$('.btn-list').append($btnList);
			$('#lawOffice').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('#lawyer').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('#serviceDB').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('.layui-upload').css('display', 'inline-block');
			if(request.businessId != '' && request.businessId != null && request.businessId != undefined) {
				getCaseInfo(request);
			}
			validateForm(request);
			break;
		case 'adi_approve':
			getCaseInfo(request, true);
			$('body').find('input').attr('disabled', 'disabled');
			$('body').find('textarea').attr('disabled', 'disabled');
			$('body').find('select').attr('disabled', 'disabled');
			break;
		case 'aid_update':
			$btnList = $('<button id="submitForm" data-issubmit="1" lay-submit lay-filter="submitForm">确认修改</button>');
			$('.btn-list').append($btnList);
			$('#lawOffice').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('#lawyer').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('#serviceDB').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$('#servicePerson').attr('disabled', 'disabled').css('cursor', 'not-allowed');
			getCaseInfo(request);
			validateForm(request);
			break;
		case 'aid_apply_zhiding':
			$btnList = $('<button id="submitForm" data-issubmit="1" lay-submit lay-filter="submitForm">提交申请</button>');
			$('.btn-list').append($btnList);
			$('body').find('input').attr('disabled', 'disabled');
			$('body').find('textarea').attr('disabled', 'disabled');
			$('body').find('select').attr('disabled', 'disabled');
			$('#lawOffice').attr('disabled', false);
			$('#lawyer').attr('disabled', false);
			$('#serviceDB').attr('disabled', false);
			$('#servicePerson').attr('disabled', false);
			getCaseInfo(request);
			validateForm(request);
			break;
		default:
			console.log('defaultin');
			$('body').find('input').attr('disabled', 'disabled');
			$('body').find('textarea').attr('disabled', 'disabled');
			$('body').find('select').attr('disabled', 'disabled');
			getCaseInfo(request, true);
			break;
	}
}
//获取已有表单信息
function getCaseInfo(request, ifOnlyView) {
	//渲染回显表单
	if(request.procInsId != undefined && request.procInsId != null && request.procInsId != '') {
		$.loadData('/api/100/530/40', '{' +
			'"procInsId":"' + request.procInsId + '",' +
			'"procDefId":"' + request.procDefId + '",' +
			'"procDefKey":"' + request.procDefKey + '",' +
			'"taskId":"' + request.taskId + '",' +
			'"taskName":"' + request.taskName + '",' +
			'"taskDefKey":"' + request.taskDefKey + '"' +
			'}',
			function(data) {
				console.log(data)
				if(ifOnlyView) {
					renderForm(data.body.businessData, request, ifOnlyView)
				} else {
					getLawyerStation(data.body.businessData);
					renderForm(data.body.businessData, request, ifOnlyView)
				}
			}, true)
	} else {
		//渲染草稿表单
		$.loadData('/api/100/540/90', '{' +
			'"id":"' + request.businessId + '",' +
			'"procDefKey":"' + request.procDefKey + '"' +
			'}',
			function(data) {
				console.log(data)
				var data = data.body.list[0];
				renderForm(data, request, ifOnlyView)
			}, true)
	}
}
//渲染表单已有信息
function renderForm(data, request, ifOnlyView) {
	console.log(data)
	if(data != undefined && data != '' && data != null) {
		var fileList = data.caseFile.substring(1, data.caseFile.length).split('|');
		$('#proposerName').val(data.name);
		$('#sexy').find("option[value = '" + data.sex + "']").attr("selected", "selected");
		$('#ethnic').find("option[value = '" + data.ethnic + "']").attr("selected", "selected");
		$('#birth').val(data.birthday);
		$('#postCode').val(data.postCode);
		$('#area').find("option[id = '" + data.area.id + "']").attr("selected", "selected");
		$('#idCard').val(data.idCard);
		$('#phone').val(data.phone);
		$('#aidCategory').find("option[value = '" + data.aidCategory + "']").attr("selected", "selected");
		$('#employer').val(data.employer);
		$('#address').val(data.address);
		$('#domicile').val(data.domicile);
		$('#proxyName').val(data.proxyName);
		$('#proxyIdCard').val(data.proxyIdCard);
		$('input[value=' + data.proxyType + ']').attr('checked', 'checked');
		if(data.proxyName == '' || data.proxyName == undefined || data.proxyName == null) {
			$("#proxyName").attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$("input[name='proxyType']").attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$("#proxyIdCard").attr('disabled', 'disabled').css('cursor', 'not-allowed');
		} else {
			$("#proxyName").attr('disabled', 'disabled').css('cursor', 'not-allowed');
			$("#proxyIdCard").attr('disabled', 'disabled').css('cursor', 'not-allowed');
		}
		$('#caseNature').find("option[value = '" + data.caseNature + "']").attr("selected", "selected");
		$('#caseTitle').val(data.caseTitle);
		$('#caseReason').val(data.caseReason);
		$('#caseType').find("option[value = '" + data.caseType + "']").attr("selected", "selected");
		$('#hasMongol').find("option[value = '" + data.hasMongol + "']").attr("selected", "selected");
		$.each(fileList, function(i, el) {
			var fileName = el.split('/')[el.split('/').length - 1];
			console.log(request)
			switch(request.taskDefKey) {
				case 'aid_update':
					$('.layui-upload').css('display', 'inline-block').data('filelist', data.caseFile);
					if(el != "" && el != undefined && el != null) {
						var $listItem = $('<tr><td>' + fileName + '</td><td></td><td>已上传</td><td><button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button></td></tr>');
						$('#demoList').append($listItem)
					}
					break;
				case 'adi_approve':
					$('.uploaded-list').show();
					var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
					$('.uploaded-list').append($listItem)
					break;
				case 'aid_start':
					console.log('in')
					$('.layui-upload').css('display', 'inline-block').data('filelist', data.caseFile);
					if(el != "" && el != undefined && el != null) {
						console.log(el)
						var $listItem = $('<tr><td>' + fileName + '</td><td></td><td>已上传</td><td><button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button></td></tr>');
						$('#demoList').append($listItem)
					}
					break;
				default:
					$('.uploaded-list').show();
					var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
					$('.uploaded-list').append($listItem)
					break;
			}
		})
		if(ifOnlyView) {
			$('#lawOffice').append($("<option id = '" + data.lawOffice.id + "' selected='selected'>" + data.lawOffice.name + '</option>'));
			$('#lawyer').append($("<option id = '" + data.lawyer.id + "' selected='selected'>" + data.lawyer.name + '</option>'));
			$('#serviceDB').append($("<option id = '" + data.legalOffice.id + "' selected='selected'>" + data.legalOffice.name + '</option>'));
			$('#servicePerson').append($("<option id = '" + data.legalPerson.id + "' selected='selected'>" + data.legalPerson.name + '</option>'));
		}
	} else {
		return
	}
}
//获取地区
function getArea() {
	$.getArea('', function(areaList) {
		//地区
		$.each(areaList, function(index, val) {
			$opt = $('<option id="' + val.id + '">' + val.name + '</option>')
			$('#area').append($opt);
		})
	})
}
//选择 律所 律师 基层
function getLawyerStation(res) {
	console.log(res)
	var areaId = res.area.id;
	if(res.caseType == '1' || res.caseType == '4') {
		renderlawyer(areaId)
		$('#serviceDB').attr('disabled', 'disabled').css('cursor', 'not-allowed');
		$('#servicePerson').attr('disabled', 'disabled').css('cursor', 'not-allowed');
	} else {
		renderlawyer(areaId)
		renderBasicLevel(areaId)
	}

	function renderlawyer(areaId) {
		var LawyerList;
		var lawyerChildList;
		$.loadData('/api/100/530/50', '{"type":"1","id":"","areaId":"' + areaId + '"}', function(data) {
			console.log(data)
			$('#lawyer').find('option').remove()
			LawyerList = data.body;
			$('#lawOffice').append($('<option id="" selected="selected" ></option>'));
			$('#lawyer').append($('<option id="" selected="selected"></option>'));
			$.each(data.body, function(i, el) {
				var $opt = $('<option id=' + el.id + '>' + el.name + '</option>');
				$('#lawOffice').append($opt);
			})
			var pId = $('#lawOffice').find('option:selected').attr('id');
			$.each(LawyerList, function(i, el) {
				if(el.id == pId) {
					lawyerChildList = el.users;
					$.each(lawyerChildList, function(i, el) {
						var $opt = $('<option id=' + el.id + '>' + el.name + '</option>');
						$('#lawyer').append($opt);
					})
				}
			})
			$('#lawOffice').change(function() {
				$('#lawyer').find('option').remove()
				var pId = $(this).find('option:selected').attr('id');
				$.each(LawyerList, function(i, el) {
					if(el.id == pId) {
						if(el.users != '' && el.users != undefined && el.users != null) {
							lawyerChildList = el.users;
							$('#lawyer').append($('<option id=""></option>'));
							$.each(lawyerChildList, function(i, el) {
								var $opt = $('<option id=' + el.id + '>' + el.name + '</option>');
								$('#lawyer').append($opt);
							})
						}
					}
				})
				$('#serviceDB').val('')
				$('#servicePerson').val('')
			})
		}, true)
	}

	function renderBasicLevel(areaId) {
		//获取基层法律服务所
		var BasicList;
		var BasicChildList;
		$.loadData('/api/100/530/60', '{"type":"1","id":"","areaId":"' + areaId + '"}', function(data) {
			BasicList = data.body;
			$('#serviceDB').append($('<option id=""></option>'));
			$.each(data.body, function(i, el) {
				var $opt = $('<option id=' + el.id + '>' + el.name + '</option>');
				$('#serviceDB').append($opt)
			})
			var pId = $('#serviceDB').find('option:selected').attr('id');
			$.each(BasicList, function(i, el) {
				if(el.id == pId) {
					if(el.users != '' && el.users != undefined && el.users != null) {
						BasicChildList = el.users;
						$.each(lawyerChildList, function(i, el) {
							var $opt = $('<option id=' + el.id + '>' + el.name + '</option>');
							$('#servicePerson').append($opt);
						})
					}
				}
			})
			$('#serviceDB').change(function() {
				$('#servicePerson').find('option').remove()
				var pId = $(this).find('option:selected').attr('id');
				$.each(BasicList, function(i, el) {
					if(el.id == pId) {
						BasicChildList = el.users;
						$('#servicePerson').append($('<option id=""></option>'));
						$.each(BasicChildList, function(i, el) {
							var $opt = $('<option id=' + el.id + '>' + el.name + '</option>');
							$('#servicePerson').append($opt);
						})
					}
				})
				$('#lawOffice').val('')
				$('#lawyer').val('')
			})
		}, true)
	}
}
//获取类型
function getCaseType() {
	//案件类型
	$.getCascadeDic('oa_case_classify', 'legal_aid', function(data) {
		var caseTypeList = data.body;
		$.each(caseTypeList, function(index, val) {
			$opt = $('<option id="' + val.value + '" value="' + val.value + '" >' + val.label + '</option>')
			$('#caseType').append($opt)
		})
	})
	//民族
	$.getDataDic('ethnic', function(data) {
		var ethnicList = data.body;
		$.each(ethnicList, function(index, val) {
			$opt = $('<option id="' + val.value + '" value="' + val.value + '" >' + val.label + '</option>')
			$('#ethnic').append($opt)
		})
	})
	//所属类型
	$.getDataDic('legal_aid_category', function(data) {
		var ethnicList = data.body;
		$.each(ethnicList, function(index, val) {
			$opt = $('<option id="' + val.value + '" value="' + val.value + '" >' + val.label + '</option>')
			$('#aidCategory').append($opt)
		})
	})
	//案件性质
	$.getDataDic('case_nature', function(data) {
		var ethnicList = data.body;
		$.each(ethnicList, function(index, val) {
			$opt = $('<option id="' + val.value + '" value="' + val.value + '" >' + val.label + '</option>')
			$('#caseNature').append($opt)
		})
	})

}

function validateForm(request) {
	//附件上传
	var adrListStr = '';
	layui.use('upload', function() {
		var $ = layui.jquery,
			upload = layui.upload;
		//多文件列表示例
		var demoListView = $('#demoList'),
			uploadListIns = upload.render({
				elem: '#testList',
				url: SERVERPORT + '/api/100/700/20',
				accept: 'fileData',
				exts: 'jpg|png|gif|bmp|jpeg|doc|docx|xls|xlsx|pdf',
				multiple: true,
				auto: false,
				headers: {
					'tag': '100',
					"timestamp": new Date().getTime(),
					'token': $.cookie('token')
				},
				bindAction: '#testListAction',
				choose: function(obj) {
					var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
					//读取本地文件
					obj.preview(function(index, fileData, result) {
						var tr = $(['<tr id="upload-' + index + '">', '<td>' + fileData.name + '</td>', '<td>' + (fileData.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>', '<button class="layui-btn layui-btn-mini demo-reload layui-hide">重传</button>', '<button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button>', '</td>', '</tr>'].join(''));

						//单个重传
						tr.find('.demo-reload').on('click', function() {
							obj.upload(index, fileData);
						});

						//删除
						tr.find('.demo-delete').on('click', function() {
							delete files[index]; //删除对应的文件
							tr.remove();
							uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
						});

						demoListView.append(tr);
					});
				},
				done: function(res, index, upload) {
					console.log(res)
					if(res.status == 0) { //上传成功
						adrListStr += '|' + res.body
						var tr = demoListView.find('tr#upload-' + index),
							tds = tr.children();
						tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
						tds.eq(3).html(''); //清空操作
						return delete this.files[index]; //删除文件队列已经上传成功的文件
					}
					this.error(index, upload);
				},
				error: function(index, upload) {
					console.log(index)
					console.log(upload)
					var tr = demoListView.find('tr#upload-' + index),
						tds = tr.children();
					tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
					tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
				}
			});
	})
	//表单验证
	layui.use(['form', 'layer'], function() {
		var form = layui.form,
			layer = layui.layer;
		//自定义验证规则
		form.verify({
			proxyIdCard: function(value, item) {
				if($('#proxyName').val() != '' && $('#proxyName').val() != null && $('#proxyName').val() != undefined) {
					$('#proxyIdCard').attr('lay-verify', "proxyIdCard|identity")
					if($('#proxyIdCard').val() == '' || $('#proxyIdCard').val() == undefined || $('#proxyIdCard').val() == null) {
						return '代理人身份证不能为空';
					}
				}
			},
		});
		//监听提交
		form.on('submit(submitForm)', function(data) {
			console.log(data)
			var isSubmit = $(this).data('issubmit');
			console.log(isSubmit)
			var oldList = $('.layui-upload').data('filelist') == undefined ? '' : $('.layui-upload').data('filelist');
			adrListStr = oldList + adrListStr
			var businessId = request.businessId == undefined ? "" : request.businessId
			var params;
			var queryDefault = '{' +
				'"id":"' + businessId + '",' +
				'"isSubmit":"' + isSubmit + '",' +
				'"name":"' + $('#proposerName').val() + '",' +
				'"sex": "' + $('#sexy option:selected').val() + '",' +
				'"birthday": "' + $('#birth').val() + '",' +
				'"area": {"id": "' + $('#area option:selected').attr('id') + '","name": "' + $('#area option:selected').html() + '"},' +
				'"ethnic": "' + $('#ethnic').val() + '",' +
				'"hasMongol": "' + $('#hasMongol option:selected').val() + '",' +
				'"idCard": "' + $('#idCard').val() + '",' +
				'"domicile": "' + $('#domicile').val() + '",' +
				'"address": "' + $('#address').val() + '",' +
				'"postCode": "' + $('#postCode').val() + '",' +
				'"phone": "' + $('#phone').val() + '",' +
				'"aidCategory": "' + $('#aidCategory option:selected').val() + '",' +
				'"employer": "' + $('#employer').val() + '",' +
				'"proxyName": "' + $('#proxyName').val() + '",' +
				'"proxyType": "' + $("input[name='proxyType']:checked").length + '",' +
				'"proxyIdCard": "' + $('#proxyIdCard').val() + '",' +
				'"caseNature": "' + $('#caseNature option:selected').val() + '",' +
				'"caseTitle": "' + $('#caseTitle').val() + '",' +
				'"caseType": "' + $('#caseType option:selected').val() + '",' +
				'"caseReason": "' + $('#caseReason').val() + '",' +
				'"caseFile": "' + adrListStr + '"}';
			var changeQuery = '{"id":"' + businessId + '",' +
				'"isSubmit":"' + isSubmit + '",' +
				'"act": {' +
				'"procInsId": "' + request.procInsId + '",' +
				'"procDefId": "' + request.procDefId + '",' +
				'"procDefKey": "' + request.procDefKey + '",' +
				'"taskId": "' + request.taskId + '",' +
				'"taskName": "' + decodeURI(decodeURI(request.taskName)) + '",' +
				'"taskDefKey": "' + request.taskDefKey + '",' +
				'"flag": "yes"},' +
				'"name":"' + $('#proposerName').val() + '",' +
				'"sex": "' + $('#sexy option:selected').val() + '",' +
				'"birthday": "' + $('#birth').val() + '",' +
				'"area": {"id": "' + $('#area option:selected').attr('id') + '","name": "' + $('#area option:selected').html() + '"},' +
				'"ethnic": "' + $('#ethnic').val() + '",' +
				'"hasMongol": "' + $('#hasMongol option:selected').val() + '",' +
				'"idCard": "' + $('#idCard').val() + '",' +
				'"domicile": "' + $('#domicile').val() + '",' +
				'"address": "' + $('#address').val() + '",' +
				'"postCode": "' + $('#postCode').val() + '",' +
				'"phone": "' + $('#phone').val() + '",' +
				'"aidCategory": "' + $('#aidCategory option:selected').val() + '",' +
				'"employer": "' + $('#employer').val() + '",' +
				'"proxyName": "' + $('#proxyName').val() + '",' +
				'"proxyType": "' + $("input[name='proxyType']:checked").length + '",' +
				'"proxyIdCard": "' + $('#proxyIdCard').val() + '",' +
				'"caseNature": "' + $('#caseNature option:selected').val() + '",' +
				'"caseTitle": "' + $('#caseTitle').val() + '",' +
				'"caseType": "' + $('#caseType option:selected').val() + '",' +
				'"caseReason": "' + $('#caseReason').val() + '",' +
				'"caseFile": "' + adrListStr + '"}';
			var querySecStep =
				'{"id":"' + request.businessId + '",' +
				'"act": {' +
				'"procInsId": "' + request.procInsId + '",' +
				'"procDefId": "' + request.procDefId + '",' +
				'"procDefKey": "' + request.procDefKey + '",' +
				'"taskId": "' + request.taskId + '",' +
				'"taskName": "' + decodeURI(decodeURI(request.taskName)) + '",' +
				'"taskDefKey": "' + request.taskDefKey + '",' +
				'"flag": "yes"},' +
				'"lawOffice":{"id":"' + $('#lawOffice option:selected').attr('id') + '","name":"' + $('#lawOffice option:selected').html() + '"},' +
				'"lawyer":{"id":"' + $('#lawyer option:selected').attr('id') + '","name":"' + $('#lawyer option:selected').html() + '"},' +
				'"legalOffice":{"id":"","name":""},' +
				'"legalPerson":{"id":"","name":""}}'

			if(request.taskDefKey == undefined || request.taskDefKey == '' || request.taskDefKey == null) {
				params = queryDefault;
				$.loadData('/api/100/520/10', params, function(data) {
					console.log(data)
					if(data.status == 0) {
						$.notice('提交成功', 2000)
						setTimeout(function() {
							window.location.href = "personalcenter.html"
						}, 2000)
					} else {
						$.notice("错误：" + data.msg, 2000)
						console.log(data)
					}
				}, true)
			} else if(request.taskDefKey == 'aid_update') {
				params = changeQuery;
				$.loadData('/api/100/520/20', params, function(data) {
					console.log(data)
					if(data.status == 0) {
						$.notice('提交成功', 2000)
						setTimeout(function() {
							window.location.href = "personalcenter.html"
						}, 2000)
					} else {
						$.notice("错误：" + data.msg, 2000)
					}
				}, true)
			} else if(request.taskDefKey == 'aid_start') {
				params = queryDefault;
				$.loadData('/api/100/520/10', params, function(data) {
					console.log(data)
					if(data.status == 0) {
						$.notice('提交成功', 2000)
						setTimeout(function() {
							window.location.href = "personalcenter.html"
						}, 2000)
					} else {
						$.notice("错误：" + data.msg, 2000)
					}
				}, true)
			} else {
				params = querySecStep;
				$.loadData('/api/100/520/20', params, function(data) {
					console.log(data)
					if(data.status == 0) {
						$.notice('提交成功', 2000)
						setTimeout(function() {
							window.location.href = "personalcenter.html"
						}, 2000)
					} else {
						$.notice("错误：" + data.msg, 2000)
					}
				}, true)
			}
			return false

		});
	});
	//回车键触发提交
	$("button").keydown(function(event) {
		if(event.keyCode == 13) {
			return false
		}
	})
}