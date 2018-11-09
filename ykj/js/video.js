/**
 * Created by uuxue on 17/1/10.
 */


$(document).ready(function(){

    networkDataInVideo()

});

function networkDataInVideo(){

    var url ="ykj/Temp/testVideo.json";
    $.getJSON(url,{},function (data, status) {

        loadDataInVideo(data["test"])
    })
}


function loadDataInVideo(contentData){

        for(var num =0;num<contentData.length;num++){

            var dict = contentData[num];

            var model=new modelInVideo(dict);

            appendItemInVideo(model);
        }


}


  //<div class="item">
  //     <div class="bg"><img src="ykj/images/video/onebg.png"> </div>
  //     <h4>2017年中央音乐学院钢琴考级(一级)</h4>
  //     <p>讲师：侯陌濛</p>
  //     <p>视频：10个</p>
  //     <div class="num_price_bg">
  //        <div class="left">  <img src="ykj/images/video/butBum.png"> <button type="button"  onclick="enter_dx()"> 63333人</button> </div>
  //     <div class="right"> ￥150  </div>
  //  </div>
  //  </div>



//数据模型
function modelInVideo(dict) {
    //this.type = dict["type"];
    this.bgImgPath=dict["bgImgPath"];
    this.lvlName=dict["lvlName"];
    this.authorName=dict["authorName"];
    this.videoNum=dict["videoNum"];
    this.btnImgPath=dict["btnImgPath"];
    this.moods=dict["moods"];
    this.payNum=dict["payNum"]
}

function appendItemInVideo(model){
    $("#v_body_con").append("<div class=\"item\">"+appendBgInVideo(model)+ appendContentInVideo(model)+ appendNumpriceInVideo(model)+"</div>");
}

function appendBgInVideo(model){

    var bgImgPath=model.bgImgPath;

    var bg = "<div class=\"bg\"><img src="+bgImgPath+"> </div>";

    return bg;

}

function appendContentInVideo(model){

    var lvlName=model.lvlName;

    var authorName=model.authorName;

    var videoNum=model.videoNum;

    var  content="<h4>2017年中央音乐学院钢琴考级("+lvlName+")</h4><p>讲师："+authorName+"</p><p>视频："+videoNum+"个</p>";

    return content;
}


function appendNumpriceInVideo(model){

    var num_price_bg="<div class=\"num_price_bg\">"+appendLeftInVideo(model)+appendRightInVideo(model)+"></div>";

    return num_price_bg;
}


function appendLeftInVideo(model){

    var btnImgPath=model.btnImgPath;

    var moods=model.moods;

    var left="<div class=\"left\">  <img src="+btnImgPath+"> <button type=\"button\"  onclick=\"enter_dx()\"> "+moods+"人</button> </div>";

    return left;

}

function appendRightInVideo(model){

    var payNum=model.payNum;

    var right="<div class=\"right\"> ￥"+payNum+"  </div>";

    return right;

}