
const crypto = require("crypto")
  ;

//错误代码
exports.errcode={
  0: "系统错误",

  // 1-100 账户相关
  1: "该ID已存在",
  2: "该ID不存在",
  3: "密码错误",
  4: "需要重新登录",

  //
  101: '缺少该字段'
};

//获取传递的参数
exports.getReqParamter=function (req,res,args,name,required) {
  if (req.params[name]!==null && (typeof req.params[name]!=='undefined')){
    args[name]=req.params[name]
  }else if (req.query[name]!==null && (typeof req.query[name]!=='undefined')){
    args[name]=req.query[name]
  }else if (req.body[name]!==null && (typeof req.body[name]!=='undefined')){
    args[name]=req.body[name]
  }else{
    if (required!==null && (typeof required!=='undefined')){
      exports.sendError(req,res,101,name);
      return false
    }else{
      return true
    }
  }
  return true
};

//以json格式返回正确值结果
exports.sendSuccess=function (req,res,obj={}) {
  return res.send(Object.assign(obj,{status:'success'}))
};
//返回错误代码
exports.sendError=function (req,res,errcode=0,errString) {
  if(typeof errcode!=='number'){
    errString=errcode;
    errcode=0;
  }else{
    if(typeof errString==='undefined' || errString===null){
      errString=exports.errcode[errcode]
    }else{
      errString = exports.errcode[errcode] + '-' + errString
    }
  }
  json={
    status:false,
    msg:errString,
    code:errcode
  };
  console.error(json.msg);
  return res.json(json)
};

//解析sequelize catch的err
exports.catchError=function (req, res) {
  return function (err) {
    console.log('Error: ',err);
// 错误有两种
// 1：sequelize报的错，这个类型的错误存在sql属性，根据sql属性区别；在sequelize的错误中，有的存在errors，有的不存在
// 2：代码中抛出的错误，没有sql属性
    let errArr=[];
    if(exports.isExist(err.sql)){
      errArr = !exports.isExist(err.errors) ? [err.message] : [err.errors[0].message]
    }else{
      errArr = err.message.split(',')
    }
    exports.sendError(req,res,errArr[0],errArr[1])
  }
};

//md5加密
exports.md5=function(data) {
  return crypto.createHash("md5").update(data).digest("hex");
};

exports.isExist=(arg)=>{
  if(arg !== null && arg !== undefined){
    return true
  }else{
    return false
  }
};