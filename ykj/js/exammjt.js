/**
 * Created by yogolo on 2016/11/28.
 */

// 数据源，盛放若干cardinfo
var dataSource;
$(document).ready(function () {
    geturl();
    if(getLocationParam("type")==2){    // 2：单项练习
        var data = { 80002: { } }
    }else{                              // 1：模拟试题
        var data = { 80001: { } }
    }
    $.appAjax(UUX_URL,data,  function(datas){
        dataSource = datas;
        my_data();
    }, function(){ } );
    changeActive(1);
});

// 将数据生成卡片
function my_data() {
    for(var index in dataSource){
        var aa= my_card(index);
        $("#s1").append(aa);
        gepr(index)
    }
}

// 卡片上layout用户分数
function gepr(index){
    var cardInfo = dataSource[index];
    var score =cardInfo.score;
    var total_score=cardInfo.subjectCount*2;
    var id ="my_id"+index;
    var my_div=$("#"+id);
    if((my_div==null || my_div=="" || typeof(my_div)=="undefined")){
       return
    }
    my_div.circleProgress(
        {
        value: score/total_score,
        size: 80,
        fill: {
            gradient: ["red", "orange"]
        },
        emptyFill:"pink"
     }
    );
}

// layout不同的card
function my_card(index) {
    var my_row = "";
    if(checkCard_HaveScore(index)){
        my_row= mycard1(index);
    }else{
        my_row= mycard2(index);
    }
    return my_row;
}

// 检查是否有答过题目的记录
function checkCard_HaveScore(index)
{
    var cardInfo = dataSource[index];
    var score =cardInfo.score;
    var  rightCount =cardInfo.rightCount;
    var  wrongCount =cardInfo.wrongCount;
    if(score >0  || (score==0 && (rightCount > 0 || wrongCount >0)) ) {
        return true;
    }else{
        return false;
    }
}

// 可以检查试卷的卡片
function mycard1(index){
    var cardInfo = dataSource[index];
    var  title =cardInfo.title;
    var  score =cardInfo.score;
    var  rightCount =cardInfo.rightCount;
    var  wrongCount =cardInfo.wrongCount;
    var  name ="my_id"+index;
    var my_row =
        "<div class=\"col-xs-3\">" +
            "<div class=\"white_card\">" +
                "<h4>"+title+"</h4>" +
                "<table  class=\"table\">" +
                    "<tr>" +
                        "<td  height='100px' colspan='2' style='border-top: 0;text-align: center ;padding: 0'>" +
                            "<div style='padding:0;height: 100%; margin-left:50% ;text-align:left;'> " +
                                "<div style='margin-top:10px;margin-left: -40px; width: 80px;height: 80px;text-align: center' id="+name+"></div>"+
                                "<div style='margin-top:-60px;margin-left: -40px; width: 80px;height: 20px;text-align: center'> " +
                                    "<div style='font-size: 30px ;color: red ;display: inline-block'>"+score+"</div>" +
                                "</div>"+
                            "</div>"+
                        "</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td class='middle_note'>"+rightCount+"</td>" +
                        "<td class='middle_note'>"+wrongCount+"</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td class='middle_answer'>答对</td>" +
                        "<td class='middle_answer'> 答错</td>" +
                    "</tr>" +
                "</table>" +
                "<a class='btn btn-primary btn-large btn-block my_start_button'  onclick='start_or_Check("+index+",1)'\"> 开始答题</a>" +
                "<a class='btn btn-primary btn-large btn-block my_checkButton'  onclick='start_or_Check("+index+",2)'\"> 查看试卷</a>" +
            "</div>" +
        "</div>" ;
    return my_row;
}

// 不可以检查试卷的卡片
function mycard2(index)
{
    var cardInfo = dataSource[index];
    var  title =cardInfo.title;
    var  score =cardInfo.score;
    var  rightCount =cardInfo.rightCount;
    var  wrongCount =cardInfo.wrongCount;
    var  name ="my_id"+index;
    var myrow =
        "<div class=\"col-xs-3\">" +
            "<div class=\"white_card\">" +
                "<h4>"+title+"</h4>" +
                "<table  class=\"table\">" +
                    "<tr>" +
                        "<td height='100px'  style='border-top: 0'>" +
                            "<div style='padding:0;height: 100%; margin-left:50% ;text-align:left;'> " +
                                "<div style='padding:0; margin-left: -40px; width: 80px;height: 80px;text-align: center' id="+name+"></div>"+
                                "<div style='padding:0; margin-top:-60px;margin-left: -40px; width: 80px;height: 20px;text-align: center'>" +
                                    "<div style='font-size: 30px ;color: red ;display: inline-block'>"+score+"</div>" +
                                "</div>"+
                            "</div>"+
                        "</td>" +
                    "</tr>" +
                "</table>" +
                "<p class='my_score'>满分80共40题</p>" +
                "<p class='my_time'>答题时间50分钟 </p>" +
                "<a class='btn btn-primary btn-large btn-block start_button' " +
                    "onclick='start_or_Check("+index+",1)'> " +
                        "开始答题" +
                "</a>" +
            "</div>" +
        "</div>" ;
    return myrow;
}

// 开始答题、检查试卷按钮点击事件;item:代表数据源内索引;type:1代表开始答题;2:代表检查试题
function start_or_Check(item,button_type) {
    if (isLogin()){
        if (isPay()){
            var cardinfo = dataSource[item];
            sessionStorage.setItem('txtKey',cardinfo.txt);
            sessionStorage.setItem('unitKey',cardinfo.unit);

            if(button_type == 2){// 检查试卷
                // 存入
                sessionStorage.setItem('select_Array',cardinfo.answerRecord);
                sessionStorage.setItem('Result_Array',cardinfo.rightOrWrongRecord);

                if(browser().mobile){
                    self.location.href="tryExaminationForPhone.html";
                }else{
                    self.location.href="tryExamination.html";
                }
            }else {// 开始答题
                sessionStorage.setItem('select_Array',"");
                sessionStorage.setItem('Result_Array',"");
                if(browser().mobile){
                    self.location.href="tryExaminationForPhone.html?type="+getLocationParam("type");
                }else{
                    self.location.href="tryExamination.html?type="+getLocationParam("type");
                }
            }
        }else {
            alert_msg(type_default,"请购买试卷,再来答题");
            setTimeout(function(){
                window.location.href="sale.html";
            },1000);
        }
    }else {
        alert_msg(type_default,"请登录!再来答题");
        setTimeout(function(){
            window.location.href="login.html";
        },1000);
    }
}