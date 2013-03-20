$(function() {
  var $container = $('#container');

  var distance = 100;

  var socket = io.connect('http://10.10.22.84');

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
      $('#name span').text(person.name);
    });
    socket.on('new person ready', function(person) {
      createPerson(person);
    });
    socket.on('person quit', function(name) {
      $('#' + name).remove();
    });

    function getPosition(direction) {
      var oldLeft = parseFloat($person.css('left')),
        oldTop = parseFloat($person.css('top'));
      switch (direction) {
      case 'left':
        var newLeft = oldLeft - distance;
        if (newLeft < 0) newLeft = 0;
        return {
          left: newLeft,
          top: oldTop
        }
      case 'right':
        var newLeft = oldLeft + distance;
        if (newLeft > maxLeft) newLeft = maxLeft;
        return {
          left: newLeft,
          top: oldTop
        }
      case 'up':
        var newTop = oldTop - distance;
        if (newTop < 0) newTop = 0;
        return {
          left: oldLeft,
          top: newTop
        }
      case 'down':
        var newTop = oldTop + distance;
        if (newTop > maxTop) newTop = maxTop;
        return {
          left: oldLeft,
          top: newTop
        }
      }
    }

    function triggerMove(direction) {
      var p = getPosition(direction);

      socket.emit('move', {
        name: $person[0].id,
        left: p.left,
        top: p.top
      });
    }

    function move(data) {
      var p = $('#' + data.name);
      p.css({
        left: data.left,
        top: data.top
      });
    }


    $('#control button').click(function() {
      var direction = $(this)[0].id;
      triggerMove(direction);
    })
    socket.on('move ready', function(data) {
      move(data);
    });
    socket.on('other move ready', function(data) {
      move(data);
    });

    $(document).keydown(function(e) {
      var directions = {
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down'
      }
      var direction = directions[e.which];
      triggerMove(direction);
      return false;
    })

  });

});
