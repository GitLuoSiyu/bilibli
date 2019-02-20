/**
 * Created by 272689 on 2017/5/28.
 */
window.webQuery = angular.module("deppon.webQueryInstall", ['ionic'])
    .controller('WebQueryCtrl', ['$scope', '$state', '$stateParams', '$ionicNativeTransitions', '$ionicLoading', '$location', 'webQueryListBillService', 'webQueryNewListBillService', 'inf_getProvince', 'inf_getCities', 'inf_getCounty', 'inf_getHotCity', 'inf_getNations', 'inf_getCityData', '$timeout',
        function($scope, $state, $stateParams, $ionicNativeTransitions, $ionicLoading, $location, webQueryListBillService, webQueryNewListBillService, inf_getProvince, inf_getCities, inf_getCounty, inf_getHotCity, inf_getNations, inf_getCityData, $timeout) {
            $scope.$on('$ionicView.beforeEnter', function() {
                inf_getCityData.GetInf_getCityData().success(function(res) {
                        localData = $.extend(true, [], res);
                        globalData = $.extend(true, [], res);
                        DepponCfg.LocCache.saveLocCache('cityData', res);
                        console.log('111,缓存本地数据');
                        // alert('111,缓存本地数据');
                        if (localData) {
                            //初始化国内省份 (获取国内所有数据)
                            $scope.provinceList = localData[0].province;
                            //初始化国际区域 (获取国际所有数据)
                            $scope.nationList = globalData;
                            $scope.nationList.splice(0, 1);
                        }
                    }).error(function(res) {

                    })
                    // alert("走了吗");

                // 获取url参数

                $scope.flag = $stateParams.flag;
                // console.log($scope.flag + '我是url参数')

                //获取URL参数
                var c = "channelType" + "=";
                var s = window.location.href;
                if (s.indexOf(c) > 0) {
                    var p = s.substr(s.indexOf("channelType" + "=") + c.length);
                    if (p.indexOf("&") >= 0) {
                        p = p.substr(0, p.indexOf("&"));
                    }
                    $scope.channelType = p;
                } else {
                    $scope.channelType = "";
                }
                if (!DepponCfg.isEmpty($stateParams.channelType)) {
                    $scope.channelType = $stateParams.channelType;
                }

                if (!DepponCfg.isEmpty($scope.channelType)) {
                    DepponCfg.LocCache.saveLocCache("channelType", $scope.channelType);
                }

                if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache("channelType"))) {
                    $scope.channelType = DepponCfg.LocCache.getLocCache("channelType");
                }

                if (DepponCfg.isEmpty($stateParams.backPara) || $scope.flag !== 1) {
                    //window.Deppon_Home_Page_Main('in', '2');
                    console.log("not back:" + $stateParams.backPara);
                    init();
                    if ($stateParams.province_city_country != null && $stateParams.province_city_country != "") {
                        $scope.webQueryAddress.proCityName = $stateParams.province_city_country;
                        $scope.webQueryAddress.address = "  ";
                        $scope.SearchButton();
                        // alert('SearchButton222')
                    } else {
                        console.log('利用微信获取地理位置接口');

                        if (!window.canGPS) {
                            return;
                        }
                        window.canGPS = false;


                        if ($scope.flag === 1) {
                            window.canGPS = false;
                        } else {
                            console.log(1, '我是利用微信我获取地理位置借口')
                            setTimeout(function() {
                                window.canGPS = true;
                            }, 2 * 1000);
                        }


                        //DepponCfg.warningInfo("启动定位", 2 * 1000);
                        // setTimeout(function() {
                        //     window.canGPS = true;
                        // }, 2 * 1000);


                    }
                } else {
                    console.log('哈哈哈我是else')

                    $scope.map = new BMap.Map("container");
                    $scope.localSearch = new BMap.LocalSearch($scope.map);
                    console.log($scope.localSearch, '我是else里面的$scope.localSearch')

                    $scope.showMenuFlag = false; //默认不显示菜单
                    $scope.webQueryBaseInfo = DepponCfg.LocCache.getLocCache("webQueryBaseInfo");
                    $scope.webQueryAddress = DepponCfg.LocCache.getLocCache("webQueryAddress");
                    $scope.webQueryList = DepponCfg.LocCache.getLocCache("webQueryList");
                    $scope.longitude = DepponCfg.LocCache.getLocCache("longitude");
                    $scope.latitude = DepponCfg.LocCache.getLocCache("latitude");
                    console.log($scope.webQueryAddress, '我是else里面的$scope.webQueryAddress')
                }

                $scope.canChange = true; //国际国内可切换开关 update by Jeff on 20180309
                $scope.currentArea = "0"; //当前城市所属区域 0：国内 1：国外
                $scope.bigArea = 0; //0：国内 1：国外 update by Jeff on 20180309
                $scope.hotCityList = []; //热门城市 update by Jeff on 20180309
                $scope.nationalCode = "100000"; //国家代码 默认中国：10000 update by Jeff on 20180309
                $scope.nationList = []; //国际列表 update by Jeff on 20180309
                $scope.nationName = ""; //国家名称 update by Jeff on 20180309
                $scope.provinceList = []; //省份列表 update by Jeff on 20180309
                $scope.nationProvinceList = []; //国际2级列表 update by Jeff on 20180309
                $scope.cityList = []; //城市列表 update by Jeff on 20180309
                $scope.cityCode = ""; //选中的cityCode update by Jeff on 20180309
                $scope.nationCityList = []; //国际3级列表 update by Jeff on 20180309
                $scope.countyList = []; //区县列表 update by Jeff on 20180309
                $scope.countyCode = ""; //选中的cityCode update by Jeff on 20180309
                $scope.nationCountyList = []; //国际4级列表 update by Jeff on 20180309
                $scope.cityCanSave = false; //城市控件默认不能保存 update by Jeff on 20180309
                $scope.showCityFlag = false; //默认不显示城市控件 update by Jeff on 20180308

                // 新增
                $scope.provinceCode = '';
                $scope.provinceName = '';
                $scope.cityName = '';
                $scope.countyCode = '';
                $scope.countyName = '';



                $scope.canRepeatCheck = true; //是否需要重新赋值（因为在点击热门城市的时候 $apply 会报错，这是设置一个flag让点击热门城市是 $apply 不执行）
                $scope.isLoad = 0; //用来区分是手动滑动还是自动滑动（0 手动滑动 1 选择热门城市后的自动滑动 2 load数据后的自动滑动）
                $scope.loadNationCode = ""; //自动滑动时需要匹配的参数
                $scope.loadProvinceCode = ""; //自动滑动时需要匹配的参数
                $scope.loadCityCode = ""; //自动滑动时需要匹配的参数
                $scope.loadCountyCode = ""; //自动滑动时需要匹配的参数
                $scope.loadNationName = ""; //自动滑动时需要匹配的参数
                $scope.loadProvinceName = ""; //自动滑动时需要匹配的参数
                $scope.loadCityName = ""; //自动滑动时需要匹配的参数
                $scope.loadCountyName = ""; //自动滑动时需要匹配的参数
                $scope.sh = false;
                $scope.proCityCode = "";

                var localData = new Array();
                var globalData = new Array();

                // inf_getCityData.GetInf_getCityData().success(function(res) {
                //     localData = $.extend(true, [], res);
                //     globalData = $.extend(true, [], res);
                //     DepponCfg.LocCache.saveLocCache('cityData', res);
                //     console.log('111');
                //     if (localData) {
                //         //初始化国内省份 (获取国内所有数据)
                //         $scope.provinceList = localData[0].province;

                //         //初始化国际区域 (获取国际所有数据)
                //         $scope.nationList = globalData;
                //         $scope.nationList.splice(0, 1);
                //     }
                // }).error(function(res) {

                // })

                if (window.updateCityVer) {
                    inf_getCityData.GetInf_getCityData().success(function(res) {
                        localData = $.extend(true, [], res);
                        globalData = $.extend(true, [], res);
                        DepponCfg.LocCache.saveLocCache('cityData', res);
                        if (localData) {
                            //初始化国内省份 (获取国内所有数据)
                            $scope.provinceList = localData[0].province;

                            //初始化国际区域 (获取国际所有数据)
                            $scope.nationList = globalData;
                            $scope.nationList.splice(0, 1);
                        }
                    }).error(function(res) {

                    })
                } else {
                    localData = DepponCfg.LocCache.getLocCache('cityData');
                    globalData = DepponCfg.LocCache.getLocCache('cityData');
                    console.log('localData', localData, 'globalData', globalData)
                    if (localData) {
                        //初始化国内省份 (获取国内所有数据)
                        $scope.provinceList = localData[0].province;

                        //初始化国际区域 (获取国际所有数据)
                        $scope.nationList = globalData;
                        $scope.nationList.splice(0, 1);
                    }
                }

                //检查缓存中是否含有currentArea update by Jeff on 20180309
                if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('currentArea'))) {
                    $scope.currentArea = DepponCfg.LocCache.getLocCache('currentArea');
                }


                //初始化热门城市
                //update by Jeff on 20180309
                inf_getHotCity.GetInf_getHotCity().success(function(res) {
                    // console.log('获取热门城市:::res=' + JSON.stringify(res));
                    if (res.status == 'success') {
                        $scope.hotCityList = res.result;
                    } else {
                        DepponCfg.warningInfo('获取热门城市失败，' + res.message);
                    }
                }).error(function(err) {
                    console.log('获取热门城市:::err=' + JSON.stringify(err));
                    DepponCfg.warningInfo('获取热门城市失败，' + err.message);
                })

                swiper(); //update by Jeff on 20180309
            });

            $scope.$on('$ionicView.afterEnter', function() {
                // 这里是启动gps 定位
                if ($scope.flag !== 1) {
                    Deppon_GPS_Main('webQuery');
                }
                window.lastPage_is_webQuery = true;

            });




            //国内swiper update by Jeff on 20180309
            var swiperConfigLeft;
            var swiperConfigCenter;
            var swiperConfigRight;

            //国际swiper update by Jeff on 20180309
            var swiperConfig1;
            var swiperConfig2;
            var swiperConfig3;
            var swiperConfig4;

            //初始化省市区控件 update by Jeff on 20180309
            function swiper() {
                // var tempLength = $("ion-view").length
                // if(tempLength > 1){ 
                //     for(var i = 0 ; i < tempLength - 1; i++){
                //         $("ion-view").eq(0).remove();
                //     }
                // }
                //初始化省份
                swiperConfigLeft = new Swiper('.swiper-container.selclass1webQuery', {
                    slidesPerView: 5,
                    direction: "vertical",
                    centeredSlides: true,
                    speed: 200,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart: function() {
                            $scope.canChange = false;
                        },
                        slideChangeTransitionEnd: function() {
                            //alert(this.activeIndex);//切换结束时，告诉我现在是第几个slide
                            //根据当前选择项 刷新城市
                            swiperConfigCenter.slideTo(0); //移动后城市slider 恢复默认
                            swiperConfigRight.slideTo(0); //移动后区县slider 恢复默认
                            var provinceCode = $(".selclass1webQuery .swiper-slide-active").attr("provincecode");
                            var provinceIndex = $(".selclass1webQuery .swiper-slide-active").attr("oindex");
                            getCity(provinceIndex); //获取城市
                            $scope.provinceCode = provinceCode;
                            $scope.canChange = true;
                        },
                    }
                });

                //初始化城市
                swiperConfigCenter = new Swiper('.swiper-container.selclass2webQuery', {
                    slidesPerView: 5,
                    direction: "vertical",
                    centeredSlides: true,
                    speed: 200,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart: function() {
                            $scope.canChange = false;
                        },
                        slideChangeTransitionEnd: function() {
                            swiperConfigRight.slideTo(0); //移动后区县slider 恢复默认
                            var cityCode = $(".selclass2webQuery .swiper-slide-active").attr("citycode");
                            var cityIndex = $(".selclass2webQuery .swiper-slide-active").attr("oindex");
                            getCounty(cityIndex);
                            $scope.cityCode = cityCode;
                            $scope.canChange = true;
                        },
                    }
                });

                //初始化区县
                swiperConfigRight = new Swiper('.swiper-container.selclass3webQuery', {
                    slidesPerView: 5,
                    direction: "vertical",
                    centeredSlides: true,
                    speed: 200,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart: function() {
                            $scope.canChange = false;
                        },
                        slideChangeTransitionEnd: function() {
                            var countyCode = $(".selclass3webQuery .swiper-slide-active").attr("countycode");
                            $scope.countyCode = countyCode;
                            $scope.canChange = true;
                        },
                    }
                });

                //初始化国际1级
                swiperConfig1 = new Swiper('.swiper-container.selclass4webQuery', {
                    slidesPerView: 5,
                    direction: "vertical",
                    centeredSlides: true,
                    speed: 200,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart: function() {
                            $scope.canChange = false;
                        },
                        slideChangeTransitionEnd: function() {
                            swiperConfig2.slideTo(0); //国际2级 恢复默认
                            swiperConfig3.slideTo(0); //国际3级 恢复默认
                            swiperConfig4.slideTo(0); //国际4级 恢复默认
                            var nationCode = $(".selclass4webQuery .swiper-slide-active").attr("nationcode");
                            var nationIndex = $(".selclass4webQuery .swiper-slide-active").attr("oindex");
                            $scope.nationName = $(".selclass4webQuery .swiper-slide-active").text().trim();
                            $scope.nationalCode = nationCode;
                            getProvince(nationIndex); //获取2级
                            $scope.canChange = true;
                        },
                    }
                });

                //初始化国际2级
                swiperConfig2 = new Swiper('.swiper-container.selclass5webQuery', {
                    slidesPerView: 5,
                    direction: "vertical",
                    centeredSlides: true,
                    speed: 200,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart: function() {
                            $scope.canChange = false;
                        },
                        slideChangeTransitionEnd: function() {
                            swiperConfig3.slideTo(0); //国际3级 恢复默认
                            swiperConfig4.slideTo(0); //国际4级 恢复默认
                            var provinceCode = $(".selclass5webQuery .swiper-slide-active").attr("provincecode");
                            var provinceIndex = $(".selclass5webQuery .swiper-slide-active").attr("oindex");
                            getCity(provinceIndex); //获取3级
                            $scope.provinceCode = provinceCode;
                            $scope.canChange = true;
                        },
                    }
                });

                //初始化国际3级
                swiperConfig3 = new Swiper('.swiper-container.selclass6webQuery', {
                    slidesPerView: 5,
                    direction: "vertical",
                    centeredSlides: true,
                    speed: 200,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart: function() {
                            $scope.canChange = false;
                        },
                        slideChangeTransitionEnd: function() {
                            swiperConfig4.slideTo(0); //国际4级 恢复默认
                            var cityCode = $(".selclass6webQuery .swiper-slide-active").attr("cityCode");
                            var cityIndex = $(".selclass6webQuery .swiper-slide-active").attr("oindex");
                            $scope.cityCode = cityCode;
                            getCounty(cityIndex); //获取4级
                            $scope.canChange = true;
                        },
                    }
                });

                //初始化国际4级
                swiperConfig4 = new Swiper('.swiper-container.selclass7webQuery', {
                    slidesPerView: 5,
                    direction: "vertical",
                    centeredSlides: true,
                    speed: 200,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart: function() {
                            $scope.canChange = false;
                        },
                        slideChangeTransitionEnd: function() {
                            var countyCode = $(".selclass7webQuery .swiper-slide-active").attr("countycode");
                            $scope.countyCode = countyCode;
                            $scope.canChange = true;
                        },
                    }
                });

                myScroll = new IScroll('#city_mask', {
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'scale',
                    fadeScrollbars: true
                });
                //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            }

            //去除【】
            $scope.changename = function(str) {
                str = str.replace(new RegExp('[\【][a-zA-Z][\】]', 'g'), '');
                return str;
            }

            $scope.Deppon_GPS_CallBack = function(res) {
                console.log(res, '我是定位的res')
                $ionicLoading.hide();
                var addComp = res.addressComponents;
                // var ssq = addComp.province + "-" + addComp.city + "-" + addComp.district;
                // $scope.webQueryAddress.proCityName = ssq;
                // $scope.webQueryAddress.address = str;

                // 我的新增
                var shi = addComp.province;
                var cityNmae = addComp.city;
                var countyName = addComp.district;
                var flag = shi.indexOf('市')
                if (flag > 0) {
                    shi = shi.substr(0, shi.length - 1);
                    $scope.webQueryAddress.provinceName = shi; // 省
                } else {
                    $scope.webQueryAddress.provinceName = addComp.province; // 省
                }
                var ssq = shi + "-" + addComp.city + "-" + addComp.district;
                var str = addComp.street + addComp.streetNumber;
                $scope.webQueryAddress.cityName = addComp.city; //城市
                $scope.webQueryAddress.countyName = addComp.district; // 区 
                $scope.webQueryAddress.otherAddress = str; // 街道
                $scope.webQueryAddress.proCityName = ssq;

                // 获取本地缓存中的所有城市
                // $scope.currentArea = DepponCfg.LocCache.getLocCache('currentArea')
                var cityData = DepponCfg.LocCache.getLocCache('cityData')
                console.log(cityData, '我是缓存中的城市')
                    // 遍历 
                var province = []
                var city = []
                var county = []
                if (cityData !== null) {
                    province = cityData[0].province
                    console.log(province, '我把他们放一起了')
                    for (var i = 0; i < province.length; i++) {
                        console.log(shi)
                        if (shi == province[i].provinceName) {
                            console.log(shi, province[i].provinceName, '快疯了')
                            $scope.webQueryAddress.provinceCode = province[i].provinceCode
                            city = province[i].city;
                            console.log(city, '我是city', $scope.webQueryAddress.provinceCode)
                            break;
                        }
                    }

                    // 遍历城市
                    for (var i = 0; i < city.length; i++) {
                        console.log(shi)
                        if (cityNmae == city[i].cityName) {
                            console.log(shi, city[i].cityName, '快疯了')
                            $scope.webQueryAddress.cityCode = city[i].cityCode
                            county = city[i].county;
                            console.log(county, 'county', $scope.webQueryAddress.cityCode)
                            break;
                        }
                    }

                    // 遍历区
                    for (var i = 0; i < county.length; i++) {
                        if (countyName == county[i].countyName) {
                            console.log(countyName, county[i].countyName, '快疯了')
                            $scope.webQueryAddress.countyCode = county[i].countyCode
                            console.log($scope.webQueryAddress.cityCode, '我是去吗')
                            break;
                        }
                    }
                }

                if (!DepponCfg.isEmpty($scope.webQueryAddress.proCityName)) {
                    $scope.SearchButton();
                    // alert('SearchButton111')
                }
            }

            function init() {
                $scope.showMenuFlag = false; //默认不显示菜单

                $scope.map = new BMap.Map("container");
                $scope.localSearch = new BMap.LocalSearch($scope.map);

                $scope.webQueryAddress = {
                    proCityName: "请选择省市区", //省市区名称
                    address: "" //详细地址
                };
                $scope.notDatat = false; //默认有数据
                /*有关列表数据的基本信息*/
                $scope.webQueryBaseInfo = {
                    "pageIndex": "1",
                    "pageSize": "10"
                }
                $scope.isShowScrollLoad = false;
                $scope.webQueryList = []


            }

            $scope.SearchButton = function searchByStationName() {

                DepponCfg.myNote("", 5 * 60 * 1000);

                $scope.keyWords = $scope.webQueryAddress.otherAddress.trim();

                //if (DepponCfg.isEmpty($scope.keyWords)) {
                //    $scope.webQueryList = [];
                //    DepponCfg.warningInfo('请输入详细地址');
                //    return;
                //}
                if (!DepponCfg.isEmpty($scope.keyWords) || !DepponCfg.isEmpty($scope.webQueryAddress.proCityName)) {
                    console.log('进来吧!DepponCfg.isEmpty($scope.keyWords) || !DepponCfg.isEmpty($scope.webQueryAddress.proCityName')
                        //$scope.map.clearOverlays();//清空原来的标注
                    $scope.longitude = "";
                    $scope.latitude = "";
                    //根据地址反查询经纬度
                    $scope.localSearch.setSearchCompleteCallback(function(searchResult) {
                        var poi = searchResult.getPoi(0);

                        if (poi == undefined) {
                            console.log('poi undefined')
                            $scope.webQueryList = [];
                            DepponCfg.warningInfo('地址获取失败，请检查地址是否正确');

                            if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('webQueryList'))) {
                                DepponCfg.LocCache.clearLocCache('webQueryList');
                                DepponCfg.LocCache.clearLocCache("longitude");
                                DepponCfg.LocCache.clearLocCache("latitude");
                                DepponCfg.LocCache.clearLocCache("webQueryBaseInfo");
                            }

                            return;
                        }
                        $scope.longitude = poi.point.lng;
                        $scope.latitude = poi.point.lat;
                        console.log("poi:" + poi.point.lng + "," + poi.point.lat);

                        if ("上海-上海市-青浦区明珠路" == searchResult.keyword ||
                            "上海市-上海市-青浦区明珠路" == searchResult.keyword) {
                            $scope.longitude = 121.268291;
                            $scope.latitude = 31.201107;
                        }
                        $scope.map.centerAndZoom(poi.point, 13);

                        if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('webQueryList'))) {
                            console.log('!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache 不空')
                            $scope.webQueryList = [];
                            DepponCfg.LocCache.clearLocCache('webQueryList');
                            DepponCfg.LocCache.clearLocCache("longitude");
                            DepponCfg.LocCache.clearLocCache("latitude");
                            DepponCfg.LocCache.clearLocCache("webQueryBaseInfo");
                        }
                        DepponCfg.LocCache.saveLocCache("longitude", $scope.longitude);
                        DepponCfg.LocCache.saveLocCache("latitude", $scope.latitude);

                        // initData($scope.keyWords, $scope.longitude, $scope.latitude);

                        // 判断是否存在关键字 
                        // var keyWords = $scope.webQueryAddress.otherAddress.trim();
                        // var keyWords = $scope.webQueryAddress.otherAddress.trim();
                        var params = {}
                        if ($scope.keyWords !== '') {
                            // 不为空
                            // "province": province, // 城市 
                            // "city": city, // 城市
                            // "county": county, // 区县
                            // "otherAddress": otherAddress, // 道路
                            params.province = $scope.webQueryAddress.provinceName // 城市
                            params.city = $scope.webQueryAddress.cityName // 城市
                            params.county = $scope.webQueryAddress.countyName // 城市
                            params.otherAddress = $scope.webQueryAddress.otherAddress // 城市
                            initData(params);
                            console.log('有关键字', params)
                        } else {
                            // "provinceCode": "",
                            // "provinceName": "",
                            // "cityCode": "",
                            // "cityName": "",
                            // "countyCode": "",
                            // "countyName": "",
                            params.provinceCode = $scope.webQueryAddress.provinceCode // 城市编码
                            params.provinceName = $scope.webQueryAddress.provinceName // 城市编码
                            params.cityCode = $scope.webQueryAddress.cityCode // 城市编码
                            params.cityName = $scope.webQueryAddress.cityName // 城市
                            params.countyCode = $scope.webQueryAddress.countyCode // 城市
                            params.countyName = $scope.webQueryAddress.countyName // 城市
                            initData(params);
                            console.log('无关键字', params)
                        }

                    });
                    console.log("$scope.webQueryAddress.proCityName1111:" + $scope.webQueryAddress.proCityName + $scope.webQueryAddress.otherAddress);
                    $scope.localSearch.search($scope.webQueryAddress.proCityName + $scope.webQueryAddress.address);
                } else {

                }
            }

            // 原来的 initData

            // function initData(keyWords, longitude, latitude) {
            //     var data = {
            //         "keyWords": "",
            //         "longitude": longitude,
            //         "latitude": latitude
            //     }
            //     console.log('执行列表查询');
            //     webQueryListBillService.SetInf_webQueryBill(data);
            //     // if()
            //     webQueryListBillService.GetInf_webQueryBill().success(function(res) {
            //         console.log('全部：res=' + JSON.stringify(res));
            //         if (res.status == 'success') {
            //             if (!DepponCfg.isEmpty(res) && !DepponCfg.isEmpty(res.result)) {

            //                 //$scope.webQueryBaseInfo.maxPageIndex = Math.ceil($scope.orderListBaseInfo[0].total / $scope.orderListBaseInfo[0].pageSize);
            //                 if ($scope.webQueryBaseInfo.pageIndex == 1) {
            //                     $scope.webQueryList = [];
            //                 }

            //                 var point1 = new BMap.Point($scope.longitude, $scope.latitude);
            //                 var point2 = null;
            //                 var distance = $scope.map.getDistance(point1, point2);
            //                 for (var i = 0; i < res.result.length; i++) {
            //                     //point2 = null;
            //                     //point2 = new BMap.Point(res.result[i].locationLongitude, res.result[i].locationLatitude);
            //                     //var range = $scope.map.getDistance(point1, point2).toFixed(2);
            //                     var range = getDistance($scope.longitude, $scope.latitude, res.result[i].locationLongitude, res.result[i].locationLatitude);
            //                     var tmp = {
            //                         "branchCode": res.result[i].branchCode, //网点编码
            //                         "name": res.result[i].name, //网点名称
            //                         "areaCode": res.result[i].areaCode, //区域编码
            //                         "locationAddress": res.result[i].locationAddress, //地址
            //                         "locationLatitude": res.result[i].locationLatitude, //经度
            //                         "locationLongitude": res.result[i].locationLongitude, //纬度
            //                         "mobilePhone": res.result[i].mobilePhone, //手机号
            //                         "telephone": res.result[i].telephone, //电话
            //                         "businessScope": res.result[i].businessScope, //业务范围
            //                         "distance": res.result[i].distance, //城市区域编码
            //                         "range": range //距离

            //                     };

            //                     $scope.webQueryList.push(tmp);
            //                 }

            //                 if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('webQueryList'))) {
            //                     DepponCfg.LocCache.clearLocCache('webQueryList');
            //                     DepponCfg.LocCache.clearLocCache('webQueryAddress');
            //                     DepponCfg.LocCache.clearLocCache('webQueryBaseInfo');
            //                 }
            //                 // 本地存储

            //                 DepponCfg.LocCache.saveLocCache("webQueryList", $scope.webQueryList);
            //                 DepponCfg.LocCache.saveLocCache("webQueryAddress", $scope.webQueryAddress);

            //                 $scope.webQueryBaseInfo.pageIndex++;

            //                 DepponCfg.LocCache.saveLocCache("webQueryBaseInfo", $scope.webQueryBaseInfo);

            //                 $("#depponBottomAll").css('height', '60px');
            //             } else {
            //                 console.log('全部：：：空');
            //                 //接着展示空的界面
            //                 $scope.notDatat = true;
            //                 $("#depponBottomAll").css('height', '220px');
            //                 $scope.isShowScrollLoad = false;
            //                 $scope.$broadcast('scroll.infiniteScrollComplete');
            //                 DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
            //                 return;
            //             }
            //             $ionicLoading.hide();
            //         } else {
            //             DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
            //             return;
            //             //if(DepponCfg.hasEnglish(res.message)) {
            //             //    DepponCfg.warningInfo('系统开小差,请稍后重试.');
            //             //    return;
            //             //}
            //             //DepponCfg.warningInfo('获取失败,' + res.message);
            //             //$("#depponBottomAll").css('height', '220px');
            //         }
            //     }).error(function(err) {
            //         console.log('全部：err=' + JSON.stringify(err));
            //         if (!DepponCfg.isEmpty(err)) {
            //             if (err.status == '901') {
            //                 $scope.isShowScrollLoad = false;
            //                 $scope.$broadcast('scroll.infiniteScrollComplete');
            //                 $("#depponBottomAll").css('height', '220px');
            //             } else {
            //                 if (DepponCfg.hasEnglish(err.message)) {
            //                     DepponCfg.warningInfo('暂时无法获取附近网点信息，请稍后重试！');
            //                     return;
            //                 }
            //                 DepponCfg.warningInfo('获取失败,' + err.message);
            //                 $("#depponBottomAll").css('height', '220px');
            //             }
            //             $ionicLoading.hide();
            //         } else {
            //             DepponCfg.warningInfo('抱歉，网络出现错误!');
            //         }
            //     }).finally(function() {
            //         $scope.$broadcast('scroll.refreshComplete');
            //     })
            // }

            //  新的  initData


            function initData(params) {
                console.log(params, '我看看')
                var obj = params;
                var arr = Object.keys(obj);
                var len = arr.length;
                // alert(len + 'params的长度')

                // 判断params 参数的长度
                console.log('执行列表查询-----------------------------新接口', params);
                if (len === 4) {
                    console.log('有关键字接口')
                    webQueryListBillService.SetInf_webQueryBill(params);
                    webQueryListBillService.GetInf_webQueryBill().success(function(res) {
                        console.log('新接口全部：res=' + JSON.stringify(res));
                        if (res.status == 'success' && res.result.length !== 0) {
                            if (!DepponCfg.isEmpty(res) && !DepponCfg.isEmpty(res.result)) {
                                $scope.webQueryList = [];
                                //$scope.webQueryBaseInfo.maxPageIndex = Math.ceil($scope.orderListBaseInfo[0].total / $scope.orderListBaseInfo[0].pageSize);
                                // if ($scope.webQueryBaseInfo.pageIndex == 1) {
                                //     console.log('我现在是?',$scope.webQueryBaseInfo.pageIndex)
                                //     // $scope.webQueryBaseInfo.pageIndex = 1
                                //     $scope.webQueryList = [];
                                // }

                                var point1 = new BMap.Point($scope.longitude, $scope.latitude);
                                var point2 = null;
                                var distance = $scope.map.getDistance(point1, point2);
                                for (var i = 0; i < res.result.length; i++) {
                                    //point2 = null;
                                    //point2 = new BMap.Point(res.result[i].locationLongitude, res.result[i].locationLatitude);
                                    //var range = $scope.map.getDistance(point1, point2).toFixed(2);
                                    // var range = getDistance($scope.longitude, $scope.latitude, res.result[i].locationLongitude, res.result[i].locationLatitude);
                                    // var range = getDistance($scope.longitude, $scope.latitude, res.result[i].baiduLng, res.result[i].baiduLat);
                                    var range = res.result[i].distance.toFixed(2) + "km"; //返回公里
                                    // var tmp = {
                                    //     "branchCode": res.result[i].branchCode, //网点编码
                                    //     "name": res.result[i].name, //网点名称
                                    //     "areaCode": res.result[i].areaCode, //区域编码
                                    //     "locationAddress": res.result[i].locationAddress, //地址
                                    //     "locationLatitude": res.result[i].locationLatitude, //经度
                                    //     "locationLongitude": res.result[i].locationLongitude, //纬度
                                    //     "mobilePhone": res.result[i].mobilePhone, //手机号
                                    //     "telephone": res.result[i].telephone, //电话
                                    //     "businessScope": res.result[i].businessScope, //业务范围
                                    //     "distance": res.result[i].distance, //城市区域编码
                                    //     "range": range //距离

                                    // };
                                    var tmp = {
                                        "branchCode": res.result[i].deptCode, //网点编码
                                        "name": res.result[i].deptName, //网点名称
                                        "areaCode": res.result[i].areaCode, //区域编码
                                        "locationAddress": res.result[i].deptAddress, //地址
                                        "locationLatitude": res.result[i].baiduLat, //经度
                                        "locationLongitude": res.result[i].baiduLng, //纬度
                                        "mobilePhone": res.result[i].mobilePhone, //手机号
                                        "telephone": res.result[i].contactway, //电话
                                        "businessScope": res.result[i].businessScope ? res.result[i].businessScope.trim() : '', //业务范围
                                        "distance": res.result[i].distance, //城市区域编码
                                        "range": range //距离

                                    };
                                    $scope.notDatat = false;
                                    $scope.webQueryList.push(tmp);
                                    console.log(tmp, $scope.webQueryList, "9")
                                }

                                if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('webQueryList'))) {
                                    DepponCfg.LocCache.clearLocCache('webQueryList');
                                    DepponCfg.LocCache.clearLocCache('webQueryAddress');
                                    DepponCfg.LocCache.clearLocCache('webQueryBaseInfo');
                                }
                                // 本地存储

                                DepponCfg.LocCache.saveLocCache("webQueryList", $scope.webQueryList);
                                DepponCfg.LocCache.saveLocCache("webQueryAddress", $scope.webQueryAddress);

                                $scope.webQueryBaseInfo.pageIndex++;

                                DepponCfg.LocCache.saveLocCache("webQueryBaseInfo", $scope.webQueryBaseInfo);

                                $("#depponBottomAll").css('height', '60px');
                            } else {
                                console.log('全部：：：空');
                                //接着展示空的界面
                                $scope.notDatat = true;
                                $("#depponBottomAll").css('height', '220px');
                                $scope.isShowScrollLoad = false;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
                                return;
                            }
                            $ionicLoading.hide();
                        } else {
                            // alert('有关键字的接口3')
                            DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
                            return;
                            //if(DepponCfg.hasEnglish(res.message)) {
                            //    DepponCfg.warningInfo('系统开小差,请稍后重试.');
                            //    return;
                            //}
                            //DepponCfg.warningInfo('获取失败,' + res.message);
                            //$("#depponBottomAll").css('height', '220px');
                        }
                    }).error(function(err) {
                        console.log('全部：err=' + JSON.stringify(err));
                        if (!DepponCfg.isEmpty(err)) {
                            if (err.status == '901') {
                                $scope.isShowScrollLoad = false;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $("#depponBottomAll").css('height', '220px');
                            } else {
                                if (DepponCfg.hasEnglish(err.message)) {
                                    DepponCfg.warningInfo('暂时无法获取附近网点信息，请稍后重试！');
                                    return;
                                }
                                DepponCfg.warningInfo('获取失败,' + err.message);
                                $("#depponBottomAll").css('height', '220px');
                            }
                            $ionicLoading.hide();
                        } else {
                            DepponCfg.warningInfo('抱歉，网络出现错误!');
                        }
                    }).finally(function() {
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                } else {
                    console.log('无关键字接口')
                    webQueryNewListBillService.SetInf_ebQueryCity(params);
                    webQueryNewListBillService.GetInf_webQueryCity().success(function(res) {
                        console.log('新接口1全部：res=' + JSON.stringify(res.departmentNetVOList));
                        if (res.status == 'success' && res.result.length !== 0) {
                            if (!DepponCfg.isEmpty(res) && !DepponCfg.isEmpty(res.result.departmentNetVOList)) {
                                // $scope.webQueryList = [];
                                //$scope.webQueryBaseInfo.maxPageIndex = Math.ceil($scope.orderListBaseInfo[0].total / $scope.orderListBaseInfo[0].pageSize);
                                if ($scope.webQueryBaseInfo.pageIndex == 1 || $scope.webQueryBaseInfo.pageIndex == 3) {
                                    $scope.webQueryBaseInfo.pageIndex = 1
                                    $scope.webQueryList = [];
                                }

                                var point1 = new BMap.Point($scope.longitude, $scope.latitude);
                                var point2 = null;
                                var distance = $scope.map.getDistance(point1, point2);
                                for (var i = 0; i < res.result.departmentNetVOList.length; i++) {
                                    //point2 = null;
                                    //point2 = new BMap.Point(res.result[i].locationLongitude, res.result[i].locationLatitude);
                                    //var range = $scope.map.getDistance(point1, point2).toFixed(2);
                                    // var range = getDistance($scope.longitude, $scope.latitude, res.result[i].locationLongitude, res.result[i].locationLatitude);
                                    // var range = getDistance($scope.longitude, $scope.latitude, res.result.departmentNetVOList[i].longitude, res.result.departmentNetVOList[i].latitude);
                                    // var tmp = {
                                    //     "branchCode": res.result[i].branchCode, //网点编码
                                    //     "name": res.result[i].name, //网点名称
                                    //     "areaCode": res.result[i].areaCode, //区域编码
                                    //     "locationAddress": res.result[i].locationAddress, //地址
                                    //     "locationLatitude": res.result[i].locationLatitude, //经度
                                    //     "locationLongitude": res.result[i].locationLongitude, //纬度
                                    //     "mobilePhone": res.result[i].mobilePhone, //手机号
                                    //     "telephone": res.result[i].telephone, //电话
                                    //     "businessScope": res.result[i].businessScope, //业务范围
                                    //     "distance": res.result[i].distance, //城市区域编码
                                    //     "range": range //距离

                                    // };
                                    var tmp = {
                                        "areaCode": res.result.departmentNetVOList[i].cityCode, //区域编码
                                        "branchCode": res.result.departmentNetVOList[i].code, //网点编码
                                        "name": res.result.departmentNetVOList[i].name, //网点名称
                                        "locationAddress": res.result.departmentNetVOList[i].address, //地址
                                        "locationLatitude": res.result.departmentNetVOList[i].latitude, //经度
                                        "locationLongitude": res.result.departmentNetVOList[i].longitude, //纬度
                                        "mobilePhone": res.result.departmentNetVOList[i].mobilePhone, //手机号
                                        "telephone": res.result.departmentNetVOList[i].contactway, //电话
                                        "businessScope": res.result.departmentNetVOList[i].businessType, //业务范围
                                        "distance": res.result.departmentNetVOList[i].distance, //城市区域编码
                                        // "range": range //距离

                                    };
                                    $scope.notDatat = false;
                                    $scope.webQueryList.push(tmp);
                                    console.log(tmp, $scope.webQueryList, '99999999999999999999')
                                }

                                if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('webQueryList'))) {
                                    DepponCfg.LocCache.clearLocCache('webQueryList');
                                    DepponCfg.LocCache.clearLocCache('webQueryAddress');
                                    DepponCfg.LocCache.clearLocCache('webQueryBaseInfo');
                                }
                                // 本地存储

                                DepponCfg.LocCache.saveLocCache("webQueryList", $scope.webQueryList);
                                DepponCfg.LocCache.saveLocCache("webQueryAddress", $scope.webQueryAddress);

                                $scope.webQueryBaseInfo.pageIndex++;

                                DepponCfg.LocCache.saveLocCache("webQueryBaseInfo", $scope.webQueryBaseInfo);

                                $("#depponBottomAll").css('height', '60px');
                            } else {
                                console.log('全部：：：空');
                                //接着展示空的界面
                                $scope.notDatat = true;
                                $("#depponBottomAll").css('height', '220px');
                                $scope.isShowScrollLoad = false;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                // alert(1)
                                DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
                                return;
                            }
                            $ionicLoading.hide();
                        } else {
                            // alert(3)
                            DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
                            return;
                            //if(DepponCfg.hasEnglish(res.message)) {
                            //    DepponCfg.warningInfo('系统开小差,请稍后重试.');
                            //    return;
                            //}
                            //DepponCfg.warningInfo('获取失败,' + res.message);
                            //$("#depponBottomAll").css('height', '220px');
                        }
                    }).error(function(err) {
                        console.log('全部：err=' + JSON.stringify(err));
                        if (!DepponCfg.isEmpty(err)) {
                            if (err.status == '901') {
                                $scope.isShowScrollLoad = false;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $("#depponBottomAll").css('height', '220px');
                            } else {
                                if (DepponCfg.hasEnglish(err.message)) {
                                    DepponCfg.warningInfo('暂时无法获取附近网点信息，请稍后重试！');
                                    return;
                                }
                                DepponCfg.warningInfo('获取失败,' + err.message);
                                $("#depponBottomAll").css('height', '220px');
                            }
                            $ionicLoading.hide();
                        } else {
                            DepponCfg.warningInfo('抱歉，网络出现错误!');
                        }
                    }).finally(function() {
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
                // console.log('执行列表查询-----------------------------新接口', params);
                // webQueryListBillService.SetInf_webQueryBill(data);
                // webQueryListBillService.SetInf_webQueryBill(params);
                // if()
                // webQueryListBillService.GetInf_webQueryBill().success(function(res) {
                //     console.log('新接口1全部：res=' + JSON.stringify(res));
                //     if (res.status == 'success' && res.result.length !== 0) {
                //         if (!DepponCfg.isEmpty(res) && !DepponCfg.isEmpty(res.result)) {

                //             //$scope.webQueryBaseInfo.maxPageIndex = Math.ceil($scope.orderListBaseInfo[0].total / $scope.orderListBaseInfo[0].pageSize);
                //             if ($scope.webQueryBaseInfo.pageIndex == 1) {
                //                 $scope.webQueryList = [];
                //             }

                //             var point1 = new BMap.Point($scope.longitude, $scope.latitude);
                //             var point2 = null;
                //             var distance = $scope.map.getDistance(point1, point2);
                //             for (var i = 0; i < res.result.length; i++) {
                //                 //point2 = null;
                //                 //point2 = new BMap.Point(res.result[i].locationLongitude, res.result[i].locationLatitude);
                //                 //var range = $scope.map.getDistance(point1, point2).toFixed(2);
                //                 // var range = getDistance($scope.longitude, $scope.latitude, res.result[i].locationLongitude, res.result[i].locationLatitude);
                //                 var range = getDistance($scope.longitude, $scope.latitude, res.result[i].baiduLng, res.result[i].baiduLat);
                //                 // var tmp = {
                //                 //     "branchCode": res.result[i].branchCode, //网点编码
                //                 //     "name": res.result[i].name, //网点名称
                //                 //     "areaCode": res.result[i].areaCode, //区域编码
                //                 //     "locationAddress": res.result[i].locationAddress, //地址
                //                 //     "locationLatitude": res.result[i].locationLatitude, //经度
                //                 //     "locationLongitude": res.result[i].locationLongitude, //纬度
                //                 //     "mobilePhone": res.result[i].mobilePhone, //手机号
                //                 //     "telephone": res.result[i].telephone, //电话
                //                 //     "businessScope": res.result[i].businessScope, //业务范围
                //                 //     "distance": res.result[i].distance, //城市区域编码
                //                 //     "range": range //距离

                //                 // };
                //                 var tmp = {
                //                     "branchCode": res.result[i].deptCode, //网点编码
                //                     "name": res.result[i].deptName, //网点名称
                //                     "areaCode": res.result[i].areaCode, //区域编码
                //                     "locationAddress": res.result[i].deptAddress, //地址
                //                     "locationLatitude": res.result[i].baiduLat, //经度
                //                     "locationLongitude": res.result[i].baiduLng, //纬度
                //                     "mobilePhone": res.result[i].mobilePhone, //手机号
                //                     "telephone": res.result[i].contactway, //电话
                //                     "businessScope": res.result[i].businessType, //业务范围
                //                     "distance": res.result[i].distance, //城市区域编码
                //                     "range": range //距离

                //                 };
                //                 $scope.notDatat = false;
                //                 $scope.webQueryList.push(tmp);
                //                 console.log(tmp,$scope.webQueryList,'99999999999999999999')
                //             }

                //             if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('webQueryList'))) {
                //                 DepponCfg.LocCache.clearLocCache('webQueryList');
                //                 DepponCfg.LocCache.clearLocCache('webQueryAddress');
                //                 DepponCfg.LocCache.clearLocCache('webQueryBaseInfo');
                //             }
                //             // 本地存储

                //             DepponCfg.LocCache.saveLocCache("webQueryList", $scope.webQueryList);
                //             DepponCfg.LocCache.saveLocCache("webQueryAddress", $scope.webQueryAddress);

                //             $scope.webQueryBaseInfo.pageIndex++;

                //             DepponCfg.LocCache.saveLocCache("webQueryBaseInfo", $scope.webQueryBaseInfo);

                //             $("#depponBottomAll").css('height', '60px');
                //         } else {
                //             console.log('全部：：：空');
                //             //接着展示空的界面
                //             $scope.notDatat = true;
                //             $("#depponBottomAll").css('height', '220px');
                //             $scope.isShowScrollLoad = false;
                //             $scope.$broadcast('scroll.infiniteScrollComplete');
                //             alert(1)
                //             DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
                //             return;
                //         }
                //         $ionicLoading.hide();
                //     } else {
                //         alert(3)
                //         DepponCfg.warningInfo('当前地址，暂未获取到附近网点');
                //         return;
                //         //if(DepponCfg.hasEnglish(res.message)) {
                //         //    DepponCfg.warningInfo('系统开小差,请稍后重试.');
                //         //    return;
                //         //}
                //         //DepponCfg.warningInfo('获取失败,' + res.message);
                //         //$("#depponBottomAll").css('height', '220px');
                //     }
                // }).error(function(err) {
                //     console.log('全部：err=' + JSON.stringify(err));
                //     if (!DepponCfg.isEmpty(err)) {
                //         if (err.status == '901') {
                //             $scope.isShowScrollLoad = false;
                //             $scope.$broadcast('scroll.infiniteScrollComplete');
                //             $("#depponBottomAll").css('height', '220px');
                //         } else {
                //             if (DepponCfg.hasEnglish(err.message)) {
                //                 DepponCfg.warningInfo('暂时无法获取附近网点信息，请稍后重试！');
                //                 return;
                //             }
                //             DepponCfg.warningInfo('获取失败,' + err.message);
                //             $("#depponBottomAll").css('height', '220px');
                //         }
                //         $ionicLoading.hide();
                //     } else {
                //         DepponCfg.warningInfo('抱歉，网络出现错误!');
                //     }
                // }).finally(function() {
                //     $scope.$broadcast('scroll.refreshComplete');
                // })
            }















            function getDistance(longitude1, latitude1, longitude2, latitude2) {

                // 维度
                var lat1 = (Math.PI / 180) * latitude1;
                var lat2 = (Math.PI / 180) * latitude2;
                // 经度
                var lon1 = (Math.PI / 180) * longitude1;
                var lon2 = (Math.PI / 180) * longitude2;
                // 地球半径
                var R = 6371.0;
                // 两点间距离 km，如果想要米的话，结果*1000就可以了
                var d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R;

                return d.toFixed(2) + "km"; //返回公里
            }

            /*
             * 选择省市区
             * */
            $scope.chooseCities = function() {
                //console.log('chooseCities');
                //$state.go('cityCtr', { prePage: '4', firstPage: $scope.firstPage,channelType:$scope.channelType });
                //update by Jeff on 20180308
                //在当前页面弹出框选择城市控件
                $(".city_hot").find("li").children("div").removeClass("selected");
                //$scope.canChange = false;
                $scope.showCityFlag = true;
                $scope.bigArea = $scope.currentArea;
                if ($scope.bigArea == 0) {
                    $(".citySelect_title .c").css("color", "red");
                    $(".citySelect_title .i").css("color", "black");
                } else {
                    $(".citySelect_title .c").css("color", "black");
                    $(".citySelect_title .i").css("color", "red");
                }

                //编辑时初始化已经选择的项目
                //编辑时初始化已经选择的项目
                if (!DepponCfg.isEmpty($scope.webQueryAddress.proCityName)) {
                    $scope.isLoad = true;
                    if ($scope.currentArea == 0) {
                        //国内
                        $scope.nationCode = "100000";
                        if (!DepponCfg.isEmpty($scope.proCityCode)) { //有 code 代表是选中后的加载
                            var cityArr = $scope.proCityCode.split('#');
                            if (cityArr.length != 3) {
                                //$scope.canChange = true;
                                return;
                            }
                            $scope.loadProvinceCode = cityArr[0];
                            $scope.loadCityCode = cityArr[1];
                            $scope.loadCountyCode = cityArr[2];

                            for (var i = 0; i < $scope.provinceList.length; i++) {
                                if ($scope.provinceList[i].provinceCode == $scope.loadProvinceCode) {
                                    setTimeout(function() {
                                        swiperConfigLeft.slideTo(i + 1);
                                    }, 100);
                                    //getCity(i);
                                    break;
                                }
                            }
                        } else {
                            var cityArr = $scope.webQueryAddress.proCityName.split('-');
                            if (cityArr.length != 3) {
                                //$scope.canChange = true;
                                return;
                            }
                            $scope.loadProvinceName = cityArr[0];
                            $scope.loadCityName = cityArr[1];
                            $scope.loadCountyName = cityArr[2];
                            switch ($scope.loadProvinceName) {
                                case "上海市":
                                    $scope.loadProvinceName = "上海";
                                    break;
                                case "北京市":
                                    $scope.loadProvinceName = "北京";
                                    break;
                                case "天津市":
                                    $scope.loadProvinceName = "天津";
                                    break;
                                case "重庆市":
                                    $scope.loadProvinceName = "重庆";
                                    break;
                                default:
                            }

                            for (var i = 0; i < $scope.provinceList.length; i++) {
                                if ($scope.provinceList[i].provinceName == $scope.loadProvinceName) {
                                    setTimeout(function() {
                                        swiperConfigLeft.slideTo(i + 1);
                                    }, 100);
                                    //getCity(i, $scope.loadProvinceName);
                                    break;
                                }
                            }
                        }

                    } else {
                        //国际
                        if (!DepponCfg.isEmpty($scope.proCityCode)) { //有 code 代表是选中后的加载
                            var cityArr = $scope.proCityCode.split('#');
                            if (cityArr.length != 4) {
                                //$scope.canChange = true;
                                return;
                            }
                            $scope.loadNationCode = cityArr[0];
                            $scope.loadProvinceCode = cityArr[1];
                            $scope.loadCityCode = cityArr[2];
                            $scope.loadCountyCode = cityArr[3];

                            for (var h = 0; h < $scope.nationList.length; h++) {
                                if ($scope.nationList[h].nation.nationCode == $scope.loadNationCode) {
                                    setTimeout(function() {
                                        swiperConfig1.slideTo(h + 1);
                                    }, 100);
                                    getProvince(h);
                                    break;
                                }
                            }
                        } else {
                            var cityArr = $scope.webQueryAddress.proCityName.split('-');
                            if (cityArr.length != 4) {
                                //$scope.canChange = true;
                                return;
                            }
                            $scope.loadNationName = cityArr[0];
                            $scope.loadProvinceName = cityArr[1];
                            $scope.loadCityName = cityArr[2];
                            $scope.loadCountyName = cityArr[3];

                            for (var h = 0; h < $scope.nationList.length; h++) {
                                if ($scope.nationList[h].nation.nationName == $scope.loadNationName) {
                                    setTimeout(function() {
                                        swiperConfig1.slideTo(h + 1);
                                    }, 100);
                                    getProvince(h, $scope.loadProvinceName);
                                    break;
                                }
                            }
                        }

                    }
                } else {
                    //$scope.canChange = true;
                }
            }

            //选择国内区域
            //update by Jeff on 20180309
            $scope.selectChina = function() {
                //if ($scope.canChange) {
                $scope.bigArea = 0;
                $(".citySelect_title .c").css("color", "red");
                $(".citySelect_title .i").css("color", "black");
                //}
            }

            //选择国际区域
            //update by Jeff on 20180309
            $scope.selectInternational = function() {
                //if ($scope.canChange) {
                $scope.bigArea = 1;
                $(".city_hot").find("li").children("div").removeClass("selected");
                $(".citySelect_title .c").css("color", "black");
                $(".citySelect_title .i").css("color", "red");
                //}
            }

            //点击热门城市 swiper自动选择 update by Jeff on 20180309
            $scope.selectHotCity = function(hotIndex) {
                if (!$scope.canChange) { //切换热门城市的时候必须等swiper滑动结束才可以切换
                    return;
                }
                $scope.sh = true;
                $scope.canRepeatCheck = true;
                $scope.isLoad = true;
                $(".citySelect_title .c").css("color", "red");
                $(".citySelect_title .i").css("color", "black");
                //$scope.canChange = false;
                $(".city_hot.webQuery").find("li").children("div").removeClass("selected");
                $(".city_hot.webQuery").find("li").eq(hotIndex).children("div").addClass("selected");

                //根据选择的热门城市，自动滚动swiper
                $scope.loadProvinceCode = $scope.hotCityList[hotIndex].provinceCode;
                $scope.loadCityCode = $scope.hotCityList[hotIndex].cityCode;

                //获取当前省份选择的index
                var currentProvinceIndex = $(".selclass1webQuery ul").find(".swiper-slide-active").attr("oindex");

                if ($scope.bigArea == 1) { //如果是从国际切换到热门城市，国内的联动需要延时操作，不然那会出现城市无法联动的情况
                    setTimeout(function() {
                        for (var i = 0; i < $scope.provinceList.length; i++) {
                            if ($scope.provinceList[i].provinceCode == $scope.loadProvinceCode) {
                                swiperConfigLeft.slideTo(i + 1);
                                break;
                            }
                        }
                    }, 200);
                } else {
                    for (var i = 0; i < $scope.provinceList.length; i++) {
                        if ($scope.provinceList[i].provinceCode == $scope.loadProvinceCode) {
                            swiperConfigLeft.slideTo(i + 1);
                            if (currentProvinceIndex == i) {
                                swiperConfigCenter.slideTo(0);
                                getCity(currentProvinceIndex);
                            }
                            break;
                        }
                    }
                }

                $scope.bigArea = 0; //选择热门城市的时候 大区域自动切换成国内

                swiperConfigRight.slideTo(0);
            }

            //提交城市控件 update by Jeff on 20180309
            $scope.submitCity = function() {
                var province = $(".swiper-container.selclass1webQuery").find(".swiper-slide-active").text().trim();
                var provinceCode = $(".swiper-container.selclass1webQuery").find(".swiper-slide-active").attr("provincecode");
                var city = $(".swiper-container.selclass2webQuery").find(".swiper-slide-active").text().trim();
                var cityCode = $(".swiper-container.selclass2webQuery").find(".swiper-slide-active").attr("citycode");
                var county = $(".swiper-container.selclass3webQuery").find(".swiper-slide-active").text().trim();
                var countyCode = $(".swiper-container.selclass3webQuery").find(".swiper-slide-active").attr("countycode");

                // alert('我是选择城市空间里面的', province, $scope.provinceCode, city, $scope.cityCode, county, $scope.countyCode, '哈哈哈')
                $scope.province = province
                $scope.city = city
                $scope.county = county
                var nation = $(".swiper-container.selclass4webQuery").find(".swiper-slide-active").text().trim();
                var nationCode = $(".swiper-container.selclass4webQuery").find(".swiper-slide-active").attr("nationcode");
                var nationProvince = $(".swiper-container.selclass5webQuery").find(".swiper-slide-active").text().trim();
                var nationProvinceCode = $(".swiper-container.selclass5webQuery").find(".swiper-slide-active").attr("provincecode");
                var nationCity = $(".swiper-container.selclass6webQuery").find(".swiper-slide-active").text().trim();
                var nationCityCode = $(".swiper-container.selclass6webQuery").find(".swiper-slide-active").attr("cityCode");
                var nationCounty = $(".swiper-container.selclass7webQuery").find(".swiper-slide-active").text().trim();
                var nationCountyCode = $(".swiper-container.selclass7webQuery").find(".swiper-slide-active").attr("countyCode");

                if ($scope.bigArea == 0) {
                    if (province == "请选择" || city == "请选择" || county == "请选择") {
                        DepponCfg.warningInfo('请选择省市区');
                        return;
                    }
                    $scope.webQueryAddress.proCityName = province + "-" + city + "-" + county;
                    $scope.proCityCode = provinceCode + "#" + cityCode + "#" + countyCode;
                    // 新增选择城市的编码国内
                    $scope.webQueryAddress.provinceName = province; //城市
                    $scope.webQueryAddress.cityName = city; // 城市
                    $scope.webQueryAddress.countyName = county; // 区
                    $scope.webQueryAddress.provinceCode = provinceCode; //城市编码
                    $scope.webQueryAddress.cityCode = cityCode; //城市编码
                    $scope.webQueryAddress.countyCode = countyCode; //城市编码
                    $scope.currentArea = 0;
                    // 置空关键字
                    $scope.webQueryAddress.otherAddress = '';


                } else {
                    if (nation == "请选择" || nationProvince == "请选择" || nationCity == "请选择" || nationCounty == "请选择") {
                        DepponCfg.warningInfo('请选择国际区域');
                        return;
                    }
                    $scope.webQueryAddress.proCityName = nationProvince + "-" + nationCity + "-" + nationCounty;
                    $scope.proCityCode = nationCode + "#" + nationProvinceCode + "#" + nationCityCode + "#" + nationCountyCode;
                    // 新增选择城市的编码国际
                    $scope.webQueryAddress.provinceName = nationProvince; // 区
                    $scope.webQueryAddress.cityName = nationCity; // 区
                    $scope.webQueryAddress.countyName = nationCounty; // 区
                    $scope.webQueryAddress.nationCode = nationCode; //城市编码
                    $scope.webQueryAddress.provinceCode = nationProvinceCode; //城市编码
                    $scope.webQueryAddress.cityCode = nationCityCode; //城市编码
                    $scope.webQueryAddress.countyCode = nationCountyCode; //城市编码

                    $scope.currentArea = 1;

                    // 置空关键字
                    $scope.webQueryAddress.otherAddress = ''
                }

                $scope.loadNationName = ""; //自动滑动时需要匹配的参数
                $scope.loadProvinceName = ""; //自动滑动时需要匹配的参数
                $scope.loadCityName = ""; //自动滑动时需要匹配的参数
                $scope.loadCountyName = ""; //自动滑动时需要匹配的参数
                DepponCfg.LocCache.saveLocCache('currentArea', $scope.currentArea);
                $scope.webQueryAddress.address = "";
                $scope.webQueryList = [];
                $scope.SearchButton();
                // alert('SearchButton333')
                $scope.hideCity();
            }

            //获取省份 update by Jeff on 20180309
            var getProvince = function(nationIndex) {
                if (!DepponCfg.isEmpty(nationIndex)) { //provinceIndex必须有值才能做下一次联动
                    $timeout(function() {
                        $scope.nationProvinceList = $scope.nationList[nationIndex].province;
                        if ($scope.isLoad) { //如何是load 则自动联动
                            if (DepponCfg.isEmpty($scope.loadProvinceName) || $scope.sh) {
                                for (var i = 0; i < $scope.nationProvinceList.length; i++) {
                                    if ($scope.nationProvinceList[i].provinceCode == $scope.loadProvinceCode) {
                                        $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                            swiperConfig2.slideTo(i + 1);
                                        }, 100)
                                        break;
                                    }
                                }
                            } else {
                                for (var i = 0; i < $scope.nationProvinceList.length; i++) {
                                    if ($scope.nationProvinceList[i].provinceName == $scope.loadProvinceName) {
                                        $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                            swiperConfig2.slideTo(i + 1);
                                        }, 100)
                                        break;
                                    }
                                }
                            }
                        }
                    }, 200);
                } else {
                    $timeout(function() {
                        $scope.nationProvinceList = [];
                        $scope.countyList = [];
                        $scope.cityList = [];
                    }, 200);
                }

            }

            //根据省份ID 获取城市 update by Jeff on 20180309
            var getCity = function(provinceIndex) {
                if ($scope.bigArea == 0) { //国内
                    if (!DepponCfg.isEmpty(provinceIndex)) { //provinceIndex必须有值才能做下一次联动
                        $timeout(function() {
                            $scope.cityList = $scope.provinceList[provinceIndex].city;
                            if ($scope.isLoad) { //如何是load 则自动联动
                                if (DepponCfg.isEmpty($scope.loadCityName) || $scope.sh) {
                                    for (var i = 0; i < $scope.cityList.length; i++) {
                                        if ($scope.cityList[i].cityCode == $scope.loadCityCode) {
                                            $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                swiperConfigCenter.slideTo(i + 1);
                                            }, 100)
                                            break;
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < $scope.cityList.length; i++) {
                                        if ($scope.cityList[i].cityName == $scope.loadCityName) {
                                            $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                swiperConfigCenter.slideTo(i + 1);
                                            }, 100)
                                            break;
                                        }
                                    }
                                }
                            }
                        }, 200);
                    } else {
                        $timeout(function() {
                            $scope.countyList = [];
                            $scope.cityList = [];
                        }, 200);
                    }
                } else { //国际
                    if (!DepponCfg.isEmpty(provinceIndex)) {
                        $timeout(function() {
                            $scope.nationCityList = $scope.nationProvinceList[provinceIndex].city;
                            if ($scope.isLoad) { //如何是load 则自动联动
                                if (DepponCfg.isEmpty($scope.loadCityName) || $scope.sh) {
                                    for (var i = 0; i < $scope.nationCityList.length; i++) {
                                        if ($scope.nationCityList[i].cityCode == $scope.loadCityCode) {
                                            $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                swiperConfig3.slideTo(i + 1);
                                            }, 100)
                                            break;
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < $scope.nationCityList.length; i++) {
                                        if ($scope.nationCityList[i].cityName == $scope.loadCityName) {
                                            $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                swiperConfig3.slideTo(i + 1);
                                            }, 100)
                                            break;
                                        }
                                    }
                                }
                            }
                        }, 200);

                    } else {
                        $timeout(function() {
                            $scope.nationCountyList = [];
                            $scope.nationCityList = [];
                        }, 200);
                    }

                }
            }

            //根据城市ID 获取区县 update by Jeff on 20180309
            var getCounty = function(cityIndex, name) {
                if ($scope.bigArea == 0) { //国内
                    if (!DepponCfg.isEmpty(cityIndex)) {
                        $timeout(function() {
                            $scope.countyList = $scope.cityList[cityIndex].county;
                            if ($scope.isLoad) { //如何是load 则自动联动
                                if (DepponCfg.isEmpty($scope.loadCountyName) || $scope.sh) {
                                    for (var i = 0; i < $scope.countyList.length; i++) {
                                        if ($scope.countyList[i].countyCode == $scope.loadCountyCode) {
                                            $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                swiperConfigRight.slideTo(i + 1);
                                            }, 100)
                                            break;
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < $scope.countyList.length; i++) {
                                        if ($scope.countyList[i].countyName == $scope.loadCountyName) {
                                            $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                swiperConfigRight.slideTo(i + 1);
                                            }, 100)
                                            break;
                                        }
                                    }
                                }
                            }
                        }, 200);
                    } else {
                        $timeout(function() {
                            $scope.countyList = [];
                        }, 200);
                    }
                } else {
                    if (!DepponCfg.isEmpty(cityIndex)) {
                        $timeout(function() {
                            $scope.nationCountyList = $scope.nationCityList[cityIndex].county;
                            if (!DepponCfg.isEmpty($scope.nationCountyList) || $scope.sh) {
                                if ($scope.isLoad) { //如何是load 则自动联动
                                    if (DepponCfg.isEmpty($scope.loadCountyName)) {
                                        for (var i = 0; i < $scope.nationCountyList.length; i++) {
                                            if ($scope.nationCountyList[i].countyCode == $scope.loadCountyCode) {
                                                $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                    swiperConfig4.slideTo(i + 1);
                                                }, 100)
                                                break;
                                            }
                                        }
                                    } else {
                                        for (var i = 0; i < $scope.nationCountyList.length; i++) {
                                            if ($scope.nationCountyList[i].countyName == $scope.loadCountyName) {
                                                $timeout(function() { //这里一定要延时加载，不然swiper不滑动
                                                    swiperConfig4.slideTo(i + 1);
                                                }, 100)
                                                break;
                                            }
                                        }
                                    }
                                }
                            } else {
                                $timeout(function() {
                                    $scope.nationCountyList = [];
                                }, 200);
                            }
                        }, 200);
                    } else {
                        $timeout(function() {
                            $scope.nationCountyList = [];
                        }, 200);
                    }
                }
            }

            /*
             * 展开城市控件 update by Jeff on 20180308
             * */
            $scope.showCity = function() {
                $scope.showCityFlag = true;
            }

            /*
             * 隐藏城市控件update by Jeff on 20180308
             * */
            $scope.hideCity = function() {
                $scope.showCityFlag = false;
                $scope.sh = false;
                swiperConfig1.slideTo(0); //国际1级 恢复默认
                swiperConfig2.slideTo(0); //国际2级 恢复默认
                swiperConfig3.slideTo(0); //国际3级 恢复默认
                swiperConfig4.slideTo(0); //国际4级 恢复默认

                swiperConfigLeft.slideTo(0); //移动后省份slider 恢复默认
                swiperConfigCenter.slideTo(0); //移动后城市slider 恢复默认
                swiperConfigRight.slideTo(0); //移动后区县slider 恢复默认

                setTimeout(function() {
                    $scope.canChange = true;
                }, 500);

                $scope.nationProvinceList = []; //国际2级列表 update by Jeff on 20180309
                $scope.cityList = []; //城市列表 update by Jeff on 20180309
                $scope.nationCityList = []; //国际3级列表 update by Jeff on 20180309
                $scope.countyList = []; //区县列表 update by Jeff on 20180309
                $scope.nationCountyList = []; //国际4级列表 update by Jeff on 20180309

            }
            $scope.webQueryDetail = function(index) {
                    // qq.maps.convertor.translate(new qq.maps.LatLng($scope.latitude, $scope.longitude), 3, function (result) {
                    //   var spointx = result[0].lng,
                    //         spointy = result[0].lat,
                    //         epointx = 0,
                    //         epointy = 0;
                    //   // 根据当前的网点地址转换成经纬度
                    //   geocoder = new qq.maps.Geocoder({
                    //     complete : function(result){
                    //       epointx = result.detail.location.lng;
                    //       epointy = result.detail.location.lat;
                    //       window.location.href = "https://map.qq.com/m/index/nav/spointx=" +
                    //           spointx + "&spointy=" + spointy + "&epointx=" + epointx + "&epointy=" + epointy;
                    //     }
                    //   });
                    //   geocoder.getLocation($scope.webQueryList[index].locationAddress);
                    // })
                    var from = $scope.webQueryAddress.proCityName + $scope.webQueryAddress.otherAddress.trim();
                    var to = $scope.webQueryList[index].locationAddress
                    window.location.href = 'https://apis.map.qq.com/uri/v1/routeplan?type=drive&from=' + from + '&to=' + to + '&ref=SDJBZ-Q6UKX-GBU4M-TMKOD-TCHAF-NMBAU'
                }
                // $scope.webQueryDetail = function(index) {
                //     window.lastPage_is_webQuery = false;
                //     DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                //     var webQueryDetailInfo = $scope.webQueryList[index];
                //     $state.go('webQueryDetail', {
                //         webQueryDetailInfo: webQueryDetailInfo,
                //         keywords: $scope.webQueryAddress.proCityName + $scope.webQueryAddress.address,
                //         longitude: $scope.longitude,
                //         latitude: $scope.latitude,
                //         channelType: $scope.channelType,
                //         flag: 1
                //     });

            // }

            $scope.queryBackHome = function() {
                window.lastPage_is_webQuery = false;
                DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                if (!DepponCfg.isEmpty(DepponCfg.LocCache.getLocCache('webQueryList'))) {
                    DepponCfg.LocCache.clearLocCache('webQueryList');
                    DepponCfg.LocCache.clearLocCache('webQueryAddress');
                    DepponCfg.LocCache.clearLocCache("webQueryBaseInfo");
                    DepponCfg.LocCache.clearLocCache("longitude");
                    DepponCfg.LocCache.clearLocCache("latitude");
                }

                $ionicNativeTransitions.stateGo(window.DepponCfg.urlPath, {}, {
                    "type": "slide",
                    "direction": "right", // 'left|right|up|down', default 'left' (which is like 'next')
                    "duration": 300 // in milliseconds (ms), default 400
                });
            }

            $scope.jumpNewPage = function(path) {
                window.lastPage_is_webQuery = false;
                DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                //window.Deppon_Home_Page_Main('out');
                $state.go(path);
            }

            $scope.jumpNewPageForLocal = function(path) {
                window.lastPage_is_webQuery = false;
                // window.Deppon_Home_Page_Main('out');
                window.open(path, '_self');
            }

            /*
             * 展开menu
             * */
            $scope.showMenu = function() {

                $scope.showMenuFlag = true;
            }

            /*
             * 隐藏menu
             * */
            $scope.hideMenu = function() {

                $scope.showMenuFlag = false;
            }

            /*
             * 跳转到  货物追踪
             * */
            $scope.toQueryByText = function() {
                    window.lastPage_is_webQuery = false;
                    DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                    $state.go('queryByText');
                    //window.location.href = "/mow/www/query/queryByText.html"
                }
                /*
                 * 跳转到  我要寄件
                 * */
            $scope.toSend = function() {
                    window.lastPage_is_webQuery = false;
                    DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                    $.ajax({
                        type: 'GET',
                        url: DepponCfg.LoginUrl + "/phonerest/system/order/freeze",
                        async: false,
                        success: function(res) {
                            //true是可以下单，false为不可下单
                            if (!res) {
                                $state.go("vacation");
                            } else {
                                $state.go('send');
                            }
                        },
                        error: function(err) {
                            $state.go('send');
                        }
                    });
                }
                /*
                 * 跳转到  我的快运
                 * */
            $scope.toQueryList = function() {
                    window.lastPage_is_webQuery = false;
                    DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                    console.log('queryMyOrderList');
                    $state.go('queryMyOrderList');
                }
                /*
                 * 跳转到  价格时效
                 * */
            $scope.toPrice = function() {
                    window.lastPage_is_webQuery = false;
                    DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                    window.DepponCfg.urlPath = "home";
                    window.DepponCfg.inPricePageType = "other";
                    $state.go('price');
                    //window.location.href = "/mow/www/query/price.html"
                }
                /*
                 * 网点查询
                 * */
            $scope.toWebQuery = function() {}
                /*
                 * 收派范围
                 * */
            $scope.toDispatchScope = function() {
                window.lastPage_is_webQuery = false;
                DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                window.DepponCfg.urlPath = "home";
                $state.go('dispatchScope');
                //window.location.href = "/mow/www/query/dispatchScope.html"
            }

            $scope.goHome = function(path) {
                window.lastPage_is_webQuery = false;
                DepponCfg.LocCache.clearLocCache('currentArea'); //清除currentArea缓存 update by Jeff on 20180309
                $state.go('home');
            }

            // $scope.toTel = function (tel) {
            //     tel = tel.trim();
            //     var flag1 = tel.indexOf(" ");
            //     var flag2 = tel.indexOf("/");

            //     if (flag1 < 0 && flag2 < 0) {
            //         window.location.href = "tel:" + tel;
            //         return;
            //     }
            //     if (flag2 < flag1) {
            //         window.location.href = "tel:" + tel.substr(0, flag1);
            //         return;
            //     }
            //     if (flag1 < flag2) {
            //         window.location.href = "tel:" + tel.substr(0, flag2);
            //         return;
            //     }
            // }


            $scope.toTel = function(tel) {
                // tel = tel.trim();
                // var flag1 = tel.indexOf(" "); // 
                // var flag2 = tel.indexOf("/"); // 
                // var reg = /\d+/;
                // // substr 
                // // 参数1: 起始位置 
                // // 参数2: length 长度  如果省略 将返回从起始位置开始到结束的字符
                // if (reg.test(tel) === false) {
                //     window.location.href = 'tel:' + 95353
                //     return
                // }
                // if (flag1 < 0 && flag2 < 0) {
                //     // 判断前两位是否为汉字
                //     var reg = /^[\u4E00-\u9FA5]{2}/;
                //     if (reg.test(tel)) {
                //         window.location.href = 'tel:' + tel.substr(3, 12);
                //         return;
                //     }
                //     window.location.href = "tel:" + tel;
                //     return;
                // }
                // if (flag2 < flag1) {
                //     if (flag1 > 12) {
                //         // 判断前两位是否为汉字
                //         var reg = /^[\u4E00-\u9FA5]{2}/;
                //         if (reg.test(tel)) {
                //             window.location.href = 'tel:' + tel.substr(3, 12);
                //             return;
                //         }
                //         window.location.href = 'tel:' + tel.substr(0, 12);
                //         return;
                //     }
                //     window.location.href = "tel:" + tel.substr(0, flag1);
                //     console.log(tel.substr(0, flag1), '我是flag2<flag1')
                //     return;
                // }
                // if (flag1 < flag2) {
                //     window.location.href = "tel:" + tel.substr(0, flag2);
                //     console.log(tel.substr(0, flag2), '我是flag1<flag2')
                //     return;
                // }
                tel = tel.trim();
                var reg = /((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}))?/g;
                var phone = tel.match(reg);
                var callTel = '';
                for (var i = 0; i < phone.length; i++) {
                    if (phone[i].length > 10) {
                        callTel = phone[i];
                        break;
                    }
                }
                console.log("tel==" + callTel);
                if (callTel == '') {
                    DepponCfg.warningInfo("电话有误，不能拨打");
                    return;
                } else {
                    window.location.href = "tel:" + callTel;
                }
            }

        }
    ])