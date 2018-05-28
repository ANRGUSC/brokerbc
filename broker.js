let createABCIServer = require('abci')

// turn on debug logging
require('debug').enable('abci*')

let state = {
  count: 0
}

var contract={"DesiredTemperatureHigh":30,"DesiredContractLow":20};



let handlers = {
  info (request) {
    return {
      data: 'Node.js counter app',
      version: '0.0.0',
      lastBlockHeight: 0,
      lastBlockAppHash: Buffer.alloc(0)
    }
  },

  checkTx (request) {
    	//prining to verify the contents of request	  
    	console.log("Request at CheckTx is");
    	//console.log(request);	  
    	//console.log("Request is:"+request.tx);	  
    
 	//Parsing the request
	currentstate=JSON.parse(request.tx)

	console.log("Current state is" + currentstate);  
	console.log("Current temp is" + currentstate.temp);  

	//checking the state against the contract
	if (currentstate.temp > contract.DesiredTemperatureHigh || 
		currentstate.temp < contract.DesiredContractLow){
    	return { code: 1, log: 'Bad' }
        } 		
	
        return { code: 0, log: 'Good' }
  },

  deliverTx (request) {
    //let tx = padTx(request.tx)
    console.log("Request at deliverTx is:"+request.tx);	  
    //let number = tx.readUInt32BE(0)
    //console.log("Request in number is: "+number)	  
    /*if (number !== state.count) {
      return { code: 1, log: 'tx does not match count' }
    }*/

    // update state
    //state.count += 1

    return { code: 0, log: 'tx succeeded' }
  }
}

// make sure the transaction data is 4 bytes long
/*function padTx (tx) {
  let buf = Buffer.alloc(4)
  tx.copy(buf, 4 - tx.length)
  return buf
}*/

let port = 46658
createABCIServer(handlers).listen(port, () => {
  console.log(`listening on port ${port}`)
})
