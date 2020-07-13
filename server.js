
var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("sever is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);


app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
});

function newConnection(socket){
  console.log('new Connection: ' + socket.id);
  var ID = socket.id;
  socket.on('openTab', openTab);
  socket.on('userId', sendUser);
  socket.on('disconnect', disConnect);
  
  socket.username = "";
  
  function sendUser(data){
    console.log(socket.userName);
    socket.username = data;
    console.log("User: " + socket.username);
    socket.broadcast.emit("newUser", data);
  }

  function openTab(data){
    console.log("recieved tab");
    socket.broadcast.emit("tab", data);
  }
  


  function disConnect(socket){
    console.log("LEFT: " + socket.username);
     socket.broadcast.emit("closedWindow", socket.username);
    console.log('Disconnected Connection: ' + socket.username);
  }
}
