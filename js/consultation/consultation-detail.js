$(function() {
	$.getSecPageNav();
	var request = $.GetRequest();
	getConsultationDetail(request.id);
	getSimilarCase(1, 5, request.problemType)
})
//咨询详情页面获取问答详情
function getConsultationDetail(id) {
	$.loadData('/api/100/600/30', '{"id":"' + id + '"}', function(data) {
		var res = data.body;
		console.log(res)
		$('.q-title').html(res.title);
		$('.q-msg').html(res.content);
		$('#q-time').html(res.createDate);
		var anList = res.commentList;
		if(anList != undefined && anList != null && anList != '') {
			$.each(anList, function(index, val) {
				var $qaBox = $('<div class="qa-box">' +
					'<div class="a-msg">' +
					'<div class="name">' + val.createUser.name + '</div>' +
					'<div class="msg">' + val.content + '</div>' +
					'</div>' +
					'<div class="detail-thumbs">' +
					'<div class="re-time">回复时间：<span id="re-time">' + val.createDate + '</span></div>' +
					'<div id="good" class="thumbsUp" data-thumbs="true" data-num="' + val.thumbsUpTrue + '">' +
					'<img src="img/consultation/good.png" alt="" />' +
					' <span id="goodConut">( ' + val.thumbsUpTrue + ' )</span>' +
					'</div>' +
					'<div id="diss" class="thumbsUp" data-thumbs="false" data-num="' + val.thumbsUpFalse + '">' +
					'<img src="img/consultation/diss.png" alt="" />' +
					' <span id="dissConut">( ' + val.thumbsUpFalse + ' )</span>' +
					'</div>' +
					'</div>' +
					'</div>');
				$qaBox.find('.thumbsUp').bind('click', function() {
					var commentId = val.id;
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
				var $closelyQABox = $('<div class="qa-closely"></div>');
				var guestbookCommentReList = val.guestbookCommentReList;
				if(guestbookCommentReList != undefined && guestbookCommentReList != null && guestbookCommentReList != '') {
					$.each(guestbookCommentReList, function(i, el) {
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
				$('.a-title').after($qaBox)

			});
		} else {
			$('.a-title').after('<div style="width:100%;text-align:center;margin-top: 20px;font-size: 13px;">暂无回复</div>')
		}
	}, true)
}

//相似案例
function getSimilarCase(pageNo, pageSize, problemType) {
	$.loadData('/api/100/600/10', '{"pageNo":"'+pageNo+'","pageSize":"'+pageSize+'","problemType":"' + problemType + '"}', function(data) {
		console.log(data)
		var list = data.body.list;
		console.log(list);
		$.each(list, function(index, val) {
			var $li = $('<li id=' + val.id + ' data-problemtype="' + problemType + '"><span class="item-title">' + val.title + '</span><span class="item-time">' + val.createDate.substr(0, 10) + '</span></li>');
			$li.bind('click', function() {
				$.openSecPage('consultation-detail.html', {
					'id': $(this).attr('id'),
					'problemType': $(this).data('problemtype')
				}, 4)
			})
			$('#similar-case').append($li);
		})
		var $more = $('<p class="more" id="morethen" data-problemType="' + list[0].problemType + '"  data-type="' + list[0].type + '">更多></p>');
		$('.detail-right').find('.box-title').append($more);

		//点击更多
		$('#morethen').on('click', function() {
			$.openSecPage('consultation-list.html', {
				problemType: $(this).data('problemtype'),
				type: $(this).data('type')
			})
		})
		
	}, true);
}