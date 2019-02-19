var KGPayManger = function () {

	var APP_INFO_UTILS = "com.space.base.AppInfoUtils";
	var DEVICE_INFO_UTILS = "com.space.base.DeviceInfoUtils";
	var PAY_MANAGER = "com.space.tv.lolipop.payment.PayManager";
	var REMOTE_MANAGER = "com.space.remote.RemoteManager";
	var TVSTORE_MANAGER = "com.space.tvstore.TvStoreManager";
	var UPLOAD_DATA_MANAGER = "com.space.data.statistics.protocal.UploadDataManager";
	var AD_MANAGER = "com.space.ad.adsdk_space.AdManager";

	var userInfoCount = 0;
	var loopchecktime = 0;
	this.isMounthPayed = false;
	this.isCheckDone = false;
	this.isloopchecking = false;

	this.loli_userId = "";
	this.loli_appName = "";
	this.loli_packageName = "";
	this.loli_appVersion = "";
	this.loli_channelId = "";
	this.loli_sysVersion = "";
	this.loli_deviceUa = "";

	this.loli_orderId = "";

	this.ispaying = false;
	this.ispayed = false;
	this.custompaytimeout = false;
	this.custompaying = false;
	this.custompaymark = false;
	var gthis = this;

	var payServerUrl = "http://202.99.114.74:57351/alajia_pay/unicompay/monthpayserver.php";

	var KGCONF = {};
	KGCONF.paynotifyurl = "http://202.99.114.74:57351/alajia_pay/unicompay/cp_bbt_notify.php";
	KGCONF.propName = "阿拉佳编程大冒险25元包月";
	KGCONF.propPrice = "1";
	KGCONF.channelParam1 = "yjbcdmxby025";

	this._payCustomCons = function (consstr) {
		console.log("PayManager:" + consstr);
	};
	this.requestOrderId = function (gameId,payoverCallback,ctx) {

		this.payoverCallback=payoverCallback;
		this.callbackctx=ctx;
		// this.payoverCallback.call(this.ctx,1111);
		this.ispaying = true;
		var sData = "fnctype=requestOrderId&userId=" + this.loli_userId + "&gameId=" + gameId + "&channelId=" + this.loli_channelId;
		axios({
			url: payServerUrl,
			method: 'post',
			data: sData,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
			.then(function (response) {
				console.log(response);
				gthis._payCustomCons("requestOrderId success orderid:" + response.data);
				gthis.loli_orderId = response.data;
				try {
					gthis._payCustomCons("do subsPay");
					gthis.bbtSubsPay(response);
				} catch (error) {
					gthis._payCustomCons("subsPay error:" + error);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
	this.bbtSubsPay = function (tradeNo) {
		try {
			var p = "cyclePay";
			var name = '["","' + PAY_MANAGER + '","' + p + '","Context","' + tradeNo + '","' + KGCONF.propName + '","' + KGCONF.propPrice + '","' + KGCONF.paynotifyurl + '"]';
			this._payCustomCons("请求计费 start: " + name);
			JavaScript2Java.javaExecute(name);
		} catch (error) {
			this._payCustomCons("请求计费 error :" + error);
		}
	};
	//     鉴权接口修改：传入参数添加String type字段，type值为1标识是按次计费，值为2标识是周期计费
	// public static void checkValid(final Context ctx, String url, String key, String type) {}

	// 新增按次计费调用接口：
	// public static void oncePay(final Context ctx, String tradeNo, String propName, String propPrice, String notifyUrl){}
	// 相较原有周期性计费接口，只是函数名不一样，传参一样
	this.subsPay = function (code) {

		console.log("PayManager:java subsPay code:" + code);
		if (code == 0) {//success
			this.ispayed = true;
			console.log("PayManager:toAutoRunUrl");
			// this.toAutoRunUrl();
			setTimeout(function () {
				gthis.ispaying = false;
			}, 10000);
			this.sendPayResult();
		} else if (code == -18003) {//cancel
			this.ispayed = false;
			o_tjltPayManger.ispaying = false;
		} else {//failed
			this.ispayed = false;
			o_tjltPayManger.ispaying = false;
		}
		if(this.payoverCallback&&this.ctx){
			this.payoverCallback.call(this.ctx,code);
		}else{
			console.log("PayManager:lost call back function or ctx");
		}
		
	};
	this.toAutoRunUrl = function () {
		console.log("PayManager:autoRunUrl is:" + window.autoRunUrl);
		if (window.autoRunUrl) {
			window.location.href = window.autoRunUrl;
			o_tjltPayManger.ispaying = false;
		}else{
			console.log("you have not autoRunUrl");
		}

	};
	this.sendPayResult = function (code) {
		var sData = "fnctype=sendPayResult&userId=" + this.loli_userId + "&orderId=" + this.loli_orderId + "&status=" + code;
		console.log("PayManager:" + code);
		axios({
			url: payServerUrl,
			method: 'post',
			data: sData,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
			.then(function (response) {
				console.log("sendPayResult success " + response.data);
				// gthis.toAutoRunUrl();
			})
			.catch(function (error) {
				console.log("sendPayResult success " + error);
				// gthis.toAutoRunUrl();
			});

	};
	this.getRemoteUserInfo = function () {
		setTimeout(function () {
			console.log("timeout auto to checkdone");
			gthis.isCheckDone = true;
		}, 5000);
		try {
			this._payCustomCons("js 请求用i户信息 开始 共7项");
			this.getInfo0();
			this.getInfo1();
			this.getInfo2();
			this.getInfo3();
			this.getInfo4();
			this.getInfo5();
			this.getInfo6();
		} catch (e) {
			this._payCustomCons("js 请求用户信息 发生错误：" + e);
		}
	};

	this.getInfo0 = function () {
		var name = '["","' + APP_INFO_UTILS + '","getAppName","Context"]';
		JavaScript2Java.javaExecute(name);
	};
	this.getInfo1 = function () {
		var name = '["","' + APP_INFO_UTILS + '","getPackageName","Context"]';
		JavaScript2Java.javaExecute(name);
	};
	this.getInfo2 = function () {
		var name = '["","' + APP_INFO_UTILS + '","getVersionName","Context"]';
		JavaScript2Java.javaExecute(name);
	};
	this.getInfo3 = function () {
		var name = '["","' + APP_INFO_UTILS + '","getChannelId","Context"]';
		JavaScript2Java.javaExecute(name);
	};
	this.getInfo4 = function () {
		var name = '["","' + DEVICE_INFO_UTILS + '","getSysVersion","Context"]';
		JavaScript2Java.javaExecute(name);
	};
	this.getInfo5 = function () {
		var name = '["","' + DEVICE_INFO_UTILS + '","getDeviceUa","Context"]';
		JavaScript2Java.javaExecute(name);
	};
	this.getInfo6 = function () {
		var name = '["","' + PAY_MANAGER + '","getUserId","Context"]';
		JavaScript2Java.javaExecute(name);
	};

	this.getUserInfoCallBack = function () {
		userInfoCount++;
		this._payCustomCons("java返回用户信息 成功：" + userInfoCount + " of 7");
		if (userInfoCount == 7) {
			this.bbtCheckValid();
			this.userRegist();
			this.userLogin();
		}
	};
	this.bbtCheckValid = function () {
		console.log("PayManager:js bbtCheckValid");
		var name = '["","' + PAY_MANAGER + '","checkValid","Context","","' + KGCONF.channelParam1 + '"]';
		try {
			JavaScript2Java.javaExecute(name);
		} catch (error) {
			console.log(error);
		}

	};
	this.checkValid = function (code, prductcode) {
		console.log("PayManager:java authPermission code:" + code);
		console.log("PayManager:java authPermission prductcode:" + prductcode);
		if (code == 0) {
			this.ispayed = true;
		} else {
			this.ispayed = false;
		}
		this.isCheckDone = true;
	};

	this.userRegist = function () {
		console.log('PayManager:start userRegist');
		var sData = "fnctype=userRegist&userId=" + this.loli_userId + "&channelId=" + this.loli_channelId +
			"&appName=" + this.loli_appName + "&appPackageName=" + this.loli_packageName + "&appVersionName=" + this.loli_appVersion +
			"&sysVersion=" + this.loli_sysVersion + "&deviceUa=" + this.loli_deviceUa;

		axios({
			url: payServerUrl,
			method: 'post',
			data: sData,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
			.then(function (response) {
				console.log("PayManager:userRegist success state:" + response.data);
				localStorage.setItem("registed", 1);
			})
			.catch(function (error) {
				console.log("PayManager:userRegist ajax error:" + error);
			});

	};
	this.userLogin = function () {
		this.sendLoginLog();

	};
	this.sendLoginLog = function () {

		var sData = "fnctype=userLogin&userId=" + this.loli_userId;
		axios({
			url: payServerUrl,
			method: 'post',
			data: sData,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
			.then(function (response) {
				console.log("PayManager:userlogin success state:" + response.data);
			})
			.catch(function (error) {
				console.log("PayManager:userlogin ajax error:" + error);
			});
	};
	this.sendPay2Log = function (str) {

		// var sData = "fnctype=sendPay2Log&userId=" + this.loli_userId + "&orderId=" + this.loli_orderId + "&content=" + str;
		// axios({
		// 	url: payServerUrl,
		// 	method: 'post',
		// 	data: sData,
		// 	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		// })
		// 	.then(function (response) {
		// 		console.log("sendPay2Log success " + response);
		// 	})
		// 	.catch(function (error) {
		// 		console.log("sendPay2Log error " + error);
		// 	});
	};
};




