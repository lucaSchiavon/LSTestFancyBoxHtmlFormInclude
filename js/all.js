
//hover immagini thumb enjoy

$(function() {
	
	$(".bottom_content").hover(function() { 
		
		var thumbOver = $(this).find("img").attr("src"); 
		
		$(this).find("a.thumb").css({'background' : 'url(' + thumbOver + ') no-repeat center bottom'});

		$(this).find(".crop").stop().fadeTo('slow', 0 , function() {
			$(this).hide() 
		}); 
	} , function() { 
	
		$(this).find(".crop").stop().fadeTo('slow', 1).show();
	});
	
	
	
	//hover immagini footer
	$('.bottom_home .sx a img').hover(function(){
		$(this).stop().animate({"opacity": 0.9});				  
		}, function(){

		$(this).stop().animate({"opacity": 1});
		}
	);



});

///////////////////////////////////////////////////////
// funzione per la creazione di un input hidden
///////////////////////////////////////////////////////
function createHidden(namesValues) 
{
    if (document.createElement) {
        var arr = namesValues.split(",");
        for (i = 0; i < arr.length; i++) {
            var tokens = arr[i].split("=");
            var oldObj = document.getElementById(tokens[0]);
            if (oldObj) {
                oldObj.value = "";
                oldObj.value = tokens[1];
            } else {
                var newField = document.createElement("input");
                newField.type = "hidden";
                newField.name = tokens[0];
                newField.id = tokens[0];
                newField.value = tokens[1];
                document.forms[0].appendChild(newField);
            }
        }
    } else {
        alert("Il browser in uso non supporta operazioni fondamentali per l\'uso di questo sito.")
    }
}