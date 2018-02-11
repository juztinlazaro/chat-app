var socket = io();

function scrollToBottom() {
  var messages = $('#messages');
  var clientHeight = messages.prop('clientHeight');
  var newMessage = messages.children('li:last-child');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = messages.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  var params = $.deparam(window.location.search);

  socket.emit('join', params, err => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', () => {
  console.log('disconnected to server');
});

$('#message-form').on('submit', e => {
  var params = $.deparam(window.location.search);
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: params.name,
      text: $('[name="message"]').val(),
    },
    () => {},
  );
});

socket.on('newMessage', message => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(data) {
  let formattedTime = moment(data.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: data.from,
    link: data.url,
    createdAt: formattedTime,
  });

  $('#messages').append(html);
  scrollToBottom();
});

let locationButton = $('#send-location');

locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location....');

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr('disabled').text('Sending location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function() {
      locationButton.removeAttr('disabled').text('Sending location');
      alert('Unable to fetch location.');
    },
  );
});
