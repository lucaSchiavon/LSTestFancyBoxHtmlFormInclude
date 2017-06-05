function spinner(holderid, R1, R2, count, stroke_width, colour) {
    var sectorsCount = count || 12,
            color = colour || "#fff",
            width = stroke_width || 15,
            r1 = Math.min(R1, R2) || 35,
            r2 = Math.max(R1, R2) || 60,
            cx = r2 + width,
            cy = r2 + width,
            r = Raphael(holderid, r2 * 2 + width * 2, r2 * 2 + width * 2),

            sectors = [],
            opacity = [],
            beta = 2 * Math.PI / sectorsCount,

            pathParams = { stroke: color, "stroke-width": width, "stroke-linecap": "round" };
    Raphael.getColor.reset();
    for (var i = 0; i < sectorsCount; i++) {
        var alpha = beta * i - Math.PI / 2,
                cos = Math.cos(alpha),
                sin = Math.sin(alpha);
        opacity[i] = 1 / sectorsCount * i;
        sectors[i] = r.path([["M", cx + r1 * cos, cy + r1 * sin], ["L", cx + r2 * cos, cy + r2 * sin]]).attr(pathParams);
        if (color == "rainbow") {
            sectors[i].attr("stroke", Raphael.getColor());
        }
    }
    var tick;
    (function ticker() {
        opacity.unshift(opacity.pop());
        for (var i = 0; i < sectorsCount; i++) {
            sectors[i].attr("opacity", opacity[i]);
        }
        r.safari();
        tick = setTimeout(ticker, 1000 / sectorsCount);
    })();
    return function () {
        clearTimeout(tick);
        r.remove();
    };
}

// settare qui le impostazioni per il funzionamento dello phtogallery
$defaultViewMode = "full"; //full, normal, original
$tsMargin = 50; // Distanza della prima e ultima miniatura dai margini della finestra
$scrollEasing = 3000; // Velovità dello scorrimento dello slider 
$scrollEasingType = "easeOutCirc"; //Tipologia di scorrimento
$thumbnailsContainerOpacity = 0.9; //Livello di opacità del contenitore delle miniature
$thumbnailsContainerMouseOutOpacity = 0; //Opacità delle miniature nello stato di Out (0 è invisibile)
$thumbnailsOpacity = 0.7; //Livello di opacità delle miniature nello stato default
$nextPrevBtnsInitState = "show"; //scegliere se rendere visibili o invisibili i pulsanti Prev-Next ("hide" or "show")
$keyboardNavigation = "on"; //Abilitare o disabilitare lo scorrimento delle fotografie con i controlli di tastiera ("on" or "off")

//cache vars
$thumbnails_wrapper = $("#thumbnails_wrapper");
$outer_container = $("#outer_container");
$thumbScroller = $(".thumbScroller");
$thumbScroller_container = $(".thumbScroller .container");
$thumbScroller_content = $(".thumbScroller .content");
$thumbScroller_thumb = $(".thumbScroller .thumb");
$preloader = $("#preloader");
$toolbar = $("#toolbar");
$toolbar_a = $("#toolbar a");
$bgimg = $("#bgimg");
$img_title = $("#img_title");
$nextImageBtn = $(".nextImageBtn");
$prevImageBtn = $(".prevImageBtn");





