/**
 * Created by zqb on 2016/11/26.
 */
$(document).ready(function () {
    document.getElementById("header").innerHTML =
    "<nav class=\"navbar navbar-default navbar-fixed-top navbar-inverse\">" +
        "<div class=\"container\"> " +
            "<div class=\"navbar-header\" style=' margin-top: 10px; vertical-align: middle'>" +
                "<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\""+
                    "data-target=\"#example-navbar-collapse\">"+
                    "<span class=\"sr-only\">切换导航</span>"+
                    "<span class=\"icon-bar\"></span>"+
                    "<span class=\"icon-bar\"></span>"+
                    "<span class=\"icon-bar\"></span>"+
                "</button>"+

                "<a id='ykj_icon' class=\"navbar-brand\" style='padding-top: 5px;height: 40px;position: relative;top: -2px'>" +
                    "<img  src='ykj/images/nav/my_icon.png' style='width:80px'>" +
                "</a>"+
            "</div>" +
            "<div class=\"collapse navbar-collapse\" id=\"example-navbar-collapse\">" +
                "<ul class=\"nav navbar-nav\">" +
                    "<li class=\"active\"><a href=\"index.html\">主页 <span class=\"sr-only\">(current)</span></a></li>" +
                    "<li><a href=\"exammain.html\">题库</a></li>" +
                    "<li><a href=\"aboutus.html\">关于</a></li>" +
                    "<li><a id='userIcon' href=\"login.html\"><span class=\"glyphicon glyphicon-user\"></span> 注册/登录</a></li>"+
                    "<li><a id='user_quite' onclick='quiteLogin()' style='cursor: pointer'><span  class=\"glyphicon glyphicon-log-in\"></span> 退出登录 </a></li>"+
                "</ul>" +
            "</div>" +
        "</div>"+
    "</nav>";

    changingScreen();
    $(window).resize(function(){
        changingScreen();
    });
    isLogin();
});

// 监控浏览器宽度
function changingScreen() {
    // alert("浏览器宽度:"+window.innerWidth);
    var screen_w = window.innerWidth;
    if (screen_w< 768){ // 这个判断导航栏变化的宽度
        $("#ykj_icon").css('top','5px');

    }else {
        $("#ykj_icon").css('top','-2px');
    }
}
// 激活导航条
function changeActive(index) {
    // 将导航栏默认选中登录、注册
    var lis = $("#header").find("li");
    for (var  i = 0; i<lis.length;i++){
        console.log("none");
        var li = lis[i];
        li.className = '';
    }
    $("#header").find("li").eq(index).addClass("active");
}

// 判断是否登录
function isLogin() {
    console.log("NO");
    console.log(getCookie("sid"));
    if (getCookie("sid")){// 隐藏登录接口
        console.log("yes");
        $("#userIcon").text("已登录").prepend("<span  class='glyphicon glyphicon-user'></span>").css({'text-decoration':'none',
            'cursor':'default'}).removeAttr('href');
        return true;
    }
    else {
        return false;
    }
}

var userName = "userName";
var userPassword = "userPassword";
function quiteLogin() {
    console.log("退出登录");
    if (isLogin()){
        clearCookie("sid");
        clearCookie(userName);
        clearCookie(userPassword);
        clearCookie("havepay");
        $("#user_name").val();
        $("#user_psd").val();
        // $(".setting").find("input")[0].checked = false;
        alert_msg(type_default,"退出登录成功!");
        $("#userIcon").text("注册/登录").prepend("<span  class='glyphicon glyphicon-user'></span>").css(
            'cursor','pointer').attr('href','login.html');
        location.replace("index.html");

    }else {
        alert_msg(type_error,"您还未登录!")
    }
}

// 默认:正常信息,如:alert_msg(type_default,"检测版本")
// type:1 错误,如:alert_msg(type_error,"出现未知错误,请重试!");
// type:2，成功,如: alert_msg(type_success,"登录成功!");
var type_default = 0;
var type_error = 1;
var type_success = 2;
function alert_msg(type,msg) {
    if (browser().mobile){
        alert(msg);
        return;
    }
    $("#msg_node").remove();
    var alert_header = "";
    var alert_type = "";
    switch (type){
        case type_error:
            alert_header = "警告: ";
            alert_type = "alert-warning";
            break;
        case type_success:
            alert_header = "恭喜: ";
            alert_type = "alert-success";
            break;
        case type_default:
        default:
            alert_header = "提示: ";
            alert_type = "alert-info";
            break;
    }
    var alert_node = "<div id=\"msg_node\" class=\"alert "+alert_type+" fade in\" style=\"margin: 60px 0 0 0\">"+
        "<a href=\"#\" class=\"close\" data-dismiss=\"alert\">&times;</a>"+
        "<strong>"+alert_header+"</strong>"+msg+
        "</div>";
    $("#header").append(alert_node);

    setTimeout(function () {
        // location.reload();
        $("#msg_node").remove();
        //setbodyH();
    },2000);
}


