  window.onload = function() {
      // window.Deppon_GPS_Main(); //获取到数据
      console.log("定位的数据", window.Deppon_GPS_Main());
      // init();
      //因为我暂时不会写，所以这些数据就先全局存在吧
      var map = new BMap.Map("container");
      var localSearch = new BMap.LocalSearch(map);
      var webQueryAddress = {
              "proCityName": $('.current-sel').innerText, //当前城市的地址栏
              "address": "", //详细的地址
              "otherAddress": $('.search-ipt').val() //输入框的详细地址
          }
          /*有关列表数据的基本信息--并不清楚有啥用*/
      var webQueryBaseInfo = {
          "pageIndex": "1",
          "pageSize": "10"
      }
      var webQueryList = []
      $('.current-sel').html("请输入省市区");
      window.Deppon_GPS_CallBack = function(res) {

              console.log("1", res);
              var addComp = res.addressComponents;
              console.log("从地理位置获取到的省市区", addComp);
              var shi = addComp.province;
              var cityName = addComp.city;
              var countyName = addComp.district;
              var flag = shi.indexOf("市");
              if (flag > 0) {
                  shi = shi.substr(0, shi.length - 1);
                  webQueryAddress.provinceName = shi;
              } else {
                  webQueryAddress.provinceName = addComp.province;
              }
              var ssq = shi + "-" + addComp.city + "-" + addComp.district; //省市区的数据
              console.log(ssq);
              $('.current-sel').html(ssq);
              var str = addComp.street + addComp.streetNumber;
              $('.search-ipt').val(str);
              webQueryAddress.cityName = addComp.city; //城市
              webQueryAddress.countyName = addComp.district; //区域
              webQueryAddress.proCityName = ssq;
              webQueryAddress.otherAddress = str;
              //获取缓存的所有的数据
              var cityData = JSON.parse(window.localStorage.getItem('cityData'));
              console.log("我是缓存的城市", cityData);
              var province = [];
              var city = [];
              var county = [];
              if (cityData !== null) {
                  province = cityData[0].province;
                  console.log(province);
                  for (var i = 0; i < province.length; i++) {
                      if (shi == province[i].provinceName) {
                          console.log(shi, province[i].provinceName, "淡定淡定");
                          webQueryAddress.provinceCode = province[i].provinceCode;
                          console.log(webQueryAddress);
                          city = province[i].city
                          console.log(city, "我是city", webQueryAddress.provinceCode);
                          break;
                      }
                  }
                  //遍历城市
                  for (var i = 0; i < city.length; i++) {
                      console.log(shi);
                      if (cityName == city[i].cityName) {
                          console.log(shi, city[i].cityName, "快疯了");
                          webQueryAddress.cityCode = city[i].cityCode;
                          county = city[i].county;
                          console.log(county, 'county', webQueryAddress.cityCode);
                          break;

                      }
                  }
                  //遍历区
                  for (var i = 0; i < county.length; i++) {
                      if (countyName == county[i].countyName) {
                          console.log(cityName, county[i].countyName, "淡定淡定");
                          webQueryAddress.countyCode = county[i].countyCode;
                          console.log(webQueryAddress.cityCode, '流浪地球啊！！');
                      }
                  }
              }
              var proCityCode = "" + webQueryAddress.provinceCode + "#" + webQueryAddress.cityCode + "#" + webQueryAddress.countyCode;
              $('.yyb-btn').attr('code', proCityCode);
              console.log("我是自动获取的code", proCityCode);
              if (!DepponCfg.isEmpty(webQueryAddress.proCityName)) {
                  //调接口取数据
                  console.log("调接口");
                  console.log(webQueryAddress);
                  var keyWords = $('.search-ipt').val();
                  console.log("我是最新的keyWords", keyWords);
                  //如果省市区的名称或者关键字的选项两者有意识存在的,那么就根据地址来反选
                  //如果根据给出的值拿不到经纬度就认为这个地址有问题，提醒用户 输入的地址存在问题
                  if (!DepponCfg.isEmpty(keyWords) || !DepponCfg.isEmpty(webQueryAddress.cityName)) {
                      var longitude = ""; //经度
                      var latitude = ""; //纬度
                      localSearch.setSearchCompleteCallback(function(searchResult) {
                          var poi = searchResult.getPoi(0);
                          console.log(poi.point.lng);
                          //   if (poi = undefined) {
                          //       webQueryList = []; //存储我们从后台拿到的数据为了后续的渲染和点击
                          //       new Toast({
                          //           showText: "地址获取失败,请检查地址是否正确",
                          //           timeout: 1500
                          //       }).show();
                          //       if (!DepponCfg.isEmpty(window.localStorage.getItem('webQueryList'))) {
                          //           window.localStorage.removeItem('webQueryLsit');
                          //           window.localStorage.removeItem('longitude');
                          //           window.localStorage.removeItem('latitude');
                          //           window.localStorage.removeItem('webQueryBaseInfo');
                          //       }
                          //       return;
                          //   }
                          console.log(poi);
                          longitude = poi.point.lng; //将获取到的经度进行性赋值
                          latitude = poi.point.lat; //将获取到的纬度进行赋值
                          console.log("我是根据地址反查得到的经纬度" + poi.point.lng + "," + poi.point.lat);
                          if ("上海-上海市-青浦区明珠路" == searchResult.keyword || "上海市-上海市-青浦区明珠路" == searchResult.keyword) {
                              longitude = 121.268291;
                              latitude = 31.201107;
                          }
                          map.centerAndZoom(poi.point, 13); //绘制地图位置
                          if (!DepponCfg.isEmpty(window.localStorage.getItem('webQueryList'))) {
                              webQueryList = [];
                              window.localStorage.removeItem('webQueryLsit');
                              window.localStorage.removeItem('longitude');
                              window.localStorage.removeItem('latitude');
                              window.localStorage.removeItem('webQueryBaseInfo');
                          }
                          window.localStorage.setItem('longitude', longitude);
                          window.localStorage.setItem('latitude', latitude);
                          var params = {};
                          if (keyWords !== '') {
                              //有关键字的接口
                              params.province = webQueryAddress.provinceName; //省份
                              params.city = webQueryAddress.cityName; //城市
                              params.county = webQueryAddress.countyName; //区域
                              params.otherAddress = webQueryAddress.otherAddress; //关键字的地区
                              initData(params);
                              console.log("有关键字的", params);
                          } else {
                              //没有关键字的接口
                              params.provinceCode = webQueryAddress.provinceCode;
                              params.provinceName = webQueryAddress.provinceName;
                              params.cityCode = webQueryAddress.cityCode;
                              params.cityName = webQueryAddress.cityCode;
                              params.countyCode = webQueryAddress.countyCode;
                              params.countyName = webQueryAddress.countyName;
                              initData(params);
                              console.log("没有关键字的", params);
                          }
                      });
                      localSearch.search(webQueryAddress.proCityName + webQueryAddress.otherAddress);

                  }


              }
          }
          //调用接口去请求数据的接口
      SearchButton();

      function SearchButton() {
          var keywords = webQueryAddress.otherAddress.trim();
          if (!DepponCfg.isEmpty(keywords) || !DepponCfg.isEmpty(webQueryAddress.proCityName)) {
              console.log("我是有关键字的数据接口呢");
              var longitude = "";
              var latitude = "";
              //根据地区和名称反插经纬度
              localSearch.setSearchCompleteCallback(function(searchResult) {
                  var poi = searchResult.getPoi(0);
                  console.log("根据地区名称反插经纬度", poi);
                  if (poi == undefined) {
                      console.log("poi is undefined");
                      webQueryList = [];
                      new Toast({
                          showText: "地址获取失败,请检查地址是否正确"
                      }).show();
                      if (!DepponCfg.isEmpty(window.localStorage.getItem('webQueryList'))) {
                          window.localStorage.removeItem('webQueryList');
                          window.localStorage.removeItem('longtitude');
                          window.localStorage.removeItem('latitude');
                          window.localStorage.removeItem('webQueryBaseInfo');
                      }
                      return;
                  }
                  longitude = poi.point.lng; //经度
                  latitude = poi.point.lat; //纬度
                  if ("上海-上海市-青浦区明珠路" == searchResult.keyword || "上海市-上海市-青浦区明珠路" == searchResult.keyword) {
                      longitude = 121.268291;
                      latitude = 31.201107;
                  }
                  map.centerAndZoom(poi.point, 13); //创建地图模式
                  if (!DepponCfg.isEmpty(window.localStorage.getItem('webQueryList'))) {
                      console.log("localStoragebuweikong");
                      webQueryList = [];
                      window.localStorage.removeItem('webQueryList');
                      window.localStorage.removeItem('longitude');
                      window.localStorage.removeItem('latitude');
                      window.localStorage.removeItem('webQueryBaseInfo');
                  }
                  window.localStorage.setItem('longitude', longitude);
                  window.localStorage.setItem('latitude', latitude);
                  var params = {};
                  if (keywords !== '') {
                      params.province = webQueryAddress.proCityName; //省份
                      params.city = webQueryAddress.cityName; //城市
                      params.county = webQueryAddress.countyName; //区域
                      params.otherAddress = webQueryAddress.otherAddress; //关键词地址
                      initData(params);
                      console.log("有关键词的", params);
                  } else {
                      params.provinceCode = webQueryAddress.provinceCode;
                      params.provinceName = webQueryAddress.provinceName;
                      params.cityCode = webQueryAddress.cityCode;
                      params.cityName = webQueryAddress.cityName;
                      params.countyCode = webQueryAddress.countyCode;
                      params.countyName = webQueryAddress.countyName;
                      initData("没有关键字的", params);
                  }
              });
              localSearch.search(webQueryAddress.proCityName + webQueryAddress.address)
                  //输入关键字反向查找地址 因为用户后来会跳转到地图的页面所以输入的地址必须能够查找到经纬这一数据
          } else {
              //不知道写啥了
          }
      }
      //调用接口的函数
      function initData(params) {
          console.log(params, '我看看');
          var obj = params;
          var arr = Object.keys(obj);
          var len = arr.length;
          //判断params参数的长度
          //len=4是有关键字的接口
          if (len === 4) {
              var data = {
                  "matchtypes": [
                      "pickup",
                      "deliver",
                      "leave"
                  ],
                  "transportway": "motor_self",
                  "province": params.province, // 城市 
                  "city": params.city, // 城市
                  "county": params.county, // 区县
                  "otherAddress": params.otherAddress, // 道路
              }
              showLoading(); //loading图出现
              $.ajax({
                  url: "/phonerest/branch/stationSearch",
                  method: "POST",
                  data: JSON.stringify(data),
                  dataType: 'json',
                  timeout: 3 * 60 * 1000,
                  headers: {
                      'Content-Type': 'application/json;charset=UTF-8'
                  },
                  success: function(res) {
                      completeLoading(); //loading图消失
                      var str = ""; //模板字符串拼接需要的
                      if (res.status == 'success' && !DepponCfg.isEmpty(res.result)) {
                          if (!DepponCfg.isEmpty(res) || !DepponCfg.isEmpty(res.result)) {
                              webQueryList = [];
                              var point1 = new BMap.Point(longitude, latitude);
                              var point2 = null;
                              var distance = getDistance(point1, point2);
                              console.log(distance);
                              for (var i = 0; i < res.result.length; i++) {
                                  //有省市区的地方能自己拿到distance
                                  var range = res.result[i].distance.toFixed(2) + "km";
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
                                  webQueryList.push(tmp);
                                  console.log(webQueryList);
                                  for (var m = 0; m < webQueryList.length; m++) {
                                      str += `<div class="detail">
                    <div class="detail-top">
                        <div class="detail-top-l clearfloat">
                            <img class="net-img" src="./img/icon_wangdian@2x.png" />
                            <span class="net-text">${webQueryList[m].name}</span>
                        </div>
                        <div class="net-type clearfloat">
                            <a class="type" href="#">${webQueryList[m].businessScope[0]?webQueryList[m].businessScope[0]:""}</a>
                            <a class="type" href="#">${webQueryList[m].businessScope[1]?webQueryList[m].businessScope[1]:""}</a>
                            <a class="type" href="#">${webQueryList[m].businessScope[2]?webQueryList[m].businessScope[2]:""}</a>
                        </div>
                    </div>
                    <div class="desc-main clearfloat">
                        <div class="desc-left">
                            <div class="detail-address clearfloat">
                                <p class="desc-adr">地址:</p>
                                <p class="desc-text">${webQueryList[m].locationAddress}</p>
                            </div>
                            <div class="desc-tel clearfloat">
                                <p class="tel">电话:</p>
                                <p class="desc-text">${webQueryList[m].telephone}</p>
                            </div>
                            </div>
                            <div class="desc-right clearfloat">
                             <img class="db-img" src="./img/img_logo@2x.png" />
                             </div>
                            </div>
                            <div class="choice">
                                <ul>
                                 <li class="bd-r">
                                <img class="choice-img" src="./img/icon_juli@2x.png" />
                                <span class="choice-text">距您${range}</span>
                                    </li>
                                 <li class="bd-r">
                                <img class="choice-img" src="./img/icon_lubiao@2x.png" />
                                    <span class="choice-text">到这里去</span>
                                      </li>
                                        <li>
                                        <img class="choice-img" src="./img/icon_phone@2x.png" />
                                        <span class="choice-text">拨打电话</span>
                                     </li>
                                  </ul>
                                 </div>
                         </div>`;

                                  }
                                  $('.main-detail').append(str);

                              }

                              if (!DepponCfg.isEmpty(window.localStorage.getItem('webQueryList'))) {
                                  window.localStorage.removeItem('webQueryList');
                                  window.localStorage.removeItem('webQueryAddress');
                                  window.localStorage.removeItem('webQuryBaseInfo');
                              }
                              //本地存储
                              window.localStorage.setItem('webQueryList', webQueryList);
                              window.localStorage.setItem('webQueryAddress', webQueryAddress);
                              webQueryBaseInfo.pageIndex++;
                              window.localStorage.setItem('webQueryBaseInfo', webQueryBaseInfo);
                          } else {
                              new Toast({
                                  showText: "当前地址,暂未获取到附近的网点",
                                  timeout: 1500
                              }).show();
                              return;
                          }
                      } else {
                          new Toast({
                              showText: "当前地址,暂未获取到附近的网点",
                              timeout: 1500
                          }).show();
                          return;
                      }
                  },
                  error: function(err) {
                      if (!DepponCfg.isEmpty(err)) {
                          if (err.status == '901') {
                              console.log("无限下拉的按钮会关闭");
                          } else {
                              if (DepponCfg.hasEnglish(err.message)) {
                                  new Toast({
                                      showText: "暂时无法获取附近网点,请稍后重试",
                                      timeout: 1500
                                  }).show();
                                  return;
                              }
                              new Toast({
                                  showText: "获取失败" + err.message,
                                  timeout: 1500
                              }).show();
                          }

                      } else {
                          new Toast({
                              showText: "抱歉,网络出现错误",
                              timeout: 1500
                          }).show();
                          return;
                      }

                  }
              });
          } else {
              console.log("没有关键字的接口");
              $.ajax({
                  url: "/phonerest/branch/queryDeptNet",
                  data: JSON.stringify(data),
                  dataType: 'json',
                  timeout: 3 * 60 * 1000,
                  headers: {
                      'Content-Type': 'application/json;charset=UTF-8'
                  },
                  success: function(res) {
                      if (res.status == 'success' && !DepponCfg.isEmpty(res.result.length !== 0)) {
                          if (!DepponCfg.isEmpty(res) && !DepponCfg.isEmpty(res.reult.departmentNetVOList)) {
                              if (webQueryBaseInfo.pageIndex == 1 || webQueryBaseInfo.pageIndex == 3) {
                                  webQueryBaseInfo.pageIndex = 1;
                                  webQueryList = [];
                              }
                              var point1 = new BMap.Point(longitude, latitude);
                              var point2 = null;
                              var distance = getDistance(point1, point2);
                              for (var i = 0; i < res.result, departmentNetVOList.length; i++) {
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
                                  webQueryList.push(tmp);
                              }
                              for (var m = 0; m < webQueryList.length; m++) {
                                  str += `<div class="detail">
                    <div class="detail-top">
                        <div class="detail-top-l clearfloat">
                            <img class="net-img" src="./img/icon_wangdian@2x.png" />
                            <span class="net-text">${webQueryList[m].name}</span>
                        </div>
                        <div class="net-type clearfloat">
                            <a class="type" href="#">${webQueryList[m].businessScope[0]?webQueryList[m].businessScope[0]:""}</a>
                            <a class="type" href="#">${webQueryList[m].businessScope[1]?webQueryList[m].businessScope[1]:""}</a>
                            <a class="type" href="#">${webQueryList[m].businessScope[2]?webQueryList[m].businessScope[2]:""}</a>
                        </div>
                    </div>
                    <div class="desc-main clearfloat">
                        <div class="desc-left">
                            <div class="detail-address clearfloat">
                                <p class="desc-adr">地址:</p>
                                <p class="desc-text">${webQueryList[m].locationAddress}</p>
                            </div>
                            <div class="desc-tel clearfloat">
                                <p class="tel">电话:</p>
                                <p class="desc-text">${webQueryList[m].telephone}</p>
                            </div>
                            </div>
                            <div class="desc-right clearfloat">
                             <img class="db-img" src="./img/img_logo@2x.png" />
                             </div>
                            </div>
                            <div class="choice">
                                <ul>
                                 <li class="bd-r">
                                <img class="choice-img" src="./img/icon_juli@2x.png" />
                                <span class="choice-text">距您${range}</span>
                                    </li>
                                 <li class="bd-r">
                                <img class="choice-img" src="./img/icon_lubiao@2x.png" />
                                    <span class="choice-text">到这里去</span>
                                      </li>
                                        <li>
                                        <img class="choice-img" src="./img/icon_phone@2x.png" />
                                        <span class="choice-text">拨打电话</span>
                                     </li>
                                  </ul>
                                 </div>
                         </div>`;

                              }
                              $('.main-detail').append(str);
                              if (!DepponCfg.isEmpty(window.localStorage.getItem('webQueryList'))) {
                                  window.localStorage.removeItem('webQueryList');
                                  window.localStorage.removeItem('webQueryAddress');
                                  window.localStorage.removeItem('webQueryBaseInfo');

                              }
                              window.localStorage.setItem('webQueryList', webQueryList);
                              window.localStorage.setItem('webQueryAddress', webQueryAddress);
                              webQueryBaseInfo.pageIndex++;
                              window.localStorage.setItem('webQueryBaseInfo', webQueryBaseInfo);


                          } else {
                              new Toast({
                                  showText: "当前地址,暂未获取附近网点",
                                  timeout: 1500
                              }).show();
                              return;
                          }
                      } else {
                          new Toast({
                              showText: "当前地址,暂未或驱动附近的网点",
                              timeout: 1500
                          }).show();
                          return;
                      }
                  },
                  error: function(err) {
                      if (!DepponCfg.isEmpty(err)) {
                          if (err.status == '901') {

                          }
                      } else {
                          if (DepponCfg.hasEnglish(err.message)) {
                              new Toast({
                                  showText: "暂时无法获取附近网点",
                                  timeout: 1500
                              }).show();
                              return;
                          }
                          new Toast({
                              showText: "获取失败" + err.message,
                              timeout: 1500
                          }).show()
                      }

                  }
              })


          }
      }
      var currentCity = $('.yyb-btn').text().trim().split('-');
      console.log("现在的城市", currentCity);
      //获取省市区的编码
      //var acode = $('.yyb-btn').attr('code').split('#');
      console.log("我是省市区的编码", $('.yyb-btn').attr('code'));
      //console.log("省市区的编码获取", acode);
      // var alen = acode.length; //省市区编码的长度
      // var provinceCode = acode[alen - 3];
      // var cityCode = acode[alen - 2];
      // var countyCode = acode[alen - 1];

      //       $('.btn-search').bind('click', function() {
      //           var currentCity = $('.yyb-btn').text().trim().split('-');
      //           console.log(currentCity);
      //           var clen = currentCity.length;
      //           var province = currentCity[clen - 3];
      //           var city = currentCity[clen - 2];
      //           var county = currentCity[clen - 1];
      //           var otherAddress = $('.search-ipt').val();
      //           console.log($('.yyb-btn').text().split('-'));
      //           var m = $('.search-ipt').val();
      //           console.log($('.search-ipt').val());
      //           console.log("关键词", m);
      //           console.log("我点击了搜索");
      //           //有关键词的接口
      //           // var data = {
      //           //     "matchtypes": [
      //           //         "pickup",
      //           //         "deliver",
      //           //         "leave"
      //           //     ],
      //           //     "transportway": "motor_self",
      //           //     "province": province, // 城市 
      //           //     "city": city, // 城市
      //           //     "county": county, // 区县
      //           //     "otherAddress": m, // 道路
      //           // };
      //           //没有关键字的接口
      //           var data = {
      //               "level": "4",
      //               "provinceCode": webQueryAddress.provinceCode,
      //               "provinceName": province,
      //               "cityCode": webQueryAddress.cityCode,
      //               "cityName": city,
      //               "countyCode": webQueryAddress.countyCode,
      //               "countyName": county,
      //               "type": "1",
      //               "pageIndex": 1,
      //               "pageSize": 9
      //           }
      //           console.log("有关键字的接口", data);
      //           $.ajax({
      //               url: "/phonerest/branch/queryDeptNet",
      //               method: "POST",
      //               dataType: 'json',
      //               data: JSON.stringify(data),
      //               timeout: 3 * 60 * 1000,
      //               headers: {
      //                   'Content-Type': 'application/json;charset=UTF-8'
      //               },
      //               success: function(res) {
      //                   console.log(res);
      //                   var str = "";
      //                   if (res.status == 'success' && res.result.length !== 0) {
      //                       if (!DepponCfg.isEmpty(res) && !DepponCfg.isEmpty(res.result.departmentNetVOList)) {
      //                           if (webQueryBaseInfo.pageIndex == 1 || webQueryBaseInfo.pageIndex == 3) {
      //                               webQueryBaseInfo.pageIndex = 1;
      //                               webQueryList = [];
      //                           }
      //                           // var point1 = new BMap.Point(longitude, latitude);
      //                           // var point2 = null;
      //                           // var distance = getDistance(point1, point2);
      //                           for (var i = 0; i < res.result.departmentNetVOList.length; i++) {
      //                               var range = getDistance(res.result.departmentNetVOList[i].longitude, res.result.departmentNetVOList[i].latitude);
      //                               console.log(range);
      //                               var tmp = {
      //                                   "areaCode": res.result.departmentNetVOList[i].cityCode, //区域编码
      //                                   "branchCode": res.result.departmentNetVOList[i].code, //网点编码
      //                                   "name": res.result.departmentNetVOList[i].name, //网点名称
      //                                   "locationAddress": res.result.departmentNetVOList[i].address, //地址
      //                                   "locationLatitude": res.result.departmentNetVOList[i].latitude, //经度
      //                                   "locationLongitude": res.result.departmentNetVOList[i].longitude, //纬度
      //                                   //没有该字段 // "mobilePhone": res.result.departmentNetVOList[i].mobilePhone, //手机号
      //                                   "telephone": res.result.departmentNetVOList[i].contactway, //电话
      //                                   "businessScope": res.result.departmentNetVOList[i].businessType.split(" "), //业务范围
      //                                   //"distance": res.result.departmentNetVOList[i].distance, //城市区域编码
      //                                   "range": range
      //                               }
      //                               webQueryList.push(tmp);
      //                               console.log(webQueryList);
      //                           }
      //                           for (var m = 0; m < webQueryList.length; m++) {
      //                               str += `<div class="detail">
      //                     <div class="detail-top">
      //                         <div class="detail-top-l clearfloat">
      //                             <img class="net-img" src="./img/icon_wangdian@2x.png" />
      //                             <span class="net-text">${webQueryList[m].name}</span>
      //                         </div>
      //                         <div class="net-type clearfloat">
      //                             <a class="type" href="#">${webQueryList[m].businessScope[0]?webQueryList[m].businessScope[0]:""}</a>
      //                             <a class="type" href="#">${webQueryList[m].businessScope[1]?webQueryList[m].businessScope[1]:""}</a>
      //                             <a class="type" href="#">${webQueryList[m].businessScope[2]?webQueryList[m].businessScope[2]:""}</a>
      //                         </div>
      //                     </div>
      //                     <div class="desc-main clearfloat">
      //                         <div class="desc-left">
      //                             <div class="detail-address clearfloat">
      //                                 <p class="desc-adr">地址:</p>
      //                                 <p class="desc-text">${webQueryList[m].locationAddress}</p>
      //                             </div>
      //                             <div class="desc-tel clearfloat">
      //                                 <p class="tel">电话:</p>
      //                                 <p class="desc-text">${webQueryList[m].telephone}</p>
      //                             </div>
      //                             </div>
      //                             <div class="desc-right clearfloat">
      //                              <img class="db-img" src="./img/img_logo@2x.png" />
      //                              </div>
      //                             </div>
      //                             <div class="choice">
      //                                 <ul>
      //                                  <li class="bd-r">
      //                                 <img class="choice-img" src="./img/icon_juli@2x.png" />
      //                                 <span class="choice-text">距您${range}</span>
      //                                     </li>
      //                                  <li class="bd-r">
      //                                 <img class="choice-img" src="./img/icon_lubiao@2x.png" />
      //                                     <span class="choice-text">到这里去</span>
      //                                       </li>
      //                                         <li>
      //                                         <img class="choice-img" src="./img/icon_phone@2x.png" />
      //                                         <span class="choice-text">拨打电话</span>
      //                                      </li>
      //                                   </ul>
      //                                  </div>
      //                          </div>`;

      //                           }
      //                       }
      //                       $('.main-detail').append(str);
      //                   }
      //               },
      //               error: function(err) {
      //                   console.log(err);
      //               }
      //           })
      //       })
      //   }

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
       *业务逻辑整理
       */
      //当我点击下拉栏得确定按钮的时候 每次点击清空上一次的渲染
      //点击的时候只有省市区的 只有省市区的时候是不显示距离用户多少米这一数据的
      $('.citySubmitCanSave').bind('click', function(e) {
          //每次点击确定的按钮都会清空
          submitCity(e); //提交城市控件的数据
          console.log("我点击了确定的按钮");
          $('.main-detail').html(" ");
          var str = "";
          showLoading(); //展示loading图
          //清空关键字
          $('.search-ipt').val(' ');
          $('.search-ipt').attr('placeholder', "请输入关机子");
          var currentCity = $('.yyb-btn').text().split('-');
          var clen = currentCity.length;
          var currentCitycode = $('#Picker').attr('code').split('#');
          var dlen = currentCitycode.length;
          console.log("拿到数据调用接口的数据", currentCity, currentCitycode);
          var data = {
              cityCode: `${currentCitycode[dlen - 2]}`,
              cityName: `${currentCity[clen - 2]}`,
              countyCode: `${currentCitycode[dlen - 1]}`,
              countyName: `${currentCity[clen - 1]}`,
              level: "4",
              pageIndex: 1,
              pageSize: 9,
              provinceCode: `${currentCitycode[dlen - 3]}`,
              provinceName: `${currentCity[clen - 3]}`,
              type: "1"
          }
          $.ajax({
              url: "/phonerest/branch/queryDeptNet",
              method: "POST",
              dataType: 'json',
              data: JSON.stringify(data),
              timeout: 3 * 60 * 1000,
              headers: {
                  'Content-Type': 'application/json;charset=UTF-8'
              },
              success: function(res) {
                  console.log(res);
                  completeLoading()

                  webQueryList = [];
                  if (res.status == 'success' && res.result.length !== 0) {
                      if (!DepponCfg.isEmpty(res) && !DepponCfg.isEmpty(res.result.departmentNetVOList)) {
                          //   if (webQueryBaseInfo.pageIndex == 1 || webQueryBaseInfo.pageIndex == 3) {
                          //       webQueryBaseInfo.pageIndex = 1;
                          //       webQueryList = [];
                          //   }
                          // var point1 = new BMap.Point(longitude, latitude);
                          // var point2 = null;
                          // var distance = getDistance(point1, point2);
                          for (var i = 0; i < res.result.departmentNetVOList.length; i++) {
                              var range = getDistance(res.result.departmentNetVOList[i].longitude, res.result.departmentNetVOList[i].latitude);
                              console.log(range);
                              var tmp = {
                                  "areaCode": res.result.departmentNetVOList[i].cityCode, //区域编码
                                  "branchCode": res.result.departmentNetVOList[i].code, //网点编码
                                  "name": res.result.departmentNetVOList[i].name, //网点名称
                                  "locationAddress": res.result.departmentNetVOList[i].address, //地址
                                  "locationLatitude": res.result.departmentNetVOList[i].latitude, //经度
                                  "locationLongitude": res.result.departmentNetVOList[i].longitude, //纬度
                                  //没有该字段 // "mobilePhone": res.result.departmentNetVOList[i].mobilePhone, //手机号
                                  "telephone": res.result.departmentNetVOList[i].contactway, //电话
                                  "businessScope": res.result.departmentNetVOList[i].businessType.split(" "), //业务范围
                                  //"distance": res.result.departmentNetVOList[i].distance, //城市区域编码
                                  // "range": range
                              }
                              webQueryList.push(tmp);
                              console.log(webQueryList);
                          }
                          for (var m = 0; m < webQueryList.length; m++) {
                              str += `<div class="detail">
                    <div class="detail-top">
                        <div class="detail-top-l clearfloat">
                            <img class="net-img" src="./img/icon_wangdian@2x.png" />
                            <span class="net-text">${webQueryList[m].name}</span>
                        </div>
                        <div class="net-type clearfloat">
                            <a class="type" href="#">${webQueryList[m].businessScope[0]?webQueryList[m].businessScope[0]:""}</a>
                            <a class="type" href="#">${webQueryList[m].businessScope[1]?webQueryList[m].businessScope[1]:""}</a>
                            <a class="type" href="#">${webQueryList[m].businessScope[2]?webQueryList[m].businessScope[2]:""}</a>
                        </div>
                    </div>
                    <div class="desc-main clearfloat">
                        <div class="desc-left">
                            <div class="detail-address clearfloat">
                                <p class="desc-adr">地址:</p>
                                <p class="desc-text">${webQueryList[m].locationAddress}</p>
                            </div>
                            <div class="desc-tel clearfloat">
                                <p class="tel">电话:</p>
                                <p class="desc-text">${webQueryList[m].telephone}</p>
                            </div>
                            </div>
                            <div class="desc-right clearfloat">
                             <img class="db-img" src="./img/img_logo@2x.png" />
                             </div>
                            </div>
                            <div class="choice">
                                <ul>
                                
                                 <li class="bd-r">
                                <img class="choice-img" src="./img/icon_lubiao@2x.png" />
                                    <span class="choice-text">到这里去</span>
                                      </li>
                                        <li>
                                        <img class="choice-img" src="./img/icon_phone@2x.png" />
                                        <span class="choice-text">拨打电话</span>
                                     </li>
                                  </ul>
                                 </div>
                         </div>`;

                          }
                      }
                      $('.main-detail').append(str);
                  }
              },
              error: function(err) {
                  console.log(err);
              }
          })

      });

      //书写点击按钮进行搜索的逻辑
      $('.btn-search').bind('click', function() {
          //判断是否输入了关键字
          showLoading(); //loading图出现
          var btnKey = $('.search-ipt').val().trim();
          var currentCity = $('.current-sel').text().trim().split('-');
          var currentCityCode = $('.current-sel').attr('code').trim().split('#');;
          console.log("获取城市", currentCity);
          var clen = currentCity.length;
          //   var province = ;
          //   var city =;
          //   var county = ;
          //   var otherAddress = $('.search-ipt').val();
          var dlen = currentCityCode.length;
          var procincecode = currentCityCode[dlen - 3];
          var citycode = currentCityCode[dlen - 2];
          var countycode = currentCityCode[dlen - 1];
          var m = "";


          if (!DepponCfg.isEmpty(btnKey)) {
              //关键字存在的情况下 调用关键字存在的接口
              var data = {
                  "matchtypes": [
                      "pickup",
                      "deliver",
                      "leave"
                  ],
                  "transportway": "motor_self",
                  "province": `${currentCity[clen - 3]}`, // 城市 
                  "city": `${currentCity[clen - 2]}`, // 城市
                  "county": `${currentCity[clen - 1]}`, // 区县
                  "otherAddress": $('.search-ipt').val(), // 道路
              };
              $.ajax({
                  url: "/phonerest/branch/stationSearch",
                  method: "POST",
                  data: JSON.stringify(data),
                  dataType: 'json',
                  timeout: 3 * 60 * 1000,
                  headers: {
                      'Content-Type': 'application/json;charset=UTF-8'
                  },
                  success: function(res) {
                      completeLoading(); //loading消失
                      console.log("获取数据", res);
                  },
                  error: function(err) {
                      console.log(err);
                      if (err.status == 'fail') {
                          new Toast({
                              showText: "暂未获取附近网点,检查地址是否正确",
                              timeout: 1500
                          }).show();
                          return; //暂时这么写
                      }

                  }
              });
          }
      })
  }