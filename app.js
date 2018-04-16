var server = require("http").createServer(handler),
  fs = require("fs"),
  sys = require("util"),
  twitter = require("twitter");

const socketIO = require("socket.io");
var io = socketIO(server);
var request = require("request");
const { spawn } = require("child_process");
var child = spawn("minimodem", ["-t", "60"]);
var kill = require('tree-kill');
var twit = new twitter(require('./config.js'));

var loudness = require('loudness');

var volume = 50;

    var myInt = setInterval(function () {
      if(volume === 50){
        volume = 0;
      }else{
        volume = 50;
      }
            console.log(volume);

            loudness.setVolume(volume, function (err) {
                // Done
            });
    }, 2000);



var randomTitle;


io.on("connection", socket => {
  let theNews =
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=dd476a63cfa14c7f9c64ea594175b59e";
  request(theNews, function(error, response, body) {
    var bodyObj = JSON.parse(body);

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    var finalArray = bodyObj.articles.map(function(ele){
      return ele.source.name.replace(".com", "");
    });

    var randomNumberFromNews = getRandomInt(finalArray.length);
    var randomTitle =finalArray[randomNumberFromNews];

    console.log("this thing", randomTitle);


    console.log("this is the picked string", randomTitle);


  });
});


function handler(req, res) {
  fs.readFile(__dirname + "/index.html", function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }
    res.writeHead(200);
    res.end(data);
  });
}


server.listen(1337);
