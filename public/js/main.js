$(function() {
  var $container = $('#container');

  var distance = 100;

  var socket = io.connect('http://localhost');

  var $person;
  var maxLeft = $container.width() - 50,
    maxTop = $container.height() - 50;

  function createPerson(person) {
    var p= $('<div class="person" id="' + person.name + '">' + person.name + '</div>').appendTo($container);
    p.css({
      left: person.left,
      top: person.top,
    }).show();
    return p;
  }
  function moveLeft(data){
    var p = $('#'+data.name);
    var oldLeft = parseFloat(p.css('left'));
    var newLeft = oldLeft - data.distance;
    if (newLeft > 0) {
      p.css('left', newLeft);
    } else {
      p.css('left', 0);
    }
  }
  function moveRight(data){
    var p = $('#'+data.name);
    var oldLeft = parseFloat(p.css('left'));
    var newLeft = oldLeft + data.distance;
    if (newLeft < maxLeft) {
      p.css('left', newLeft);
    } else {
      p.css('left', maxLeft);
    }
  }

  socket.on('welcome', function() {
    socket.on('person list', function(personList) {
      $.each(personList, function() {
        createPerson(this);
      });
    });

    socket.emit('set person', {
      name: Math.round(Math.random() * 1000).toString(),
      left: Math.random() * maxLeft,
      top: Math.random() * maxTop
    });
    socket.on('person ready', function(person) {
      $person = createPerson(person);
    });
    socket.on('new person ready', function(person) {
      createPerson(person);
    });
    socket.on('person quit', function(name) {
      $('#' + name).remove();
    });

    $('#left').click(function() {
      socket.emit('person left',{
        name:$person[0].id,
        distance:distance
      });
    })
    socket.on('person left ready', function(data) {
      moveLeft(data);
    });
    socket.on('other person left ready', function(data) {
      moveLeft(data);
    });

    $('#right').click(function() {
      socket.emit('person right',{
        name:$person[0].id,
        distance:distance
      });
    })
    socket.on('person right ready', function(data) {
      moveRight(data);
    });
    socket.on('other person right ready', function(data) {
      moveRight(data);
    });

  });

});
