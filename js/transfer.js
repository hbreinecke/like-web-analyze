var lightspeed = (function (win, doc) {
//*****************************************************************************
// start internal functions
if(getCookie("lightuser")==""){
	setCookie("lightuser", generateUUID(),1000 )
}
var lightuser = window.lightuser ? window.lightuser : getCookie("lightuser");
var clientid = window.lightclientid ? window.lightclientid : "0" ;
var contentObject ={};
//*****************************************************************************
function addimage() {
  lightuser = window.lightuser ? window.lightuser : getCookie("lightuser");
  var img = document.createElement("img");
  img.id="pic4711";
  //img.src = getPicServer() +"/" + clientid + "/" + lightuser + "/" + getImageName() +".jpg" + getImageParam();
  //img.src = getPicServer() +"/" + clientid + "/" + lightuser + "/0.png" + getImageParam();
  img.src = getPicServer() + "/0.png" + getImageParam();
  img.height = 0;
  img.width = 0;
  img.style.top=0;
  img.style.right=0;
  img.onload = loadHandler;
  document.body.appendChild(img);
}
//*****************************************************************************
function getPicServer(){
    return  "http://light-no.de/img";
}
//*****************************************************************************
function getImageParam(){
	if(!isEmpty(contentObject )){
        contentObject.clientid = window.lightclientid ? window.lightclientid : "0" ;;
        contentObject.user = lightuser;
        contentObject.trackingtime = new Date().getTime();
		var va = JSON.stringify(contentObject);
		//console.log(contentObject);
		va = b64EncodeUnicode(va);
		contentObject={};
		return "?l=" + va + "&t=" + rand(1,50000);
  }	else{
		return "";
  }
}
//*****************************************************************************
 function rand (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
//*****************************************************************************
//*****************************************************************************
function isEmpty(obj) {
   for (var x in obj) { return false; }
   return true;
}
//*****************************************************************************
function loadHandler(){
	//console.log("image loaded");
}
//*****************************************************************************
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
//*****************************************************************************
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
//b64EncodeUnicode('? Ã  la mode'); // "4pyTIMOgIGxhIG1vZGU="
//b64EncodeUnicode('\n'); // "Cg=="
//*****************************************************************************
function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
//*****************************************************************************
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//*****************************************************************************
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//*****************************************************************************
//http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
// end internal function
//*****************************************************************************
//*****************************************************************************
// return the public methods
return {
        generateUUID :function(){ return generateUUID();},
        track  : function ( param) {
			contentObject = param;
			addimage();
         }
    };
//*****************************************************************************
//*****************************************************************************
})(window, document);