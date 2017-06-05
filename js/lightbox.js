jQuery(document).ready(function () {

     $("#lightbox").fancybox({
	    'width': 940,
		'height': 885,
        'autoScale': false,
        'transitionIn': 'none',
        'transitionOut': 'none',
        'type': 'iframe'
    });

    $("#lightbox").trigger("click");


});