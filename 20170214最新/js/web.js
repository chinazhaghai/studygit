
//
(function(window,$){
  function Page(){

  }
  var proto = Page.prototype;

  proto.init = function(callback){
    this.pages = $(".page");
    this.currentIndex = -1;
    this.loadRes(callback);

  }
  proto.loadRes = function(callback){
    var resource = $("[data-src]"),
        total = resource.length,
        loaded = 0,
        self = this;
    if(total==0) return (callback||function(){}).call(this),true;
    resource.each(function(index,elem){
      (function(elem){
        var src = "./img/"+$(elem).attr("data-src");
        var img = new Image;
        img.onload = function(){
          img.onload = null;
          img = null;
          var dom = $(elem);
          if(dom.hasClass("bg")){
            dom.css({backgroundImage:"url("+src+")"})
          }else {
            dom.attr("src",src);
          }
          if(loaded++,loaded==total){
            (callback || function(){}).call(self);
          }
        }
        img.src = src;
      })(elem)
    })
  }

  proto.changePage = function(){
    this.currentIndex++;
    this.pages.eq(this.currentIndex).addClass("active").siblings().removeClass("active");
  }

  proto.initEvents = function(){
    var self = this;
    $("#page1-btn").bind("touchend",this.changePage.bind(this));
    $("#uniform-btn").bind("touchend",function(){
      $("#uniform-box").addClass("active");
      self.changePage();
      var reader = new UploadFile({
        selector:"#uniform-camera-left",
        callback:function(url){
          $(this.el).remove();
          reader = null;
          var dom = $("#uniform-left-canvas");
          self.leftCanvas = new Canvas({
            el:dom[0],
            dir:"left",
            width:dom.width(),
            height:dom.height(),
            control:$(".page3")[0],
            mask:$("#uniform-mask1")[0]
          }).load(url);
        }
      });
      var reader2 = new UploadFile({
        selector:"#uniform-camera-right",
        callback:function(url){
          $(this.el).remove();
          reader2 = null;
          var dom = $("#uniform-right-canvas");
          self.rightCanvas = new Canvas({
            el:dom[0],
            dir:"right",
            width:dom.width(),
            height:dom.height(),
            control:$(".page3")[0],
            mask:$("#uniform-mask2")[0]
          }).load(url);
        }
      });
    })
    $("#shirt-btn").bind("touchend",function(){
      $("#shirt-box").addClass("active");
      self.changePage();
      var reader = new UploadFile({
        selector:"#shirt-camera-left",
        callback:function(url){
          $(this.el).remove();
          reader = null;
          var dom = $("#shirt-left-canvas");
          self.leftCanvas = new Canvas({
            el:dom[0],
            dir:"left",
            width:dom.width(),
            height:dom.height(),
            control:$(".page3")[0],
            mask:$("#shirt-mask1")[0]
          }).load(url);
        }
      });
      var reader2 = new UploadFile({
        selector:"#shirt-camera-right",
        callback:function(url){
          $(this.el).remove();
          reader = null;
          var dom = $("#shirt-right-canvas");
          self.rightCanvas = new Canvas({
            el:dom[0],
            dir:"right",
            width:dom.width(),
            height:dom.height(),
            control:$(".page3")[0],
            mask:$("#shirt-mask2")[0]
          }).load(url);
        }
      });

    })
    $("#make-photo").bind("touchend",function(){
      //$("#make-photo,.page3 .tips").hide();
      //$("#share-btn,.save-tips").show();
      self.makePhoto();
    })
    $("#share-btn").bind("touchend",function(){
      $(".share-tips").show().one("touchend",function(){
        $(this).hide();
      });
    })
  }

  proto.makePhoto = function(){
    if(!this.leftCanvas || !this.rightCanvas) return;
    var elems = $(".page3 .active .need-make,.page3 .piaodai,.page3 .curtain-left,.page3 .curtain-right,.logo");
    elems.sort(function(elem1,elem2){
      var order1 = $(elem1).attr("data-order"),order2 = $(elem2).attr("data-order");
      return order1-order2;
    });


    var canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    elems.each(function(index,elem){
      var rect= elem.getBoundingClientRect();
      ctx.drawImage(elem,rect.left,rect.top,rect.width,rect.height);
    });
    var img = new Image;
    img.src = canvas.toDataURL();
    $(img).css({width:window.innerWidth,height:window.innerHeight,opacity:0,position:"absolute",top:0,left:0});
    $("#save-tips").before($(img));
    $("#make-photo,.page3 .tips").hide();
    $("#share-btn,.save-tips").show();
  }
  new Page().init(function(){
    $("body").addClass("loaded");
    this.changePage();
    this.initEvents();
  });

})(window,Zepto);
