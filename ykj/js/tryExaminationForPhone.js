/**
 * Created by MDJ on 2016/11/30.
 */
// 字段特别说明：
// subType--题目类型(0:无图；1:1张长图;2:1张方图;3:2张长图)
// specialType--选项类型(1:方图、0：长图)
// order:题号;title:题目;titleIcon:题目图片;answer正确答案;mp3: 需要播放音乐


var readcontent= '数据未接受';

// 单元号
var localUnit = '';
// 资源--本地路径
var localPath = "ykj/images/tryExam/";
// 播放器node
var player = "";
// 默认选择item（0-39）
var defaultItem = 0;
// 默认答题时间 50:00 表示50分钟
var defaultTime = "50:00";
// 数据源<模型>
var dataArr =[];
// 盛放选择答案0：错误；1：正确
var Result_Array = [];
// 盛放选择答案结果，0：未做；1：A;2:B;3:C;4:D
var select_Array = [];
// 判断是否提交过考卷1：提交；0：未提交
var isPassFlag = 0;

//标记点击的是上一题or下一题
var leftorright;
//是否显示底边栏 (上一题等按钮)
var ifshow;


// 本地数据加载、勿删
function localData() {
    $.getJSON("../jsonData/tryExaminationJsonData.json",{},function (data, status) {
        checkNode(data["data"]);
    })
}

// 网络数据加载
function networkData() {

    if (getLocationParam("type") == 1){
        $("#my_path").text("模拟题");
    }else {
        $("#my_path").text("单项练习");
    }

    var url = sererPath+sessionStorage.getItem("txtKey");
    $.getJSON(url,{},function (data, status) {
        $("#my_active").text(data.unitName);

        var temp_datas = [];
        for(var item in data["e"]) {

            var subType=0;
            var special_type=0;
            var t_type= data["e"][item].ttype;
            if( t_type ==1 ){
                subType=2;
            }else if( t_type ==3 ){
                subType=0;
            }else if(data["e"][item].timg!="" &&data["e"][item].timg1!="" )
            {
                subType=3
            }else if(data["e"][item].timg!="" &&data["e"][item].timg1=="" )
            {
                subType=1
            }
            if( t_type ==5 ){
                special_type=0
            }
            if(t_type ==4 || t_type ==2){
                special_type=1
            }
            var answer ="";
            if(data["e"][item].op[0].isright==1){
                answer="A";
            }else if(data["e"][item].op[1].isright==1){
                answer="B";
            }else if(data["e"][item].op[2].isright==1){
                answer="C";
            }else if(data["e"][item].op[3].isright==1){
                answer="D";
            }

            temp_datas.push({
                "eid":data["e"][item].eid,
                "subType": subType,
                "specialType": special_type,
                "order": data["e"][item].tno,
                "title": data["e"][item].title,
                "titleIcon": data["e"][item].timg,
                "titleIcon1":data["e"][item].timg1,
                "ttsStr" : data["e"][item].ttsStr,
                "readnum":data["e"][item].readnum,
                "optionA": data["e"][item].op[0].text,
                "optionB": data["e"][item].op[1].text,
                "optionC": data["e"][item].op[2].text,
                "optionD": data["e"][item].op[3].text,
                "answer": answer,
                "mp3": data["e"][item].audio,
                "ttsmp3": data["e"][item].ttsmp3
            });
        }
        checkNode(temp_datas);

    });
}
$(document).ready(function () {
    // localData();
    geturl();
    //changeActive(1);
    networkData();
});

// 根据数据源，加载各个页面节点
function checkNode(sources) {
    // 答题界面节点

    for (var a =0;a<sources.length;a++){
        var dict = sources[a];
        var objc = new OptionObjc(dict);
        examinationType(objc);
        Result_Array[a]=0;
        select_Array[a]= 0;
        dataArr.push(objc);
    }
    // 动态创建答题记录
    typeResult();

    // 默认首个激活
    var items = $(".carousel-inner").children();
    var item = items[defaultItem];
    item.className = "item active";

    // 创建二维数组盛放选择答案0：未选择；1：正确；2：错误
    var tArray = new Array();
    for(var i=0;i<sources.length;i++){
        tArray[i]=[i+1,0];
    };

    /***************************&&&&&&&&&&&&&&&&&&&&&&****************************************/
    // 类型1-4:选项按钮点击事件
    var myOptions = $(".myOption");
    for(var i = 0; i < myOptions.length; i++){
        var myOption = myOptions[i];
        myOption.onclick = function (id) {

            //var contentHeight = $(".header").outerHeight()+$("#carousel-example-generic").height();
            //$('html, body').animate({scrollTop:contentHeight}, 'slow');

            // 恢复该题的4个设置
            var contentFooters = $(this).parents(".contentFooter");
            var myOption_a = $(contentFooters.first()).find(".myOption a");
            for(var j=0; j <myOption_a.length; j++){
                myOption_a[j].className = '';
            }

            // 设置该题选中项目、
            var childSpans = $(this).children();
            var childSpan = childSpans[0];
            childSpan.className = 'select';

            // 拿出题号
            var  contentHeaders = $(this).parents(".item");
            var order = parseInt(contentHeaders.find("h4").text());
            selectAnwser(order,childSpan.innerText,tArray);
        };
    }

    // 类型5、6:选项按钮点击事件
    var Options = $(".myOption2");
    for(var c = 0; c < Options.length; c++){
        var Option = Options[c];
        Option.onclick = function () {
            // 恢复该题的4个设置
            var contentFooters = $(this).parents(".contentFooter");
            var myOption_a = $(contentFooters.first()).find(".myOption2 a");
            for(var j=0; j <myOption_a.length; j++){
                myOption_a[j].className = '';
            }

            // 设置选中按钮
            var childSpans = $(this).children();
            var childSpan = childSpans[0];
            childSpan.className = 'select';

            // 拿出题号
            var  contentHeaders = $(this).parents(".item");
            var order = parseInt(contentHeaders.find("h4").text());

            selectAnwser(order,childSpan.innerText,tArray);
        };
    }

    //// 修改题号
    //function fix(num, length) {
    //    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
    //}

    // 重置题目
    reviseProgressBar(defaultTime);

    is_already();
}

