package upo.MQTT;

import org.eclipse.paho.client.mqttv3.*;

public class MQTTPublisher {

    private MqttClient client;

    public MQTTPublisher() {
        String broker_url = "tcp://localhost:1883";
        String clientId = MqttClient.generateClientId();

        try {
            client = new MqttClient(broker_url, clientId);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
    public void start() {

            MqttConnectOptions options = new MqttConnectOptions();
            //options.setCleanSession(false);
            try{
            client.connect(options);
            } catch (MqttException e) {
                e.printStackTrace();
        }
    }

    public void publishTemperature(String temp_val, String topic) throws MqttException {

        MqttTopic tempTopic = client.getTopic(topic);

        tempTopic.publish(new MqttMessage(temp_val.getBytes()));
    }

    public void publishUmidita(String umid_val, String topic) throws MqttException {

        MqttTopic tempTopic = client.getTopic(topic);

        tempTopic.publish(new MqttMessage(umid_val.getBytes()));
    }

}