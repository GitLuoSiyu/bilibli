/**
 * Created by 272689 on 2017/5/17.
 */
window.DepponCfg = function() {
    // var LoginUrl = 'https://www.deppon.com';//正式环境
    var LoginUrl = 'http://owstest.deppon.com'; //测试环境
    // var LoginUrl = 'http://owstest.deppon.com'; //测试环境
    //var LoginUrl = 'https://owstest.deppon.com/testenv/2';//测试环境(德企)

    //var mapLLUrl = 'http://10.230.28.182:8280/pda-web/track/position.do?t=';//货物地图获取经纬度测试环境
    //var mapReceiveUrl = 'http://10.230.28.182:8280/pda-web/track/apppage.do?waybillNo='; //收件货物地图点击跳转测试环境
    //var mapTrackUrl = 'http://10.230.28.182:8280/pda-web/track/apppage.do?waybillNo='; //派件货物地图点击跳转测试环境

    var hotLineUrl = 'https://oss.deppon.com/robot/wxChat_deppon.html?sysNum=1476067342641247&receiveId=&sourceId=255'; //在线客服正式环境
    var mapLLUrl = 'https://pdaweb.deppon.com/pda-web/track/position.do?t='; //货物地图获取经纬度正式环境
    var mapReceiveUrl = 'https://pdaweb.deppon.com/pda-web/receive/apppage.do?waybillNo='; //收件货物地图点击跳转正式环境
    var mapTrackUrl = 'https://pdaweb.deppon.com/pda-web/track/apppage.do?waybillNo='; //派件货物地图点击跳转正式环境

    var sysCode = "MOW";

    //定制封装所有的loading提醒，已经定制样式
    var $ionicLoading = null;
    var setION = function(obj) {
        $ionicLoading = obj
    }; //这句是为了从初始页面传入$ion服务
    var myNote = function(content, timeout) {
        $ionicLoading
            .show({
                noBackdrop: true,
                template: "<img src='img/loadingR.GIF' style='width:30%;'/>",
                duration: timeout || 1500
            })
    };

    //定制封装所有的弹出提醒，弹出提醒无取消按钮
    var $ionicPopup = null;
    var setAlert = function(obj) {
        $ionicPopup = obj
    }; //这句是为了从初始页面传入$ionicPopup服务
    var myAlertOne = function(content, title) {
        var alert = $ionicPopup.alert({
            title: title || '温馨提醒',
            template: content
        });
        alert.then(function(res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };


    //定制封装所有的弹出提醒，弹出提醒有取消按钮
    var myAlertTow = function(content, title) {
        var confirm = $ionicPopup.confirm({
            title: title || '温馨提醒',
            template: content
        });
        confirm.then(function(res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        })
    };
    /*
     * 提示框(没有按钮)
     * */
    var warningInfo = function(content, time) {
        $ionicLoading.show({
            template: content,
            duration: time || 2000
        });
    };
    var uuid = function() {
        var s = [];
        var hexDigits = "0123456789ABCDEF";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23];

        var uuid = s.join("");
        return uuid;
    };
    //创建缓存封装, 在LocCache中不能进行自调用
    var LocCache = function() {
        var data = {};
        var conn = {};
        //保存缓存数据
        conn.saveLocCache = function(key, val) {
            try {
                data = localStorage.setItem(key, angular.toJson(val));
                return data;
            } catch (e) {
                return false;
            }
        };
        //调用缓存数据
        conn.getLocCache = function(key) {
            try {
                data = JSON.parse(window.localStorage.getItem(key));
                return data;
            } catch (e) {
                return false;
            }
        };

        //清除缓存
        conn.clearLocCache = function(key) {
            window.localStorage.removeItem(key)
        };
        return conn;
    }();

    // 创建缓存封装, 在SessionCache中不能进行自调用
    var SessionCache = function() {
        var data = {};
        var conn = {};
        // 保存缓存数据
        conn.saveSessionCache = function(key, val) {
            try {
                data = sessionStorage.setItem(key, angular.toJson(val));
                return data;
            } catch (e) {
                return false;
            }
        };
        // 调用缓存数据
        conn.getSessionCache = function(key) {
            try {
                data = JSON.parse(window.sessionStorage.getItem(key));
                return data;
            } catch (e) {
                return false;
            }
        };

        // 清除缓存
        conn.clearSessionCache = function(key) {
            window.sessionStorage.removeItem(key)
        };
        return conn;
    }();


    //unicode转码
    var unicode = function(input) {

        var matches = input.match(/[^\x00-\xff]/g);
        if (matches) {
            for (var i = 0; i < matches.length; ++i) {
                input = input.replace(/[^\x00-\xff]/, "\\u" + parseInt(matches[i].charCodeAt(0), 10).toString(16));
            }
        }
        return input;
    };
    var coverage = function(index) {
        if (index <= 9) {
            //alert("coverage+"+index+"+"+("000" + index))
            return "000" + index;
        } else if (index <= 99) {
            //alert("coverage+"+index+"+"+("00" + index))
            return "00" + index;
        } else if (index <= 999) {
            //alert("coverage+"+index+"+"+("0" + index))
            return "0" + index;
        } else {
            //alert("coverage+"+index+"+"+ + index)
            return index;
        }

    };


    /*
     * 时间戳转时间
     * */
    var dateFormat = function(shijianchuo) {
        if (shijianchuo == 0 || shijianchuo == "") {
            return "";
        }
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }

    var currentDate = function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var hours = date.getHours();
            if (hours >= 0 && hours <= 9) {
                hours = "0" + hours;
            }

            var minutes = date.getMinutes();
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }

            var seconds = date.getSeconds();
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds;
            }

            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
                " " + hours + seperator2 + minutes +
                seperator2 + seconds;
            return currentdate;
        }
        /*
         * 时间戳转时间内部调用
         * */
    var add0 = function(m) {
        return m < 10 ? '0' + m : m;
    }
    var clientHeight = window.screen.height;
    var clientWidth = window.screen.width;

    /*
     * 判断字符串是否为空
     * */
    var isEmpty = function(str) {
        if (str == "" || str == null || str == undefined) {
            return true; //为空
        }
        return false; //不为空
    }

    /*
     *判断是否是字母数字组合
     * */
    var checkRate = function(str) {
        var re = /^[0-9a-zA-Z]*$/g; //判断字符串是否为数字和字母组合     //判断正整数 /^[1-9]+[0-9]*]*$/    
        if (!re.test(str)) {
            return false;
        } else {
            return true;
        }
    }

    /*
     * 判断字符串中是否有英文
     * */
    var hasEnglish = function(str) {
        var reg = /^[A-Za-z]+$/;
        if (reg.test(str)) {
            return true
        }
        return false;
    }

    /*
     * 时间戳转时间
     * */
    var dateFormat = function(shijianchuo) {
        if (shijianchuo == 0 || shijianchuo == "") {
            return "";
        }
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }

    /*
     * 时间戳转时间内部调用
     * */
    var add0 = function(m) {
        return m < 10 ? '0' + m : m;
    }
    var depponCfg = {};
    depponCfg.unicode = unicode;
    depponCfg.setION = setION;
    depponCfg.myNote = myNote;
    depponCfg.setAlert = setAlert;
    depponCfg.myAlertOne = myAlertOne;
    depponCfg.myAlertTow = myAlertTow;
    depponCfg.warningInfo = warningInfo;
    depponCfg.LoginUrl = LoginUrl;
    depponCfg.LocCache = LocCache;
    depponCfg.SessionCache = SessionCache;
    depponCfg.coverage = coverage;
    depponCfg.uuid = uuid;
    depponCfg.isEmpty = isEmpty;
    depponCfg.checkRate = checkRate;
    depponCfg.dateFormat = dateFormat;
    depponCfg.sysCode = sysCode;
    depponCfg.urlPath = "";
    depponCfg.hasEnglish = hasEnglish;
    depponCfg.inPricePageType = "other";
    depponCfg.dateFormat = dateFormat;
    depponCfg.hotLineUrl = hotLineUrl;
    depponCfg.mapLLUrl = mapLLUrl;
    depponCfg.mapReceiveUrl = mapReceiveUrl;
    depponCfg.mapTrackUrl = mapTrackUrl;
    return depponCfg;
}();

