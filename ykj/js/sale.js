/**
 * Created by MDJ on 2016/12/13.
 */

var order_objc ;
$(document).ready(function () {

    geturl();
    // handleData(new localObjc());
    var parma = {
        80003: {}
    };
    $.appAjax(UUX_URL,parma,function(objc){
        order_objc = objc;
        handleData(objc);
    }, function(){});

    // 导航栏激活
    changeActive(1);
    setbodyH();
});

function handleData(objc) {
    // title
    $("#pay_header").next().text(objc.title);

    // 级别
    var pay_grade = (objc.grade==1)?"初级音基":"";
    $("#pay_grade").text(pay_grade);

    // 现价
    var origin = objc.price;
    $("#pay_price").text("￥"+origin);

    // 现价
    var pay_factory_price = objc.cost;
    var label_node = "<label style=\"background-color: grey;height: 1px;width: 40px;position: absolute;top: 20px\"></label>"+"￥"+pay_factory_price;
    $("#pay_factory_price").append(label_node);

    // 红包减免
    var reduce = objc.r_reduce;
    $("#pay_reduce").text("￥"+reduce);

    // 支付金额
    var pay_last = objc.price - reduce;
    $("#pay_last").text("￥"+pay_last);

    // 判断是否支付,ispay :1 支付过的
    if (objc.ispay == 1){
        $("#pay_button").children("a").text("已支付").addClass("disabled");
    }
}

// show支付框
var timer;
$(function () { $('#pay_QRCode').on('show.bs.modal', function () {
    // 1.检查支付方式
    if ($("#optionsRadios3")[0].checked == true){
        $("#pay_Model").text("微信扫码支付");
        $("#pay_Model").next().text($("#pay_header").next().text()+" -- "+"￥"+(order_objc.price-order_objc.r_reduce));
        pay_sending();

    }else {
        alert("支付宝");
    }
})
});

// 支付
var QR_objc;
var flag = 0;
function pay_sending() {
    var last_money = order_objc.price-order_objc.r_reduce;
    var parma = {
        104: {
            goodid:order_objc.goodid,
            rid:order_objc.redPackid,
            cid:999,
            price:last_money
        }
    };

    // 等待动画
    $("#QR_animation").show();
    $.appAjax(UUX_PAY_URL,parma,function(objc){
        $("#QR_animation").hide();
        // 二维码
        QR_objc = objc;
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width : 200,
            height : 200
        });
        qrcode.makeCode(objc.code_url);
        // 定时器:每5s检查一次支付结果
        timer = setInterval(function(){
            pay_over();
        }, 5000);

    }, function(){});
}

// dismiss支付框
$(function () { $('#pay_QRCode').on('hide.bs.modal', function () {
    // 清除定时器
    clearInterval(timer);
    // 清除支付二维码
    $('#qrcode').html("")
})
});

// 支付完成
function pay_over() {
    var parma = {
        80004: {
            my_order:QR_objc.out_trade_no
        }
    };
    $.appAjax(UUX_URL,parma,function(status){

        if (status.s == 1){
            // 弹框消失
            $('#pay_QRCode').modal('hide');
            // 禁止再次支付
            $("#pay_button").children("a").text("已支付").addClass("disabled");
            // 跳回答题页面
            history.go(-1);
            // window.history.go(-1);
            setCookie("havepay",1,1);
            var have_pay = getCookie("havepay");
        }
    }, function(){});
}

// 支付遇到问题
function pay_quesestion() {
   alert("\n"+"1.支付已经完成问题，请联系收款方：优优学"+"\n"+"QQ:2990954489"+"\n"+"\n"+"2.二维码无法显示问题，请点击关闭，重新下单"+"\n");
}
