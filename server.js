
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
  socket.on('newUser', createUser);
  socket.on('openTab', openTab);
  socket.on('disconnect', disConnect);
  socket.on('sendInfo', sendBack);
  socket.on('disconnecting', () => {
    const rooms = Object.keys(socket.rooms);
    //console.log(rooms);
    for(var x = 0; x < rooms.length; x++){
      if(rooms[x] == socket.id){
        console.log("same room");
      }
      else{
        socket.broadcast.to(rooms[x]).emit('windowClosed', socket.id);
      }
    }
  });

  function sendBack(data){
    io.sockets.to(data.iden).emit('addUser', {email: data.email, iden: socket.id});
  }

  function openTab(data){
    //console.log("recieved tab");
    io.sockets.to(data.user).emit('tab', data.tab);
  }

  function createUser(data){
    console.log("User: " + data.email + " join room: " + data.room);
    socket.join(data.room);
    var newData = {email: data.email, iden: socket.id};
    socket.broadcast.to(data.room).emit("userJoined", newData);
  }

  function disConnect(){
    console.log('Disconnected Connection: ' + ID);
  }

}
