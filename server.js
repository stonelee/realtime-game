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

var personList = [];
io.sockets.on('connection', function(socket) {
  socket.emit('welcome');

  socket.emit('person list', personList);
  socket.on('set person', function(person) {
    socket.set('name', person.name, function() {
      personList.push(person);
      socket.emit('person ready', person);
      socket.broadcast.emit('new person ready', person);
    });
  });

  socket.on('disconnect', function() {
    socket.get('name', function(err, name) {
      personList = _.reject(personList, function(person) {
        return person.name == name;
      });
      socket.broadcast.emit('person quit', name);
    });
  });
});
