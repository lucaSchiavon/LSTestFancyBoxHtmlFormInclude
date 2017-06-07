jQuery(document).ready(function () {

     $("#lightbox").fancybox({
	    'width': 730,
		'height': 730,
        'autoScale': false,
        'transitionIn': 'none',
        'transitionOut': 'none',
        'type': 'iframe'
    });

    $("#lightbox").trigger("click");


});