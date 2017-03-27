dataworld={};
dataworld.currentlines=0;
//******************************************************************************
function start(){
  dataworld.timer1 = window.setInterval(fetchData, document.getElementById("fetchtime").value *1000);
  dataworld.timer2 = window.setInterval(displayData, document.getElementById("updatetime").value *1000);
  dataworld.serverurl = document.getElementById("server").value;
  dataworld.clientid = document.getElementById("clientid").value;
  dataworld.lastfetchtime=0;
  dataworld.databaseexist=false;
  dataworld.numericfields=["day","month","year","hour","minute","second","timestamp","deletetime"];
  dataworld.currentpage=1;
  dataworld.databasecolumns=[];
  $('#running').toggle();
  $('#start').toggle();
  $('#stop').toggle();
  var date = new Date();
  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var hour = date.getHours();
  $('#starttime').val(hour+":"+minutes+ ":"+seconds );
}
//******************************************************************************
function stop(){
  clearInterval(dataworld.timer1);
  clearInterval(dataworld.timer2);
  $('#running').toggle();
  $('#start').toggle();
  $('#stop').toggle();
}
//******************************************************************************
function gotoPage(page){
  dataworld.currentpage=page;
  displayData();
  for(var n = 1; n <=6 ; n++){
    $("#goto"+n).removeClass("active");
  }
  $("#goto"+page).addClass("active");
}
//******************************************************************************
function statusmessage(mes){
  var t = $("#statusmessage").html();
  $("#statusmessage").html( mes +"\n" + t);
}
//******************************************************************************
function fetchData(){
  var dparam = {};
  dparam.clientid= dataworld.clientid;
  dparam.lastfetchtime = dataworld.lastfetchtime;
  dparam.clienttime = new Date().getTime();
    
  //console.log(dparam);
  $.ajax({
    type: "GET",
    crossDomain: true,
    url: dataworld.serverurl + "?l="+ b64EncodeUnicode(JSON.stringify(dparam)),
    dataType: "text",
    success: function(data) {
    //console.log("Data = ****************");
    console.log(data.length);
    if(data.length > 0){
        statusmessage("Recieved Chars " + data.length);
        processData(data);
    }

    },
    error: function(xhr, ajaxOptions, thrownError) {
        //console.log("Status: " + xhr.status + "     Error: " + thrownError);
    }
  });
  dataworld.lastfetchtime = new Date().getTime();
}
//******************************************************************************
function checkDatabaseColumns(dataoject){
    for(ind in dataoject){
         //console.log(dataworld.databasecolumns[ind]);
        if( dataworld.databasecolumns.indexOf(ind) < 0 ){
            var statement= "ALTER TABLE rawdata ADD COLUMN "+ind+" String";
            var statement2= "update rawdata set "+ind+" = '';";
            //console.log(statement);
            alasql(statement);
            alasql(statement2);
            dataworld.databasecolumns.push(ind);
        }
    }
}
//******************************************************************************
function processData(data){
  //console.log(data)
  datalines=[]
  datalines = data.split("|||");
  if(datalines.length==0){return}
  dataworld.currentlines+=datalines.length;
  $("#reqreceived").val( dataworld.currentlines);
  //statusmessage("Recieved lines: " +datalines.length);
  for(lc in datalines){
    if(datalines[lc].length==0){break;}
    //console.log(datalines[lc]);
    var parseddata = JSON.parse(datalines[lc]);

    var datum = new Date(parseddata.trackingtime);
    parseddata.year = datum.getFullYear();
    parseddata.month= datum.getMonth();
    parseddata.day = datum.getUTCDate();
    parseddata.hour= datum.getHours();
    parseddata.minute= datum.getMinutes();
    parseddata.second = datum.getSeconds();
    parseddata.datum = twoDigits(parseddata.hour) + ":" + twoDigits(parseddata.minute) + ":" + twoDigits(parseddata.second );
    //console.log(parseddata);

    if(dataworld.databaseexist== false){
      createDatabase(parseddata);
      dataworld.databaseexist= true;
    }
    if(parseddata.timestamp > dataworld.lastfetchtime){
      dataworld.lastfetchtime = parseddata.timestamp;
    }
    var inssql = "insert into rawdata ("  ;
    var colstring="";
    checkDatabaseColumns(parseddata);
    for(ind in parseddata){ 
      var k = colstring.length=="" ? "" : ",";
      colstring+= k+" " + ind;
    }
    inssql += colstring + ") values (";
    colstring="";
    for(ind in parseddata){
      var k = colstring.length=="" ? "" : ",";
      if(dataworld.numericfields.includes(ind)){
        colstring+= k +" " + parseddata[ind]+"";
      }else{
        colstring+= k+ "'" + parseddata[ind]+"'" ;
      }
    }
    inssql+=colstring + ")";
    //console.log(inssql);
    alasql.exec(inssql);
  }
}
//******************************************************************************
function twoDigits(value) {
   if(value < 10) {
    return '0' + value;
   }
   return value;
}
//******************************************************************************
function displayData(){
  //console.log("display");
  var analyseLayout=[
    { "title" : "Last 5 Content from last minute",
      "page"  : 1,
      "into" :"1",
      "sql" : "Select top 5 content, datum from rawdata where trackingtime > "+ (new Date().getTime()-60000)  + " order by 2 desc",
      "display" : "simpletable",
      "heading" : ['Inhalt','Zeit'],
      "dclass"  : ".col-md-4"
    },
    { "title" : "Top 5 Content ",
      "page"  : 1,
      "into"  : "2",
      "sql" : "Select top 5 content, count(*)  from rawdata group by content order by 2 desc",
      "display" : "simpletable",
      "heading" : ['Kampange','Anzahl'],
      "dclass"  : ".col-md-4"
    },
    { "title" : "Anzahl User",
      "page"  : 1,
      "into"  : "3",
      "sql" : "select count(*) from (Select distinct user from rawdata )",
      "display" : "simpletable",
      "heading" : ['Benutzer'],
      "dclass"  : ".col-md-4"
    }
  ];

  for(var n = 1;n <= 6; n++ ) {
      $("#loc"+ n ).html("<h3><a href='#'></a></h3>");
  }
  for(index in analyseLayout){
    var ana = analyseLayout[index];
    if(ana.page==dataworld.currentpage){
      var localresult="<h3><a href='#'>" +ana.title+ "</a></h3>";
      var datas =[];
      try {
          console.log(ana.sql);
        datas = alasql.exec(ana.sql);
        localresult+= converters[ana.display](datas,ana.heading);
        $("#loc"+ ana.into ).html(localresult);
      } catch(e){
        console.log(e);
      }
    }
  }
}
//*****************************************************************************
var converters=[];
converters["simpletable"]=function(data,head){
    var ret = "<table class='table  '> <thead><tr>";
    for(var ix in head){ret+="<th scope='row'>"+head[ix] + "</th>"}
    ret+=" </tr></thead>"
    for(var index in data){
        ret += "<tr>";
        for(var na in data[index]){
            ret += "<td>" + data[index][na] + "</td>"
        }
        ret += "</tr>";
    }
    return ret+"</table>";
}
converters["simplechart"]=function(data,head){
    var ret = '<canvas id="myChart" width="400" height="400"></canvas>';

    for(var ix in head){ret+="<th scope='row'>"+head[ix] + "</th>"}
    ret+=" </tr></thead>"
    for(var index in data){
        ret += "<tr>";
        for(var na in data[index]){
            ret += "<td>" + data[index][na] + "</td>"
        }
        ret += "</tr>";
    }
    return ret+"</table>";
}
//******************************************************************************
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
//******************************************************************************
function createDatabase(db){
//INDEXEDDB, LOCALSTORAGE
    alasql.exec("DROP TABLE IF EXISTS rawdata");
    var first = true;
    var createsql="CREATE TABLE rawdata (  ";
    for(var ind in db){
        if(dataworld.numericfields.includes(ind)){
          if(first == true){
            createsql+= " " + ind +" INT ";
            first = false;
          }else{
            createsql+= ", " + ind +" INT ";
          }
        } else {
          if(first == true){
            createsql+= " " + ind +" STRING ";
            first = false;
          } else{
            createsql+= ", " + ind +" STRING ";
          }
        }
        dataworld.databasecolumns.push(ind);
        //console.log("Pushing " + ind);
    }
    createsql+= ")";
    //console.log(createsql);
    alasql.exec(createsql);

    //console.log("table created");
}
//******************************************************************************