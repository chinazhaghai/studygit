var Dpr = 1, uAgent = window.navigator.userAgent;
var isIOS = uAgent.match(/iphone/i);
var isYIXIN = uAgent.match(/yixin/i);
var is2345 = uAgent.match(/Mb2345/i);
var ishaosou = uAgent.match(/mso_app/i);
var isSogou = uAgent.match(/sogoumobilebrowser/ig);
var isLiebao = uAgent.match(/liebaofast/i);
var isGnbr = uAgent.match(/GNBR/i);
function resizeRoot(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth, wDpr, wFsize;
    var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
    if (window.devicePixelRatio) {
        wDpr = window.devicePixelRatio;
    } else {
        wDpr = isIOS ? wWidth > 818 ? 3 : wWidth > 480 ? 2 : 1 : 1;
    }
    if(isIOS) {
        wWidth = screen.width;
        wHeight = screen.height;
    }
    if(wWidth > wHeight){
        wWidth = wHeight;
    }

    wFsize = wWidth > 1080 ? 144 : wWidth / 6.4;
    wFsize = wFsize > 32 ? wFsize : 32;

    window.screenWidth_ = wWidth;
    if(isYIXIN || is2345 || ishaosou || isSogou || isLiebao || isGnbr){
        setTimeout(function(){
            wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth;
            wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
            wFsize = wWidth > 1080 ? 144 : wWidth / 7.5;
            wFsize = wFsize > 32 ? wFsize : 32;
            document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
            document.getElementById("fixed").style.display="none";
        },500);
    }else{
        document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
    }
    //console.log("fz="+wFsize+";dpr="+window.devicePixelRatio+";UA="+uAgent+";width="+wWidth+";sw="+screen.width+";wiw="+window.innerWidth+";wsw="+window.screen.width+window.screen.availWidth);
}
resizeRoot();
window.onresize = resizeRoot;
