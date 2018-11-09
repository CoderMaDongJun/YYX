
//解析数据   zqb

//保存登陆信息
function saveLogonInfo(data){
    data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
    if(data!=null){
        console.log("返回的sid"+data.sid);
        setCookie("userid",data.id,1);
        setCookie("sid",data.sid,1);
        setCookie("havepay",data.havePay,1);
        this.status = 1;
    }else{
        alert("登陆失败，请重新登录");
    }
}

function mntlist(data){
    var arrayObj = new Array();//创建一个数组
    for(var item in data){
        var index = item;
        arrayObj.push({
            answerRecord:data[index].answerRecord,
            create_date:data[index].create_date,
            creation_date:data[index].creation_date,
            discount:data[index].discount,
            from:data[index].from,
            grade:data[index].grade,
            info:data[index].info,
            num:data[index].num,
            pic:data[index].pic,
            picurl:data[index].picurl,
            price:data[index].price,
            reviewTime:data[index].reviewTime,
            rightOrWrongRecord:data[index].rightOrWrongRecord,
            shareUrl:data[index].shareUrl,
            spetype:data[index].spetype,
            stageid:data[index].stageid,
            subjectCount:data[index].subjectCount,
            time:data[index].time,
            title:data[index].title,
            txt:data[index].txt,
            unit:data[index].unit,
            unitinfo:data[index].unitinfo,
            unitName:data[index].unitName,
            url:data[index].url,
            userid:data[index].userid,
            score:data[index].score,
            rightCount:data[index].rightCount,
            wrongCount:data[index].wrongCount
        })
    }
    return arrayObj;
}

function tryUsemntData(key,data){
        this.objectid =key ;
        this.answerRecord=data.answerRecord;
        this.create_date=data.create_date;
        this.creation_date=data.creation_date;
        this.discount=data.discount;
        this. from=data.from;
        this.grade=data.grade;
        this.info=data.info;
        this.num=data.num;
        this.pic=data.pic;
        this.picurl=data.picurl;
        this.price=data.price;
        this.reviewTime=data.reviewTime;
        this.rightOrWrongRecord=data.rightOrWrongRecord;
        this.shareUrl=data.shareUrl;
        this.spetype=data.spetype;
        this.stageid=data.stageid;
        this.subjectCount=data.subjectCount;
        this.time=data.time;
        this.title=data.title;
        this.txt=data.txt;
        this.unit=data.unit;
        this.unitinfo=data.unitinfo;
        this.unitName=data.unitName;
        this.url=data.url;
        this.userid=data.userid;
        this.score=data.score;
        this.rightCount=data.rightCount;
        this.wrongCount=data.wrongCount
}

function tryUsedxData(key,data){
        this.objectid =key ;
        this.answerRecord=data.answerRecord;
        this.create_date=data.create_date;
        this.creation_date=data.creation_date;
        this.discount=data.discount;
        this. from=data.from;
        this.grade=data.grade;
        this.info=data.info;
        this.num=data.num;
        this.pic=data.pic;
        this.picurl=data.picurl;
        this.price=data.price;
        this.reviewTime=data.reviewTime;
        this.rightOrWrongRecord=data.rightOrWrongRecord;
        this.shareUrl=data.shareUrl;
        this.spetype=data.spetype;
        this.stageid=data.stageid;
        this.subjectCount=data.subjectCount;
        this.time=data.time;
        this.title=data.title;
        this.txt=data.txt;
        this.unit=data.unit;
        this.unitinfo=data.unitinfo;
        this.unitName=data.unitName;
        this.url=data.url;
        this.userid=data.userid;
        this.score=data.score;
        this.rightCount=data.rightCount;
        this.wrongCount=data.wrongCount
}

// 支付页面--套题信息
function pay_page_start(data){
    this.goodid = data.goodid;
    this.title = data.title;
    this.cost = data.cost;
    this.r_reduce = data.r_reduce;
    this.discount = data.discount;
    this.price = data.price;
    this.pic = data.pic;
    this.grade = data.grade;
    this.from = data.from;
    this.info = data.info;
    this.create_date = data.create_date;
    this.redPackid = data.redPackid;
    this.redcount = data.redcount;
    this.ispay = data.ispay;
}

// 支付页面--支付二维码
function pay_page_QRCode(data) {
    this.code_url = data.code_url;
    this.out_trade_no = data.out_trade_no;
}

// 登录信息
function login_model(data) {
    this.userid = data.id;
    this.sid = data.sid;
    this.havePay = data.havePay;
}

//保存答案
function SaveResult_model(data) {
    this.r = data.r;
    this.info = data.info;
}


// 支付配置
function weixinconfig(data){
    this.appId = data.appId;
    this.timestamp = data.timestamp;
    this.nonceStr = data.nonceStr;
    this.signature = data.signature;
}


function gzh_Pay(data){
    this.appid = data.appid;
    this.partnerid = data.partnerid;
    this.prepayid = data.prepayid;
    this.noncestr = data.noncestr;
    this.timestamp = data.timestamp;
    this.sign = data.sign;
}