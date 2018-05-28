const request = require('request');
var mqtt = require('mqtt');

/***********************************************************************/
var client = mqtt.connect('mqtt://eclipse.usc.edu')


/**********************************************************************/
Registered_Topics=["PackageABC","PackageDEF","PackageGHI"]

/**********************************************************************/
uri = "http://192.168.1.148:46657/broadcast_tx_commit?tx=0x"



/*********************************************************************/
/************this function converts json to suitable hex buffer******/
/********************************************************************/
function convert_to_buffer(message){
	var buf=Buffer.from(JSON.stringify(message))
	return buf.toString('hex')
}


client.on('connect', function () {
	console.log("Connected to the Broker -> Waiting for Message");
	for(i=0;i<Registered_Topics.length;i++) {
		console.log(Registered_Topics[i])
		client.subscribe(Registered_Topics[i])
	}

})

client.on('message', function (topic, message) {
	console.log("Message Received From Topic " + topic)
	console.log(message.toString())
	hex_buffer=convert_to_buffer(message.toString())
	console.log(hex_buffer);
	push_transaction_to_the_network(uri+hex_buffer);
})





/**************************************************/
/*this function converts the base64 to ascii**
 * Tendermint returns transction in base64 format***/
/**************************************************/

function convert_base64_to_ascii(data){
	var buff = new Buffer(data, 'base64');  
	var text = buff.toString('ascii');
	console.log('"' + data + '" converted from Base64 to ASCII is "' + text + '"'); 
	return text
}

/****************************************************/
/*this function returns the block using the received height 
 * info, as we use the height to fetch the replicated state 
 * information from the blockchain to prevent the users 
 * from tampering the local data********************/
/***************************************************/
function get_block_and_data(block_height){
block_uri = "http://192.168.1.148:46657/block?height="+block_height
request(block_uri, { json: true }, (err, res, body) => {
  	if (err) { return console.log(err); }
	//console.log(body);
	console.log(body.result.block.data.txs[0]);

  	if ("txs" in body.result.block.data){
		console.log("Transaction found in the block")
		data_base64=body.result.block.data.txs[0];
  		console.log(convert_base64_to_ascii(data_base64));
		return	
  	}

	});
}




/********************************************************/
/*this function validates the response of the transaction***
 * Request function pushes the published data to the 
 * consensus engine to replicate state across the entire 
 * network. The response function will consist of the 
 * outcome of the consensus process***********************/
/********************************************************/
/***********Typical Response*****************************
{
  	jsonrpc: '2.0',
	id: '',
	result: 
	{ check_tx: { log: 'Good', fee: {} },
	deliver_tx: { log: 'tx succeeded', fee: {} },
	hash: '76B5D8387626A74A0E4437BB6E1F0DD6D93EE6F6',
        height: 42 } }
	{ check_tx: { log: 'Good', fee: {} },
	deliver_tx: { log: 'tx succeeded', fee: {} },
	hash: '76B5D8387626A74A0E4437BB6E1F0DD6D93EE6F6',
	height: 42 
}

********************************************************/
function validate_transaction(response){
	console.log(response)
	if(response.check_tx.log == "Good" && response.deliver_tx.log ==  "tx succeeded"){
		console.log("Contract intact -> State Replicated")
		return response.height	
	}
}

function push_transaction_to_the_network(uri){
request(uri, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  if ("result" in body){
  	console.log(body.result);
  	height = validate_transaction(body.result)
	console.log("Height is ",height);	
	get_block_and_data(height);
	return	
  }
  if ("error" in body){
	console.log(body.error.data)	  
	return
  }
});
}