window.onload=function(){

    setTimeout("ifFadeInFooter(true)",300);
    // setTimeout("playMp3ByOrder(true)",300);
}

/****************************************** 节点 ***********************************************************/
// 答题界面节点（题目节点+选项节点）
function examinationType(objc) {
    $(".carousel-inner").append("<div class=\"item\">"+getTitleNode(objc)+ getOPtionNode(objc)+"</div>");
}

//contentHeader
// 获得题目节点
function getTitleNode(objc) {
    var title = fix(objc.order, 2) + "、" + objc.title;// 题目
    player = objc.mp3 ? getPlayerImgNode() : "";
    var type = objc.subType;
    var specialType = objc.specialType;
    var titleIcon = networkPath + objc.titleIcon;// 题目图片1
    var titleIcon1 = networkPath + objc.titleIcon1;// 题目图片2

    // 0张图片
    if (type == 0) {// 题目无图片
        //var contentHeader = "<div class=\"contentHeader\"><h4>" + title + player + "</h4></div>";
        var contentHeader = "<div class=\"contentHeader\"><h4>"+title+player+"</h4></div>";
    }else if (type == 1){// 1张长方形图
        //contentHeader = "<div class=\"contentHeader\"><h4>" + title + player + "</h4>" +
        //    "<img class='img-thumbnail' style='width: 90%;max-width: 800px' src= " + titleIcon + "></div>";
        contentHeader = "<div class=\"contentHeader\"><h4>"+title+player+"</h4><img src= "+titleIcon+" style=\"width:92%\"></div>";
    }else if(type == 2){// 1张正方形图
        //contentHeader = "<div class=\"contentHeader\"><h4>" + title + player + "</h4>" +
        //    "<img class='img-thumbnail' style='width: 200px' src= " + titleIcon + "></div>";
        contentHeader = "<div class=\"contentHeader\"><h4>"+title+player+"</h4><img src= "+titleIcon+" style=\"width:50%\"></div>";

    }else if (type == 3){// 2张长方形图
        //contentHeader = "<div class=\"contentHeader\" style='text-align: center'>" +
        //    "<h4>" + title + player + "" + "</h4>" +
        //    "<img class='img-thumbnail' style='width: 55%' src= " + titleIcon + ">" +
        //    "<img class='img-thumbnail' style='width: 55%' src= " + titleIcon1 + "></div>";
        contentHeader = "<div class=\"contentHeader\"><h4>"+title+player+"</h4><img src= "+titleIcon+" style=\"width:92%\"><img src= "+titleIcon1+" style=\"width:92%\"></div>";
    }

    return contentHeader;
}

//contentFooter
// 获得选项节点
function getOPtionNode(objc) {
    var optionA = objc.optionA;// 选项A
    var optionB = objc.optionB;// 选项B
    var optionC = objc.optionC;// 选项C
    var optionD = objc.optionD;// 选项D

    //用indexOf方法判断是否包含test字符串
    var bool = optionA.indexOf(".png");
    if(bool<0) {
        var myRow1 = "<div class=\"myrow\">" + option_AC("A", optionA) + option_BD("B", optionB) + "</div>";
        var myRow2 = "<div class=\"myrow\">" + option_AC("C", optionC) + option_BD("D", optionD) + "</div>";
        return "<div class=\"contentFooter\">" + myRow1 + myRow2 + "</div>";
    }else {// 图片
            var picPath = networkPath;
            if (objc.specialType == 0){// 长图
                //return "<div class=\"myOption\" style='margin: 5px' onclick='optionClick(this)'><a>"+k+"</a>" +
                //    "<img style='width: 60%;margin-left: 10px' src="+picPath+" class=\"img-thumbnail\"></div>";
                return "<div class=\"contentFooter\">"+optionABCD("A",picPath+optionA)+optionABCD("B",picPath+optionB)+optionABCD("C",picPath+optionC)+optionABCD("D",picPath+optionD)+"</div>";;
            }else {// 方图
                //return "<div class=\"myOption\" style='display:inline-block' onclick='optionClick(this)'><a>"+k+"</a>" +
                //    "<img src="+picPath+" class=\"img-thumbnail\" style='width: 100px'></div>";
                myRow1 = "<div class=\"myrow\">"+optionAC("A",picPath+optionA)+optionBD("B",picPath+optionB)+"</div>" ;
                myRow2 = "<div class=\"myrow\">"+optionAC("C",picPath+optionC)+optionBD("D",picPath+optionD)+"</div>" ;
                return "<div class=\"contentFooter\">" + myRow1 + myRow2 + "</div>";
            }
        }


    //return "<div class=\"contentFooter\">"
    //    +option("A",optionA,bool,objc.specialType)
    //    +option("B",optionB,bool,objc.specialType)
    //    +option("C",optionC,bool,objc.specialType)
    //    +option("D",optionD,bool,objc.specialType)+"</div>";
}

