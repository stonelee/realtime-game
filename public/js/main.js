$(function() {
  var $container = $('#container');

  var distance = 100;

  var socket = io.connect('http://localhost');

  var $person;
  var maxLeft = $container.width() - 50,
    maxTop = $container.height() - 50;

  function createPerson(person) {
    var p = $('<div class="person" id="' + person.name + '">' + person.name + '</div>').appendTo($container);
    p.css({
      left: person.left,
      top: person.top,
    }).show();
    return p;
  }

  socket.on('welcome', function() {
    socket.on('person list', function(persons) {
      for (var p in persons) {
        createPerson(persons[p]);
      }
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
      var oldLeft = parseFloat($person.css('left'));
      var newLeft = oldLeft - distance;
      if (newLeft < 0) newLeft = 0;
      var newTop = parseFloat($person.css('top'));

      socket.emit('move', {
        name: $person[0].id,
        left: newLeft,
        top: newTop
      });
    })
    $('#right').click(function() {
      var oldLeft = parseFloat($person.css('left'));
      var newLeft = oldLeft + distance;
      if (newLeft > maxLeft) newLeft = maxLeft;
      var newTop = parseFloat($person.css('top'));

      socket.emit('move', {
        name: $person[0].id,
        left: newLeft,
        top: newTop
      });
    })
    socket.on('move ready', function(data) {
      move(data);
    });
    socket.on('other move ready', function(data) {
      move(data);
    });

    function move(data) {
      var p = $('#' + data.name);
      p.css({
        left: data.left,
        top: data.top
      });
    }

  });

});
