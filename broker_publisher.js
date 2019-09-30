var mqtt = require('mqtt')
var clients = require('./client_5nodes.json')

/**********************************************************************/
Registered_Topics=["PackageABC","PackageDEF","PackageGHI"]

/**********************************************************************/
Registered_Warehouses=["Warehouse123,456 Street,Country 00001","Warehouse789,101 Street,Country 00002","Warehouse112,131 Street,Country 00003"]


setInterval(function () {
	console.log(clients.client.length);
	var client = mqtt.connect(clients.client[0]);
	
	var milliseconds = (new Date).getTime();
	console.log(milliseconds);
	random_temperature=15+Math.floor(Math.random() * Math.floor(15))+Math.random()
	random_warehouse=Math.floor(Math.random() * Math.floor(3))
	payload={"Warehouse":Registered_Warehouses[random_warehouse],"Temperature":random_temperature,"Timestamp":milliseconds}
	random_topic=Math.floor(Math.random() * Math.floor(3))
	console.log(random_topic);

	var Unverified_topics = [];
	for (var obj in Registered_Topics) {
		Unverified_topics.push(Registered_Topics[obj]+"_unverified");
	}
	console.log(Unverified_topics);

	console.log("topic is " + Unverified_topics[random_topic]);
	client.publish(Unverified_topics[random_topic],JSON.stringify(payload));
},20000);
