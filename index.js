const config = require('config');
const clientId = config.get('clientId');
const hostname = config.get('hostname');
const port = config.get('port');
const userName = config.get('userName');
const password = config.get('password');

client = new Paho.MQTT.Client(location.hostname, Number(location.port), clientId);
 
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
 
client.connect({onSuccess:onConnect, userName:userName, password:password});
 
var radioactivity = 3.6;

function onConnect() {
    console.log("onConnect");
    client.subscribe("ukuli/" + client_id + "/radioactivity/");
    while(true) {
        radioactivity = Math.random() * 1000);
        message = new Paho.MQTT.Message(radioactivity);
        message.destinationName = "ukuli/" + client_id + "/radioactivity/";
        client.send(message);
    }
}

 
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
        }
}
 
function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
    }
}