/*************************** 类型1\2 ****************************************/
// 选项A、C函数
function optionAC(a,b) {
    return "<div class=\"myOption\" style=\"margin-right: 50px;\"><a>"+a+"</a><div class=\"option_bg\"><img src="+b+"></div></div>";
}

// 选项B、D函数
function optionBD(c,d) {
    return "<div class=\"myOption\"><a>"+c+"</a><div class=\"option_bg\"><img src="+d+"></div></div>";
}

/*************************** 类型3\4 ****************************************/
// 选项A、C函数
function option_AC(e,f) {
    return "<div class=\"myOption\" style=\"margin-right: 10px\"><a>"+e+"</a><div class=\"textOption\">"+f+"</div></div>";
}

// 选项B、D函数
function option_BD(g,h) {
    return "<div class=\"myOption\"><a>"+g+"</a><div class=\"textOption\">"+h+"</div></div>";
}

/*************************** 类型5 ****************************************/
// 选项A、B、C、D函数
function optionABCD(i,j) {
    return "<div class=\"myOption2\"><a>"+i+"</a><img src="+j+"></div>";
}

/*************************** 类型6 ****************************************/
// 选项A、B、C、D函数
function optionABCD_(k,l) {
    return " <div class=\"myOption2\"><a>"+k+"</a><label>"+l+"</label></div>";
}


//// 选项A、B、C、D节点(k:选项；l:选项内容；m:是否图片，>0：非图片);subtype(1:方图、0：长图)
//function option(k,l,bool,subtype) {
//    if (bool<0){// 文字
//        //return " <div class=\"myOption\" style='display:inline-block' onclick='optionClick(this)'>" +
//        //    "<a>"+k+"</a><label>"+l+"</label></div>";
//        var myRow1 = "<div class=\"myrow\">"+option_AC("A",this.optionA)+option_BD("B",this.optionB)+"</div>" ;
//        var myRow2 = "<div class=\"myrow\">"+option_AC("C",this.optionC)+option_BD("D",this.optionD)+"</div>" ;
//        return myRow1 + myRow2;
//
//    }else {// 图片
//        var picPath = networkPath+l;
//        if (subtype == 0){// 长图
//            //return "<div class=\"myOption\" style='margin: 5px' onclick='optionClick(this)'><a>"+k+"</a>" +
//            //    "<img style='width: 60%;margin-left: 10px' src="+picPath+" class=\"img-thumbnail\"></div>";
//            myRow1 = "<div class=\"myrow\">"+optionAC("A",this.optionA)+optionBD("B",this.optionB)+"</div>" ;
//            myRow2 = "<div class=\"myrow\">"+optionAC("C",this.optionC)+optionBD("D",this.optionD)+"</div>" ;
//            return myRow1 + myRow2;
//        }else {// 方图
//            //return "<div class=\"myOption\" style='display:inline-block' onclick='optionClick(this)'><a>"+k+"</a>" +
//            //    "<img src="+picPath+" class=\"img-thumbnail\" style='width: 100px'></div>";
//            myRow1 = "<div class=\"myrow\">"+optionAC("A",this.optionA)+optionBD("B",this.optionB)+"</div>" ;
//            myRow2 = "<div class=\"myrow\">"+optionAC("C",this.optionC)+optionBD("D",this.optionD)+"</div>" ;
//            return myRow1 + myRow2;
//        }
//    }
//}

//// 播放标记的节点
//function getPlayerImgNode() {
//    return "<img src="+localPath+"thy.png"+"  onclick='playMp3(this)'>";
//}

// 播放标记的节点
function getPlayerImgNode() {
    return "<img src="+localPath+"thy.png"+" style=\"width: 40px;height: 40px;border: none;margin-top: 0px\" onclick='playMp3(this)'>";
}

// 修改题号，将数字保留两位有效数字，如:6-->06
function fix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

