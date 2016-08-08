// YOUR CODE HERE:


setInterval(() => {
  var displayMessage = messages => {
    _.each(messages.results, data => {
      console.log(data.objectId);
      let username = data.username ? cleanInput(data.username) : '';
      let text = data.text ? cleanInput(data.text) : '';
      username && $('#chats').append(`${username}: ${text}`).append('<br>');  
    });
    

  };
  $.get('https://api.parse.com/1/classes/messages', displayMessage);

}, 1000);


var cleanInput = input => {
  let output = input.split('');
  let charArray = ['<', '>'];
  for (let i = 0; i < output.length; i++) {
    if (_.indexOf(charArray, output[i]) !== -1) {
      output = output.splice(i++ - 1, 0, '\\');
    }
  }
  return output.join(''); 
};