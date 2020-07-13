
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
  socket.on('removing', closedWindow);
  
  function sendUser(data){
    socket.username = data;
    console.log("User: " + socket.username);
    socket.broadcast.emit("newUser", data);
  }

  function openTab(data){
    console.log("recieved tab");
    socket.broadcast.emit("tab", data);
  }
  
  function closedWindow(data){
     console.log("LEFT: " + data);
     socket.broadcast.emit("closedWindow", data);
  }


  function disConnect(socket){
    console.log('Disconnected Connection: ' + socket.username);
  }
}
