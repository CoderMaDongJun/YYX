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
});

function mnt_try_use() {
    if(isLogin()){
        sessionStorage.setItem('txtKey',mntTryBut.txt);
        sessionStorage.setItem('unitKey',mntTryBut.unit);
        if(browser().mobile){
            window.location.href="tryExaminationForPhone.html";
        }else{
            window.location.href="tryExamination.html";
        }
    }else{
        window.location.href="login.html";
    }
}

