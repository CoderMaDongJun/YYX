/**
 * Created by zqb on 2016/11/28.
 */

var mntTryBut;
var dxtTryBut;
$(document).ready(function () {
    geturl();
    var data = {
        80005: {}
    };
    $.appAjax(UUX_URL,data,  function(datas){
        if(datas.objectid==TRY_USE_MNT_DATA){
            mntTryBut = datas;
        }else if(datas.objectid==TRY_USE_DX_DATA){
            dxtTryBut = datas;
        }

    }, function(){ } );
    // 导航栏激活
    changeActive(1);
    if (isPay()){
        is_pay();
    }
});

window.onload = function () {
    setbodyH()
};

function is_pay() {
    $(".my_big_Button").css({'width':'68%','border':'1px solid #C1A252'});
    $(".my_button").parent().removeClass("btn-group");
    $(".my_button").hide();
    $(".my_button").next().hide();
}

function enter_mnt() {
    window.location.href = "exammjt.html?type=1";
}

function enter_dx() {
    window.location.href = "examsingle.html?type=2" ;
}

function mnt_try_use() {
    if(isLogin()){
        setCookie("txtKey",mntTryBut.txt,1);
        setCookie("unitKey",mntTryBut.unit,1);
        var width=window.screen.width;
        alert(width);
        if(width>768){
            self.location.href="tryExamination.html";
        }else{
            window.location.href="tryExaminationForPhone.html";
        }
    }else{
        window.location.href="login.html";
    }
}

function dx_try_use() {
    if(isLogin()){
        setCookie("txtKey",mntTryBut.txt,1);
        setCookie("unitKey",mntTryBut.unit,1);
        var width=window.screen.width;
        alert(width);
        if(width>768){
            self.location.href="tryExamination.html";
        }else{
            window.location.href="tryExaminationForPhone.html";
        }
    }else{
        window.location.href="login.html";
    }
}

function buy() {
    if(isLogin()){
        window.location.href="sale.html";
    }else{
        window.location.href="login.html";
    }
}