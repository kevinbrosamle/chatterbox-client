// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/messages',
  user: {
    name: window.location.href.split('=')[1],
    friends: []
  }, 
  roomNames: ['General Chat'],
  currentRoom: 'General Chat',
  existingMessages: {}
};

app._cleanInput = input => {
  let output = input.split('');
  let charArray = ['<', '>'];
  for (let i = 0; i < output.length; i++) {
    if (charArray.indexOf(output[i]) !== -1) {
      output = output.splice(i++ - 1, 0, '\\');
    }
  }
  return output.join(''); 
};  

app.init = function() {
  setInterval(this.fetch.bind(this), 1000);
  setInterval(function() {
    $('.timeFromNow').each(function() {
      $(this).text(`[${moment($(this).attr('data-created-at')).fromNow()}]`);
    });
  }, 30000);
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message)
  });
};

app.fetch = function() {
  var displayMessage = messages => {
    messages.results.reverse();
    _.each(messages.results, data => {
      if (!this.existingMessages[data.objectId]) {
        this.existingMessages[data.objectId] = true;
        this.addMessage(data);
      }
    });
  };
  $.ajax({
    url: this.server,
    type: 'GET',
    success: displayMessage
  });
};

app.clearMessages = function() {
  this.existingMessages = {};
  $('#chats').empty();
};

app.addMessage = function(message) {
  let roomname = message.roomname;
  let roomClassName = '';
  if (roomname === null || roomname === undefined || roomname.replace(' ', '') === '') {
    roomname = 'General Chat';
    roomClassName = 'General-Chat';
  } else {
    roomname = this._cleanInput(roomname);
    roomClassName = roomname.replace(' ', '-');
  } 
  let username = message.username ? this._cleanInput(message.username) : '';
  let className = username.replace(' ', '-');
  let text = message.text ? this._cleanInput(message.text) : '';
  this.addRoom(roomname);
  if (username) {
    $('#chats').prepend(`
      <div class="${className} chat ${roomClassName}">
        <blockquote>
          <span class="username">
            <span class="timeFromNow" data-created-at="${message.createdAt}">
              [${moment(message.createdAt).fromNow()}]
            </span>
            ${username}
          </span>:<p>
          ${text}
          </p>
          [${moment(message.createdAt).format('M/D/YY h:mmA')}]
        </blockquote>
      </div>
    `);
    if (this.user.friends.indexOf(className) !== -1) {
      $('#chats > div').first().addClass('friend');
    }
    if (this.currentRoom !== roomname) {
      $('#chats > div').first().hide();
    }
  } 
};

app.addFriend = function(target) {
  target = target.replace(' ', '-');
  var index = this.user.friends.indexOf(target);
  if (index === -1) {
    this.user.friends.push(target);
    $(`.${target}`).addClass('friend');
  } else {
    this.user.friends.splice(index, 1);
    $(`.${target}`).removeClass('friend');
  }
};

app.handleSubmit = function(text) {
  app.send({
    username: app.user.name,
    text: text,
    roomname: app.currentRoom
  });
  $('#message').val('');
};

app.addRoom = function(roomName) {
  if (this.roomNames.indexOf(roomName) === -1) {
    $('#roomSelect').append(`<option>${roomName}</option>`);
    this.roomNames.push(roomName);
  } 
};

app.selectRoom = function() {
  $('#chats > div').show();
  app.currentRoom = document.getElementById('roomSelect').value;
  $('#chats > div').not(`.${app.currentRoom.replace(' ', '-')}`).hide();
};

app.handleRoomSubmit = function(roomName) {
  this.currentRoom = roomName;
  this.addRoom(roomName);
  $('#roomSelect').val(roomName);
  $('#roomInput').val('');  
  this.selectRoom();
};

//initilization
$(document).ready(() => {
  app.init();
  $('body').on('click', '.username', function() {
    app.addFriend($(this).text());  
  });
  //message senders
  $('body').on('click', '#send', function() {
    app.handleSubmit($('#message').val());
  });
  $('body').on('keyup', '#message', function(e) {
    e.which === 13 && app.handleSubmit($('#message').val());
  });
  //new room senders
  $('body').on('click', '#roomSubmit', function() {
    console.log($('#roomSelect').val())
    app.handleRoomSubmit($('#roomInput').val());
  });
  $('body').on('keyup', '#roomInput', function(e) {
    e.which === 13 && app.handleRoomSubmit($('#roomInput').val());
  });

});