window.canGPS = true; //默认是开的   GPS

/*
 * 原生定位  的回调函数   Deppon_GPS_CallBack
 * @params dataStr json字符串
 * 返回值：
 * {"status": "success/fail",// 成功/失败
 * "message": "",// 返回成功时：message为空，失败时，message为失败内容
 * "result": {"xxx": ""}//返回结果，返回成功时result里面为具体的成功值，失败时，result为空}
 * */
// window.Deppon_GPS_CallBack = function(dataStr) {
//     var scope = '';
//     var data = JSON.parse(dataStr);
//     if (data.status == 'success') {
//         if (data.result.type == 'addNewAddress') {
//             scope = angular.element($("#addNewAddress")).scope();
//             scope.$apply(function() {
//                 scope.Deppon_GPS_CallBack(data.result);
//             });
//         } else if (data.result.type == 'modifyAddress') {
//             scope = angular.element($("#modifyAddress")).scope();
//             scope.$apply(function() {
//                 scope.Deppon_GPS_CallBack(data.result);
//             });
//         } else if (data.result.type == 'webQuery') {
//             scope = angular.element($("#webQuery")).scope();
//             scope.$apply(function() {
//                 scope.Deppon_GPS_CallBack(data.result);
//             });
//         }
//     } else {
//         DepponCfg.warningInfo(data.message);
//     }
// }

/*
 * GPS定位 Deppon_GPS_Main
 * @params  type  String  界面名称
 **/
