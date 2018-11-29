$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	var topRequest = top.$.GetRequest()
	ininForm(request, topRequest);
	$('#right-fixed-nav').remove();
})
//初始化表单 是否可编辑
function ininForm(request, topRequest) {
	if(request.status == 1) {
		console.log(request.taskDefKey)
		switch(request.taskDefKey) {
			case 'mediation_xiugai':
				getCaseType();
				getAreaTown();
				$.renderTime('accuserBirthday');
				$.renderTime('defendantBirthday');
				$btnList = $('<button id="submitForm" data-issubmit="1" lay-submit lay-filter="submitForm">确认修改</button>');
				$('.btn-list').append($btnList)
				getCaseInfo(request)
				bindSubmitForm(request, topRequest);
				break;
			case 'mediation_shenhe':
				getCaseType();
				getAreaTown();
				$('body').find('input').attr('readonly', 'readonly')
				$('body').find('textarea').attr('readonly', 'readonly')
				$('body').find('select').attr('disabled', 'disabled')
				$('.search-select').unbind('click').attr('disabled', 'disabled')
				$('#testList').remove();
				$('#testListAction').remove();
				getCaseInfo(request);
				break;
			case 'mediation_start':
				getCaseType();
				$.renderTime('accuserBirthday');
				$.renderTime('defendantBirthday');
				$btnList = $('<button id="save" data-issubmit="0" lay-submit lay-filter="submitForm">暂时保存</button> ' +
					'<button id="submitForm" data-issubmit="1" lay-submit lay-filter="submitForm"">提交申请</button>');
				$('.btn-list').append($btnList)
				if(request.businessId != '' && request.businessId != 'undefined' && request.businessId != null) {
					getAreaTown();
					getCaseInfo(request);
				} else {
					renderUserInfo()
				}
				bindSubmitForm(request, topRequest);
				break;
			case 'mediation_zhiding':
				getCaseType();
				getAreaTown();
				$('body').find('input').attr('readonly', 'readonly')
				$('body').find('textarea').attr('readonly', 'readonly')
				$('body').find('select').attr('disabled', 'disabled')
				$('.search-select').unbind('click').attr('disabled', 'disabled')
				$('#testList').remove();
				$('#testListAction').remove();
				getCaseInfo(request);
				break;
			default:
				$.loadData('/api/100/400/50', '', function(data) {
					console.log(data)
					$('#accuserName').val(data.body.realname)
					$('#accuserBirthday').val(data.body.birthday)
					$('#accuserPhone').val(data.body.mobile)
					getAreaTown(data.body.area.id, data.body.townarea.id);
				})
				getCaseType();
				$.renderTime('accuserBirthday');
				$.renderTime('defendantBirthday');
				$btnList = $('<button id="save" data-issubmit="0" lay-submit lay-filter="submitForm">暂时保存</button> ' +
					' <button id="submitForm" data-issubmit="1" lay-submit lay-filter="submitForm">提交申请</button>');
				$('.btn-list').append($btnList)
				$('.layui-upload').css('display', 'inline-block');
				bindSubmitForm(request, topRequest);
				break;
		}
	} else if(request.status == 2) {
		getCaseType();
		getAreaTown();
		$('body').find('input').attr('readonly', 'readonly')
		$('body').find('textarea').attr('readonly', 'readonly')
		$('body').find('select').attr('disabled', 'disabled')
		$('.search-select').unbind('click').attr('disabled', 'disabled')
		$('#testList').remove();
		$('#testListAction').remove();
		getCaseInfo(request);
	}
}
//渲染用户基础数据
function renderUserInfo() {
	$.loadData('/api/100/400/50', '', function(data) {
		console.log(data)
		$('#accuserName').val(data.body.realname).attr('disabled', 'disabled').css('cursor', 'not-allowed');
		$('#accuserBirthday').val(data.body.birthday)
		$('#accuserPhone').val(data.body.mobile).attr('disabled', 'disabled').css('cursor', 'not-allowed');
		$('#accuserIdcard').val(data.body.papernum).attr('disabled', 'disabled').css('cursor', 'not-allowed');
		getAreaTown(data.body.area.id, data.body.townarea.id);
	}, true, true)
}
//渲染表单
function renderTabelForm(req, taskDefKey, status, request) {
	console.log(req)
	var fileList = req.caseFile.substring(1, req.caseFile.length).split('|');
	$('#accuserName').val(req.accuserName);
	$('#accuserIdcard').val(req.accuserIdcard);
	$('#accuserSex').find("option[value = '" + req.accuserSex + "']").attr("selected", "selected");
	$('#accuserBirthday').val(req.accuserBirthday);
	$('#accuserEthnic').find("option[value = '" + req.accuserEthnic + "']").attr("selected", "selected");
	$('#accuserCounty').find("option[value = '" + req.accuserCounty.id + "']").attr("selected", "selected");
	$.getArea(req.accuserCounty.id, function(areaList) {
		$.each(areaList, function(i, val) {
			$opt = $('<option value="' + val.id + '">' + val.name + '</option>')
			$('#accuserTown').append($opt);
		});
	}, false)
	$('#accuserTown').find("option[value = '" + req.accuserTown.id + "']").attr("selected", "selected");
	$('#accuserOccupation').val(req.accuserOccupation);
	$('#accuserDomicile').val(req.accuserDomicile);
	$('#accuserAddress').val(req.accuserAddress);
	$('#accuserPostCode').val(req.accuserPostCode);
	$('#accuserPhone').val(req.accuserPhone);
	$('#defendantName').val(req.defendantName);
	$('#defendantIdcard').val(req.defendantIdcard);
	$('#defendantSex').find("option[value = '" + req.defendantSex + "']").attr("selected", "selected");
	$('#defendantBirthday').val(req.defendantBirthday);
	$('#defendantEthnic').find("option[value = '" + req.defendantEthnic + "']").attr("selected", "selected");
	$('#defendantCounty').find("option[value = '" + req.defendantCounty.id + "']").attr("selected", "selected");
	$.getArea(req.defendantCounty.id, function(areaList) {
		$.each(areaList, function(i, val) {
			$opt = $('<option value="' + val.id + '">' + val.name + '</option>')
			$('#defendantTown').append($opt);
		});
	}, false)
	$('#defendantTown').find("option[value = '" + req.defendantTown.id + "']").attr("selected", "selected");
	$('#defendantOccupation').val(req.defendantOccupation);
	$('#defendantDomicile').val(req.defendantDomicile);
	$('#defendantAddress').val(req.defendantAddress);
	$('#defendantPostCode').val(req.defendantPostCode);
	$('#defendantPhone').val(req.defendantPhone);
	$('#mediator').data('id', req.mediator.id).val(req.mediator.name);
	$('#peopleMediationCommittee').data('id', req.peopleMediationCommittee.id).val(req.peopleMediationCommittee.name);
	$('#caseTitle').val(req.caseTitle);
	$('#caseSituation').val(req.caseSituation);
	$('#caseType').find("option[value = '" + req.caseType + "']").attr("selected", "selected");
	$('#caseCounty').find("option[value = '" + req.caseCounty.id + "']").attr("selected", "selected");
	$.getArea(req.caseCounty.id, function(areaList) {
		$.each(areaList, function(i, val) {
			$opt = $('<option value="' + val.id + '">' + val.name + '</option>')
			$('#caseTown').append($opt);
		});
	}, false)
	$('#caseTown').find("option[value = '" + req.caseTown.id + "']").attr("selected", "selected");
	$.each(fileList, function(i, el) {
		var fileName = el.split('/')[el.split('/').length - 1];
		switch(taskDefKey) {
			case 'mediation_xiugai':
				$('.layui-upload').css('display', 'inline-block').data('filelist', req.caseFile);;
				if(el != "" && el != undefined && el != null) {
					var $listItem = $('<tr><td>' + fileName + '</td><td></td><td>已上传</td><td><button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button></td></tr>');
					$('#demoList').append($listItem)
				}
				break;
			case 'mediation_zhiding':
				$('.uploaded-list').show();
				var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
				$('.uploaded-list').append($listItem)
				break;
			case 'mediation_shenhe':
				$('.uploaded-list').show();
				var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
				$('.uploaded-list').append($listItem)
				break;
			case 'mediation_start':
				if(request.businessId != '' && request.businessId != undefined && request.businessId != null) {
					if(status == 2) {
						$('.uploaded-list').show();
						var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
						$('.uploaded-list').append($listItem)
					} else if(status == 1) {
						$('.layui-upload').css('display', 'inline-block').data('filelist', req.caseFile);;
						if(el != "" && el != undefined && el != null) {
							var $listItem = $('<tr><td>' + fileName + '</td><td></td><td>已上传</td><td><button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button></td></tr>');
							$('#demoList').append($listItem)
						}
					} else {
						$('.layui-upload').css('display', 'inline-block');
					}
				} else {
					$('.layui-upload').css('display', 'inline-block');
				}
				break;
			default:
				if(status == 2) {
					$('.uploaded-list').show();
					var $listItem = $('<p><a href="' + SERVERFILEPORT + el + '" target="_blank">' + fileName + '</a></p>');
					$('.uploaded-list').append($listItem)
				} else if(status == 1) {
					$('.layui-upload').css('display', 'none');
				} else {
					$('.layui-upload').css('display', 'inline-block');
				}
				break;
		}
	})
	$.calcParentIframeHeight();
}
//获取已有表单信息
function getCaseInfo(request) {
	console.log(request)
	if(request.procInsId != "undefined" && request.procInsId != null && request.procInsId != '') {
		$.loadData('/api/100/540/40', '{' +
			'"procInsId":"' + request.procInsId + '",' +
			'"procDefId":"' + request.procDefId + '",' +
			'"procDefKey":"' + request.procDefKey + '",' +
			'"taskId":"' + request.taskId + '",' +
			'"taskName":"' + encodeURI(encodeURI(request.taskName)) + '",' +
			'"taskDefKey":"' + request.taskDefKey + '"' +
			'}',
			function(data) {
				renderTabelForm(data.body.businessData, data.body.taskDefKey, request.status, request)
			}, true, true)
	} else {
		$.loadData('/api/100/540/90', '{' +
			'"id":"' + request.businessId + '",' +
			'"procDefKey":"' + request.procDefKey + '"' +
			'}',
			function(data) {
				console.log(data)
				var data = data.body.list[0];
				renderTabelForm(data, 'mediation_start', 1, request)
			}, true, true)
	}
}
//获取民族/纠纷类型
function getCaseType() {
	$.getDataDic('ethnic', function(data) {
		var ethnicList = data.body;
		$.each(ethnicList, function(index, val) {
			$opt = $('<option id="' + val.value + '" value="' + val.value + '" >' + val.label + '</option>')
			$('.ethnic').append($opt)
		})
	})
	$.getCascadeDic('oa_case_classify','people_mediation', function(data) {
		var typeList = data.body;
		$.each(typeList, function(index, val) {
			$opt = $('<option id="' + val.value + '" value="' + val.value + '" >' + val.label + '</option>')
			$('#caseType').append($opt)
		})
	})
}
//获取地区乡镇
function getAreaTown(areaId, townId) {
	$.getArea('', function(areaList) {
		//初始化渲染全部地区乡镇
		$('.area').find('option').remove();
		$('.town').find('option').remove();
		//地区
		$.each(areaList, function(index, val) {
			$opt = $('<option value="' + val.id + '">' + val.name + '</option>')
			$('.area').append($opt);
		})
		//乡镇
		var secId = $('.area').find("option:selected").val();
		console.log(secId)
		$.getArea(secId, function(areaList) {
			console.log(areaList)
			$.each(areaList, function(index, val) {
				$townOpt = $('<option value="' + val.id + '">' + val.name + '</option>');
				$('.area').parent().siblings('td').find('.town').append($townOpt);
			})
		}, false)
		//初始化用户信息
		if(areaId != '' && areaId != 'undefined' && areaId != null) {
			$('#accuserCounty').find('option[value="' + areaId + '"]').attr("selected", "selected");
			$.getArea(areaId, function(areaList) {
				$('#accuserTown').find('option').remove();
				$.each(areaList, function(index, val) {
					$townOpt = $('<option value="' + val.id + '">' + val.name + '</option>');
					$('#accuserTown').append($townOpt);
				})
				var townID = $('#caseTown').val();
				getCommitteeMediator(townID)
			}, false)
			$('#accuserTown').find('option[value="' + townId + '"]').attr("selected", "selected");
		}
		//地区改变
		$('.area').bind('change', function() {
			var $siblingTown = $(this).parent().siblings('td').find('.town');
			$siblingTown.find('option').remove();
			var parentId = $(this).find("option:selected").val();
			$.getArea(parentId, function(areaList) {
				$.each(areaList, function(index, val) {
					$townOpt = $('<option value="' + val.id + '">' + val.name + '</option>');
					$siblingTown.append($townOpt);
				})
			})

		})
		//案发地区改变
		$('#caseCounty').bind('change', function() {
			var $siblingTown = $(this).parent().siblings('td').find('.town');
			$siblingTown.find('option').remove();
			var parentId = $(this).find("option:selected").val();
			$.getArea(parentId, function(areaList) {
				$.each(areaList, function(index, val) {
					if(index=0){
						townID=val.id
					}
					$townOpt = $('<option value="' + val.id + '">' + val.name + '</option>');
					$siblingTown.append($townOpt);
				})
				var townID = $('#caseTown').val();
				getCommitteeMediator(townID)
			})
		})
		//案发地区乡镇改变
		$('#caseTown').bind('change', function() {
			var townID = $('#caseTown').val();
			getCommitteeMediator(townID)
		})
	}, false)
}

