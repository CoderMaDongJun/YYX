
$(function(){
/**
 * ajax封装
 * url 发送请求的地址
 * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
 * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
 * success_function 成功回调函数
 * error_function 失败回调函数
 */
$.appAjax=function(sendurl, data, success_function, error_function) {
        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
        //var jsonText  = JSON.stringify(data); //转换成string
        //appAjaxalert(jsonText);
        console.log("url:"+sendurl);
        $.ajax({
				type:"POST",
				url: sendurl,
				timeout : 5000,
				data: JSON.stringify(data),
                dataType: "json",
                beforeSend:function(request) {
				    console.log("发送前的sid:"+getCookie("sid"));
                    request.setRequestHeader("https-session",getCookie("sid"));
                 },
				success: function(response) {
					if (!response) {
                        alert("data-error");
					}
                    parser(response,success_function)
				},
                error: function(e){
                    // 网络错误提示框
                    // $("#error_node").remove();
                    // $("#header").append(netWorkError_alert("您的网络连接有问题。"));
                    alert_msg(type_error,"您的网络连接有问题。");
                    // 打印错误
                    var jsonText  = JSON.stringify(e); //转换成string
                    console.log("您的网络连接有问题。"+jsonText);
                }
		});
    };

    /**解析后台数据*/
    function parser(responseText,callback){
        for(var key in responseText){
            var my_string  = JSON.stringify(responseText[key]); //转换成string
            //alert(my_string);
            //console.log(my_string);
            var json = responseText[key];
            switch (parseInt(key)){
                case LOGON:
                    callback(new saveLogonInfo(json));
                    break;
                case MJT_LIST:
                    var arrays = mntlist(json);
                    callback(arrays);
                    break;
                case   DX_LIST:
                    var arrays = mntlist(json);
                    callback(arrays);
                    break;
                case   TRY_USE_MNT_DATA:
                    var object =  new tryUsemntData(TRY_USE_MNT_DATA,json);
                    callback(object);
                    break;
                case   TRY_USE_DX_DATA:
                    var object =   new tryUsedxData(TRY_USE_DX_DATA,json);
                    callback(object);
                    break;
                case   RESP_SAVE_ANSWER:
                    var object =   new SaveResult_model(json)
                    callback(object);
                    break;
                case MSG_1000:
                    // [{"id":1,"msg":"手机号输入有误","s":2}]
                    var id = json[0].id;
                    var msg= json[0].msg;
                    var s  = json[0].s;
                    alert(msg);
                    console.log("1000="+id+"---"+msg+"----"+s);
                    if (id == 12){
                        callback(s);
                    }
                    break;
                case PAYBACK:
                    callback(new  pay_page_QRCode(json));
                    break;
                case PAY_PAGE:
                    callback(new pay_page_start(json));
                    break;
                case PAY_CHECK:
                    callback(json);
                    break;
                case MSG_1001:
                    // 账号被踢掉错误
                    // {"id":80003,"msg":"请登录账户或你的账户已在别处被登陆","s":0}
                    clearCookie("sid");
                    callback("fail");
                    if (browser().mobile){
                        alert("请登录账户，或你的账户已在别处被登陆");
                    }else{
                        alert_msg(type_error,"请登录账户，或你的账户已在别处被登陆");
                    }
                    break;
                case  WEIXINCONFIG:
                    callback(new weixinconfig(json));
                    break;
                case  GZH_PAY:
                    callback(new gzh_Pay(json));
                    break;
                default:
                    // 未知错误
                    alert_msg(type_error,"出现未知错误,请重试!");
                    console.log("出现未知错误,请重试!"+parseInt(key));
                    break;
            }
        }
    }

    /**获取作者视频列表*/
    var getAuthorVideos= function(authorSrc) {
        //var author = {
        //    name: authorSrc.name,
        //    tag: authorSrc.tag,
        //    level: authorSrc.level,
        //    icon:authorSrc.icon,
        //    intro:authorSrc.intro,
        //    videos: []
        //};
        //authorSrc.videos.forEach(function(videoItem) {
        //    author.videos.push({
        //        video_id: videoItem.video_id,
        //        name:videoItem.name,
        //        video_url: videoItem.video_url,
        //        play_count: videoItem.play_count,
        //        keynote: videoItem.keynote,
        //        love_count: videoItem.love_count,
        //        hasCollection: videoItem.hasCollection
        //    });
        //});
        return author;
    };
});


