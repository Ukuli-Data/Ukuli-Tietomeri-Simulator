global.WebSocket = require('ws');
var Config = require('config-js');
var config = new Config('./config.js');
const client_id = config.get('mqtt.clientId');
const hostname = config.get('mqtt.hostname');
const port = config.get('mqtt.port');
const userName = config.get('mqtt.userName');
const password = config.get('mqtt.password');

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://' + hostname + ":" + Number(port));
 
client.on('connect', function () {
    console.log("onConnect");
    client.subscribe("tietomeri/" + client_id + "/radioactivity/");
    client.subscribe("tietomeri/" + client_id + "/reactorstatus/");
    client.subscribe("tietomeri/" + client_id + "/reactoroperator/");
    client.subscribe("tietomeri/" + client_id + "/rbmk/");
    client.publish('tietomeri/' + client_id + "/rbmk/", 'Reactor operational');
    messageLoop();
});
 
client.on('message', function (topic, message) {
  console.log(topic);
  console.log(message);
});
 
var radioactivity = 3.6;
var spamLoop = 0;

function messageLoop() {
    setInterval(function(){ 
        spamMessage();
    }, 1000);
}
 
function spamMessage() {
    radioactivity = (Math.random() * 1000);
    console.log(radioactivity);
    if(radioactivity % 2 == 0) {
       radioactivity = 3.6;
    }
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
	client.publish('tietomeri/' + client_id + "/reactoroperator/", reactoroperator);
        if(reactoroperator == "Dyatlov") {
            client.publish('tietomeri/' + client_id + "/rbmk/", 'There is no graphite!');
            client.publish('tietomeri/' + client_id + "/radioactivity/", 3.6);
        }
    break;
    // Radioactivity level
    default:
	if(typeof radioactivity == "number") {
		radioactivity = radioactivity.toString();
	}
        client.publish("tietomeri/" + client_id + "/radioactivity/", radioactivity);
    }
}
