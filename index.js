global.WebSocket = require('ws');
var Config = require('config-js');
var config = new Config('./config/config.js');
const clientId = config.get('mqtt.clientId');
const hostname = config.get('mqtt.hostname');
const port = config.get('mqtt.port');
const userName = config.get('mqtt.userName');
const password = config.get('mqtt.password');

const Paho = require('paho-mqtt');
const client = new Paho.Client(hostname, Number(port), clientId);
 
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
 
client.connect({onSuccess:onConnect, userName:userName, password:password});
 
var radioactivity = 3.6;

function onConnect() {
    console.log("onConnect");
    client.subscribe("ukuli/" + client_id + "/radioactivity/");
    client.subscribe("ukuli/" + client_id + "/reactorstatus/");
    client.subscribe("ukuli/" + client_id + "/reactoroperator/");
    while(true) {
        setTimeout(spamMessage(), 5000);
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

function spamMessage() {
    var randomNumber = Math.round((Math.random() * 10));
    switch(randomNumber) {
    // Reactor status
    case 0:
        var reactorstatus = Math.round((Math.random() * 2));
        switch(reactorstatus) {
            case 0:
                reactorstatus = "Xenon poisoning";
            break;
            case 1:
                reactorstatus = "Stable";
            break;
            default:
                reactorstatus = "Meltdown";
        }        
    break;
    // Reactoroperator
    case 1:
        var reactoroperator = Math.round((Math.random() * 2));
        switch(reactoroperator) {
            case 0:
                reactoroperator = "Akimov";
            break;
            case 1:
                reactoroperator = "Toptunov";
            break;
            default:
                reactoroperator = "Dyatlov";
        }
        message = new Paho.MQTT.Message(reactoroperator);
        message.destinationName = "ukuli/" + client_id + "/reactoroperator/";
        client.send(message);
    break;
    // Radioactivity level
    default:
        radioactivity = (Math.random() * 1000);
        message = new Paho.MQTT.Message(radioactivity);
        message.destinationName = "ukuli/" + client_id + "/radioactivity/";
        client.send(message);
    }
}