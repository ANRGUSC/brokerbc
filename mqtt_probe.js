#!/usr/bin/env node
const mqtt = require('mqtt')

const args = require('minimist')(process.argv.slice(2))

const help = `
-h | --help    help
--to    broker to publish to
--from    broker to subscribe to
-t    topic
-r    rate (publishes/second)
-n    total number of publishes
-w    time to wait after last message to exit (seconds)
`

// Settings
const To = args.to || 'localhost'
const From = args.from || 'localhost'

const Topic = args.t
if (!Topic) {
  console.error('missing topic')
  process.exit(1)
}

const Rate = parseFloat(args.r) || 1/60
const Num = parseInt(args.n) || 10
const Wait = parseFloat(args.w) || 5



//console.log(To, From, Topic, Rate, Num)

// MQTT connections
const recvClient = mqtt.connect(`mqtt://${From}`)

let sendClient
if (args.to === args.from) {
  // No reason to reconnect to same address
  sendClient = recvClient
}
else {
  sendClient = mqtt.connect(`mqtt://${To}`)
}

// Connection setup
recvClient.on('connect', () => {
  recvClient.subscribe(Topic)
  recvClient.subscribe(Topic + '_verified')
})

recvClient.on('message', (topic, message) => {
  console.log(`${Date.now()} ${topic} '${message.toString()}'`)
})

recvClient.on('error', error => {
  console.error('error:', error)
  process.exit(2)
})

sendClient.on('connect', () => {
  sendMessages(sendClient)
})

sendClient.on('error', error => {
  console.error('error:', error)
  process.exit(3)
})

let iterations = 0

function publish(client) {
	const data = JSON.stringify({
  		Warehouse: 'Warehouse123,456 Street,Country 00001',
  		Temperature: 15,
  		Timestamp: Date.now() //ms
	})
  console.log(`${Date.now()} ${Topic}_sent ${data}`)
  client.publish(Topic, data)

  ++iterations

  if (iterations === Num) {
    // Wait a minute before exiting
    setTimeout(shutdown, 1000 * Wait)
  }
  else {
    // More messages!
    setTimeout(publish, 1000 * Rate, client)
  }
}

function sendMessages(client) {
  publish(client)
}

function shutdown() {
  sendClient.end()
  recvClient.end()
}
