const SERVERPORT = 'http://123.178.194.50:9306/WisdomJustice';
const SERVERFILEPORT = 'http://123.178.194.50:9306';
const HOST = window.location.host;

//const SERVERFILEPORT = 'http://192.168.0.138:8080';
//const SERVERPORT = 'http://192.168.0.155:8080/SnowLeopard'

$(function() {
	Common.checkLoginStatus();
	Common.renderRightNavBar();
	Common.checkifIndex();
	$('#footer').load('footer.html');
})
$.extend({
	//读取数据
	loadData: function(apihost, params, callback, ifAsync, showLoading) {
		var token = $.cookie('token');
		console.log(token)
		var index;
		$.ajax({
			url: SERVERPORT + apihost,
			type: 'POST',
			async: ifAsync,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
				xhr.setRequestHeader("tag", "100");
				xhr.setRequestHeader("timestamp", new Date().getTime());
				if(token != undefined && token != null && token != '') {
					xhr.setRequestHeader("token", token);
				}
				if(showLoading) {
					top.layui.use('layer', function() {
						index = top.layer.open({
							title: false,
							type: '1',
							btn: false,
							shade: 0.1,
							shadeClose: false,
							skin: 'layer-own-loading',
							closeBtn: false,
							content: '<img src="img/loading400.gif" style="display:block;width:200px;height:200px;margin:0 auto;"/>'
						});
					})
				}
				//console.log(apihost + ':' + new Date())
			},
			data: {
				'query': params
			},
			success: function(data, status, xhr) {
				//console.log(apihost + ':' + new Date())
				if(showLoading) {
					top.layer.close(index)
				}
				callback(data, status, xhr);
			}
		})
	},
	//根据key获取字典值
	getDataDic: function(key, callback) {
		$.loadData('/api/100/510/10', '{"key":"' + key + '"}', function(data) {
			callback(data)
		}, true)
	},
	//根据字典type一级父级id获取二级字典值
	getCascadeDic: function(key, parentId, callback) {
		$.loadData('/api/100/510/20', '{"key":"' + key + '","parentId":"' + parentId + '"}', function(data) {
			callback(data)
		}, true)
	},
	//开启二级列表页面
	openSecPage: function(url, params, serverType) {
		var index = window.location.pathname.lastIndexOf('/')
		var localURL = window.location.pathname.substring(index + 1, window.location.pathname.length);
		var param = $.extend(true, {}, params);
		var host = window.location.host;
		console.log(params)
		if(param != '' && param != undefined && param != null) {
			var paramLink = '';
			$.each(param, function(key, val) {
				paramLink += (key + '=' + val + '&')
			})
			paramLink = paramLink.substring(0, paramLink.lastIndexOf('&'));
			if(serverType == 4) {
				window.open(url + "?" + paramLink)
			} else {
				window.location.href = url + "?" + paramLink
			}
		}
		//		sessionStorage.setItem('params', JSON.stringify(params))
		//		if(serverType == 4) {
		//			window.open(url)
		//		} else {
		//			window.location.href = url
		//		}
	},
	//渲染二级页面导航条
	getSecPageNav: function() {
		var navSession = sessionStorage.getItem('navList');
		if(navSession != null && navSession != '' && navSession != undefined) {
			var navList = JSON.parse(navSession);
			var request = $.GetRequest();
			$.each(navList, function(index, val) {
				var $li = $('<li data-href="' + val.link + '" id="' + val.id + '">' + val.name + '</li>');
				if(request.serviceId == val.id || request.pServiceId == val.id) {
					$li.addClass('active')
				} else {
					$li.removeClass('active')
				}
				$li.bind('click', function() {
					$.openSecPage($(this).data('href'), {
						'serviceId': $(this).attr('id'),
						'siteName': encodeURI(encodeURI($(this).html()))
					})
					if($(this).data('href') == '') {
						$.openSecPage('404build.html', {
							'serviceId': $(this).attr('id'),
							'siteName': encodeURI(encodeURI($(this).html()))
						})
					}
				})
				$('.nav-list').append($li)
			});
		} else {
			$.loadData('/api/100/8030/10', '', function(data) {
				var request = $.GetRequest();
				if(data.status == 0) {
					var list = data.body;
					sessionStorage.setItem('navList', JSON.stringify(list))
					$.each(list, function(index, val) {
						var $li = $('<li data-href="' + val.link + '" id="' + val.id /*+ '" data-siteid="' + val.siteId + '" data-officeid="' + val.officeId*/ + '">' + val.name + '</li>');
						if(request.serviceId == val.id || request.pServiceId == val.id) {
							$li.addClass('active')
						} else {
							$li.removeClass('active')
						}
						$li.bind('click', function() {
							$.openSecPage($(this).data('href'), {
								'serviceId': $(this).attr('id'),
								'siteName': encodeURI(encodeURI($(this).html()))
							})
							if($(this).data('href') == '') {
								$.openSecPage('404build.html', {
									'serviceId': $(this).attr('id'),
									'siteName': encodeURI(encodeURI($(this).html()))
								})
							}
						})
						$('.nav-list').append($li)
					});
				} else {
					console.log(data.msg)
				}
			}, true)
		}

	},
	//获取URL参数
	GetRequest: function() {
		var url = location.search; //获取url中"?"符后的字串   
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substring(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		//		var session = sessionStorage.getItem('params')
		//		var theRequest = JSON.parse(session)
		return theRequest;
	},
	//检测登录状态 返回true false
	checkLoginStatus: function() {
		var loginStatus;
		$.loadData('/api/100/400/50', '', function(data) {
			//console.log(data)
			if(data.status == 0) {
				loginStatus = true;
			} else if(data.status == 403000) {
				loginStatus = false;
			}
		}, false)
		//console.log(loginStatus)
		return loginStatus
	},
	//根据文本长度，显示...
	calcTextLength: function(text, sublen) {
		var byteLen = 0,
			newText = '',
			len = text.length;
		if(!text) return 0;
		for(var i = 0; i < len; i++) {
			byteLen += text.charCodeAt(i) > 255 ? 2 : 1;
		}
		if(byteLen > sublen) {
			newText = text.substring(0, sublen / 2) + '...';
		} else {
			newText = text;
		}
		return newText
	},
	//加载时间控件
	renderTime: function(id) {
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			laydate.render({
				elem: '#' + id
			});
		});
	},
	//渲染盟内地区
	getArea: function(parentId, callback, ifanysc) {
		var ifanysc = ifanysc == undefined ? true : ifanysc;
		$.loadData('/api/100/500/40', '{"parentId":"' + parentId + '"}', function(data) {
			var areaList = data.body;
			callback(areaList)
		}, ifanysc, false)
	},
	//检测元素属性是否存在 返回属性值或空
	checkElValue: function(el, elattr) {
		var returnValue = "";
		returnValue = el.attr(elattr) == undefined || el.attr(elattr) == '' || el.attr(elattr) == null ? "" : el.attr(elattr);
		return returnValue;
	},
	//动态计算Iframe高度
	calcIframeHeight: function() {
		$('#iframe').load(function() {
			var iframeBodyHeight = $('#iframe').contents().find('body').find('.apply-form').height();
			$('#iframe').css('height', iframeBodyHeight + 100)
		})
	},
	//子页面高度改变计算父元素高度
	calcParentIframeHeight: function() {
		var childFormHeight = $('body').find('.apply-form').height();
		console.log(childFormHeight)
		$('#iframe', parent.document).css('height', childFormHeight + 100)
	},
	//加载图片错误
	userNotFind: function() {
		var img = event.srcElement;
		img.src = "img/mediation/mrry.jpg";
		img.onerror = null;
	},
	organNotFind: function() {
		var img = event.srcElement;
		img.src = "img/mediation/mrjg.jpg";
		img.onerror = null;
	},
	//半透明提示框
	notice: function(msg, time) {
		layui.use('layer', function() {
			var layer = layui.layer;
			layer.msg(msg, {
				time: time,
				area: '300px'
			});
		})
	},
	//点赞反赞功能
	giveThumbs: function(commentId, thumbsStatus, callback) {
		var status = $.checkLoginStatus();
		if(status) {
			//console.log('{"commentId":"' + commentId + '","thumbsUp":"' + thumbsStatus + '"}')
			$.loadData('/api/100/600/50', '{"commentId":"' + commentId + '","thumbsUp":"' + thumbsStatus + '"}', function(data) {
				//console.log(data)
				if(data.status == '0') {
					callback(data)
				} else {
					$.notice(data.msg, 2000)
				}
			})
		} else {
			$.notice('请登录后重试！')
		}
	},
})
$.fn.extend({
	//注册登录弹框
	alertLoginRegistPosition: function(elW, elH, showEl, submitFnc) {
		var $login = '<form class="alert-main login-main layui-form">' +
			'<div class="alert-head">' +
			'<div class="alert-title normal-user"></div>' +
			'<div class="close">x</div>' +
			'</div>' +
			'<div class="alert-body">' +
			'<ul class="login-form">' +
			'<li>' +
			'<div class="login-input">' +
			'<i><img src="img/userName.png"/></i>' +
			'<input type="text" id="login-name" lay-verify="required|phone" placeholder="请输入账号"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="login-input">' +
			'<i><img src="img/password.png"/></i>' +
			'<input type="password" id="login-password" lay-verify="required" placeholder="请输入密码"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="forget-password">' +
			'<a href="javascript:;">忘记密码</a>' +
			'</div>' +
			'</li>' +
			'</ul>' +
			'</div>' +
			'<div class="alert-footer">' +
			'<button class="submit-btn" id="loginBtn" lay-submit lay-filter="loginBtn">登录</button>' +
			'</div>' +
			'</form>';
		var $serviceLogin = '<form class="alert-main service-login-main layui-form">' +
			'<div class="alert-head">' +
			'<div class="alert-title service-user"></div>' +
			'<div class="close">x</div>' +
			'</div>' +
			'<div class="alert-body">' +
			'<ul class="login-form">' +
			'<li>' +
			'<div class="login-input">' +
			'<i><img src="img/userName.png"/></i>' +
			'<input type="text" id="login-name" lay-verify="required" placeholder="请输入账号"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="login-input">' +
			'<i><img src="img/password.png"/></i>' +
			'<input type="password" id="login-password" lay-verify="required" placeholder="请输入密码"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="forget-password">' +
			'<a href="javascript:;">忘记密码</a>' +
			'</div>' +
			'</li>' +
			'</ul>' +
			'</div>' +
			'<div class="alert-footer">' +
			'<button class="submit-btn" id="serviceLoginBtn" lay-submit lay-filter="serviceLoginBtn" >登录</button>' +
			'</div>' +
			'</form>';
		var $regist =
			'<form class="alert-main regist-main layui-form">' +
			'<div class="regist-left" >' +
			'<img src="img/regist-left.jpg"/>' +
			'</div>' +
			'<div class="regist-right">' +
			'<div class="regist-title">新用户注册<div class="close" style="float:right">x</div></div>' +
			'<ul class="regist-form">' +
			'<li>' +
			'<div class="regist-label">' +
			'<i><img src="img/red-star.png"/></i>' +
			'<span>真实姓名</span>' +
			'</div>' +
			'<div class="regist-input" >' +
			'<input type="text" id="real-name" lay-verify="required|name"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label">' +
			'<i><img src="img/red-star.png"/></i>' +
			'<span>身份证号</span>' +
			'</div>' +
			'<div class="regist-input" >' +
			'<input type="text" id="id-card" lay-verify="required|identity" />' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label" >' +
			'<i><img src="img/red-star.png"/></i>' +
			'<span>手机号</span>' +
			'</div>' +
			'<div class="regist-input" >' +
			'<input type="text" id="mobile" lay-verify="required|phone"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label" >' +
			'<i><img src="img/red-star.png"/></i>' +
			'<span>密码</span>' +
			'</div>' +
			'<div class="regist-input" >' +
			'<input type="password" id="password" lay-verify="required"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label" >' +
			'<i><img src="img/red-star.png"/></i>' +
			'<span>重复密码</span>' +
			'</div>' +
			'<div class="regist-input" >' +
			'<input type="password" id="re-password" lay-verify="required|repassword"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label">' +
			'<i><img src="img/red-star.png"/></i>' +
			'<span>验证码</span>' +
			'</div>' +
			'<div class="regist-input">' +
			'<input type="text" class="verification-code" id="verification-code" lay-verify="required"/>' +
			'<input type="button" class="getCode" value="获取验证码" />' +
			'<input type="hidden" name="smsToken" id="smsTokenR" />' +
			'</div>' +
			'</li>' +
			'</ul>' +
			'<button class="submit-btn regist-btn" id="registBtn" lay-submit lay-filter="registBtn">注    册</button>' +
			'</div>' +
			'</form>';
		var $forget = '<form class="alert-main forget-main layui-form">' +
			'<div class="alert-head">' +
			'<div class="alert-title">忘记密码</div>' +
			'<div class="close">x</div>' +
			'</div>' +
			'<div class="alert-overlay">' +
			'<div class="alert-body">' +
			'<ul class="forget-form">' +
			'<li>' +
			'<div class="regist-label">' +
			'<i>*</i>' +
			'<span>手机号码</span>' +
			'</div>' +
			'<div class="regist-input">' +
			'<input type="text" id="mobileF" lay-verify="required|phone"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label">' +
			'<i>*</i>' +
			'<span>验证码</span>' +
			'</div>' +
			'<div class="regist-input">' +
			'<input type="text" class="verification-code" id="verification-code" lay-verify="required" autocomplete="off"/>' +
			'<input type="button" class="getCode" value="免费获取验证码" />' +
			'<input type="hidden" name="smsToken" id="smsTokenF" />' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label">' +
			'<i>*</i>' +
			'<span>新密码</span>' +
			'</div>' +
			'<div class="regist-input">' +
			'<input type="password" id="pwd" lay-verify="required"/>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="regist-label">' +
			'<i>*</i>' +
			'<span>重复密码</span>' +
			'</div>' +
			'<div class="regist-input">' +
			'<input type="password" id="repwd" lay-verify="required|repassword"/>' +
			'</div>' +
			'</li>' +
			'</ul>' +
			'<button class="submit-btn forget-btn" lay-submit lay-filter="forgetBtn">提    交</button>' +
			'</div>' +
			'</form>';
		$(this).bind('click', function() {
			if($('.' + showEl + '-main').attr('display') == 'block') {
				return
			} else {
				$('.alert-main').remove()
			}
			if(showEl == 'login') {
				$('body').append($login)
				Common.closeLR();
				submitFnc()
				$('.forget-password').alertLoginRegistPosition(660, 280, 'forget', Common.ForgetForm)
			}
			if(showEl == 'regist') {
				$('body').append($regist)
				Common.closeLR();
				submitFnc();
				$('.regist-main').find('.getCode').bind('click', Common.getCode)
			}
			if(showEl == 'forget') {
				$('.login-main').remove();
				$('body').append($forget)
				Common.closeLR();
				$('.submit-btn').bind('click', submitFnc);
				$('.forget-main').find('.getCode').bind('click', Common.getCode)
			}
			if(showEl == 'service-login') {
				$('body').append($serviceLogin)
				Common.closeLR();
				submitFnc();
			}
			var w = document.documentElement.clientWidth || document.body.clientWidth;
			var h = document.documentElement.clientHeight || document.body.clientHeight;
			var left = (w - elW) / 2 + 'px';
			var top = (h - elH) / 2 + 'px';
			if((h - elH) <= 0) {
				top = '15px';
			}
			$('.' + showEl + '-main').show().css({
				'left': left,
				'top': top,
				'position': 'fixed'
			})
		})

	},
	//获取更多
	bindGetMore: function() {
		$(this).off().on('click', function() {
			$.openSecPage('indexList.html', {
				categoryType: $(this).attr('id'),
				sourceId: ''
			})
		})
	},
	//绑定搜索下拉框
	bindSelectSearch: function(inputId, listId, callback) {
		var _this = $(this);
		//隐藏下拉框
		$(document).click(function() {
			_this.find("ul").hide();
		});
		//筛选列表中内容
		$('#' + listId).delegate('li', 'mouseover mouseout', function(e) {
			$(this).toggleClass("on");
			e.stopPropagation();
		});

		$('#' + listId).delegate('li', 'click', function(e) {
			e.stopPropagation();
			var val = $(this).text();
			_this.find("input").val(val);
			_this.find("input").data('id', $(this).attr('id'));
			_this.find("ul").hide();
			callback()
		});
		//绑定事件
		$('#' + inputId).on('input propertychange', function() {
			console.log($(this).val())
			var strValue = $(this).val();
			var count = 0;
			if(strValue != "") {
				$('#' + listId).find('li').each(function(i) {
					var contentValue = $(this).text();
					if(contentValue.toLowerCase().indexOf(strValue.toLowerCase()) < 0) {
						$(this).hide();
						count++;
					} else {
						$(this).show();
					}
					if(count == (i + 1)) {
						$(".half-hasLabel").find("ul").hide();
					} else {
						$(".half-hasLabel").find("ul").show();
					}
				});
			} else {
				$(".half-hasLabel ul li").each(function(i) {
					$(this).show();
				});
			}
		})
		_this.bind('click', function(e) {
			e.stopPropagation();
			$(this).find("ul").show();
		});
	}

})
var Common = {
	//弹框注册登录
	closeLR: function() {
		$('.close').click(function() {
			$('.alert-main').remove();
		})
	},
	//底部导航开启新窗口
	openwindow: function() {
		$('.web-link select').change(function() {
			var href = $(this).val();
			window.open(href)
		})
	},
	//获取验证码
	getCode: function() {
		var countdown = 90;
		var calctime = setInterval(function() {
			if(countdown == 0) {
				clearInterval(calctime)
				$('.getCode').removeAttr("disabled");
				$('.getCode').val("免费获取验证码");
				countdown = 90;
			} else {
				$('.getCode').attr('disabled', true);
				$('.getCode').val(countdown + "秒后重新发送");
				countdown--;
			}
		}, 1000)
		if($('.regist-main').css('display') == 'block') {
			var mobile = $('#mobile').val();
		} else if($('.forget-main').css('display') == 'block') {
			var mobile = $('#mobileF').val();
		}
		$.loadData('/api/100/400/10', '{"mobile": "' + mobile + '"}', function(data) {
			if(data.status != 0) {
				$.notice(data.msg, 2000)
			}
			if($('.regist-main').css('display') == 'block') {
				$('#smsTokenR').val(data.body)
			} else if($('.forget-main').css('display') == 'block') {
				$('#smsTokenF').val(data.body)
			}
		}, true)
	},
	//注册
	RegistForm: function() {
		layui.use(['form', 'layer'], function() {
			var form = layui.form,
				layer = layui.layer;
			//自定义验证规则
			form.verify({
				name: [/^([\u4e00-\u9fa5]){2,7}$/, '姓名只能为2到7位中文'],
				repassword: function(value) {
					var passvalue = $('#password').val();
					if(value != passvalue) {
						return '两次输入的密码不一致!';
					}
				}
			});
			//监听提交
			form.on('submit(registBtn)', function(data) {
				var name = $('#real-name').val();
				var mobile = $('#mobile').val();
				var papernum = $('#id-card').val();
				var pwd = $('#password').val();
				var code = $('#verification-code').val();
				var smsToken = $('#smsTokenR').val();
				var MD5 = hex_md5(pwd + mobile);
				$.loadData('/api/100/400/20', '{"smsToken":"' + smsToken + '","name":"' + name + '","papernum":"' + papernum + '","pwd":"' + MD5 + '","code":"' + code + '"}', function(data) {
					console.log(data)
					if(data.status == 0) {
						$('.regist-main').remove();
						var token = data.msg;
						var expiresDate = new Date();
						expiresDate.setTime(expiresDate.getTime() + 30 * 60 * 1000);
						$.cookie('token', token, {
							expires: expiresDate
						});
						var loginStatus = '<span class="login-user">欢迎您，' + data.body.realname + '!</span><a href="personalcenter.html" class="personalcenter">个人中心</a><a id="logout">退出</a>';
						$('.user-login-list').html(loginStatus)
						$('#logout').bind('click', function(e) {
							$.loadData('/api/100/400/60', '', function(data) {
								if(data.status == 0) {
									window.location.href = "index.html"
								}
							}, true)
						})
					} else {
						$.notice(data.msg, 2000)
					}
				}, true)
				return false;
			})
		})
	},
	//登录
	LoginForm: function() {
		layui.use(['form', 'layer'], function() {
			var form = layui.form,
				layer = layui.layer;
			//自定义验证规则
			form.verify({});
			//监听提交
			form.on('submit(loginBtn)', function(data) {
				console.log(data)
				var name = $('#login-name').val();
				var pwd = $('#login-password').val();
				var MD5 = hex_md5(pwd + name);
				$.loadData('/api/100/400/40', '{"username":"' + name + '","password":"' + MD5 + '"}', function(data, status, xhr) {
					console.log(data)
					if(data.status == 0) {
						$('.login-main').remove();
						var token = data.msg;
						var expiresDate = new Date();
						expiresDate.setTime(expiresDate.getTime() + 30 * 60 * 1000);
						$.cookie('token', token, {
							expires: expiresDate
						});
						var loginStatus = '<span class="login-user">欢迎您，' + data.body.realname + '!</span><a href="personalcenter.html" class="personalcenter">个人中心</a><a id="logout">退出</a>';
						$('.user-login-list').html(loginStatus);
						$('#logout').bind('click', function(e) {
							$.loadData('/api/100/400/60', '', function(data) {
								if(data.status == 0) {
									window.location.href = "index.html"
								}
							}, true)
						})
					} else {
						$.notice(data.msg, 2000)
					}
				}, true)
				return false;
			})
		})
	},
	//服务人员登录
	ServiceLoginForm: function() {
		layui.use(['form', 'layer'], function() {
			var form = layui.form,
				layer = layui.layer;
			//自定义验证规则
			form.verify({});
			//监听提交
			form.on('submit(serviceLoginBtn)', function(data) {
				var name = $('#login-name').val();
				var pwd = $('#login-password').val();
				var MD5 = hex_md5(pwd + name);
				var linkHref = '/newsIndex'
				$.loadData('/api/100/400/41', '{"username":"' + name + '","password":"' + MD5 + '"}', function(data) {
					if(data.status == 0) {
						console.log(data)
						top.window.location.href = data.body
					} else {
						$.notice(data.msg, 2000)
					}
				}, true)
				return false;
			})
		})
	},
	//忘记密码
	ForgetForm: function() {
		layui.use(['form', 'layer'], function() {
			var form = layui.form,
				layer = layui.layer;
			//自定义验证规则
			form.verify({
				repassword: function(value) {
					var passvalue = $('#pwd').val();
					if(value != passvalue) {
						return '两次输入的密码不一致!';
					}
				}
			});
			//监听提交
			form.on('submit(forgetBtn)', function(data) {
				var mobile = $('#mobileF').val();
				var pwd = $('#pwd').val();
				var smsToken = $('#smsTokenF').val();
				var verificationVode = $('.verification-code').val();
				var MD5 = hex_md5(pwd + mobile);
				$.loadData('/api/100/400/30', '{"smsToken":"' + smsToken + '","pwd":"' + pwd + '","code":"' + verificationVode + '"}', function(data) {
					if(data.status == 0) {
						console.log(data)
						$.notice('修改成功！请重新登录！', 2000)
						$('.forget-main').remove()
					} else {
						$.notice(data.msg, 2000)
					}
				}, true)
				return false;
			})
		})
	},
	//检测登录状态
	checkLoginStatus: function() {
		var includeLayui = typeof layui != 'undefined' && layui instanceof Function;
		var includeMd5 = typeof hex_md5 != 'undefined' && hex_md5 instanceof Function;
		if(!includeLayui) {
			$('head').append('<link rel="stylesheet" type="text/css" href="js/components/page/css/layui.css" />')
			$('head').append('<script src="js/components/page/layui.js" type="text/javascript" charset="utf-8"></script>');
		}
		if(!includeMd5) {
			$('head').append('<script src="js/components/md5.js" type="text/javascript" charset="utf-8"></script>');
		}
		$.loadData('/api/100/400/50', '', function(data) {
			console.log(data)
			if(data.status == 0) {
				if(data.body.userType == "0") {
					var loginStatus = '<span class="login-user">欢迎您，' + data.body.realname + '!</span> <a href="personalcenter.html" class="personalcenter">个人中心</a><a id="logout">退出</a>';
					$('.user-login-list').html(loginStatus);
					$('#logout').bind('click', function(e) {
						e.stopPropagation();
						$.loadData('/api/100/400/60', '', function(data) {
							if(data.status == 0) {
								window.location.href = "index.html"
							}
						}, true)
					})
				} else {
					top.window.location.href = SERVERPORT+'/newIndex';
				}

			} else if(data.status == 403000) {
				var lrList = '<a href="javascript:;" id="login">社会公众登录</a> ' +
					'<a href="javascript:;" id="service-login">服务人员登录</a> ' +
					'<a href="javascript:;" id="register">注册</a> ';
				$('.user-login-list').html(lrList);
				//注册登录弹框
				$('#login').alertLoginRegistPosition(500, 250, 'login', Common.LoginForm)
				$('#register').alertLoginRegistPosition(660, 430, 'regist', Common.RegistForm)
				$('#service-login').alertLoginRegistPosition(500, 250, 'service-login', Common.ServiceLoginForm)
			}
		}, true)
	},
	//渲染右侧固定导航
	renderRightNavBar: function() {
		var $rightNavBar = $('<ul id="right-fixed-nav">' +
			'<li><a href="javascript:;" title="12348客服热线"><img src="img/hotphont.png" alt="12348客服热线" /><p>12348</p><p>服务热线</p></a></li>' +
			'<li><a href="javascript:;" title="微博"><img src="img/weibo.png" alt="微博" /><p>微博</p></a></li>' +
			'<li><a href="javascript:;" title="微信公众号"><img src="img/wechat.png" alt="微信公众号" /><p>公众号</p></a><div class="qrcode"><div class="chinese"><img src="img/chinese.jpg" /><p>汉语微信公众号</p></div><div class="mongolian"><img src="img/mongolian.jpg" /><p>蒙文微信公众号</p></div></div></li>' +
			'<li><a href="javascript:;" title="APP"><img src="img/app6.png" alt="APP" /><p>APP</p></a></li>' +
			'<li><a href="javascript:;" title="投诉建议" onclick="Common.alertComplaintBox()"><img src="img/proposal.png" alt="投诉建议" /><p>投诉建议</p></a></li>' +
			'<li class="backtop" style="border-top: 1px solid #FFFFFF;"><a href="#" title="返回顶部"><img src="img/backtop.png" alt="返回顶部" /><p>返回顶部</p></a></li></ul>');
		$('body').append($rightNavBar)
		//返回顶部
		$('#go-top').click(function() {
			$('body,html').animate({
				"scrollTop": 0
			}, 1000)
		});
	},

	//投诉建议弹框
	alertComplaintBox: function() {
		var loginStatus = $.checkLoginStatus();
		if(loginStatus) {
			var codeOk = false;
			var $complaintbox =
				$('<form class="complaint-box layui-form" action="">' +
					'<div class="title-box">' +
					'<div class="title">' +
					'<span class="title-word">投&nbsp;诉&nbsp;建&nbsp;议</span>' +
					'<span class="title-line"></span>' +
					'</div>' +
					'<img src="img/lr-title.png">' +
					'<div class="close-btn">x</div>' +
					'</div>' +
					'<div class="complaint-content">' +
					'<div class="p-user">' +
					'<ul>' +
					'<li><div class="title">投诉人</div><input type="text" id="complaintName" readonly="readonly" /></li>' +
					'<li><div class="title">所在地区</div><select lay-ignore name="" class="area" id="complaintArea"></select></li>' +
					'</ul>' +
					'<span class="line"></span>' +
					'</div>' +
					'<div class="b-user">' +
					'<ul style="height:120px;">' +
					'<li><div class="title">被投诉人</div><input type="text" /></li>' +
					'<li><div class="title">执业证号</div><input type="text" id="number" /></li>' +
					'<li><div class="title">所在地区</div><select lay-ignore name="" id="areaId" class="area"></select></li>' +
					'<li><div class="title">所属乡镇</div><select lay-ignore name="" id="townId" class="town"></select></li>' +
					'<li><div class="title">人员类别</div><select lay-ignore name="" class="cate" id="cate"></select></li>' +
					'<li class="org">' +
					'<div class="title">所属机构</div>' +
					'<div class="orgDiv search-select">' +
					'<input type="text" style="" class="organization" id="organId" lay-verify="required" autocomplete="off"/>' +
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
					'<input type="text" id="title" lay-verify="required"/>' +
					'</div>' +
					'<div class="q-t-half">' +
					'<p>投诉事项</p>' +
					'<select lay-ignore name="" class="matter" id="matter"></select>' +
					'</div>' +
					'</div>' +
					'<p>详细内容</p>' +
					'<textarea id="contentId" name="" rows="" cols="" lay-verify="required"></textarea>' +
					'<div class="identify">' +
					'<label for="codeInput">验证码</label><input type="text" name="" id="codeInput" value="" lay-verify="required|validateCode"/>' +
					'<img id="codeImg" src="' + SERVERPORT + '/servlet/validateCodeServlet" alt="" style="" />' +
					'<div class="anony-box">' +
					'<input lay-ignore type="checkbox" class="anony" id="anonymous" style="display:inline-block;"/>匿名</div>' +
					'</div>' +
					'</div>' +
					'<div class="word">' +
					'<p>欢迎您对我们的工作进行监督和建议</p>' +
					'<p>我们将您的意见视作提高服务质量、更好的为您做好工作。</p>' +
					'<p>我们将及时处理并将结果反馈给您!</p>' +
					'</div>' +
					'<div class="bottom">' +
					'<button type="submit" class="submit" id="submitBtn" lay-submit lay-filter="submitComplaint">提交</button>' +
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
				'top': top,
				'position': 'fixed'
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
			}, true)

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
						$.loadData('/api/100/700/50', '{"area":{"id":"' + $townID + '"}}', function(data) {
							$('#organId').val('');
							$("#orgUl").find("li").remove();
							$.each(data.body, function(index, val) {
								$orgLi = $('<li id="' + val.id + '" title="' + val.name + '">' + val.name + '</li>');
								$("#orgUl").append($orgLi);
							})
							var townID = $('#townId').find("option:selected").attr('id');
							$('.orgDiv').bindSelectSearch('organId', 'orgUl', function() {})
						}, true)
					})
					//地区改变
					$('#areaId').bind('change', function() {
						var $town = $(this).parent().siblings('li').find('.town');
						$town.find('option').remove();
						var parentId = $(this).find("option:selected").attr('id');
						$.getArea(parentId, function(data) {
							$.each(data, function(index, val) {
								$townOpt = $('<option id="' + val.id + '">' + val.name + '</option>');
								$town.append($townOpt);
							})
							var $townId = $('#townId').find("option:selected").attr('id');
							$.loadData('/api/100/700/50', '{"area":{"id":"' + $townId + '"}}', function(data) {
								$('#organId').val('');
								$("#orgUl").find("li").remove();
								$.each(data.body, function(index, val) {
									$orgLi = $('<li id="' + val.id + '" title="' + val.name + '">' + val.name + '</li>');
									$("#orgUl").append($orgLi);
								})
								var townID = $('#townId').find("option:selected").attr('id');
								$('.orgDiv').bindSelectSearch('organId', 'orgUl', function() {})
							}, true)
						})
					})

					//改变乡镇
					$('#townId').bind('change', function() {
						var townID = $('#townId').find("option:selected").attr('id');
						//获取机构
						$.loadData('/api/100/700/50', '{"area":{"id":"' + townID + '"}}', function(data) {
							console.log(data);
							$('#organId').val('')
							$("#orgUl").find("li").remove();
							$.each(data.body, function(index, val) {
								$orgLi = $('<li id="' + val.id + '" title="' + val.name + '">' + val.name + '</li>');
								$("#orgUl").append($orgLi);
							})
							$('.orgDiv').bindSelectSearch('organId', 'orgUl', function() {})
						}, true)
					})
				})
			}

			//获取验证码
			$('#codeImg').bind('click', function() {
				var timestamp = new Date().getTime();
				$('#codeImg').attr("src", SERVERPORT + "/servlet/validateCodeServlet?timestamp=" + timestamp);
			})
			//校验验证码
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
							codeOk = false;
							$("#codeInput").css('border', '1px solid red');
						} else {
							$("#codeInput").css('border', '1px solid green');
							codeOk = true;
						}
					}
				})
			});
			layui.use(['form', 'layer'], function() {
				var form = layui.form,
					layer = layui.layer;
				//自定义验证规则
				form.verify({
					validateCode: function(value, item) {
						if(!codeOk) {
							return '请填写正确验证码'
						}
					}
				});
				form.on('submit(submitComplaint)', function(data) {
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
							$.notice(data.msg, 2000)
						}
						if(data.status == 1190) {
							$.notice(data.msg, 2000)
						}
						if(data.status == 0) {
							$.notice('提交成功！', 2000)
							$('.complaint-box').remove();
						}
					}, true)
					return false;
				})
			})
		} else {
			$.notice('请登录后重试', 2000)
		}
	},
	//检测是否为首页
	checkifIndex: function() {
		var index = window.location.pathname.lastIndexOf('/');
		var localURL = window.location.pathname.substring(index + 1, window.location.pathname.length);
		console.log(localURL)
		if(localURL == 'index.html' || localURL == "") {
			$('.user-login-list').addClass('index-login')
		}
	},

	//弹出咨询窗口
	alertConsultationBox: function(ryId) {
		var loginStatus = $.checkLoginStatus();
		if(loginStatus) {
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
					validateCode: function(value, item) {
						if(!codeOk) {
							return '请填写正确验证码'
						}
					}
				});
				console.log(ryId)
				form.on('submit(submitForm)', function(data) {

					var type = $("#parentCase option:selected").attr('id');
					var problemType = $("#childCase option:selected").attr('id');
					var title = $("#title").val();
					var content = $("#contentId").val();
					var phone = $("#phoneId").val();
					var area = $('#areaId option:selected').attr('id');
					var query = '{"type":"' + type + '","problemType":"' + problemType + '","title":"' + title + '","content":"' + content + '","phone":"' + phone + '","area":{"id":"' + area + '"},"user":{"id":"' + ryId + '"}}'
					$.loadData('/api/100/600/20', query, function(data) {
						if(data.status == '0') {
							$.notice("您已经提交成功了!", 2000);
							$('.leaving-box').hide();
							$('#submitForm').attr('disabled', 'disabled').css('cursor', 'not-allow')
						} else {
							$('#submitForm').attr('disabled', false).css('cursor', 'pointer')
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
				'top': top,
				'position': 'fixed'
			})
			$('.close-btn').bind('click', function() {
				$('.leaving-box').remove()
			})
		} else {
			window.stop()
			$.notice('请先登录再进行操作！', 2000)
			return;
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
					var $opt = $('<option id="' + val.parentId + '">' + val.name + '</option>');
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

	}
}
// 如果在框架或在对话框中，则弹出提示并跳转到首页
if(self.frameElement && self.frameElement.tagName == "IFRAME" ||
	$('#left').length > 0 || $('.jbox').length > 0) {
	var status = $.checkLoginStatus();
	if(!status) {
		top.location.href = SERVERFILEPORT;
	}
}
//时间格式化
Date.prototype.format = function(format) {
	var args = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds()
	};
	if(/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var i in args) {
		var n = args[i];
		if(new RegExp("(" + i + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
	}
	return format;
};