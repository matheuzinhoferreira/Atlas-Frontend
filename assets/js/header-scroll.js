$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 48) {
            $('.header').addClass('header-compact');
        } else {
            $('.header').removeClass('header-compact');
        }
    });
});