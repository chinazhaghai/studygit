/*
* 银都插件 文档参照 Jquery 或者 Zepto
*/
var Yindu = (function(window,undefined){




  function Yindu(selector){
    return new Yindu.fn.init(selector);
  }
  Yindu.fn = Yindu.prototype = {
    init:function(){

    }
  }
  Yindu.fn.init.prototype = Yindu.fn;
})(window)
