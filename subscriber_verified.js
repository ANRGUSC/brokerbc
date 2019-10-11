var mqtt = require('mqtt')

var client = mqtt.connect('mqtt://localhost')
var clients_count = 5

/**********************************************************************/
Registered_Topics=["PackageABC","PackageDEF","PackageGHI","ripa"]

var Verified_topics = []
for(i=0;i<Registered_Topics.length;i++) {
	Verified_topics.push(Registered_Topics[i]+"_verified")
}

var dict = {}

/* JS implementation of Java HashCode:
 * Link: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/ */
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

client.on('connect', function () {
	console.log("Connected to the Broker mqtt://localhost -> Waiting for Message");
	for(i=0;i<Verified_topics.length;i++) {
		console.log(Verified_topics[i])
		client.subscribe(Verified_topics[i])
	}
})

client.on('message', function (topic, message) {
	var millisec = (new Date).getTime();
	console.log("Message Received for Topic " + topic + " from mqtt://localhost "+" at: "+ millisec)
	console.log(JSON.parse(message))
	var msg_modified = JSON.parse(message)
	msg_modified["broker_id"] = " "
	console.log(JSON.stringify(msg_modified))
	var Msg_hash = (JSON.stringify(msg_modified)).hashCode()
	console.log(Msg_hash)
	Msg_hash = Msg_hash.toString()

	if (!(Msg_hash in dict)) {
		dict[Msg_hash] = 1
	} else {
		dict[Msg_hash] += 1
	}

	console.log(dict)

	if (dict[Msg_hash] >= Math.ceil(2*clients_count/3)) {
		console.log("Message: "+ message +" received for Topic: " + topic + " from "+dict[Msg_hash]+" brokers!!!!!!");
	}
})
