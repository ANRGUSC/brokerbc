#!/usr/bin/env node
const mqtt = require('mqtt')
var clients = require('./client_5nodes.json')

const args = require('minimist')(process.argv.slice(2))

const help = `
-h | --help    help
-t    topic
-r    rate (publishes/second)
-n    total number of publishes
-w    time to wait after last message to exit (seconds)
`

// Settings
const From = 'localhost'

const Topic = args.t
if (!Topic) {
  console.error('missing topic')
  process.exit(1)
}

const Rate = parseFloat(args.r) || 1/60
const Num = parseInt(args.n) || 10
const Wait = parseFloat(args.w) || 5

const clients_count = clients.client.length // No of clients

var dict = {}

/* JS implementation of Java HashCode:
 *  * Link: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/ */
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

//console.log(Topic, Rate, Num)

// MQTT connections
const recvClient = mqtt.connect(`mqtt://${From}`)

// Connection setup
recvClient.on('connect', () => {
  recvClient.subscribe(Topic + '_verified')
})

recvClient.on('message', function (topic, message) {
  var millisec = Date.now()
  var msg_modified = JSON.parse(message)
  var Msg_hash = (JSON.stringify(msg_modified)).hashCode()
  Msg_hash = Msg_hash.toString()

  if (!(Msg_hash in dict)) {
    dict[Msg_hash] = 1
    console.log(`${millisec} ${topic} '${message.toString()}'`)
  } else {
    dict[Msg_hash] += 1
  }
})

recvClient.on('error', error => {
  console.error('error:', error)
  process.exit(2)
})

let iterations = 0

setInterval(function () {
  var millisec = Date.now()
  const data = JSON.stringify({
	  "Warehouse": "Warehouse123,456 Street,Country 00001",
	  "Temperature": 15,
	  "Timestamp": millisec //ms
  })
  console.log(`${millisec} ${Topic}_sent ${data}`)

  for (var i=0;i<clients_count;i++) {
    var client = mqtt.connect(clients.client[i])
    client.publish(Topic, data)				
  }

  ++iterations

  if (iterations === Num) {
    // Wait a minute before exiting
    setTimeout(shutdown, 1000 * Wait)
  }

},1000*Rate);

function shutdown() {
  recvClient.end()
}