$(document).ready(function () {
    var remove = spinner("holder", 20, 20, 20, 4, "#fff");
    $toolbar.data("imageViewMode", $defaultViewMode); //default view mode
            
    ShowHideNextPrev($nextPrevBtnsInitState);
    //thumbnail scroller
    $thumbScroller_container.css("marginLeft", $tsMargin + "px"); //add margin
    sliderLeft = $thumbScroller_container.position().left;
    sliderWidth = $outer_container.width();
    $thumbScroller.css("width", sliderWidth);
    var totalContent = 0;
    fadeSpeed = 200;

    var $the_outer_container = document.getElementById("outer_container");
    var $placement = findPos($the_outer_container);

    $thumbScroller_content.each(function () {
        var $this = $(this);
        totalContent += $this.innerWidth();
        $thumbScroller_container.css("width", totalContent);
        $this.children().children().children(".thumb").fadeTo(fadeSpeed, $thumbnailsOpacity);
    });

    $thumbScroller.mousemove(function (e) {
        if ($thumbScroller_container.width() > sliderWidth) {
            var mouseCoords = (e.pageX - $placement[1]);
            var mousePercentX = mouseCoords / sliderWidth;
            var destX = -((((totalContent + ($tsMargin * 2)) - (sliderWidth)) - sliderWidth) * (mousePercentX));
            var thePosA = mouseCoords - destX;
            var thePosB = destX - mouseCoords;
            if (mouseCoords > destX) {
                $thumbScroller_container.stop().animate({ left: -thePosA }, $scrollEasing, $scrollEasingType); //with easing
            } else if (mouseCoords < destX) {
                $thumbScroller_container.stop().animate({ left: thePosB }, $scrollEasing, $scrollEasingType); //with easing
            } else {
                $thumbScroller_container.stop();
            }
        }
    });

    $thumbnails_wrapper.fadeTo(fadeSpeed, $thumbnailsContainerOpacity);
    $thumbnails_wrapper.hover(
			function () { //mouse over
				var $this = $(this);
				$this.stop().fadeTo("slow", 1);
			},
			function () { //mouse out
				var $this = $(this);
				$this.stop().fadeTo("slow", $thumbnailsContainerMouseOutOpacity);
			}
		);

    $thumbScroller_thumb.hover(
			function () { //mouse over
				var $this = $(this);
				$this.stop().fadeTo(fadeSpeed, 1);
			},
			function () { //mouse out
				var $this = $(this);
				$this.stop().fadeTo(fadeSpeed, $thumbnailsOpacity);
			}
		);

    //on window resize scale image and reset thumbnail scroller
    $(window).resize(function () {
        FullScreenBackground("#bgimg", $bgimg.data("newImageW"), $bgimg.data("newImageH"));
        $thumbScroller_container.stop().animate({ left: sliderLeft }, 400, "easeOutCirc");
        var newWidth = $outer_container.width();
        $thumbScroller.css("width", newWidth);
        sliderWidth = newWidth;
        $placement = findPos($the_outer_container);
    });

    //load 1st image
    var the1stImg = new Image();
    the1stImg.onload = CreateDelegate(the1stImg, theNewImg_onload);
    the1stImg.src = $bgimg.attr("src");
    $outer_container.data("nextImage", $(".content").first().next().find("a").attr("href"));
    $outer_container.data("prevImage", $(".content").last().find("a").attr("href"));
});

function BackgroundLoad($this, imageWidth, imageHeight, imgSrc) {
    $this.fadeOut("fast", function () {
        $this.attr("src", "").attr("src", imgSrc); //change image source
        FullScreenBackground($this, imageWidth, imageHeight); //scale background image
        $preloader.fadeOut("fast", function () { $this.fadeIn("slow"); });
        var imageTitle = $img_title.data("imageTitle");
        if (imageTitle) {
            $this.attr("alt", imageTitle).attr("title", imageTitle);
            $img_title.fadeOut("fast", function () {
                $img_title.html(imageTitle).fadeIn();
            });
        } else {
            $img_title.fadeOut("fast", function () {
                $img_title.html($this.attr("title")).fadeIn();
            });
        }
    });
}

//mouseover toolbar
if ($toolbar.css("display") != "none") {
    $toolbar.fadeTo("fast", 0.4);
}
$toolbar.hover(
		function () { //mouse over
			var $this = $(this);
			$this.stop().fadeTo("fast", 1);
		},
		function () { //mouse out
			var $this = $(this);
			$this.stop().fadeTo("fast", 0.4);
		}
	);

//Clicking on thumbnail changes the background image
$("#outer_container a").click(function (event) {
    event.preventDefault();
    var $this = $(this);
    GetNextPrevimg($this);
    GetImageTitle($this);
    SwitchImage(this);
    ShowHideNextPrev("show");
});

//next/prev img buttons
$nextImageBtn.click(function (event) {
    event.preventDefault();
    SwitchImage($outer_container.data("nextImage"));
    var $this = $("#outer_container a[href='" + $outer_container.data("nextImage") + "']");
    GetNextPrevimg($this);
    GetImageTitle($this);
});

$prevImageBtn.click(function (event) {
    event.preventDefault();
    SwitchImage($outer_container.data("prevImage"));
    var $this = $("#outer_container a[href='" + $outer_container.data("prevImage") + "']");
    GetNextPrevimg($this);
    GetImageTitle($this);
});

