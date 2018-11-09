var uux_domain ;
var UUX_URL ;
var UUX_PAY_URL ;
var UUX_WEIXIN_CONFIG ;
var UUX_DOWNIMAGE_URL ;
// 资源--网络路径
var networkPath ;
// 服务器地址
var sererPath ;
// mp3 资源
var mp3Path = "";
function geturl(){
    uux_domain = document.domain;
    UUX_URL= "http://"+uux_domain+"/portal";//  uux_domain+"/portal";//"http://ekaoji.com/portal";
    UUX_PAY_URL ="http://"+uux_domain+"/Pay/AliPayServlet";    // uux_domain+"/Pay/AliPayServlet";
    UUX_DOWNIMAGE_URL = "http://"+uux_domain+"/images";
    // 资源--网络路径
    networkPath = "http://"+uux_domain+"/exam/pic/";
    // 服务器地址
    sererPath = "http://"+uux_domain+"/exam/file/";
    // mp3 资源
    mp3Path = "http://"+uux_domain+"/exam/ttsmp3/";

    UUX_WEIXIN_CONFIG ="http://"+uux_domain+"/Pay/WeixinConfig";    // uux_domain+"/Pay/AliPayServlet";
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function PCInfo() {
    document.Browser.Name.value = navigator.appName;
    document.Browser.Version.value = navigator.appVersion;
    document.Browser.Code.value = navigator.appCodeName;
    document.Browser.Agent.value = navigator.userAgent;
}