window.Deppon_GPS_Main = function(type) {
    //这里可以获取到当前的地理位置
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            console.log(r, '我是config的定位');
            var po = new BMap.Point(r.point.lng, r.point.lat);
            console.log("位置的经纬度", po);
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            myGeo.getLocation(po, function(rs) {
                if (rs) {
                    console.log("位置", rs);

                    // scope = angular.element($("#" + type)).scope();
                    // scope.$apply(function() {
                    //     scope.Deppon_GPS_CallBack(rs);
                    // });
                    window.Deppon_GPS_CallBack(rs);
                } else {
                    console.log("位置", po);
                    //$scope.errorDenied = "位置获取不到，请手动输入！";
                    // new Toast({
                    //     showText: "位置获取不到请手动输入",
                    //     timeout: 1500
                    // }).show()
                }
            });
        } else {
            // $scope.errorDenied = "位置获取不到，请手动输入！";
            // new Toast({
            //     showText: "位置获取不到请手动输入",
            //     timeout: 1500
            // }).show()
        }
    }, { enableHighAccuracy: true });
}


var patrn = /^\d*$/;

/**
 * 校验运单号
 */
window.Deppon_Test_WayBillNo = function(wayBillNo) {
    if (!DepponCfg.isEmpty(wayBillNo) && (patrn.test(wayBillNo)) &&
        (wayBillNo.length > 7) && (wayBillNo.length < 15)) {
        return true;
    } else {
        return false;
    }
}

/*
 * 勿改动！！！272689项颖冰
 * 微信返回键
 *
 * */
window.addEventListener("popstate", function(e) {
    $("body").unbind("touchmove");
    var scope = null;
    var state = window.location.hash;
    console.log('state=' + state);

    //update by Jeff on 20180528
    //寄件成功页面微信原生返回键控制
    var temp = state.substr(state.indexOf('#'), state.length);
    if (temp.indexOf('?') > -1) {
        state = temp.substr(0, temp.indexOf('?'));
    }

    if (state == '#/meHome' || state == '#/home' || state == '#/send' || state == '#/sendSK' || state == '#/query' || state == '#/price' || state == '#/sendSuccess' || state == '#/ToEvaluate' || state == '#/evaluateSuccess' ||
        state == '#/payOrder' || state == '#/sendForScan' || state == '#/sendForScanFail' || state == '#/couponsMessage' ||
        state == '#/couponsMessageNewHasGet' || state == '#vacation' || state == '#/webQueryDetail') {
        console.log('就是这几个界面不能前进');
        window.history.pushState('forward', null, state);
        window.history.forward();
    }
    if (window.lastPage_is_evaluateSuccess) {
        console.log("大洋的，编辑投下锅+state=" + state);
        setTimeout(function() {
            scope = angular.element($("#evaluateSuccess")).scope();
            scope.$apply(function() {
                window.lastPage_is_evaluateSuccess = false;
                scope.BackBtn();
            });
        }, 100)
    } else {
        window.lastPage_is_evaluateSuccess = false;
    }

    if (window.lastPage_is_webQueryDetail) {
        console.log("浏览器网点查询详情返回+state=" + state);
        setTimeout(function() {
            scope = angular.element($("#webQueryDetailInfo")).scope();
            scope.$apply(function() {
                window.lastPage_is_webQueryDetail = false;
                scope.queryBackHome();
            });
        }, 100)
    } else {
        window.lastPage_is_webQueryDetail = false;
    }

    if (window.lastPage_is_webQuery) {
        console.log("浏览器网点查询返回+state=" + state);
        setTimeout(function() {
            scope = angular.element($("#webQuery")).scope();
            scope.$apply(function() {
                window.lastPage_is_webQuery = false;
                scope.queryBackHome();
            });
        }, 100)
    } else {
        window.lastPage_is_webQuery = false;
    }
}, false);

/*
 * 判断是否有表情
 * */
window.isEmojiCharacter = function(substring) {
        var flag = false; //默认没有表情
        var f = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if (f.test(substring)) {
            flag = true;
        }
        for (var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        flag = true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    flag = true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    flag = true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    flag = true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    flag = true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
                    hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
                    hs == 0x2b50) {
                    flag = true;
                } else if (hs == 0xd83e || hs == 0xdd23) {
                    flag = true;
                }
            }
        }
        return flag;
    }
    /*
     * 判断是否有特殊字符
     * */
window.CheckStr = function(str) {
    var SpecialCharacters = "*@/'#$%&^";
    for (var i = 0; i < SpecialCharacters.length; i++) {
        if (str.indexOf(SpecialCharacters.charAt(i)) != -1) {
            return true;
        }
        if (str.indexOf('\"') != -1) {
            return true;
        }
    }
    return false;
}

/*
 * 打电话 Deppon_Tel_Main
 * @params  phone  String  电话号码
 * */
window.Deppon_Tel_Main = function(phone) {
        if (window.deviceType == 'IOS') {
            window.webkit.messageHandlers.Deppon_Tel.postMessage(phone)
                //Deppon_Tel(type);
        } else {
            window.Android.Deppon_Tel(phone);
        }
    }
    /*
     *  获取设备类型
     * */
window.deviceType = function() { //设备类型
    console.log("设备类型:::window.navigator.appVersion=" + window.navigator.appVersion);
    if (window.navigator.appVersion.indexOf("Android") !== -1) {
        return 'Android';
    } else {
        return 'IOS';
    }
}();

window.citysource = [];