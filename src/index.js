const mqtt = require("mqtt")
const Realm = require("realm");

if(!process.env.MQTT_USER || !process.env.MQTT_PASSWORD || !process.env.MQTT_PORT || !process.env.MQTT_HOST) {
	var err = new Error("ENV missing");
	throw err;
}

const DHT22ValueSchema = {
	name: "DHT22Value",
	properties: {
	  	sensor:  "string",
		temperature: "double",
		humidity: "double",
		timestamp: "double"
	}
};

let realm = new Realm({path:"./dht22Data/dht22.realm", schema: [DHT22ValueSchema]});

var options = {
	username:process.env.MQTT_USER,
	password:process.env.MQTT_PASSWORD,
	port:process.env.MQTT_PORT
}
var client  = mqtt.connect("mqtt://" + process.env.MQTT_HOST, options)
client.on("connect", function () {
  	client.subscribe("/" + process.env.MQTT_USER + "/dht22")
})
 
client.on("message", function (topic, message) {
	var messageString = message.toString();
	var tmpObject = JSON.parse(messageString);
	realm.write(() => {
		let dht22Value = realm.create('DHT22Value', {
			sensor: tmpObject.sensor,
			temperature: tmpObject.temperature,
			humidity: tmpObject.humidity,
			timestamp: tmpObject.timestamp
		});
	});
})