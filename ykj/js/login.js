/**
 * Created by MDJ on 2016/11/29.
 */

$(document).ready(function () {

    geturl();
    // 激活导航条
    changeActive(3);

    // 分析cookie值，显示上次的登陆信息
    $("#user_name").val(getCookie(userName));
    $("#user_psd").val(getCookie(userPassword));

    if (getCookie(userName)){
       $(".setting").find("input")[0].checked = true;
    }
});

// 用户登录
function userLogin() {

    // 下次自动登录
    var name = $("#user_name").val();
    var psd = $("#user_psd").val();
    if($(".setting").find("input")[0].checked==true){
        setCookie(userName,name,1);
        setCookie(userPassword,psd,1);
    }else {
        clearCookie(userName);
        clearCookie(userPassword);
        $("#user_name").val();
        $("#user_psd").val();
        $(".setting").find("input")[0].checked = false;
    }

    var logonData = {
        1: {
            "mPhone": name,
            "mPassword": psd,
            "vCode": "1",
            "vName" : "1",
            "OSModel" :  browser_name(browser()),// 浏览器类型
            "OSSDK" : browser().version,// 浏览器版本号
            "plat":"3",
            "OSRelease" : "1"
        }
    };


    $.appAjax(UUX_URL,logonData,
        function(objc){
            isLogin();
            setTimeout(function () {
                if (getLocationParam("Account") == 1){
                    self.history.go(-1);
                }else {
                    location.replace("index.html");
                }
            },1800);
            alert_msg(type_success,"登录成功!");
        },
        function(){}
    );
}

// 下一步
function nextStep() {
    // 获取所有的li(标题) 和 标题对应的内容(div)
    var flag =0;
    var titles = $("#forgetModal .modal-body .nav li");;
    var divs = $("#nav-con div ");
    //    判断
    if (titles.length != divs.length) return;
    for(var i = 0; i < titles.length; i++){
        if (titles[i].className == "active"){
            flag = i+1;
            flag = (flag>=1)?1:flag;
        }
        titles[i].className = 'disable';
        divs[i].style.display = 'none';
    }
    titles[flag].className = "active";
    divs[flag].style.display = "block";
}

//
var ifclick=true;
// 获取验证码
function getCode() {
    if(ifclick){
        var mPhone = $("#mPhone").val();
        if (checkPhone(mPhone)){

            var parma = {
                80009: {
                    "mPhone": mPhone
                }
            };

            //更改 '获取验证码'
            var codea = document.getElementById('code').getElementsByTagName('a')[0];
            settime(codea);
            ifclick=false;

            $.appAjax(UUX_URL,parma, function(){},  function(){} );
        }
    }
}

//重新发送倒计时
var countdown=60;
function settime(codea) {
    if (countdown == 0) {
        //obj.removeAttribute("disabled");
        codea.innerHTML="获取验证码";
        codea.style.backgroundColor ="#C1A252";
        ifclick=true;
        countdown = 60;
        return;
    } else {

        codea.innerHTML="重新发送(" + countdown + ")";
        codea.style.backgroundColor ="gray";
        countdown--;
    }
    setTimeout(function() {
            settime(codea) }
        ,1000)
}

// 模态框消失 注册
$(function() {
    $('#registerModal').on('hide.bs.modal',
        function() {
            countdown=0;
        })
});

// 模态框消失 忘记密码
$(function() {
    $('#forgetModal').on('hide.bs.modal',
        function() {
            countdown=0;
            $("#next_button").text("下一步");
        })
});

// 获取忘记密码的手机验证码
function get_forget_Code() {
    if(ifclick){
        var mPhone = $("#my_phone").val();
        if (checkPhone(mPhone)){
            console.log("手机号正确,发送获取验证码请求");
            var parma = {
                11: {
                    "mPhone": mPhone
                }
            };

            var codea = document.getElementById('code2').getElementsByTagName('a')[0];
            settime(codea);
            ifclick=false;

            $.appAjax(UUX_URL,parma, function(){},  function(){} );
        }
    }
}

// 忘记密码
function forgetPassword() {
    var mPhone = $("#my_phone").val();
    if (checkPhone(mPhone)){
        var mCode = $("#my_code").val();

        var mNewPsd = $("#new_password").val();
        var mAgainPsd = $("#again_password").val();
        if ((mNewPsd != mAgainPsd)||(typeof(mNewPsd)=='undefined')){
            alert("两次输入密码不一致");
            return;
        }

        var parma = {
            12: {
                "mPhone": mPhone,
                "mCode":mCode,
                "newPass":mNewPsd
            }
        };

        $.appAjax(UUX_URL,parma, function(status){
            console.log("重置返回");
            if (status == 1){
                console.log("重置完成");
                $('#forgetModal').modal('hide')
            }
        },  function(){} );
    }
}

// 判断是否点击发送
function isSend() {
    var myTitle = $("#next_button").text();
    if (myTitle == "发送"){
        forgetPassword();
    }
}

// 当轮播幻灯片过渡效果,结束时触发该事件。
$(function(){
    $('#myCarousel').on('slid.bs.carousel', function () {
        var myTitle = $("#myCarousel").find(".active p").text();
        if (myTitle == "重置密码"){
            console.log("文字改变:发送");
            $("#next_button").text("发送");
        }else {
            console.log("文字改变:下一步");
            $("#next_button").text("下一步");
        }
    });
});

// 创建用户
function setupUserCount() {
    var mPhone = document.getElementById("mPhone").value;
    if (!checkPhone(mPhone)) return;
    var mPassword = $("#mPassword").val();
    var mAgainPassword = $("#againPassword").val();

    var mCode = $("#mcode").val();
    if ((mPassword != mAgainPassword)||(typeof(mPassword)=='undefined')){
        alert("两次输入密码不一致");
        return;
    }

    var logonData = {
        8: {
            "mPhone": mPhone,
            "mCode": mCode,
            "mPassword": mPassword ,
            "vCode" : "1",
            "plat" : "3",
            "vName" : "1",
            "OSModel" :  browser_name(browser()),// 浏览器类型
            "OSSDK" : browser().version,// 浏览器版本号
            "cid" : "999", //不變
            "OSRelease" : "1"
        }
    };


    $.appAjax(UUX_URL,logonData, function(objc){
        if (objc.status == 1){
            alert("注册成功!");
            setTimeout(function () {
                location.replace("index.html")
            },1000);
        }
    },  function(){} );
}
