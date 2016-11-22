$(function(){
			var win_w = $(window).width();

	var win_h = $(window).height(),
		win_w = $(window).width(),
		num = $('.block').length,
	    counter = 0,
	    off = true;
	$('.block').height(win_h);
	$('.inside-banner').height(win_h);

	if (win_w > 1024) {
		$(document).on("mousewheel DOMMouseScroll", function (e) {
		    animatefun(e);
		});
	}

	$('.vision li').on('click',function(e){
		counter = $(this).index()-1;
	    animatefun(e);

	});



	//首页加载指定位置
	$(window).load(function(){
		var sUrl = window.location.href;
		if(sUrl.indexOf('#')){
			var ind = sUrl.indexOf('#')+1;
			new_sUrl = sUrl.substring(ind);
			if ( new_sUrl == 'whitepaper') {
				$('html,body').animate({'scrollTop' : win_h*7 });
				$('.vision').css('display','block');
				$('.vision li').eq(7).addClass('selected').siblings().removeClass('selected');
				counter = 7;
			};
		}

	})

	function animatefun(e){
		var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
	                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox

	    if (delta > 0) {
	        // 向上滚
	    	if(off){
	    		off = false;
		     	counter --;
	    		if (counter < 0) {
	    			counter = 0;
	    			off = true;
	    			return false;
	    		};
	    		if (counter == 0) {
	    			$('.vision').fadeOut();
	    		}
		        var timer = null, time = 0, begin = -counter*win_h , change = win_h, duration = 70;
		        $('.block').eq(counter).addClass('selected').siblings().removeClass('selected');

		    	$('html,body').animate({'scrollTop' : win_h*counter });
		    	$('.overflowhideen').eq(counter).find('.block').addClass('active').parent('.overflowhideen').siblings().find('.block').removeClass('active');
		    	setTimeout(function(){
		    		$('.block').eq(counter+1).css('transform' , 'translateY(0px)');
		    		off = true;
		    	},500)
						//console.log(2322)
		    }
	    } else if (delta < 0 || delta == undefined || delta == 0 ) {
	        // 向下滚
	    	if(off){
	    		off = false;
		     	counter ++;
	    		if (counter == num) {
	    			counter = num-1;
	    			off = true;
	    			return false;
	    		}; 
	    		if (counter == 0) {
	    			$('.vision').fadeOut();
	    		}else {
	    			$('.vision').css('display','block');
	    		}
	    		
		        var timer = null, time = 0, begin = -counter*win_h , change = -win_h, duration = 70;
		        $('.block').eq(counter).addClass('selected').siblings().removeClass('selected');
		    	$('.block').eq(counter-1).css('transform' , 'translateY(-1000px)')
		    	$('html,body').animate({'scrollTop' : win_h*counter });
		    	$('.overflowhideen').eq(counter).find('.block').addClass('active').parent('.overflowhideen').siblings().find('.block').removeClass('active');
		    	setTimeout(function(){
		    		$('.block').eq(counter-1).css('transform' , 'translateY(0px)');
		    		off = true;
		    	},500)
	    	}
	    }
	    $('.vision li').eq(counter).addClass('selected').siblings().removeClass('selected');
	}

	
});