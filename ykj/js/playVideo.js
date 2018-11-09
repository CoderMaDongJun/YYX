$(document).ready(function () {
    hiddenOrShow();
});

// 曲目、曲目信息、评论 点击处理
function switchButton(id) {
    $(id).children().addClass('active');
    $(id).siblings().find("a").removeClass('active');
}

// 教师简介隐藏、展开
function hiddenOrShow() {
    for (var i = 0; i < $("div[name=content]").length; i++) {
        var m = $("div[name=content]").eq(i);
        if (m.text().length > 100) {
            m.attr("content", m.text());
            m.html(m.text().substr(0, 100) + "...<a name=\"zhankai\" href=\"javascript:;\">展开</a>");
        }
    }
    $("a[name=zhankai]").live("click", function () {
        $(this).parent().html($(this).parent().attr("content") + "<a name=\"yinchang\" href=\"javascript:;\">隐藏</a>");
    });
    $("a[name=yinchang]").live("click", function () {
        $(this).parent().html($(this).parent().attr("content").substr(0, 100) + "...<a name=\"zhankai\" href=\"javascript:;\">展开</a>");
    });
}

// 下一曲
var videoName = "1";
function nextVideo() {
    $("#mp4_src").attr("src","ykj/images/MP4/"+videoName+".mp4");//更新url
    $("#mp4_src").attr("autoplay","true");//直接播放
    videoName = (videoName ++>8)?1:videoName++;
}