//// 动态创建答题成绩界面
//function typeResult() {
//    // 1.
//    var my_length = dataArr.length;
//    var result_top = "<span><label>得分:</label><label  id='result_Score' style=\"color: #8FD33F\">0</label> </span>"
//        +"<span><label>答对:</label> <label id='result_Right' style=\"color: #8FD33F\">0</label> </span>"
//        +"<span><label>答错:</label><label id='result_Wrong'  style=\"color: #FF5D69; padding-left: 3px\">0</label> </span>"
//        +"<span><label>未做:</label> <label id='result_Undo' style=\"color: #363636\">"+my_length+"</label> </span>";
//
//    // 2.
//    var trs = "";
//    var col = 6;// 列
//    var my_row = parseInt(my_length / col) + 1;// 行
//    for (var x=0;x<my_row;x++){
//        var tds = "" ;
//        for (var  y=0;y<col;y++){
//            if (x == my_row-1 && y>4) break;
//            if (x==my_row-1 && y==4){
//                tds += "<td colspan='2' style='font-size: 0'>" +
//                    "<img id='checkPrompt' src="+localPath + "check_pic.png"+" style='width: 85px;display:none'></td>";
//
//                break;
//            }
//            var value =1+x*col+y;
//            tds += "<td><label>"+value+"</label></td>";
//        }
//        trs +="<tr>"+tds+"</tr>";
//    }
//
//    //3.
//    var table = "<table cellspacing=\"0px\" align=\"center\" width=\"100%\" style=\"margin: 0\">"+trs+"</table>";
//    $("#examination_result").append("<div id='result_Header'>"+result_top+"</div>"+"<div id='result_Footer'>"+table+"</div>");
//}

// 动态创建答题界面
function typeResult() {

    var my_length = dataArr.length;

    var span0 = "<span><label>得分:</label><label  id='resultScore' style=\"color: #8FD33F\">0</label> </span>";
    var span1 = "<span><label>答对:</label> <label id='resultRight' style=\"color: #8FD33F\">0</label> </span>";
    var span2 = "<span><label>答错:</label><label id='resultWrong'  style=\"color: #FF5D69\">0</label> </span>";
    var span3 = "<span><label>未做:</label> <label id='resultUndo' style=\"color: #363636\">40</label> </span>";
    var resultHeader = span0+span1+span2+span3;

    //var trs = "";
    //for (var x=0;x<7;x++){
    //    var tds = "" ;
    //    for (var  y=0;y<6;y++){
    //        if (x ==6 && y>3) break;
    //        var value =1+x*6+y;
    //        var td = "<td><label>"+value+"</label></td>";
    //        tds += td;
    //    }
    //    var tr = "<tr>"+tds+"</tr>"
    //    trs +=tr;
    //}

    var trs = "";
    var col = 6;// 列
    var my_row = parseInt(my_length / col) + 1;// 行
    for (var x=0;x<my_row;x++){
        var tds = "" ;
        for (var  y=0;y<col;y++){
            if (x == my_row-1 && y>4) break;
            if (x==my_row-1 && y==4){
                tds += "<td colspan='2' style='font-size: 0'>" +
                    "<img id='checkPrompt' src="+localPath + "check_pic.png"+" style='width: 80px'></td>";

                break;
            }
            var value =1+x*col+y;
            tds += "<td><label>"+value+"</label></td>";
        }
        trs +="<tr>"+tds+"</tr>";
    }


    var table = "<table cellspacing=\"0px\" align=\"center\" width=\"100%\" style=\"margin: 0px\">"+trs+"</table>";
    var repeatButton = "<div style='text-align: center;padding:35px 0px 25px '><a id='again' onclick='self.location=document.referrer;'>返回首页</a></div>";
    // var downloadButton = "<div style='text-align: center;padding:10px 0px'><a  id=\"openApp\" onclick='isWeiXin()'>更多测试下载艺考级App</a></div>";

    var contentHeader = "<div class=\"contentHeader\" id='resultHeader'>"+resultHeader+"</div>";
    var contentFooter = "<div class=\"contentFooter\" id='resultFooter'>"+table+repeatButton+"</div>";
    $(".carousel-inner").append("<div class=\"item\" id='result'>"+contentHeader+contentFooter+"</div>");


}


// 参数：order:题号；select：选择题号;tArray:存放选择答案的数组 (0:默认，未做；1：正确；2：错误)
function selectAnwser(order,select,tArray) {

    //alert(select);

    var  index = order - 1;
    var answer = dataArr[index]["answer"];
    select_Array[index]=select.charCodeAt()-64;

    //alert(select_Array);
    //Result_Array[index]=dataArr[index]["answer"];
    var labels = $("#resultFooter label");
    var label = labels[index];

    // 更改答题结果
    if (select == answer){// 正确
        tArray[index] = [order,1];
        label.className = 'right';
    }else {// 错误
        tArray[index] = [order,2];
        label.className = 'wrong';
    }

    var right = 0;
    var wrong = 0;
    var undo = 0;
    var  labels = $("#resultFooter label");
    for (var x= 0;x<labels.length;x++){
        var  label = labels[x];
        if (label.className == "right"){
            right++;
            Result_Array[index]=1;
        }else if (label.className == "wrong"){
            wrong++;
            Result_Array[index]=0;
        }else {
            undo++;
        }
    }

    $("#resultScore").text(2*right);
    $("#resultRight").text(right);
    $("#resultWrong").text(wrong);
    $("#resultUndo").text(undo);
}


