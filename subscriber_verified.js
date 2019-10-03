var mqtt = require('mqtt')

var client = mqtt.connect('mqtt://localhost')
var client_2 = mqtt.connect('mqtt://192.168.1.134:1883')
var client_3 = mqtt.connect('mqtt://192.168.1.136:1883')
var client_4 = mqtt.connect('mqtt://192.168.1.137:1883')
var client_5 = mqtt.connect('mqtt://192.168.1.138:1883')
var clients_count = 5

/**********************************************************************/
Registered_Topics=["PackageABC","PackageDEF","PackageGHI","ripa"]

var Verified_topics = []
for(i=0;i<Registered_Topics.length;i++) {
	Verified_topics.push(Registered_Topics[i]+"_verified")
}

var count = {}

for(j=0;j<Verified_topics.length;j++) {
	count[Verified_topics[j]] = 0
}


client.on('connect', function () {
	console.log("Connected to the Broker mqtt://localhost -> Waiting for Message");
	for(i=0;i<Verified_topics.length;i++) {
		console.log(Verified_topics[i])
		client.subscribe(Verified_topics[i])
	}
})

client_2.on('connect', function () {
	console.log("Connected to the Broker mqtt://192.168.1.134:1883 -> Waiting for Message");
	for(i=0;i<Verified_topics.length;i++) {
		console.log(Verified_topics[i])
		client.subscribe(Verified_topics[i])
	}
})


client_3.on('connect', function () {
	console.log("Connected to the Broker mqtt://192.168.1.136:1883 -> Waiting for Message");
	for(i=0;i<Verified_topics.length;i++) {
		console.log(Verified_topics[i])
		client.subscribe(Verified_topics[i])
	}
})


client_4.on('connect', function () {
	console.log("Connected to the Broker mqtt://192.168.1.137:1883 -> Waiting for Message");
	for(i=0;i<Verified_topics.length;i++) {
		console.log(Verified_topics[i])
		client.subscribe(Verified_topics[i])
	}
})


client_5.on('connect', function () {
	console.log("Connected to the Broker mqtt://192.168.1.138:1883 -> Waiting for Message");
	for(i=0;i<Verified_topics.length;i++) {
		console.log(Verified_topics[i])
		client.subscribe(Verified_topics[i])
	}
})


client.on('message', function (topic, message) {
	var millisec = (new Date).getTime();
	console.log("Message Received for Topic " + topic + " from mqtt://localhost "+" at: "+ millisec)
	console.log(message.toString())
	count[topic] += 1
	if (count[topic] > Math.ceil(2/3*clients_count)) {
		console.log("Message Received for Topic " + topic + " from "+count[topic]+" brokers!!!!!!");
	}
})

client_2.on('message', function (topic, message) {
	var millisec = (new Date).getTime();
	console.log("Message Received for Topic " + topic + " from mqtt://192.168.1.134:1883 "+" at: "+ millisec)
	console.log(message.toString())
	count[topic] += 1
	if (count[topic] > Math.ceil(2/3*clients_count)) {
		console.log("Message Received for Topic " + topic + " from "+count[topic]+" brokers!!!!!!");
	}
})

client_3.on('message', function (topic, message) {
	var millisec = (new Date).getTime();
	console.log("Message Received for Topic " + topic + " from mqtt://192.168.1.136:1883 "+" at: "+ millisec)
	console.log(message.toString())
	count[topic] += 1
	if (count[topic] > Math.ceil(2/3*clients_count)) {
		console.log("Message Received for Topic " + topic + " from "+count[topic]+" brokers!!!!!!");
	}
})

client_4.on('message', function (topic, message) {
	var millisec = (new Date).getTime();
	console.log("Message Received for Topic " + topic + " from mqtt://192.168.1.137:1883 "+" at: "+ millisec)
	console.log(message.toString())
	count[topic] += 1
	if (count[topic] > Math.ceil(2/3*clients_count)) {
		console.log("Message Received for Topic " + topic + " from "+count[topic]+" brokers!!!!!!");
	}
})

client_5.on('message', function (topic, message) {
	var millisec = (new Date).getTime();
	console.log("Message Received for Topic " + topic + " from mqtt://192.168.1.138:1883 "+" at: "+ millisec)
	console.log(message.toString())
	count[topic] += 1
	if (count[topic] > Math.ceil(2/3*clients_count)) {
		console.log("Message Received for Topic " + topic + " from "+count[topic]+" brokers!!!!!!");
	}
})

