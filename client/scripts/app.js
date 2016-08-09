// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/messages',
  user: {
    name: window.location.href.split('=')[1],
    friends: []
  } 
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
    _.each(messages.results, data => {
      this.addMessage(data);
    });
  };
  $.ajax({
    url: this.server,
    type: 'GET',
    success: displayMessage
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  let username = message.username ? this._cleanInput(message.username) : '';
  let className = username.replace(' ', '-');
  let text = message.text ? this._cleanInput(message.text) : '';
  username && $('#chats').append(`<div class="${className} chat"><span class="username">${username}</span>: ${text}</div>`);
  this.user.friends.indexOf(className) !== -1 && $('#chats > div').last().addClass('friend');
};//needs spans to keep track of chat and username and entire line for formatting

app.addRoom = function(roomName) {
  $('#roomSelect').append(`<span>${roomName}</span>`);
};

app.addFriend = function(target) {
  target = target.replace(' ', '-');
  this.user.friends.push(target);
  $(`.${target}`).addClass('friend');
};

app.handleSubmit = function() {

};


//initilization
$(document).ready(() => {
  app.init();
  $('body').on('click', '.username', function() {
    app.addFriend($(this).text());  
  });
});