/*********************************************** 事件 ******************************************************/
// 选项按钮点击事件
//function optionClick(id)
//{
//    // 恢复其他3各选项设置
//    var my_Options = $(id).siblings(".myOption");
//    for(var i=0;i<my_Options.length;i++){
//        $(my_Options[i]).children("a").removeClass("select")
//    }
//    // 设置选中按钮
//    $(id).children("a").addClass("select");
//
//    // 拿出题号
//    var index = parseInt($(id).parents(".item").find(".contentHeader h4").text())-1;
//    // 更改用户选项数组
//    select_Array[index] = $(id).children("a").text().charCodeAt()-64;
//    // 右侧展示结果栏
//    $("#result_Footer").find("table label")[index].className = "select";
//    if ($(id).children("a").text() == dataArr[index].answer){// 正确
//        Result_Array[index] = 1;
//    }else {// 错误
//        Result_Array[index] = 0;
//    }
//    var select_labels = $("#result_Footer").find("table .select");
//    $("#result_Undo").text(dataArr.length-select_labels.length);
//}


//$(".a").click(function(){
//    leftorright=$('.a').attr('class');
//
//}
// 进度条处理
function reviseProgressBar(seconds) {

    var order = parseInt($("#carousel-example-generic").find(".active h4").text());
    var intPercent=parseFloat(order/(dataArr.length),2);
    var charPercent = parseFloat(order/(dataArr.length),2)*100 +"%";
    if(intPercent<0.15){
        charPercent='15%';
    }
    // 进度条
    //$(".header .progressbarTitle").text(order+"/"+dataArr.length).css('width',charPercent);
    $(".header .progress-bar").text(order+"/"+dataArr.length).css('width',charPercent);

    // 时间
    if(seconds){
        $(".header label").text(seconds);
    }

    // 判断最后一题
    //var name ;
    //if (order == dataArr.length) {
    //    if (isPassFlag == 1){
    //        $(".footer").find(".right").addClass("disabledAnimation");
    //        name = "已提交"
    //        $(".right").removeAttr("data-slide");
    //        //leftorright='left';
    //
    //    }else {
    //        name = "提交答卷";
    //    }
    //}else {
    //    name = "下一题";
    //    $(".right").attr("data-slide","next");
    //    $(".footer").find(".right").removeClass("disabledAnimation");
    //}
    //$(".footer").find(".right").text(name);

    //如果提交过
    if(isPassFlag==1){

        $(".footer").find(".right").text("查看成绩");

    }else{
        if(order == dataArr.length){
            $(".right").removeAttr("data-slide");
            $(".footer").find(".right").text("提交答卷");
        }else{
            $(".right").attr("data-slide","next");
            $(".footer").find(".right").text("下一题");
        }
    }
}






// 最后一题:判断提交
function isLast(my_bool) {

    leftorright = 'right';
    //var v_id = $(e.target).attr('class');

    if ($(".footer").find(".right").text() == "提交答卷") {

        if (my_bool == true) {

            if ($("#resultUndo").text() > 0) {

                if (window.confirm("你有题目未做，确认提交吗?")) {
                    //sendData(my_bool);
                    //commitResult(true);
                    isNeedSend();
                }
            }else{
                isNeedSend();
            }
        }else{
            isNeedSend();
        }
    }
    else if($(".footer").find(".right").text() == "查看成绩"){
        $("#carousel-example-generic").carousel(dataArr.length);
    }

}
//function sendData(my_bool) {
    //isPassFlag = 1;
    //endAudioMusic();
    ////clearInterval(timer);
    ////stop();
    //commitResult(my_bool);



    // 翻转动画
    //$("#carousel-example-generic").addClass("commitAnimation");
    //setTimeout(commitResult(my_bool),250);
