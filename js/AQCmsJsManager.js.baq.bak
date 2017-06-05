function AQCmsJsManager(){
    this.oForm = document.forms[0];
    this.idTxtEmail;
    this.idImgLoading;
}

AQCmsJsManager.prototype.getResult = function (arg, context) {
    context.preLoad(false);
    alert(arg);
};
AQCmsJsManager.prototype.getError = function(arg,context){
    alert(arg);
};
AQCmsJsManager.prototype.preLoad = function (show) {
    var obj = document.getElementById(this.idImgLoading);
    if (obj != null) obj.style.display = (show == true) ? 'block' : 'none';
};
 AQCmsJsManager.prototype.callSrv = function () {
     var txt = document.getElementById(this.idTxtEmail);
     if (txt.value.search(/^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.\w+$/) == -1) {
         alert('Invalid email');
         return;
     }
     this.preLoad(true);
     callServer('reg$' + txt.value + '');
 };

  