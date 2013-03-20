var express = require('express'),
  _ = require('underscore'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

var persons = {};
io.sockets.on('connection', function(socket) {
  socket.emit('welcome');

  socket.emit('person list', persons);
  socket.on('set person', function(data) {
    socket.set('name', data.name, function() {
      persons[data.name] = data;
      socket.emit('person ready', data);
      socket.broadcast.emit('new person ready', data);
    });
  });

  socket.on('move', function(data) {
    socket.get('name', function(err, name) {
      if (data.name === name) {
        persons[name].left = data.left;
        persons[name].top = data.top;
        socket.emit('move ready', data);
        socket.broadcast.emit('other move ready', data);
      };
    });
  });

  socket.on('disconnect', function() {
    socket.get('name', function(err, name) {
      delete persons[name];
      socket.broadcast.emit('person quit', name);
    });
  });
});