//}
//
//// 提交答卷 Result_Array:存放选择答案的数组 (0:默认,错误(结合另个数组一起判断);1：正确；)
function commitResult(isNeed) {


    isPassFlag = 1;
    endAudioMusic();
    clearInterval(timer);
    //stop();

    //console.log("进来判断答题结果啦....");
    //// 1> 右侧展示结果栏

    var labels = $("#resultFooter").find("table label");
    var right = 0;
    var wrong = 0;
    var undo = 0;
    var items = $("#carousel-example-generic").find(".item");

    var right_img = "<img id='right_img' src="+localPath + "right.png"+" style='width:30px; height:30px;'>";
    var wrong_img = "<img id='wrong_img' src="+localPath + "wrong.png"+" style='width:30px; height:30px;'>";



    for (var x= 0;x<dataArr.length;x++){
        var select_label = labels[x];
        var item = items[x];
        var  option_Answer = Result_Array[x];
        // 查看试题时，将用户的选项自动赋值
        if (isNeed != true && select_Array[x]!=0){
            var my_a = $(item).find(".myOption a");
            console.log("come in");
            my_a[select_Array[x]-1].className = 'select';
        }
        if (option_Answer == 1){// 正确
            console.log("正确："+x);
            right++;
            // 右侧展示区--正确标签
            select_label.className = "right";
            // 左侧选项区--正确标签

            if((!$(item).find(".myOption a.select").find("#right_img").length)){
                $(item).find(".myOption a.select").append(right_img);
            }

            if((!$(item).find(".myOption2 a.select").find("#right_img").length)){
                $(item).find(".myOption2 a.select").append(right_img);
            }


        }else if (option_Answer == 0){
            if (select_Array[x] == 0) {// 未做
                console.log("未做："+x)
                undo++;
                var undo_img = "<img id='undo_img' src="+localPath + "undo.png"+" style='width: 27%;height: auto;'>";
                // 未做标签
                //$(item).find(".contentHeader").append(undo_img);

                if((!$(item).find("#undo").length)){
                    $(item).append("<div id=\"undo\" style=\"text-align: center\">"+undo_img+"</div>");
                }
                //$("#placeholder").append(undo_img);
            }else {// 错误
                console.log("错误："+x)
                wrong++;
                select_label.className = "wrong";
                // 错标签
                $(item).find(".myOption a.select").append(wrong_img);
            }

            // 再给出正确标签
            var answer = dataArr[x].answer;
            //alert(dataArr[15].answer);
            var my_order = $(item).find(".myOption a");
            var my_orderaddmyOption2 = $(item).find(".myOption2 a");

            for (var m in my_order) {
                if (my_order[m].text == answer) {

                    if((!$(my_order[m]).find("#right_img").length)){
                        $(my_order[m]).append(right_img);
                    }
                }
            }
            for (var n in my_orderaddmyOption2) {
                if (my_orderaddmyOption2[n].text == answer) {

                    if((!$(my_orderaddmyOption2[n]).find("#right_img").length)){
                        $(my_orderaddmyOption2[n]).append(right_img);
                    }
                }
            }

        }


        //// 动态创建答题记录
        //typeResult();
        //$("#carousel-example-generic").carousel(40);
        //$(".right").attr("data-slide","next");
        //$("#placeholder").remove();
        //if(document.getElementById('abcd')){
        //    $("#abcd").remove();
        //}
        //
        //ifFadeInFooter(false);



        select_label.onclick = function () {


            if(!(document.getElementById('placeholder'))){
                var placeholder="<div id='placeholder'></div>";
                $("#carousel-example-generic").after(placeholder);
            }



            var order = parseInt(this.innerHTML-1);

            $(".header span") .remove();

            $("#carousel-example-generic").carousel(order);
            $("#carousel-example-generic").carousel("pause");

            // 暂停
            endAudioMusic();

        }
    }

    //$(".right").attr("data-slide","next");

    //如果是最后一题
    var compareElement = document.getElementById("result");
    if (compareElement.className == "item active"){
        $("#placeholder").remove();
        ifFadeInFooter(false);
        if(document.getElementById('abcd')){
            $("#abcd").remove();
        }
    }





    $("#result_Score").text(2*right);
    $("#result_Right").text(right);
    $("#result_Wrong").text(wrong);
    $("#result_Undo").text(undo);

    //// 2> 上一题、下一题
    //$(".footer").find(".right").addClass("disabledAnimation");
    ////setTimeout(function () {
    //    $(".footer").find(".right").text("已提交");
    //    //$("#carousel-example-generic").find(".right").text("正确");
    //    $("#checkPrompt").css({"display":"inline-block"})
    ////},250);

    //alert('here');
    // 3>.禁止重选
    var my_Options = $(".myOption");
    for(var c = 0;c<my_Options.length;c++) {
        $(my_Options[c]).find("a").addClass("dis");
        my_Options[c].onclick= function () {}
    }
    var my_Option2s = $(".myOption2");
    for(var c = 0;c<my_Option2s.length;c++) {
        $(my_Option2s[c]).find("a").addClass("dis");
        my_Option2s[c].onclick= function () {}
    }



    //4>.判断是否需要上传答题结果
    //判断是否显示
    if (isNeed == true){
        //console.log("需要上传");
        //isNeedSend();
        $("#carousel-example-generic").carousel(dataArr.length);
    }else {
        console.log("不用上传了");

        //$("#carousel-example-generic").carousel(0);

        //alert('here');
        //$("#carousel-example-generic").carousel("pause");

        // 暂停
        endAudioMusic();

        reviseProgressBar();
    }
}
//
// 判断是否需要上传答题结果
function isNeedSend() {


    //alert(select_Array);
    // 2007_15.txt
    localUnit = sessionStorage.getItem("unitKey");
    var data = {
        80008: {
            unit:localUnit,
            stageId:0,
            result:Result_Array.toString(),
            answer:select_Array.toString()
        }
    };
    $.appAjax(UUX_URL,data,function(datas){
        console.log(datas);
        if (datas =="fail"){// 账号异常登录
            if (confirm("账号异常登录，提交答题结果失败。请重新登录，并再次提交答题结果")){
                // 存入
                sessionStorage.setItem('select_Array',select_Array.toString());
                sessionStorage.setItem('Result_Array',Result_Array.toString());
                sessionStorage.setItem('repeat_send',1);
                location.href="login.html?Account=1";
            }
        }else {// 提交数据成功
            sessionStorage.setItem('repeat_send',"");
            commitResult(true);
        }

    }, function(){});
}

