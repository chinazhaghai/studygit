/**
 * Created by Administrator on 2016/11/21.
 */
var Slider = (function(){
    function Slider(opt){
    	var opt = opt || {};
        this.container = $(opt.container || '.swiper-container');
        this.wrapper = $(opt.wrapper || '.swiper-wrapper');
        this.slide = $(opt.slide || '.swiper-item');
        this.pre = $(opt.pre || '.pre-btn');
        this.next = $(opt.next || '.next-btn');
        this.indicator = $(opt.indicator || '.indicator');
        this.sum = $(this.slide).length;
        this.fixSum = 0;
        this.width = $(this.container).width();
        this.height = $(this.container).height();
        this.currentIndex = -1;
        this.currentDot = Math.abs(this.currentIndex)-1;
        this.playing = false;
        this.callback = opt.callback || function(){};
        this.init();
    }
    Slider.prototype.init=function(){
    	var self = this;
        this.slide.width(this.width);
        var width = this.width*(this.sum+2);
        var last = this.slide.eq(this.sum-1).clone().addClass("pre-elem");
        var first = this.slide.eq(0).clone().addClass("last-elem");
        $(last).insertBefore(this.slide.eq(0));
        $(first).insertAfter(this.slide.eq(this.sum-1));
        this.wrapper.width(width);
        this.wrapper.css("margin-left",-1*this.width);

        //注册事件
        this.pre.hide();
        this.next.hide();
        this.pre.on("click",this.onPre.bind(this));
        this.next.on("click",this.onNext.bind(this));
        this.container.on("touchstart",this.onStart.bind(this));
        this.container.on("touchend",this.onEnd.bind(this));

        this.autoPlay();

        if(this.indicator.find(".li").length>1){
        	this.indicator.find(".li").click(function(index){
        		var index = $(this).index();
        		self.currentIndex = -1*index-1;
        		
        		self.onPlay();
        	})
        }

    };
    Slider.prototype.onPre = function(){
        if(this.playing)return;
        this.currentIndex++;
        this.onPlay();
    }
    Slider.prototype.onNext = function(){
        if(this.playing)return;
        this.currentIndex--;
        this.onPlay();
    }
    Slider.prototype.onStart = function(e){
    	var e = e.originalEvent;
    	var data = e.changedTouches[0];
    	this.init_x = this.current_x = data.pageX;
    	this.init_y = this.current_y = data.pageY;
    }
    Slider.prototype.onEnd = function(e){
    	var e = e.originalEvent;
    	var data = e.changedTouches[0];
    	this.current_x = data.pageX;
    	this.current_y = data.pageY;

    	var diff_x = this.current_x - this.init_x,
    		diff_y = this.current_y - this.init_y;
    	//如果 X距离大与 Y的距离 那么久认定为是水平滑动  
		if(Math.abs(diff_x)>Math.abs(diff_y)){
			if(diff_x<-30){//左滑动
				this.onNext();
			}
			if(diff_x>30){//右滑动
				this.onPre();
			}
		}
    }
    Slider.prototype.autoPlay = function(){
    	var self = this;
    	this.timer = setInterval(function(){
    		self.onNext();
    	},5000);
    }
    Slider.prototype.onPlay = function(){
        var self = this;
        this.playing = true;
        $(this.wrapper).animate({"margin-left":this.currentIndex*this.width},{
            easing: 'swing',
            duration: 600,
            complete: function(){
                self.playing = false;
                var current = (self.currentIndex+self.sum+1)%self.currentIndex;
                if(self.currentIndex==0){
                    $(self.wrapper).css({"margin-left":-1*self.sum*self.width});
                    self.currentIndex-=self.sum;
                }
                if(self.currentIndex==-1*(self.sum+1)){
                    $(self.wrapper).css({"margin-left":-1*self.width})
                    self.currentIndex=-1;
                }
                self.update();
            }
        });
    }
    Slider.prototype.update  = function(){
    	var self = this;
    	self.currentDot = Math.abs(self.currentIndex)-1;
    	if(this.indicator.find(".li").length>1){
    		this.indicator.find(".li").eq(self.currentDot).addClass("active").siblings().removeClass("active");
    	}
    	console.log(self.currentDot);
    	this.callback(self.currentDot);

    }

    return Slider;
})(window,$);

$(function(){
	new Slider();
})
