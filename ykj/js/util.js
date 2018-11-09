//var uux_domain ;
//var UUX_URL = uux_domain+"/portal";//"http://ekaoji.com/portal";
//var UUX_PAY_URL = uux_domain+"/Pay/AliPayServlet";
//var UUX_DOWNIMAGE_URL = uux_domain+"/images";
//// 资源--网络路径
//var networkPath = uux_domain+"/exam/pic/";
//// 服务器地址
//var sererPath = uux_domain+"/exam/file/";
var USER_KEY	= "";
/*当前是否联网*/
var NETWORK = true;

/*****和后台进行交互接口*****/
/* 登录 */
var LOGON= 1;
var MJT_LIST= 80001;  /*模拟题列表*/
var DX_LIST = 80002;  /*单项列表*/
var TRY_USE_MNT_DATA = 80006;  /*使用数据*/
var TRY_USE_DX_DATA  = 80007;  /*使用数据*/


var RESP_SAVE_ANSWER  = 80008;  /*使用数据*/
/* 通知1 */
var MSG_1000 = 1000;
/* 通知2 */
var MSG_1001 = 1001;
/* 支付页面1 */
var PAY_PAGE=80003;
/* 支付页面2 */
var PAY_CHECK=80004;
/** 支付页面3 */
var PAYBACK = 104;  /*单项列表*/
var WEIXINCONFIG = 105;  /*微信配置*/
var GZH_PAY = 106;  /*公众号支付*/

var AUTHOR = "AUTHOR";

/*采用正则表达式获取地址栏参数：*/
function getLocationParam(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

// 设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires + ";path=/";
}

// 获取cookie
function getCookie(cname) {
    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while(c.charAt(0) == ' ') c = c.substring(1);
            if(c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
    } catch(e) {
        console.log(e);
    }
    return "";
}

//清除cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}

// 检测手机号
function checkPhone(mphone){
    if(!(/^1[34578]\d{9}$/.test(mphone))){
        alert("手机号码有误，请重填");
        return false;
    }
    return true;
}

// javascript 验证手机号码的正确性
function is_Phone_number(value){
    var pattern=/^1[34578][0123456789]\d{8}$/;
    if(!pattern.test(value)){
        alert("手机号码有误，请重填");
        return false;
    }
    return true;
}

// javascript 验证电子邮箱的正确性
function is_email(value){
    var pattern=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if(!pattern.test(value)){
        return false;
    }
    return true;
}

// 判断是否登录
function isPay() {
    var have_pay = getCookie("havepay");
    if(have_pay==1){ //已经支付了才能答题
        return true;
    }
    else {
        return false;
    }
}

//  获取浏览器相关属性
function browser() {
    var u = navigator.userAgent.toLowerCase();
    return {
        txt: u,
        version: (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        msie: /msie/.test(u) && !/opera/.test(u),
        mozilla: /mozilla/.test(u) && !/(compatible|webkit)/.test(u),
        safari: /safari/.test(u) && !/chrome/.test(u),
        chrome: /chrome/.test(u),
        opera: /opera/.test(u),
        presto: u.indexOf('presto/') > -1,
        webKit: u.indexOf('applewebkit/') > -1,
        gecko: u.indexOf('gecko/') > -1 && u.indexOf('khtml') == -1,
        mobile: !!u.match(/applewebkit.*mobile.*/),
        ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        android: u.indexOf('android') > -1,
        iPhone: u.indexOf('iphone') > -1,
        iPad: u.indexOf('ipad') > -1,
        webApp: !!u.match(/applewebkit.*mobile.*/) && u.indexOf('safari/') == -1
    };
}

// 获取浏览器名字
function browser_name(objc) {
    if (objc.chrome){
        return "chrome";
    }else if (objc.mozilla){
        return "firefox";
    }else if (objc.opera){
        return "opera";
    }else if (objc.msie){
        return "IE";
    }else if (objc.opera){
        return "opera";
    }else if (objc.safari){
        return "safari";
    }else if (objc.ios||objc.iPhone||objc.iPad){
        return "apple_browser";
    }else if (objc.android){
        return "android_browser";
    }else {
        return "unknown";
    }
}