// 已经答卷
function is_already() {
    var record  = sessionStorage.getItem('select_Array');
    var rightOrWrongRecord  = sessionStorage.getItem('Result_Array');
    if(record==""){
        console.log("开始答题流程")
    }else{
        select_Array= record.split(",");
        Result_Array= rightOrWrongRecord.split(",");

        //$(".footer").find(".right").text("下一题");
        //isLast(false);
        commitResult(false);
    }
}

/*********************************************** end ******************************************************/
// 点击播放
function playMp3(player) {


    // 播放开始，打开播放标志的动画
    $(player).attr("src",localPath+"thy.jpg");

    // 拿出全文唯一的音乐播放器
    var audioPlayer = $(".header audio");
    var audio = audioPlayer[0];

    // 拿出item.class = active的
    var mp3 = dataArr[parseInt($("#carousel-example-generic").find(".active h4").text())-1].mp3;
    if (mp3){
        audio.src = networkPath+mp3+"";
        audio.play();
        audio.volume = 1;
    }else {
        audio.pause;
    }
}

// 结束播放
function endAudioMusic() {
    // 暂停动画
    var item = document.getElementsByClassName("item active")[0];
    var titleImg = $(item).find("h4 img");
    var titleOrder = $(item).find("h4").text();
    $(titleImg).attr("src",localPath+"thy.png");

    // 暂停播放mp3
    var audioPlayer = $(".header audio");
    var audio = audioPlayer[0];
    audio.src = "";
}



//// 播放结束，关闭播放标志的动画
//function endAudio() {
//    var item = document.getElementsByClassName("item active")[0];
//
//    var titleImg = $(item).find("h4 img");
//    var titleOrder = $(item).find("h4").text();
//
//    $(titleImg).attr("src","../image/thy.png");
//}

//// 重新做题
//function repeatAgain() {
//    location.reload()
//}

//function backToIndex(){
//    self.location.href="index.html";
//}

// 当调用 slide 实例方法时立即触发该事件。
$(function(){

    $('#carousel-example-generic').on('slide.bs.carousel', function () {

        // 暂停播放mp3
        endAudioMusic();

        //$("#carousel-example-generic").carousel(order);
        //$("#carousel-example-generic").carousel(3);


    });
});


// 当轮播完成幻灯片过渡效果时触发该事件。
$(function(){

    $('#carousel-example-generic').on('slid.bs.carousel', function () {

        $('html, body').animate({scrollTop:0}, 'slow');



        //如果点击右侧
        if(leftorright=='right'){

            ////如果不是考试成绩
            //var myElement = document.getElementsByClassName("item active");
            //if($(myElement[0]).find("h4").length){
            //
            //    //var my_title = $("#carousel-example-generic").find(".active h4").text();
            //    //var order = parseInt(my_title);
            //    //var order=parseInt($("#carousel-example-generic").find(".active h4").text());
            //
            //    var myTitle = $(myElement[0]).find("h4");
            //    var order = parseInt(myTitle[0].innerHTML);
            //    //如果是最后一题
            //    if (order == dataArr.length) {
            //        reviseProgressBar();
            //    }
            //}
            //如果不是考试成绩
            if($("#carousel-example-generic").find(".active h4").length){

                //alert('go');
                reviseProgressBar();

                ifshow=true;
            }

            else{

                ifshow=false;
            }

        }
        //左侧
        else{
            //如果不是考试成绩
            if($("#carousel-example-generic").find(".active h4").length){
                ifshow = true;
                reviseProgressBar();
            }
        }




        //默认回到左
        leftorright='left';

        ifFadeInFooter(ifshow);
        //}


        // 判断是否为最后一题
        var compareElement = document.getElementById("result");
        if (compareElement.className == "item active"){// 隐藏标题
            //$(".footer").css("display","none");

            var headerspan = "<span>考试成绩</span>";
            //display: inline-block;
            //background-color: #F2F2F2;
            //width: 35%;
            //border-radius: 20px;
            //font-size: 22px;
            //margin-bottom: 3%;

            //$("#progress").before(headerspan);
            $(".header").prepend(headerspan);

            //$(".header span").text("考试成绩");
            //$(".header span").css({"display": "inline-block","background-color": "#F2F2F2","width": "35%","border-radius": "20px","margin-bottom": "3%","font-size":"22px","color":"black"});

            return;
        }

        playMp3ByOrder(true);

        //var myElement = document.getElementsByClassName("item active");
        //var myTitle = $(myElement[0]).find("h4");
        //var order = parseInt(myTitle[0].innerHTML);
        //$(".header b").text(order);


    });
});

