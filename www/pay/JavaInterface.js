/**
 * Created by JUNXIAN.LIU on 2016/12/12.
 */
 
var javaClassName = "com.space.jsji.JavaInterface";
var javaMethodName = "javaExecute";

/**
 * JavaInterface.javaExecute(params, 2);
 * 第一个参数params,jsonArray类型字符串,第一个元素是要调用的java函数名
 */

// javascript调用java入口函数
function javaExecute(params) {
 console.log("start javaExecute");
 try
 {
   console.log("start t5 jsji");
   JavaInterface.javaExecute(params, 2);
 }
 catch (e)
 {
   console.log(e);
   console.log("start laya jsji");
   //a、创建类
   var sdkClass = PlatformClass.createClass(javaClassName);
   //String转array
   var array=JSON.parse(params); 
   //b、调用静态函数
   sdkClass.call(javaMethodName, params, 1);
 }
}

// 被java调用函数
function javascriptExecute(params) {
 console.log("start javascriptExecute1");
 doThing(params);
}

//自定义函数体
function doThing(params) {
 var moduleName = params[0];
 var className = params[1];
 var methodName = params[2];
 console.log("PayManager: _____moduleName:"+moduleName+"_____className:"+className+"_____methodName:"+methodName);
 switch (methodName){
   case "getAppName":
     o_tjltPayManger._payCustomCons("appName: "+params[3]);
     o_tjltPayManger.loli_appName=params[3];
     o_tjltPayManger.getUserInfoCallBack();
     break;
   case "getPackageName":
     o_tjltPayManger._payCustomCons("packageName: "+params[3]);
     o_tjltPayManger.loli_packageName=params[3];
     o_tjltPayManger.getUserInfoCallBack();
     break;
   case "getVersionName":
     o_tjltPayManger._payCustomCons("appVersion: "+params[3]);
     o_tjltPayManger.loli_appVersion=params[3];
     o_tjltPayManger.getUserInfoCallBack();
     break;
   case "getChannelId":
     o_tjltPayManger._payCustomCons("channelId: "+params[3]);
     o_tjltPayManger.loli_channelId=params[3];
     o_tjltPayManger.getUserInfoCallBack();
     break;
   case "getSysVersion":
     o_tjltPayManger._payCustomCons("sysVersion: "+params[3]);
     o_tjltPayManger.loli_sysVersion=params[3];
     o_tjltPayManger.getUserInfoCallBack();
     break;
   case "getDeviceUa":
     o_tjltPayManger._payCustomCons("deviceUa: "+params[3]);
     o_tjltPayManger.loli_deviceUa=params[3];
     o_tjltPayManger.getUserInfoCallBack();
     break;
   case "getUserId":
     o_tjltPayManger._payCustomCons("userId："+params[3]);
     o_tjltPayManger.loli_userId=params[3]+"";
      o_tjltPayManger.getUserInfoCallBack(params[3]);
     break;
   case "cyclePay":
   case "oncePay":
     console.log(methodName+"__"+params[3]);
       o_tjltPayManger.subsPay(params[3]);
     break;
   case "checkValid":
     console.log(methodName+"__"+params[3]);
       o_tjltPayManger.checkValid(params[3]);
     break;
   case "startPay":
     console.log("PayManager: startPay"+params[3]+"___"+params[4]);
       // if(params[3]=="payresult"){
         // o_tjltPayManger.subsPay2(params[4]);
       // }else{
         // o_tjltPayManger.sendPay2Log(params[3]+"__"+params[4]);
       // }
     break;
   case "openAd":
     break;
   default:
     break;
 }
}