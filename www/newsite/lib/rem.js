(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 640) {
                docEl.style.fontSize = '80px';
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
                var div = document.createElement('div');
                div.style.width = '1.4rem';
                div.style.height = '0';
                document.body.appendChild(div);
                var ideal = 140 * clientWidth / 750;
                var rmd = (div.clientWidth / ideal);
                if (rmd > 1.2 || rmd < 0.8) {
                    docEl.style.fontSize = 100 * (clientWidth / 750) / rmd + 'px';
                }
                document.body.removeChild(div);
            };
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
// var DEPPON_URL = 'http://aljcode.com';//正式环境
//  var DEPPON_URL = 'http://aljcode.com'  // 本地
var DEPPON_URL = 'http://aljcode.com'  // 测试 