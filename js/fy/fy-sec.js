$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getSecService(request.serviceId, request.siteName);
	setBanner(request.siteName);
})
//根据二级页面name获取Banner图显示
function setBanner(siteName) {
	var name = decodeURI(decodeURI(siteName))
	switch(name) {
		case "法律援助":
			var $btn = $('<button class="banner-btn red" id="apply">申请法律援助</button>');
			var $lybtn = $('<button class="banner-btn red">留言咨询</button>');
			$btn.bind('click', function() {
				var status = $.checkLoginStatus();
				console.log(status)
				if(status) {
					$.openSecPage('legalaid-apply.html', {})
				} else {
					$.notice('请先登录再进行操作！', 2000)
				}
			})
			$lybtn.bind('click', function() {
				$.openSecPage('consultation.html', {})
			})
			$('.banner .content-wrapper').append($lybtn)
			$('.banner .content-wrapper').append($btn)
			$('.banner').css('background-image', 'url(img/sec-banner/fy-banner.png)')
			break;
		case "人民调解":
			var $btn = $('<button class="banner-btn blue">申请人民调解</button>');
			$btn.bind('click', function() {
				var status = $.checkLoginStatus();
				console.log(status)
				if(status) {
					$.openSecPage('view-mediation.html', {})
				} else {
					$.notice('请先登录再进行操作！', 2000)
				}
			})
			$('.banner .content-wrapper').append($btn)
			$('.banner').css('background-image', 'url(img/sec-banner/tj-banner.png)')
			break;
		case "律师服务":
			$('.banner').css('background-image', 'url(img/sec-banner/ls-banner.png)')
			break;
		case "公证服务":
			$('.banner').css('background-image', 'url(img/sec-banner/gz-banner.png)')
			break;
		case "司法鉴定":
			$('.banner').css('background-image', 'url(img/sec-banner/jd-banner.png)')
			break;
		case "普法宣传":
			$('.banner').css('background-image', 'url(img/sec-banner/fx-banner.jpg)')
			break;
		case "司法考试":
			$('.banner').css('background-image', 'url(img/sec-banner/ks-banner.png)')
			break;
		default:
			break;
	}
}
//获取二级服务
function getSecService(serviceId, siteName) {
	$.loadData('/api/100/8030/30', '{"serverId":"' + serviceId + '"}', function(data) {
		var list = data.body;
		$.each(list, function(index, val) {
			var categoryId = val.categoryId == undefined ? '' : val.categoryId;
			console.log(val)
			var $li = $('<li id="' + val.id + '" data-serverType="' + val.serverType + '" data-categoryid="' + categoryId + '" data-sourceid="' + val.sourceId + '" data-href="' + val.link + '"><a href="javascript:;" title="' + val.name + '"><img src="' + SERVERFILEPORT + val.logo + '" alt="" /></a></li>')
			if(val.name == '意见投诉') {
				$li.bind('click',function(){Common.alertComplaintBox()})
			} else {
				$li.bind('click', function() {
					$.openSecPage($(this).data('href'), {
						"id": $(this).attr('id'),
						"categoryId": $(this).data('categoryid'),
						'sourceId': $(this).data('sourceid'),
						'servertype': $(this).data('servertype'),
						"pServiceId": serviceId,
						'siteName': encodeURI(encodeURI(siteName))
					}, $(this).data('servertype'))
				})
			}
			$('.fy-sec-list').append($li)
		});
	}, true)
}