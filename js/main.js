$(function() {
  var $person = $('#person'),
    $container = $('#container');

  var maxLeft = $container.width() - $person.width(),
    maxTop = $container.height() - $person.height();

  $person.css({
    left: Math.random() * maxLeft,
    top: Math.random() * maxTop,
  }).show();

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
});
