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


loudness.setVolume(0, function (err) {
    // Done
});



server.listen(1337);

var randomTitle;


io.on("connection", socket => {

  let theNews =
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=dd476a63cfa14c7f9c64ea594175b59e";
  request(theNews, function(error, response, body) {
    var bodyObj = JSON.parse(body);
    // console.log(bodyObj);

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    var randomNumberFromNews = getRandomInt(bodyObj.articles.length);

    var randomTitle = bodyObj.articles[randomNumberFromNews].source.name;
    // console.log("is?", bodyObj.articles.length);
    bodyObj.articles.map(ele => console.log(ele.source.name));
    console.log("this is the picked string", randomTitle);

    twit.stream("statuses/filter", { track: "Usnews" }, function(stream) {
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
