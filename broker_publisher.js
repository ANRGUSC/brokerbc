var mqtt = require('mqtt')
var clients = require('./client_5nodes.json')

/**********************************************************************/
Registered_Topics=["PackageABC","PackageDEF","PackageGHI"]

/**********************************************************************/
Registered_Warehouses=["Warehouse123,456 Street,Country 00001","Warehouse789,101 Street,Country 00002","Warehouse112,131 Street,Country 00003"]


setInterval(function () {

	random_temperature=15+Math.floor(Math.random() * Math.floor(15))+Math.random()
	random_warehouse=Math.floor(Math.random() * Math.floor(3))
	payload={"Warehouse":Registered_Warehouses[random_warehouse],"Temperature":random_temperature,"Timestamp":milliseconds}
	random_topic=Math.floor(Math.random() * Math.floor(3))

	var Unverified_topics = []
	for (var obj in Registered_Topics) {
		Unverified_topics.push(Registered_Topics[obj]+"_unverified")
	}
	console.log("Topic to publish: " + Unverified_topics[random_topic])

	console.log("No of clients: "+clients.client.length)

	for (var i=0;i<clients.client.length;i++) {
		var client = mqtt.connect(clients.client[i])

		var milliseconds = (new Date).getTime()
		console.log("Published to broker "+clients.client[i]+" at: "+milliseconds)

		client.publish(Unverified_topics[random_topic],JSON.stringify(payload))
	}
},20000);
