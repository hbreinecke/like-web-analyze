$( document ).ready(function() {
    window.lightclientid=1000;
    init();
    //console.log( "ready!" );
});

var task={
    'counter' : 100
};
var looptime=1000;
var tasktype="";

var labels = [
  {"category" : "Startseite", "content" : "Start", "campaign" : "Google1"},
  {"category" : "Startseite/Auto & Motorrad/KFZ-Ersatzteile/Scheibenreinigung/Scheibenwischer", "content" : "Überblick" },
  {"category" : "Startseite/Auto & Motorrad/KFZ-Ersatzteile", "content" : "Kategorie Überblick" },
  {"category" : "Startseite/Elektronik & Computer/Unterhaltungselektronik/Foto & Video","content" : "Kategorie Überblick" },
  {"category" : "Startseite/Elektronik & Computer/Unterhaltungselektronik/TV, Audio & Video/Fernseher & ZubehörFernseher", "content" : "Telefunken Full HD LED TV 102cm"},
  {"category" : "Startseite/Elektronik & Computer/Unterhaltungselektronik/TV, Audio & Video/Fernseher & ZubehörFernseher", "content" : "Telefunken LED TV 80cm"},
  {"category" : "Startseite/Elektronik & Computer/Unterhaltungselektronik/TV, Audio & Video/Fernseher & Zubehör/Fernseher", "content" : "JTC Ultra HD LED TV 101,6cm (40 Zoll)" },
  {"category" : "Startseite/Elektronik & Computer/Unterhaltungselektronik/TV, Audio & Video/Fernseher & Zubehör/Fernseher", "content" : "Samsung UE40J6250 101 cm (40 Zoll) Full HD LCD-Fernseher, LED-Backlight, 600 Hz" },
  {"category" : "Startseite/Elektronik & Computer/Computer/Drucken & Scannen/Druckerzubehör/Druckerpatronen", "content" : "vhbw 10x Druckerpatronen Tintenpatronen Set mit Chip für Canon Pixma" },
  {"category" : "Startseite/Elektronik & Computer/Computer/Drucken & Scannen/Druckerzubehör/Druckerpatronen", "content" : "10 Patronen MIT CHIP für Canon Pixma iP4850" },
  {"category" : "Startseite/Elektronik & Computer/Computer/Drucken & Scannen/Druckerzubehör/Druckerpatronen", "content" : "N.T.T.® kompatible Tintenpatronen für Canon Pixma MG-5750 " },
  {"category" : "Startseite/Elektronik & Computer/Computer/Drucken & Scannen/Druckerzubehör/Druckerpatronen", "content" : "HP 301 Original Tintenpatrone - Schwarz, Dreifarbig - Tintenstrahl - 3er Pack" },
  {"category" : "Startseite/Körperpflege & Gesundheit/Parfüms/Eau de Parfum", "content" :"Kategorie Überblick" }
];
var users=[];
function init(){
    console.log("task= " + task)
}
//*****************************************************************************
function loop(){
    var intlooptime = looptime;
    if(intlooptime== 0){
       intlooptime = rand(5,20)*1000;
    }
    //console.log("loop " + task.counter);
    //console.log("pause " + intlooptime);
    if(task.counter>0){
        task.counter--;
    }
    document.getElementById("state").value="Request Counter : " + task.counter;
    if(task.counter > 0){
        setTimeout(loop, intlooptime);
    }else {
        endJourney();
    }
    // ssr = single shopper random
    if(tasktype=="ssr"){
        label = labels[rand(0,labels.length -1)];
        lightspeed.track(label);
    }
    // sso = single shopper order
    if(tasktype=="sso"){
        counter++;
        if(counter > labels.length){
            counter = 0;
        }
        label = labels[counter];
        lightspeed.track(label);
    }
    if(tasktype=="multiuser10"){
        if(users.length != 10){
            users=[];
            for(var x= 1; x < 11;x++){
                users.push(lightspeed.generateUUID());
               // console.log(users);
            }
        }
        window.lightuser = users[rand(0,9)];

        label = labels[rand(0,labels.length -1)];
        lightspeed.track(label);
    }
    if(tasktype=="multiuser100"){
        if(users.length != 100){
            users=[];
            for(var x= 1; x < 11;x++){
                users.push(lightspeed.generateUUID());
            }
        }
        window.lightuser = users[rand(0,9)];
        label = labels[rand(0,labels.length -1)];
        lightspeed.track(label);
    }
}
//*****************************************************************************
function startJourney(){
    setCookie("lightuser", generateUUID(),1000 ); // generate new user
    tasktype= document.getElementById("tasktype").value;
    looptime= 1000 * document.getElementById("timevalue").value;
    console.log("looptime " + looptime);
    console.log("tasktype " +tasktype);
    task.counter = document.getElementById("repeatcounter").value;;
    setTimeout(loop, 1000);
    $('#startdemo').hide();
    $('#stopdemo').show();
}
//*****************************************************************************
function endJourney(){
    task.counter = 0;
    $('#startdemo').show();
    $('#stopdemo').hide();
}
//*****************************************************************************
function getRootPath(){
    return  window.location.protocol + "//"  +window.location.host + window.location.pathname;
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
 function rand (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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
//*****************************************************************************