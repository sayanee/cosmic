function addListItem(data, date, status) {
  var entry = document.createElement('li');
  entry.innerHTML = setMessage(data, date, status)

  list.insertBefore(entry, list.firstChild);
  setTimeout(function() {
    entry.className = entry.className + ' show';
  }, 10);
}

function setMessage(data, date, status) {
  var normData = Math.round((data + 1) / 4096 * 100)
  var message = 'My soil moisture is <strong>' + normData + '%</strong>'
  var dateMessage = '<span>' + moment(date).format('MMM D, h:mm a') + '</span>'

  if (!data) {
    return 'Oops! Looks like I am not connected to the Internet. You want to check?' + dateMessage
  }

  if (data < config.trigger) {
    return 'Please water me! My soil moisture is below <em>2500</em> at <strong>' + data + '</strong>' + dateMessage
  }

  if (status === 'changed') {
    return 'Yay! I have been watered. ' + message + dateMessage
  }

  return message + dateMessage
}

var channel = 'basil'
var list = document.getElementById('list')
var socket = io.connect()
var dataStore = []
var config = {}

socket.on('init', function(data) {
  dataStore = data[ channel ]
  config = data.config

  return dataStore.forEach(function(eachData, index) {
    if (index > 0 && (eachData.data - dataStore[ index - 1 ].data > config.change)) {
      addListItem(parseInt(eachData.data), eachData.date, 'changed')
    } else {
      addListItem(parseInt(eachData.data), eachData.date)
    }
  })
})

socket.on(channel, function(data) {
  addListItem(data, new Date())
});