//next/prev img keyboard arrows
if ($keyboardNavigation == "on") {
    $(document).keydown(function (ev) {
        if (ev.keyCode == 39) { //right arrow
            SwitchImage($outer_container.data("nextImage"));
            var $this = $("#outer_container a[href='" + $outer_container.data("nextImage") + "']");
            GetNextPrevimg($this);
            GetImageTitle($this);
            return false; // don't execute the default action (scrolling or whatever)
        } else if (ev.keyCode == 37) { //left arrow
            SwitchImage($outer_container.data("prevImage"));
            var $this = $("#outer_container a[href='" + $outer_container.data("prevImage") + "']");
            GetNextPrevimg($this);
            GetImageTitle($this);
            return false; // don't execute the default action (scrolling or whatever)
        }
    });
}

function ShowHideNextPrev(state) {
    if (state == "hide") {
        $nextImageBtn.fadeOut();
        $prevImageBtn.fadeOut();
    } else {
        $nextImageBtn.fadeIn();
        $prevImageBtn.fadeIn();
    }
}

//get image title
function GetImageTitle(elem) {
    var title_attr = elem.children("img").attr("title"); //get image title attribute
    $img_title.data("imageTitle", title_attr); //store image title
}

//get next/prev img
function GetNextPrevimg(curr) {
    var nextImage = curr.parents(".content").next().find("a").attr("href");
    if (nextImage == null) { //if last image, next is first
        var nextImage = $(".content").first().find("a").attr("href");
    }
    $outer_container.data("nextImage", nextImage);
    var prevImage = curr.parents(".content").prev().find("a").attr("href");
    if (prevImage == null) { //if first image, previous is last
        var prevImage = $(".content").last().find("a").attr("href");
    }
    $outer_container.data("prevImage", prevImage);
}

//switch image
function SwitchImage(img) {
    $preloader.fadeIn("fast"); //show preloader
    var theNewImg = new Image();
    theNewImg.onload = CreateDelegate(theNewImg, theNewImg_onload);
    theNewImg.src = img;
}

//get new image dimensions
function CreateDelegate(contextObject, delegateMethod) {
    return function () {
        return delegateMethod.apply(contextObject, arguments);
    }
}

//new image on load
function theNewImg_onload() {
    $bgimg.data("newImageW", this.width).data("newImageH", this.height);
    BackgroundLoad($bgimg, this.width, this.height, this.src);
}

//Image scale function
function FullScreenBackground(theItem, imageWidth, imageHeight) {
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    if ($toolbar.data("imageViewMode") != "original") { //scale
        var picHeight = imageHeight / imageWidth;
        var picWidth = imageWidth / imageHeight;
        if ($toolbar.data("imageViewMode") == "full") { //fullscreen size image mode
            if ((winHeight / winWidth) < picHeight) {
                $(theItem).attr("width", winWidth);
                $(theItem).attr("height", picHeight * winWidth);
            } else {
                $(theItem).attr("height", winHeight);
                $(theItem).attr("width", picWidth * winHeight);
            };
        } else { //normal size image mode
            if ((winHeight / winWidth) > picHeight) {
                $(theItem).attr("width", winWidth);
                $(theItem).attr("height", picHeight * winWidth);
            } else {
                $(theItem).attr("height", winHeight);
                $(theItem).attr("width", picWidth * winHeight);
            };
        }
        $(theItem).css("margin-left", (winWidth - $(theItem).width()) / 2);
        $(theItem).css("margin-top", (winHeight - $(theItem).height()) / 2);
    } else { //no scale
        $(theItem).attr("width", imageWidth);
        $(theItem).attr("height", imageHeight);
        $(theItem).css("margin-left", (winWidth - imageWidth) / 2);
        $(theItem).css("margin-top", (winHeight - imageHeight) / 2);
    }
}

//Image view mode function - fullscreen or normal size
function ImageViewMode(theMode) {
    $toolbar.data("imageViewMode", theMode);
    FullScreenBackground($bgimg, $bgimg.data("newImageW"), $bgimg.data("newImageH"));
            
}

//function to find element Position
function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft
        curtop = obj.offsetTop
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        }
    }
    return [curtop, curleft];
}