//获取人民调解委员会 人民调解员
function getCommitteeMediator(areaId) {
	//调委会
	$('#peopleMediationCommittee').val('');
	$('#mediator').val('');
	$('#peopleMediationCommitteeList').find('li').remove();
	$('#mediatorList').find('li').remove();
	//	console.log('{"categoryId":"10","pageNo":"1","pageSize":"2000","name":"", "areaId":"' + areaId + '","isEvaluate":"false"}')
	$.loadData('/api/100/500/20', '{"categoryId":"10","pageNo":"1","pageSize":"9999","name":"", "areaId":"' + areaId + '","isEvaluate":"false"}', function(data) {
		console.log(data)
		var committeeList = data.body.list;
		if(committeeList != '' && committeeList != undefined && committeeList != null) {
			$.each(committeeList, function(i, el) {
				$li = $('<li id="' + el.agencyId + '" title="'+el.agencyName+'">' + el.agencyName + '</li>')
				$('#peopleMediationCommitteeList').append($li)
			});
			console.log('调委会:'+new Date())
			$('.twh').bindSelectSearch('peopleMediationCommittee', 'peopleMediationCommitteeList', function() {
				//民调人员
				$.loadData('/api/100/530/100', '{"id":"' + $('#peopleMediationCommittee').data('id') + '"}', function(data) {
					console.log('调解员:'+new Date())
					$('#mediator').val('')
					$('#mediatorList').find('li').remove()
					var mediatorList = data.body;
					if(mediatorList != '' && mediatorList != undefined && mediatorList != null) {
						$.each(mediatorList, function(i, el) {
							$li = $('<li id="' + el.id + '">' + el.name + '</li>')
							$('#mediatorList').append($li)
						});
						$('.tjy').bindSelectSearch('mediator', 'mediatorList', function() {})
					} else {
						$('#mediator').val('该地区暂无人民调解员').data('id', "")
					}
				}, true)
			})
		} else {
			$('#peopleMediationCommittee').val('该地区暂无人民调解委员会').data('id', "")
			$('#mediator').val('该地区暂无人民调解员').data('id', "")
		}
	}, true, false)
}
//提交表单数据
function bindSubmitForm(request, topRequest) {
	var adrListStr = '';
	var queryDefault = '';
	var params = "";
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
						$.calcParentIframeHeight()
					});
				},
				done: function(res, index, upload) {
					//					console.log(res)
					if(res.status == 0) { //上传成功
						adrListStr += '|' + res.body;
						var tr = demoListView.find('tr#upload-' + index),
							tds = tr.children();
						tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
						return delete this.files[index]; //删除文件队列已经上传成功的文件
					}
					this.error(index, upload);

				},
				error: function(index, upload) {
					var tr = demoListView.find('tr#upload-' + index),
						tds = tr.children();
					tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
					tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
				}
			});
	})
	layui.use(['form', 'layer'], function() {
		var form = layui.form,
			layer = layui.layer;
		//自定义验证规则
		form.verify({});
		form.on('submit(submitForm)', function(data) {
			var isSubmit = $(this).data('issubmit');
			if(isSubmit == '1') {
				//提交人民调解
				var params;
				var oldList = $('.layui-upload').data('filelist') == undefined ? '' : $('.layui-upload').data('filelist');
				adrListStr = oldList + adrListStr
				var mediator = $('#mediator').data('id') == undefined ? '' : $('#mediator').data('id');
				var peopleMediationCommittee = $('#peopleMediationCommittee').data('id') == undefined ? '' : $('#peopleMediationCommittee').data('id');
				switch(request.taskDefKey) {
					case 'mediation_xiugai':
						params =
							'{"act":{' +
							'"procInsId":"' + request.procInsId + '",' +
							'"procDefId":"' + request.procDefId + '",' +
							'"procDefKey":"' + request.procDefKey + '",' +
							'"taskId":"' + topRequest.taskId + '",' +
							'"taskName":"' + decodeURI(decodeURI(decodeURI(request.taskName))) + '",' +
							'"taskDefKey":"' + request.taskDefKey + '",' +
							'"flag":"yes"' +
							'},' +
							'"id":"' + request.businessId + '",' +
							'"accuserName": "' + $('#accuserName').val() + '",' +
							'"accuserIdcard": "' + $('#accuserIdcard').val() + '",' +
							'"accuserSex": "' + $('#accuserSex option:selected').val() + '",' +
							'"accuserBirthday": "' + $('#accuserBirthday').val() + '",' +
							'"accuserEthnic": "' + $('#accuserEthnic option:selected').val() + '",' +
							'"accuserCounty": {' +
							'"id": "' + $('#accuserCounty option:selected').val() + '",' +
							'"name": "' + $('#accuserCounty option:selected').html() + '"' +
							'},' +
							'"accuserTown": {' +
							'"id": "' + $('#accuserTown option:selected').val() + '",' +
							'"name": "' + $('#accuserTown option:selected').html() + '"' +
							'},' +
							'"accuserOccupation": "' + $('#accuserOccupation').val() + '",' +
							'"accuserDomicile": "' + $('#accuserDomicile').val() + '",' +
							'"accuserAddress": "' + $('#accuserAddress').val() + '",' +
							'"accuserPostCode": "' + $('#accuserPostCode').val() + '",' +
							'"accuserPhone": "' + $('#accuserPhone').val() + '",' +
							'"defendantName": "' + $('#defendantName').val() + '",' +
							'"defendantIdcard": "' + $('#defendantIdcard').val() + '",' +
							'"defendantSex": "' + $('#defendantSex option:selected').val() + '",' +
							'"defendantBirthday": "' + $('#defendantBirthday').val() + '",' +
							'"defendantEthnic": "' + $('#defendantEthnic option:selected').val() + '",' +
							'"defendantCounty": {' +
							'"id": "' + $('#defendantCounty option:selected').val() + '",' +
							'"name": "' + $('#defendantCounty option:selected').html() + '"' +
							'},' +
							'"defendantTown": {' +
							'"id": "' + $('#defendantTown option:selected').val() + '",' +
							'"name": "' + $('#defendantTown option:selected').html() + '"' +
							'},' +
							'"defendantOccupation": "' + $('#defendantOccupation').val() + '",' +
							'"defendantDomicile": "' + $('#defendantDomicile').val() + '",' +
							'"defendantAddress": "' + $('#defendantAddress').val() + '",' +
							'"defendantPostCode": "' + $('#defendantPostCode').val() + '",' +
							'"defendantPhone": "' + $('#defendantPhone').val() + '",' +
							'"mediator": {' +
							'"id": "' + mediator + '"' +
							'},' +
							'"peopleMediationCommittee": {' +
							'"id": "' + peopleMediationCommittee + '"' +
							'},' +
							'"caseTitle": "' + $('#caseTitle').val() + '",' +
							'"caseSituation": "' + $('#caseSituation').val() + '",' +
							'"caseFile": "' + adrListStr + '",' +
							'"caseType": "' + $('#caseType option:selected').val() + '",' +
							'"caseTypeDesc": "' + $('#caseType option:selected').html() + '",' +
							'"caseCounty":{' +
							'"id":"' + $('#caseCounty option:selected').val() + '",' +
							'"name":"' + $('#caseCounty option:selected').html() + '"' +
							'},' +
							'"caseTown":{' +
							'"id":"' + $('#caseTown option:selected').val() + '", ' +
							'"name":"' + $('#caseTown option:selected').html() + '"' +
							'}' +
							'}';
						$.loadData('/api/100/540/30', params, function(data) {
							if(data.status == 0) {
								top.$.notice('提交成功', 2000)
								setTimeout(function() {
									top.window.location.href = "personalcenter.html"
								}, 2000)
							} else {
								top.$.notice(data.msg, 2000)
							}
						}, true)
						break;
					default:
						params =
							'{"accuserName": "' + $('#accuserName').val() + '",' +
							'"accuserIdcard": "' + $('#accuserIdcard').val() + '",' +
							'"accuserSex": "' + $('#accuserSex option:selected').val() + '",' +
							'"accuserBirthday": "' + $('#accuserBirthday').val() + '",' +
							'"accuserEthnic": "' + $('#accuserEthnic option:selected').val() + '",' +
							'"accuserCounty": {' +
							'"id": "' + $('#accuserCounty option:selected').val() + '",' +
							'"name": "' + $('#accuserCounty option:selected').html() + '"' +
							'},' +
							'"accuserTown": {' +
							'"id": "' + $('#accuserTown option:selected').val() + '",' +
							'"name": "' + $('#accuserTown option:selected').html() + '"' +
							'},' +
							'"accuserOccupation": "' + $('#accuserOccupation').val() + '",' +
							'"accuserDomicile": "' + $('#accuserDomicile').val() + '",' +
							'"accuserAddress": "' + $('#accuserAddress').val() + '",' +
							'"accuserPostCode": "' + $('#accuserPostCode').val() + '",' +
							'"accuserPhone": "' + $('#accuserPhone').val() + '",' +
							'"defendantName": "' + $('#defendantName').val() + '",' +
							'"defendantIdcard": "' + $('#defendantIdcard').val() + '",' +
							'"defendantSex": "' + $('#defendantSex option:selected').val() + '",' +
							'"defendantBirthday": "' + $('#defendantBirthday').val() + '",' +
							'"defendantEthnic": "' + $('#defendantEthnic option:selected').val() + '",' +
							'"defendantCounty": {' +
							'"id": "' + $('#defendantCounty option:selected').val() + '",' +
							'"name": "' + $('#defendantCounty option:selected').html() + '"' +
							'},' +
							'"defendantTown": {' +
							'"id": "' + $('#defendantTown option:selected').val() + '",' +
							'"name": "' + $('#defendantTown option:selected').html() + '"' +
							'},' +
							'"defendantOccupation": "' + $('#defendantOccupation').val() + '",' +
							'"defendantDomicile": "' + $('#defendantDomicile').val() + '",' +
							'"defendantAddress": "' + $('#defendantAddress').val() + '",' +
							'"defendantPostCode": "' + $('#defendantPostCode').val() + '",' +
							'"defendantPhone": "' + $('#defendantPhone').val() + '",' +
							'"mediator": {' +
							'"id": "' + mediator + '"' +
							'},' +
							'"peopleMediationCommittee": {' +
							'"id": "' + peopleMediationCommittee + '"' +
							'},' +
							'"caseTitle": "' + $('#caseTitle').val() + '",' +
							'"caseSituation": "' + $('#caseSituation').val() + '",' +
							'"caseFile": "' + adrListStr + '",' +
							'"caseType": "' + $('#caseType option:selected').val() + '",' +
							'"caseTypeDesc": "' + $('#caseType option:selected').html() + '",' +
							'"caseCounty":{' +
							'"id":"' + $('#caseCounty option:selected').val() + '",' +
							'"name":"' + $('#caseCounty option:selected').html() + '"' +
							'},' +
							'"caseTown":{' +
							'"id":"' + $('#caseTown option:selected').val() + '", ' +
							'"name":"' + $('#caseTown option:selected').html() + '"' +
							'}' +
							'}';
						console.log(params)
						$.loadData('/api/100/540/20', params, function(data) {
							if(data.status == 0) {
								top.$.notice('提交成功', 2000)
								setTimeout(function() {
									top.window.location.href = "personalcenter.html"
								}, 2000)
							} else {
								top.$.notice(data.msg, 2000)
							}
						}, true)
						break;
				}
				return false;
			} else if(isSubmit == '0') {
				//保存人民调解
				var params;
				var oldList = $('.layui-upload').data('filelist') == undefined ? '' : $('.layui-upload').data('filelist');
				adrListStr = oldList + adrListStr
				var mediator = $('#mediator').data('id') == undefined ? '' : $('#mediator').data('id');
				var peopleMediationCommittee = $('#peopleMediationCommittee').data('id') == undefined ? '' : $('#peopleMediationCommittee').data('id');
				if(request.businessId != '' && request.businessId != 'null' && request.businessId != 'undefined') {
					params =
						'{"id":"' + request.businessId + '",' +
						'"accuserName": "' + $('#accuserName').val() + '",' +
						'"accuserIdcard": "' + $('#accuserIdcard').val() + '",' +
						'"accuserSex": "' + $('#accuserSex option:selected').val() + '",' +
						'"accuserBirthday": "' + $('#accuserBirthday').val() + '",' +
						'"accuserEthnic": "' + $('#accuserEthnic option:selected').val() + '",' +
						'"accuserCounty": {' +
						'"id": "' + $('#accuserCounty option:selected').val() + '",' +
						'"name": "' + $('#accuserCounty option:selected').html() + '"' +
						'},' +
						'"accuserTown": {' +
						'"id": "' + $('#accuserTown option:selected').val() + '",' +
						'"name": "' + $('#accuserTown option:selected').html() + '"' +
						'},' +
						'"accuserOccupation": "' + $('#accuserOccupation').val() + '",' +
						'"accuserDomicile": "' + $('#accuserDomicile').val() + '",' +
						'"accuserAddress": "' + $('#accuserAddress').val() + '",' +
						'"accuserPostCode": "' + $('#accuserPostCode').val() + '",' +
						'"accuserPhone": "' + $('#accuserPhone').val() + '",' +
						'"defendantName": "' + $('#defendantName').val() + '",' +
						'"defendantIdcard": "' + $('#defendantIdcard').val() + '",' +
						'"defendantSex": "' + $('#defendantSex option:selected').val() + '",' +
						'"defendantBirthday": "' + $('#defendantBirthday').val() + '",' +
						'"defendantEthnic": "' + $('#defendantEthnic option:selected').val() + '",' +
						'"defendantCounty": {' +
						'"id": "' + $('#defendantCounty option:selected').val() + '",' +
						'"name": "' + $('#defendantCounty option:selected').html() + '"' +
						'},' +
						'"defendantTown": {' +
						'"id": "' + $('#defendantTown option:selected').val() + '",' +
						'"name": "' + $('#defendantTown option:selected').html() + '"' +
						'},' +
						'"defendantOccupation": "' + $('#defendantOccupation').val() + '",' +
						'"defendantDomicile": "' + $('#defendantDomicile').val() + '",' +
						'"defendantAddress": "' + $('#defendantAddress').val() + '",' +
						'"defendantPostCode": "' + $('#defendantPostCode').val() + '",' +
						'"defendantPhone": "' + $('#defendantPhone').val() + '",' +
						'"mediator": {' +
						'"id": "' + mediator + '"' +
						'},' +
						'"peopleMediationCommittee": {' +
						'"id": "' + peopleMediationCommittee + '"' +
						'},' +
						'"caseTitle": "' + $('#caseTitle').val() + '",' +
						'"caseSituation": "' + $('#caseSituation').val() + '",' +
						'"caseFile": "' + adrListStr + '",' +
						'"caseType": "' + $('#caseType option:selected').val() + '",' +
						'"caseTypeDesc": "' + $('#caseType option:selected').html() + '",' +
						'"caseCounty":{' +
						'"id":"' + $('#caseCounty option:selected').val() + '",' +
						'"name":"' + $('#caseCounty option:selected').html() + '"' +
						'},' +
						'"caseTown":{' +
						'"id":"' + $('#caseTown option:selected').val() + '", ' +
						'"name":"' + $('#caseTown option:selected').html() + '"' +
						'}' +
						'}';
				} else {
					params =
						'{"accuserName": "' + $('#accuserName').val() + '",' +
						'"accuserIdcard": "' + $('#accuserIdcard').val() + '",' +
						'"accuserSex": "' + $('#accuserSex option:selected').val() + '",' +
						'"accuserBirthday": "' + $('#accuserBirthday').val() + '",' +
						'"accuserEthnic": "' + $('#accuserEthnic option:selected').val() + '",' +
						'"accuserCounty": {' +
						'"id": "' + $('#accuserCounty option:selected').val() + '",' +
						'"name": "' + $('#accuserCounty option:selected').html() + '"' +
						'},' +
						'"accuserTown": {' +
						'"id": "' + $('#accuserTown option:selected').val() + '",' +
						'"name": "' + $('#accuserTown option:selected').html() + '"' +
						'},' +
						'"accuserOccupation": "' + $('#accuserOccupation').val() + '",' +
						'"accuserDomicile": "' + $('#accuserDomicile').val() + '",' +
						'"accuserAddress": "' + $('#accuserAddress').val() + '",' +
						'"accuserPostCode": "' + $('#accuserPostCode').val() + '",' +
						'"accuserPhone": "' + $('#accuserPhone').val() + '",' +
						'"defendantName": "' + $('#defendantName').val() + '",' +
						'"defendantIdcard": "' + $('#defendantIdcard').val() + '",' +
						'"defendantSex": "' + $('#defendantSex option:selected').val() + '",' +
						'"defendantBirthday": "' + $('#defendantBirthday').val() + '",' +
						'"defendantEthnic": "' + $('#defendantEthnic option:selected').val() + '",' +
						'"defendantCounty": {' +
						'"id": "' + $('#defendantCounty option:selected').val() + '",' +
						'"name": "' + $('#defendantCounty option:selected').html() + '"' +
						'},' +
						'"defendantTown": {' +
						'"id": "' + $('#defendantTown option:selected').val() + '",' +
						'"name": "' + $('#defendantTown option:selected').html() + '"' +
						'},' +
						'"defendantOccupation": "' + $('#defendantOccupation').val() + '",' +
						'"defendantDomicile": "' + $('#defendantDomicile').val() + '",' +
						'"defendantAddress": "' + $('#defendantAddress').val() + '",' +
						'"defendantPostCode": "' + $('#defendantPostCode').val() + '",' +
						'"defendantPhone": "' + $('#defendantPhone').val() + '",' +
						'"mediator": {' +
						'"id": "' + mediator + '"' +
						'},' +
						'"peopleMediationCommittee": {' +
						'"id": "' + peopleMediationCommittee + '"' +
						'},' +
						'"caseTitle": "' + $('#caseTitle').val() + '",' +
						'"caseSituation": "' + $('#caseSituation').val() + '",' +
						'"caseFile": "' + adrListStr + '",' +
						'"caseType": "' + $('#caseType option:selected').val() + '",' +
						'"caseTypeDesc": "' + $('#caseType option:selected').html() + '",' +
						'"caseCounty":{' +
						'"id":"' + $('#caseCounty option:selected').val() + '",' +
						'"name":"' + $('#caseCounty option:selected').html() + '"' +
						'},' +
						'"caseTown":{' +
						'"id":"' + $('#caseTown option:selected').val() + '", ' +
						'"name":"' + $('#caseTown option:selected').html() + '"' +
						'}' +
						'}';
				}
				console.log(params)
				$.loadData('/api/100/540/10', params, function(data) {
					if(data.status == 0) {
						top.$.notice('提交成功', 2000)
						setTimeout(function() {
							top.window.location.href = "personalcenter.html"
						}, 2000)
					} else {
						top.$.notice(data.msg, 2000)
					}
				}, true)
				return false;
			}

		})
	})
	//回车键触发提交
	$("button").keydown(function(event) {
		if(event.keyCode == 13) {
			return false
		}
	})
}