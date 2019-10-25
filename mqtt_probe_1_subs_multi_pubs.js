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
const recvClient = mqtt.connect(`mqtt:${From}`)

// Connection setup
recvClient.on('connect', () => {
  recvClient.subscribe(Topic + '_verified')
})

recvClient.on('message', function (topic, message) {
  var millisec = Date.now()
  var msg_modified = JSON.parse(message)
  //msg_modified["broker_id"] = " "
  delete msg_modified["broker_id"]
  var msg_mod_str = JSON.stringify(msg_modified)
  var Msg_hash = (msg_mod_str).hashCode()
  Msg_hash = Msg_hash.toString()

  if (!(Msg_hash in dict)) {
    dict[Msg_hash] = 1
  } else {
    dict[Msg_hash] += 1
  }

  if (dict[Msg_hash] >= Math.ceil(2*clients_count/3)) {
    console.log(`${millisec} ${topic} '${msg_mod_str}'`)
    //console.log(`${millisec} ${topic} '${message.toString()}'`)
  }
})

recvClient.on('error', error => {
  console.error('error:', error)
  process.exit(2)
})

let iterations = 0

var timr = setInterval(function () {
  var millisec = Date.now()
  var dat = {
	  "Warehouse": "Warehouse123,456 Street,Country 00001",
	  "Temperature": 15,
	  "Timestamp": millisec //ms
  }
  var data = JSON.stringify(dat)
  console.log(`${millisec} ${Topic}_sent '${data}'`)

  for (var i=0;i<clients_count;i++) {
    var client = mqtt.connect(clients.client[i])
    dat["broker_id"] = "client" + i
    client.publish(Topic, JSON.stringify(dat))
  }

  ++iterations
  //console.log("Iterations"+iterations)

  if (iterations == Num) {
    // Wait a minute before exiting
    // setTimeout(shutdown, 1000 * Wait)
    shutdown()
  }

},1000*Rate);

function shutdown() {
  clearInterval(timr)
  //recvClient.end()
}
