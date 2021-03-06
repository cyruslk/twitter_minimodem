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
var configNews = require("./config_news.js")

var loudness = require('loudness');


console.log(configNews);

var volume = 0;



    var myInt = setInterval(function () {
        if(volume === 20){
          volume = 0;
        }else{
          volume = 20;
        }
            console.log(volume);
            loudness.setVolume(volume, function (err) {
                // Done
            });
    }, 2000);



var randomTitle;


io.on("connection", socket => {
  let theNews = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${configNews.news_key}`;

  request(theNews, function(error, response, body) {
    let bodyObj = JSON.parse(body);

     getRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max));
    }

    let finalArray = bodyObj.articles.map(function(ele){
      return ele.source.name.replace(".com", "");
    });

    let randomNumberFromNews = getRandomInt(finalArray.length);
    let randomTitle =finalArray[randomNumberFromNews];


    twit.stream("statuses/filter", { track: randomTitle }, function(stream) {
      stream.on("data", function(data) {
        socket.emit("tweet", data.text);
        child.stdin.write(data.text);
      });
    });
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


server.listen(1336);
