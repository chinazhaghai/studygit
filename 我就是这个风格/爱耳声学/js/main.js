$(function(){
	var win_h = $(window).height(),
		win_w = $(window).width(),
		num = $('.block').length,
	    counter = 0,
	    off = true;

	$('.inside-banner').height(win_h);
	$('.mobile-nav').height(win_h);



	//轮播器
	
	var li_length = $('.rotator2-con ul li').length;
	var li_w = $('.rotator2-con').width();
	$('.rotator2-con ul').width(li_w * li_length);
	$('.rotator2-con ul li').width(li_w);


	var rotator2_minpic = $('.rotator2-min').width()*104/181*4+80;
    $('.rotator2-minpic-block-con').height(rotator2_minpic);


	var num = 0;
	$('.arrow-prev').bind('click',function(){
		$('.arrow-next').css({'opacity':'1','zIndex':10});
		var rotator2_minpic_h = $('.rotator2-minpic').height()+28;
		var rotator2_minpic_length = $('.rotator2-minpic').length;
		num--;
		if (num < 1) {
			num = 0;
			$('.arrow-prev').css({'opacity':'0','zIndex':-1});
		};
		$('.rotator2-minpic-block-con ul').animate({'marginTop' : -rotator2_minpic_h*num });
	});
	$('.arrow-next').bind('click',function(){
		$('.arrow-prev').css({'opacity':'1','zIndex':10});
		var rotator2_minpic_h = $('.rotator2-minpic').height()+28;
		var rotator2_minpic_length = $('.rotator2-minpic').length;
		num++;
		if (num > rotator2_minpic_length-5) {
			num = rotator2_minpic_length-4;
			$('.arrow-next').css({'opacity':'0','zIndex':-1});
		};
		$('.rotator2-minpic-block-con ul').animate({'marginTop' : -rotator2_minpic_h*num });
	});
	$('.rotator2-minpic-block ul li').bind('click',function(){
		var index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		var li_w = $('.rotator2-con ul li').eq(0).width();
		$('.rotator2-con ul').css('marginLeft', -li_w*index);
	});

	var max_num = 0;
	$('.left-arrow').css('display','none');
	$('.left-arrow').bind('click',function(){
		$('.right-arrow').css('display','block');
		var li_w = $('.rotator2-con ul li').eq(0).width();
		var li_length = $('.rotator2-con ul li').length;
		max_num--;
		if (max_num < 1) {
			max_num = 0;
			$('.left-arrow').css('display','none');
		};
		$('.rotator2-con ul').animate({'marginLeft' : -li_w*max_num });
	});
	$('.right-arrow').bind('click',function(){
		$('.left-arrow').css('display','block');
		var li_w = $('.rotator2-con ul li').eq(0).width();
		var li_length = $('.rotator2-con ul li').length;
		max_num++;
		if (max_num > li_length-2) {
			max_num = li_length-1;
			$('.right-arrow').css('display','none');
		};
		$('.rotator2-con ul').animate({'marginLeft' : -li_w*max_num });
	});



	var mobile_nav_h = $('.mobile-nav').height();

    function wapNav(){
        var wap_navbtn = $('.wap_navbtn'),
            mobile_nav = $('.mobile-nav');
        wap_navbtn.on('click',function(){
            if (!$(this).hasClass('close')) {
                $(this).addClass('close');
                mobile_nav.animate({'top' : 0 });
                $('.inside-logo').css('display','none');
            }else{
                $(this).removeClass('close');
                mobile_nav.animate({'top' : -mobile_nav_h },function(){
                	$('.inside-logo').css('display','inline-block');
                });
            };
        });
        
    }
    wapNav();

    $('.download-btn-a').bind('click',function(){
    	var alink = $('.download-btn-a').attr('href');
    	if (alink == 'javascript:;') {
    		var obj_link = $(this).data('download');
    		$.cookie('obj_link', obj_link , { expires: 365 , path:'/' });
    		window.location = 'register.html';
    	}
    })


	$('.mobile-nav').css('top',-mobile_nav_h);
	$(window).resize(function(){
		var current_win_w = $(window).width(),
			mobile_nav_h = $('.mobile-nav').height();
		if (win_w == current_win_w) {
			$('.mobile-nav').css('top',-mobile_nav_h);
		};
	})





	function load (){
		document.addEventListener('touchstart', touch, false);
		document.addEventListener('touchmove', touch, false);
		var y = 0, num = 0;

		function touch (event){
			var event = event || window.event;


			switch(event.type){
				case 'touchstart' :
					y = event.touches[0].clientY;
					break;
				case 'touchmove' :
					num = y-event.touches[0].clientY;
					break;
			}
			if (num < -20) {
				$('.inside-header').css('backgroundColor','#cc3947').animate({'top':'-10'});
				if(document.body.scrollTop < 768){
					$('.inside-header').css('backgroundColor','transparent');
				}
			}else if (num > 20) {
				$('.inside-header').animate({'top':'-50'});
			};
		}
	}
	if (!$.browser.msie) {
		window.addEventListener('load', load, false);
	};


});