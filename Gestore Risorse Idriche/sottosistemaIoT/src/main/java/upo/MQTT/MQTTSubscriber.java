package upo.MQTT;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import upo.IoT.AttivoSubscribe;
import upo.IoT.ModalitaSubscribe;
import upo.IoT.Piano;
import upo.json.JSONObject;
import org.eclipse.paho.client.mqttv3.*;

import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;


public class MQTTSubscriber {

    private final List<Piano> piani;
    private final List<ModalitaSubscribe> modalitaList;
    private final List<AttivoSubscribe> statoList;

    // init the client
    private MqttClient mqttClient;

    /**
     * Constructor. It generates a client id and instantiate the MQTT client.
     */

    final String topic = "+/+/attuatori/+";

    public MQTTSubscriber() {

        piani = new ArrayList<Piano>();
        modalitaList = new ArrayList<ModalitaSubscribe>();
        statoList = new ArrayList<AttivoSubscribe>();
        // the broker URL
        String brokerURL = "tcp://127.0.0.1:1883";
        String clientId = MqttClient.generateClientId();

        try {
            mqttClient = new MqttClient(brokerURL, clientId);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public List<Piano> getPiani() {
        return piani;
    }

    public List<ModalitaSubscribe> getModalitaList() {
        return modalitaList;
    }

    public List<AttivoSubscribe> getStatoList() {
        return statoList;
    }

    /**
     * The method to start the subscriber. It listen to all the homestation-related topics.
     */
    public void start() {
        try {
            String password = "prova";
            char[] pwd = password.toCharArray();
            MqttConnectOptions options = new MqttConnectOptions();
            options.setUserName("nomeProva");
            options.setPassword(pwd);
            // set a callback and connect to the broker
            mqttClient.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {

                }

                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {

                    String strmsg = new String(message.getPayload(), StandardCharsets.UTF_8);
                    System.out.println("Message arrived for the topic '" + topic + "': " + strmsg);

                    JSONObject obj = new JSONObject(strmsg);


                    if(obj.has("modalita")) {

                        ObjectMapper mapper = new ObjectMapper();

                        ModalitaSubscribe modActual = mapper.readValue(strmsg,  new TypeReference<>() {
                        });
                        modalitaList.add(modActual);

                        System.out.println("\n\nCAMBIO MODALITÀ");
                        System.out.println("attuatore = " + obj.getInt("idAttuatore") + ", modalita' = " + obj.getString("modalita"));
                    }
                    else if(obj.has("attivo")) {

                        ObjectMapper mapper = new ObjectMapper();

                        AttivoSubscribe statoActual = mapper.readValue(strmsg,  new TypeReference<>() {
                        });
                        statoList.add(statoActual);

                        System.out.println("\n\nCAMBIO STATO");
                        System.out.println("attuatore = " + obj.getInt("idAttuatore") + ", attivo = " + obj.getInt("attivo"));

                    }
                    else if(obj.has("condizione")) {

                        DateFormat formatter = new SimpleDateFormat("hh:mm");
                        Date ora_inizio = formatter.parse(obj.getString("ora_inizio"));
                        Date ora_fine = formatter.parse(obj.getString("ora_fine"));
                        obj.put("ora_inizio", ora_inizio);
                        obj.put("ora_fine", ora_fine);

                        ObjectMapper mapper = new ObjectMapper();

                        Piano pianiactual = mapper.readValue(strmsg,  new TypeReference<>() {
                        });
                        piani.add(pianiactual);
                        System.out.println("LUNGHEZZA= "+ piani.size());

                        System.out.println("\n\n NUOVO PIANO");
                        System.out.println("attuatore = " + obj.getInt("idAttuatore"));
                        System.out.println("giorno = " + obj.getString("giorno"));
                        System.out.println("condizione = " + obj.getString("condizione"));
                        System.out.println("ora di inizio = " + obj.getDate("ora_inizio"));
                        System.out.println("ora di fine = " + obj.getDate("ora_fine"));

                        //Agiungere il piano alla lista dei piani
                    }

                    // additional action for the Last Will and Testament message
                    if ("#".equals(topic)) {
                        System.err.println("Publisher is gone!");
                    }

                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {

                }
            });


            mqttClient.connect(options);
            mqttClient.subscribe(topic);

            System.out.println("The subscriber is now listening to " + topic + "...");

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}