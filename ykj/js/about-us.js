/**
 * Created by yogolo on 2016/12/5.
 */

$(document).ready(function () {
    geturl();
    info($("#abc"));

    // 导航栏激活
    changeActive(2);
});

window.onload = function () {
    setbodyH();
};

function test(id) {
    var my_Options = $(id).siblings("li");
    for(var i=0;i<my_Options.length;i++){
        $(my_Options[i]).removeClass("on")
    }
    // 设置选中按钮
    $(id).addClass("on");
}

function info(node) {
    document.getElementById("right_contnt").innerHTML ="<div class=\"col2\">"+
    "<div><a href=\"index.html\">首页›</a>  <span style='font-size: 10px'>公司简介</span></div>"+
    "<div class=\"aboutArea_1\">　　北京优优学信息咨询有限公司,成立于2015年，是一家专注于音乐考级的综合服务平台。<br>　　公司专注于线下核心业务和线上互联网产品服务，提供给孩子专业、正确的学习解决方案。公司还邀请了中央音乐学院精英教师团队提供最权威、最精准的音乐基础考试真题。<br>　　我们还为考生提供最新、最专业的考级资讯，更多内容敬请关注微信公众号：uuxue2015，每日推送音乐考级干货，精彩内容不容错过哦~~</div>"+
    "</div>";
    test(node)
}

function team(node) {
    document.getElementById("right_contnt").innerHTML = "<div class=\"col2\">" +
    "<div><a href=\"index.html\">首页›</a> <span style='font-size: 10px'>公司产品</span></div>" +
    "<div class=\"aboutArea_1\">　　我们的产品名“艺考级”。<br>　　服务宗旨：艺考级，易考级 让考级变得更容易 。<br>　　我们致力于 互联网+音乐教育，垂直内容的互联网产品，更加专注，创新，智慧的服务孩子。<br>　　目前的产品有ios App“艺考级”和网页版本，满足你的各种使用场景。</div>" +
    "</div>";
    test(node)
}

function us(node) {
    document.getElementById("right_contnt").innerHTML = "<div class=\"col2\">" +
    "<div><a href=\"index.html\" >首页›</a><span style='font-size: 10px'>联系我们</span></div>" +
    "<div class=\"aboutArea_1\">　　北京优优学信息咨询有限公司<br>　　邮 箱：bjuuxue@163.com<br>　　地址：北京朝阳区望京合生麒麟社1-912<br>　　微信公众号 :<br>　　<img src=\"ykj/images/aboutus/erweima.jpg\" width='150px' height='150px'><br>　　加关注会有您意想到的惊喜哦!(可以和 <a href='http://baike.baidu.com/link?url=e4_fWOVZ7esJHwd4inyaup2gvnOYYQj6f7KP_dGIR1OVpcvbx6WcfsKRNP1cHpp2eDrWsX2okFoCa7do07eU3rJUdciX8qs3OhdrSv7QE3GL1YIWlHVxQZunD8GfhDj1'>侯陌濛</a> 老师直接对话哦)     　　</div>" +
    "</div>";
    test(node)
}