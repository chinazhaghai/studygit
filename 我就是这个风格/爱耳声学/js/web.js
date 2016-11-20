$(function(){
    $(".navbar-item-title").click(function(){

        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).siblings(".navbar-sub-nav").slideUp();
        }else {
            $(this).addClass("active").parent().siblings().find(".navbar-item-title").removeClass("active");
            $(this).addClass("active").parent().siblings().find(".navbar-sub-nav").slideUp();
            $(this).siblings(".navbar-sub-nav").slideDown();
        }
    })
});