function ifFadeInFooter(bool){

    if(bool){
        $(".footer").show();
    }else{
        $(".footer").hide();
    }





    //$(".footer").hide();
    ////alert('hide');
    //
    //if(bool){
    //
    //    var footerHeight=60;
    //    var windowHeight = $(window).height();
    //    var contentHeight = $(".header").outerHeight()+$("#carousel-example-generic").height();
    //
    //    if(windowHeight-footerHeight+20 > contentHeight){
    //
    //        $(".footer").fadeIn("slow");
    //    }
    //
    //}
}


//// 当调用 slide 实例方法时立即触发该事件。
//$(function(){
//    $('#examina').on('slide.bs.carousel', function () {
//        endAudioMusic();
//    });
//});
//
//// 当轮播幻灯片过渡效果,结束时触发该事件。
//$(function(){
//    $('#examination_body-slide').on('slid.bs.carousel', function () {
//
//        var myTitle = $("#examination_body-slide").find(".active h4").text();
//
//        // 检测是否添加动画
//        if ( parseInt(myTitle) == dataArr.length){
//             $("#examination_body_click").children(".right").addClass("commitAnimation")
//         }
//    });
//});

// 定时器
var timer = setInterval(function(){
    var spans = $(".header label");
    var  label = spans[0];
    // mm:ss 如：09：08表示9分8秒
    var minute = parseInt(label.innerHTML.substr(0,2));
    var second = parseInt(label.innerHTML.substr(3,2));

    var seconds = minute*60 + second-1;
    var newMinute = parseInt(fix(seconds/60,2));
    var newSecond = parseInt(fix(seconds%60,2));

    label.innerHTML = fix(newMinute,2)+":"+fix(newSecond,2);
    if(seconds == '0'){
        // 清除计时器
        clearInterval(timer);
        alert("答题时间结束");
    }
}, 1000);

//数据模型
function OptionObjc(dict) {
    this.type = dict["type"];
    this.subType = dict["subType"];
    this.specialType = dict["specialType"];
    this.order = dict["order"];
    this.title = dict["title"];
    this.titleIcon = dict["titleIcon"];
    this.titleIcon1 = dict["titleIcon1"];
    this.optionA = dict["optionA"];
    this.optionB = dict["optionB"];
    this.optionC = dict["optionC"];
    this.optionD = dict["optionD"];
    this.answer = dict["answer"];
    this.mp3 = dict["mp3"];
    this.ttsStr = dict["ttsStr"];
    this.ttsmp3= dict["ttsmp3"];
}


//$(window).scroll(function(){
//
//    var footerHeight=60;
//    var scrollTop = $(window).scrollTop();
//    var windowHeight = $(window).height();
//
//    var contentHeight = $(".header").outerHeight()+$("#carousel-example-generic").height();
//
//    if(document.getElementsByTagName('.header span')){
//        var topicnum=$(".header span").text();
//        if(!(topicnum=='考试成绩')){
//            //if(scrollTop + windowHeight-footerHeight > bodyHeight){
//            if(contentHeight-scrollTop-20<windowHeight-footerHeight){
//
//                //alert('go?');
//                //$("footer").animate({height:'1200px'});
//                $(".footer").fadeIn("slow");
//            }
//            else {
//                $(".footer").fadeOut("slow");
//            }
//        }
//    }
//
//});

var my_url = '';
function playMp3ByOrder(bool) {
    if(bool) {
        playTitleMp3();
    }
}

function playTitleMp3() {

    // 拿出当前页面的MP3路径
    var my_title = $("#carousel-example-generic").find(".active h4").text();
    var order = parseInt(my_title);
    var mp3_url = mp3Path + dataArr[order - 1].ttsmp3;

    // 拿出全文唯一的音乐播放器
    var audioPlayer = $("#titlePlayer audio");
    var audio = audioPlayer[0];
    // 拿出item.class = active的
    if (mp3_url){
        audio.src = mp3_url;
        audio.play();
        audio.volume = 1;
    }else {
        audio.pause;
    }
}

function endTitlePlay() {
    // 暂停播放mp3
    var audioPlayer = $("#titlePlayer audio");
    var audio = audioPlayer[0];
    audio.src = "";
}

window.onload = function () {
    //setTimeout(function(){
        if (browser().mobile){
            var w = $(window).width()+'px';
            //var h =  $(window).height()+'px';
            var h='1000px';
            var y = '-'+h;
            var a ='<div id="abcd" style="width: '+w+';height:'+h+';margin-top: -190%;position: absolute" onclick="dismiss()"></label></div>'
            $('body').append(a);
        }
    //},2000);

};

function dismiss() {
    $("#abcd").remove();
    playTitleMp3();
}