$(function() {
  var $container = $('#container');

  var distance = 100;
  $('#left').click(function() {
    var oldLeft = parseFloat($person.css('left'));
    var newLeft = oldLeft - distance;
    if (newLeft > 0) {
      $person.css('left', newLeft);
    } else {
      $person.css('left', 0);
    }
  })
  $('#right').click(function() {
    var oldLeft = parseFloat($person.css('left'));
    var newLeft = oldLeft + distance;
    if (newLeft < maxLeft) {
      $person.css('left', newLeft);
    } else {
      $person.css('left', maxLeft);
    }
  })

  var socket = io.connect('http://localhost');

  var maxLeft = $container.width() - 50,
    maxTop = $container.height() - 50;

  function createPerson(person) {
    var $person = $('<div class="person" id="' + person.name + '">' + person.name + '</div>').appendTo($container);
    $person.css({
      left: person.left,
      top: person.top,
    }).show();
  }

  socket.on('welcome', function() {
    socket.on('person list', function(personList) {
      $.each(personList, function() {
        createPerson(this);
      });
    });

    socket.emit('set person', {
      name: Math.round(Math.random() * 1000),
      left: Math.random() * maxLeft,
      top: Math.random() * maxTop
    });
    socket.on('person ready', function(person) {
      createPerson(person);
    });
    socket.on('new person ready', function(person) {
      createPerson(person);
    });
    socket.on('person quit', function(name) {
      $('#' + name).remove();
    });

  });

});
