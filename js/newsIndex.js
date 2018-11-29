$(function() {
	var request = $.GetRequest();
	$.getSecPageNav();
	getNewsDetail(request.id, request.categoryId)
	bindCommentSubmit(request.id)
})

function getNewsDetail(id) {
	$.loadData('/api/100/601/30', '{"articleId":"' + id + '"}', function(data) {
		console.log(data)
		if(data.status == 0) {
			$('.bread ul').append('<li>' + data.body.siteName + '</li><li>' + data.body.agencyCategoryVo.categoryName + '</li>')
			var title = data.body.title;
			var time = data.body.createDate;
			$('.news-detail .news-title').html(title);
			$('.news-detail .time').html(time);
			$('.news-msg').html(data.body.articleData.content);
			$('#hitsCount').html(data.body.hits);
			//详情
			if(data.body.files != undefined && data.body.files != '' && data.body.files != null) {
				var fileList = data.body.files.substring(1, data.body.files.length).split('|');
				$.each(fileList, function(i, el) {
					var fileName = decodeURI(el.split('/')[el.split('/').length - 1]);
					var $listItem = $('<p>附件' + (i + 1) + '：<a href="' + SERVERFILEPORT + el + '" target="_blank">' + decodeURI(fileName) + '</a></p>');
					$('.news-files').append($listItem)
				})
			}
			//点赞
			$('#thumbCount').html(data.body.thumbsUpCount);
			if(data.body.isThumbsUp == 'true') {
				$('#thumbsChange').addClass('is').data('changeThumbs', 'false')
			} else {
				$('#thumbsChange').data('changeThumbs', 'true')
			}
			$('#thumbsChange').bind('click', function() {
				$.giveThumbs(id, $(this).data('changeThumbs'), function(data) {
					console.log(data)
					if(data.body == '0') {
						$('#thumbsChange').removeClass('is')
						$('#thumbsChange').data('changeThumbs', 'true')
						var count = $('#thumbCount').html();
						$('#thumbCount').html(parseInt(count) - 1)
						$.notice('取消点赞！', 2000)
					} else if(data.body == '1') {
						$.notice('点赞成功！', 2000)
						$('#thumbsChange').addClass('is')
						var count = $('#thumbCount').html();
						$('#thumbsChange').data('changeThumbs', 'false')
						$('#thumbCount').html(parseInt(count) + 1)
					}
				});

			})
			//回复列表
			if(data.body.commentCount != '' && data.body.commentCount != undefined && data.body.commentCount != null && data.body.commentCount != 0) {
				var commentList = data.body.commentList;
				$.each(commentList, function(i, el) {
					var $commentLi = $(
						'<li>' +
						'<div class="commentMsg">' + el.title + '</div>' +
						'<div class="commentTime">' + el.createDate + '</div>' +
						'</li>'
					);
					$('.commentList').append($commentLi)
				});
			} else {
				$('.commentList').append('<li style="text-align:center" class="nodata">暂无评论</li>')
			}
		} else {
			console.log(data.msg)
		}
	}, true)
}
//绑定评论功能
function bindCommentSubmit(contentId) {
	$('.comment-btn').bind('click', function() {
		var status = $.checkLoginStatus();
		if(status) {
			var content = $('#commentContent').val();
			$.loadData('/api/100/601/50', '{"contentId":"' + contentId + '","title":"' + content + '","content":"' + content + '"}', function(data) {
				if(data.status == 0) {
					$.notice('评论成功！已提交审核！', 2000)
					$('#commentContent').val('')
				} else {
					console.log(data)
					$.notice('评论失败！', 2000)
				}
			})
		} else {
			$.notice('请登录后重试！', 2000)
		}
	})
}
//去除文档自定义样式
//var description = eval(json)
//description = json.replace(/(\n)/g, "");
//description = description.replace(/(\t)/g, "");
//description = description.replace(/(\r)/g, "");
//description = description.replace(/<\/?[^>]*>/g, "");
//description = description.replace(/\s*/g, "");