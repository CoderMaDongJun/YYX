/**
 * Created by uuxue on 16/12/22.
 */
$(document).ready(function(){

    document.getElementById("footer").innerHTML = "<div id=\"my_footer_content\">"+
    "<div style=\"margin-bottom: 5px\">&copy;2015 北京优优学信息咨询有限公司</div>"+
    "<div>版权所有ICP证:京ICP备16066909号</div>"+
    "<div id=\"footer_right\">"+
        "<a id=\"go_top\" href=\"#\" >"+
            "<span class=\"glyphicon glyphicon-arrow-up\"></span>"+
        "</a>"+
        "<a type=\"button\" class=\"popover-options\""+
            "title=\"<h6 style='text-align: center;margin: 0'>艺考级公众号</h6>\""+
            "data-container=\"body\""+
            "data-toggle=\"popover\""+
            "data-trigger=\"hover\""+
            "data-placement=\"left\""+
            "data-content=\"<img src='ykj/images/aboutus/erweima.jpg' style='width:100px'>\">"+
            "<span id=\"footer_middle\" class=\"glyphicon glyphicon-qrcode\"></span>"+
        "</a>"+
        "<a target=\"_blank\" href=\"//mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=V2VubmduYmNjb24XJiZ5NDg6\">"+
             "<span class=\"glyphicon glyphicon-envelope\"></span>"+
        "</a>"+
        "</div>"+
    "</div>";
        
    $("#my_footer_content").css({
        'background-color': '#0D1613',
        'padding': '10px',
        'text-align': 'center',
        'color': 'lightgray',
        'font-size': '12px'
    });

    $("#footer_right").find(".btn-lg").css({
        'color': 'white',
        'border': 'none',
        'border-radius': '0',
        'padding': '14px',
        'background-color': 'green',
        'text-shadow': 'black 5px 3px 3px',
        'padding-bottom': '12px'
    });

    $("#footer .glyphicon").css({
        'color':'#C1A252',
        'font-size': '24px'
    });

    $("#footer_right").css({
        'width': '40px',
        'background-color': 'white',
        'position':'fixed',
        'right': '5px',
        'bottom': '30px',
        'border': '1px solid lightgray',
        'z-index': '999'
    });

    $("#footer_right").find("span").css({
        'padding': '3px'
});

    $("#footer_middle").css({
        'margin':'10px 0'
    });

    // 刷新footer高度使用
    $(window).resize(function(){
        if(browser().mobile) return;
        location.reload()
    });

});

window.onscroll = function () {
    var m = $(document).scrollTop();
    if (m == 0){
        $("#go_top").hide();
    }else{
        $("#go_top").show();
    }
};

$(function () { $(".popover-options").popover({html : true });});

function setbodyH(){

    if (document.compatMode == "BackCompat") {
        cWidth = document.body.clientWidth;
        cHeight = document.body.clientHeight;
        sWidth = document.body.scrollWidth;
        sHeight = document.body.scrollHeight;
        sLeft = document.body.scrollLeft;
        sTop = document.body.scrollTop;
    } else {
        //document.compatMode == \"CSS1Compat\"
        cWidth = document.documentElement.clientWidth;
        cHeight = document.documentElement.clientHeight;
        sWidth = document.documentElement.scrollWidth;
        sHeight = document.documentElement.scrollHeight;
        sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
        sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
    }

    //alert (sHeight);

    var footer=document.getElementById('footer');
    var my_header=document.getElementById('header');

    var body_height=sHeight-footer.clientHeight - my_header.clientHeight-footer.clientTop;


    if(document.getElementById('aboutusmain')){
        body_height= sHeight-footer.clientHeight- my_header.clientHeight-footer.clientTop+92;
    }

    if(document.getElementById('main')){
        var main=document.getElementById('main');
        body_height=sHeight-footer.clientHeight-header.clientHeight-footer.clientTop+main.clientTop;
    }
    $(footer).prev().css('height',body_height+"px");
}


