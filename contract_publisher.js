var mqtt = require('mqtt')



/***********************************************************************/
var client = mqtt.connect('mqtt://192.168.1.148:1883')

/**********************************************************************/
Registered_Topics=["PackageABC","PackageDEF","PackageGHI"]

/**********************************************************************/
Registered_Warehouses=["Warehouse123,456 Street,Country 00001","Warehouse789,101 Street,Country 00002","Warehouse112,131 Street,Country 00003"]


setInterval(function () {
	var milliseconds = (new Date).getTime();
	console.log(milliseconds);
	payload={'topics':Registered_Topics,'stakeholders':Registered_Warehouses,
		'policies':{0:{"Field":"Temperature","Operator": ">","Value":30,"Response":"Temperature is outside the recommended range"},
			1:{"Field":"Temperature","Operator": "<","Value":20,"Response":"Temperature is outside the recommended range"},
			2:{"Field":"Warehouse","Operator": "not in","Value": "list of stakeholders","Response": "Unauthorized Warehouse"}}}
	   			  
	client.publish('contract',JSON.stringify(payload));
},10000);
