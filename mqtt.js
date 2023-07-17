const mqtt = require ('mqtt')
let count =0;
options={
    clientId: "mqttx_7d99a61f"
};

let client  = mqtt.connect("mqtt://127.0.0.1",options);

client.on("connect",function(){
    console.log("connected  "+ client.connected);

})

//handle incoming messages
client.on('message',function(topic, message, packet){
    console.log("message is "+ message);
    console.log("topic is "+ topic);
});


//handle errors
client.on("error",function(error){
    console.log("Can't connect" + error);
    process.exit(1)});

//publish
function publish(topic,msg,options){
    console.log("publishing",msg);

    if (client.connected === true){

        client.publish(topic,msg,options);

    }
    count+=1;
    if (count === 2) //ens script
        clearTimeout(timer_id); //stop timer
    client.end();
}

//////////////

let options={
    retain:true,
    qos:1};
let topic="testtopic";
let message="test prova";
let topic_list=["topic2","topic3","topic4"];
let topic_o={"topic22":0,"topic33":1,"topic44":1};
console.log("subscribing to topics");
client.subscribe(topic,{qos:1}); //single topic
client.subscribe(topic_list,{qos:1}); //topic list
client.subscribe(topic_o); //object
let timer_id=setInterval(function(){publish(topic,message,options);},5000);
