var request = require('request');
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://localhost:46658//broadcast_tx_commit',
  body:    "tx=0x00"
}, function(error, response, body){
  console.log(body);
});
