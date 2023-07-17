package upo.IoT;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.jetbrains.annotations.NotNull;
import upo.MQTT.MQTTPublisher;
import upo.MQTT.MQTTSubscriber;
import upo.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class SottosistemaIoT {
    public static final String CONFIGAZIENDE = "http://localhost:3000/idAziendaConfig";

    public static final int CONSUMO_ORARIO_ETTARO = 5; // 5 litri ogni ora per ettaro
    public static final int AUMENTO_ORARIO_UMIDITA = 5; //ogni ora di irrigazione l'umidità aumenta del 5%

    public static int getAcquaAzienda(int idAzienda) throws IOException, InterruptedException {

        int acquaAzienda = 0;
        String Config = "http://localhost:3000/getAcquaAzienda/" + idAzienda;
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .uri(URI.create(Config))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        // parse JSON
        acquaAzienda = Integer.parseInt(response.body());

        return acquaAzienda;
    }

    public static void salvaDatiGiornalieri(@NotNull LocalDate data, int acquaTotUtilizzata, @NotNull List<Campo> campi) throws IOException, InterruptedException {
        //Salvo il consumo di acqua totale dell'azienda e il singolo consumo di acqua di ogni campo
        String uri = "http://localhost:3000/inserisciConsumoTotaleGiornata";
        String uriCampo = "http://localhost:3000/inserisciConsumoCampoGiornata";

        JSONObject json = new JSONObject();
        json.put("data", data.toString());
        json.put("azienda", String.valueOf(campi.get(0).getIdAzienda()));
        json.put("acquaRichiesta", String.valueOf(SottosistemaIoT.getAcquaAzienda(campi.get(0).getIdAzienda())));
        json.put("acquaConsumata", String.valueOf(acquaTotUtilizzata));

        inviaRichiesta(uri, json);

        for(Campo campo : campi){
            json = new JSONObject();
            json.put("data", data.toString());
            json.put("campo", String.valueOf(campo.getId()));
            json.put("acquaAssegnata", String.valueOf(campo.getAcquaAssegnata()));
            json.put("acquaConsumata", String.valueOf(campo.getAcquaConsumata()));
            inviaRichiesta(uriCampo, json);
        }

    }

    public static void inviaDataOra(LocalDate data, LocalTime ora) throws IOException, InterruptedException {
        String uri = "http://localhost:3000/inserisciDataOra";

        JSONObject json = new JSONObject();
        json.put("data", data.toString());
        json.put("ora", ora.toString());

        inviaRichiesta(uri, json);

    }

    public static void inviaRichiesta(String uri, JSONObject json) throws IOException, InterruptedException {

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();

        try {
            HttpPost request = new HttpPost(uri);
            StringEntity params = new StringEntity(json.toString());
            request.addHeader("content-type", "application/json");
            request.setEntity(params);
            httpClient.execute(request);
            // handle response here...
        } catch (Exception ex) {
            // handle exception here
        } finally {
            httpClient.close();
        }
    }

    public static int irriga(@NotNull Campo campo, AttuatoreIrrigazione irr, int misuraUmidita) throws IOException, InterruptedException {
        int acquaRimanente = campo.getAcquaAssegnata() - campo.getAcquaConsumata();
        int acquaConsumata = 0;
        int ore = 0;

        while (campo.getUmiditaIdeale() > misuraUmidita) { //fino a qundo non raggiungo l'umidità desiderata e c'è acqua rimanente irrigo
            if(acquaRimanente > 0)
                irr.setAttivo(1, campo.getIdAzienda());
            else { //scorta terminata, irrigatore bloccato
                irr.setAttivo(-1, campo.getIdAzienda());
            }
            ore++;
            misuraUmidita += AUMENTO_ORARIO_UMIDITA;
            acquaRimanente -= campo.getEttari() * CONSUMO_ORARIO_ETTARO;
            Thread.sleep(2500);
        }
        irr.setAttivo(0, campo.getIdAzienda()); //inattivo
        acquaConsumata = campo.getEttari() * CONSUMO_ORARIO_ETTARO * ore;
        campo.setAcquaConsumata(campo.getAcquaConsumata() + acquaConsumata);

        return acquaConsumata;

    }

    public static void main(String[] args) throws InterruptedException, MqttException, IOException {

        AziendaConfig azienda;
        do {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .GET()
                    .header("accept", "application/json")
                    .uri(URI.create(CONFIGAZIENDE))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println(response.body());

            // parse JSON
            ObjectMapper mapper = new ObjectMapper();
            azienda = mapper.readValue(response.body(), new TypeReference<>() {});

            Thread.sleep(4500);
        }while(azienda.getIdAzienda()==0);

        String Config = "http://localhost:3000/aziende/" + azienda.getIdAzienda() + "/campi";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .uri(URI.create(Config))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // parse JSON
        ObjectMapper mapper = new ObjectMapper();
        List<Campo> campiActual = mapper.readValue(response.body(), new TypeReference<>() {
        });
        List<Campo> campi = new ArrayList<Campo>(campiActual);

        List<AttuatoreConfig> attuatori = new ArrayList<AttuatoreConfig>();
        for (Campo s : campi) {
            Config = "http://localhost:3000/aziende/" + s.getIdAzienda() + "/campi/" + s.getId() + "/attuatori";
            client = HttpClient.newHttpClient();
            request = HttpRequest.newBuilder()
                    .GET()
                    .header("accept", "application/json")
                    .uri(URI.create(Config))
                    .build();

            response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // parse JSON
            mapper = new ObjectMapper();
            List<AttuatoreConfig> attuatoriActual = mapper.readValue(response.body(), new TypeReference<>() {
            });
            attuatori.addAll(attuatoriActual);
        }

        List<SensoreConfig> sensori = new ArrayList<SensoreConfig>();
        for (Campo s : campi) {
            Config = "http://localhost:3000/aziende/" + s.getIdAzienda() + "/campi/" + s.getId() + "/sensori";
            client = HttpClient.newHttpClient();
            request = HttpRequest.newBuilder()
                    .GET()
                    .header("accept", "application/json")
                    .uri(URI.create(Config))
                    .build();

            response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // parse JSON
            mapper = new ObjectMapper();
            List<SensoreConfig> sensoriActual = mapper.readValue(response.body(), new TypeReference<>() {
            });

            sensori.addAll(sensoriActual);

        }

        List<Piano> piani = new ArrayList<Piano>();
        for (AttuatoreConfig at : attuatori) {

            int idAzienda = 0;
            for (Campo campo : campi) {
                if (campo.getId() == at.getIdCampo()) {
                    idAzienda = campo.getIdAzienda();

                }
            }

            Config = "http://localhost:3000/aziende/" + idAzienda + "/campi/" + at.getIdCampo() + "/attuatori/" + at.getId() + "/piani";
            client = HttpClient.newHttpClient();
            request = HttpRequest.newBuilder()
                    .GET()
                    .header("accept", "application/json")
                    .uri(URI.create(Config))
                    .build();

            response = client.send(request, HttpResponse.BodyHandlers.ofString());
            //System.out.println(response.body());
            // parse JSON
            mapper = new ObjectMapper();
            List<Piano> pianiActual = mapper.readValue(response.body(), new TypeReference<>() {
            });

            piani.addAll(pianiActual);

        }

        List<SensoreTemperatura> sensoriTemp = new ArrayList<>();
        List<SensoreUmidita> sensoriUmid = new ArrayList<>();
        for (SensoreConfig sens : sensori) {

            switch (sens.getTipo()) {
                case "t" -> sensoriTemp.add(new SensoreTemperatura(sens.getId(), sens.getIdCampo()));
                case "u" -> sensoriUmid.add(new SensoreUmidita(sens.getId(), sens.getIdCampo()));
            }
        }

        List<AttuatoreIrrigazione> attuatoriIrrig = new ArrayList<AttuatoreIrrigazione>();
        List<AttuatoreRiscaldamento> attuatoriRisc = new ArrayList<AttuatoreRiscaldamento>();
        for (AttuatoreConfig attC : attuatori) {

            switch (attC.getTipo()) {
                case "u" -> attuatoriIrrig.add(new AttuatoreIrrigazione(attC.getId(), attC.getModalita(), attC.getAttivo(), attC.getIdCampo()));
                case "t" -> attuatoriRisc.add(new AttuatoreRiscaldamento(attC.getId(), attC.getModalita(), attC.getAttivo(), attC.getIdCampo()));
            }
        }

        MQTTSubscriber subscriber = new MQTTSubscriber();
        subscriber.start();

        MQTTPublisher publisher = new MQTTPublisher();
        publisher.start();

        int acquaTotUtilizzata = 0;
        int plusDay = 1;
        int plusHours = 3; // 24 : 3 = 8 -> ci saranno 8 misurazioni al giorno per ogni sensore
        LocalDate data = LocalDate.now(); //Primo giorno
        LocalTime ora = LocalTime.of(0,0);// 00:00

        //Esecuzione della simulazione -- simulo le misurazioni e il passare delle ore e dei giorni
        while (true) {

            // Inizio Giornata
            // Richiedo la disponibilità di acqua dell'azienda per il giorno attuale
            int idAzienda = azienda.getIdAzienda();

            while (true){

                //Invio ora e data al backend
                System.out.println("Invio data e ora al Backend");
                inviaDataOra(data,ora);

                int misuraTemp = 0;
                int misuraUmidita = 0;


                //Acquisisico i dati dei sensori di Temperatura se presenti
                for (SensoreTemperatura sensTemp : sensoriTemp) {
                    sensTemp.rilevaMisura(data, ora);
                    misuraTemp = sensTemp.getTempCelsius().getValore();

                    for (Campo campo : campi) {
                        if (campo.getId() == sensTemp.getIdCampo()) {
                            idAzienda = campo.getIdAzienda();
                        }
                    }

                    String topic = idAzienda + "/" + sensTemp.getIdCampo() + "/sensori/sensoreTemp";

                    String json = new Gson().toJson(sensTemp.getTempCelsius());

                    System.out.println(json);

                    publisher.publishTemperature(json, topic);

                    List<Piano> pianiS = subscriber.getPiani();
                    List<ModalitaSubscribe> modalitaS = subscriber.getModalitaList();
                    List<AttivoSubscribe> statoS = subscriber.getStatoList();

                    for(Piano ps : pianiS) {
                        boolean presenteP = false;
                        for(Piano p : piani) {
                            if(p.equals(ps))
                                presenteP = true;
                        }
                        if(!presenteP)
                            piani.add(ps);
                    }

                    boolean modTrovato;
                    for(ModalitaSubscribe m : modalitaS)
                    {
                        modTrovato = false;
                        for(AttuatoreIrrigazione irr: attuatoriIrrig) {
                            if (!modTrovato && irr.getId() == m.getIdAttuatore()) {
                                irr.setModalita(m.getModalita());
                                modTrovato = true;
                            }
                        }
                        if(!modTrovato) {
                            for(AttuatoreRiscaldamento r: attuatoriRisc) {
                                if (!modTrovato && r.getId() == m.getIdAttuatore()) {
                                    r.setModalita(m.getModalita());
                                    modTrovato = true;
                                }
                            }
                        }
                    }

                    boolean statoTrovato;
                    for(AttivoSubscribe s : statoS)
                    {
                        statoTrovato = false;
                        for (AttuatoreIrrigazione irr : attuatoriIrrig) {
                            if (!statoTrovato && irr.getId() == s.getIdAttuatore()) {
                                irr.setAttivo(s.getAttivo(), idAzienda);
                                statoTrovato = true;
                            }
                        }
                        if(!statoTrovato) {
                            for (AttuatoreRiscaldamento r : attuatoriRisc) {
                                if (!statoTrovato && r.getId() == s.getIdAttuatore()) {
                                    r.setAttivo(s.getAttivo(), idAzienda);
                                    statoTrovato = true;
                                }
                            }
                        }
                    }

                    boolean presente = false;
                    for (AttuatoreRiscaldamento attRisc : attuatoriRisc)
                    {
                        if(attRisc.getIdCampo()==sensTemp.getIdCampo())
                        {
                            presente= true;
                            if(attRisc.getAttivo()!=0) // se non è spento
                            {

                                if(attRisc.getModalita().equals("a")) // se in modalita auto
                                {
                                    for (Piano pianiAct : piani)
                                    {

                                        if(pianiAct.getIdAttuatore()==attRisc.getId())
                                        {

                                            LocalDate dt = LocalDate.parse(sensTemp.getTempCelsius().getData());

                                            if(dt.getDayOfWeek().getValue()==pianiAct.getGiorno())
                                            {

                                                LocalTime timeMisura = LocalTime.parse(sensTemp.getTempCelsius().getOra());
                                                LocalTime inizioPiano = LocalTime.parse(pianiAct.getOra_inizio());
                                                LocalTime finePiano = LocalTime.parse(pianiAct.getOra_fine());
                                                if(timeMisura.isAfter(inizioPiano) && timeMisura.isBefore(finePiano))
                                                {
                                                    if(sensTemp.getTempCelsius().getValore() > pianiAct.getCondizione())
                                                    {
                                                        if(attRisc.getAttivo() == 1) {

                                                            attRisc.setAttivo(-1, idAzienda);  //STAND-BY perchè è stata superata la condizione
                                                            System.out.println("La condizione del piano è stata superata. L'attuatore è andato in stand-by");
                                                        }
                                                        else {
                                                            System.out.println("L'attuatore e' gia' in stand-by");
                                                        }
                                                    }
                                                    else {
                                                        if(attRisc.getAttivo()==-1) {
                                                            System.out.println("L'attuatore si e' attivato in quanto la condizione non e' stata superata");
                                                            attRisc.setAttivo(1, idAzienda);
                                                        }
                                                        else
                                                            System.out.println("La condizione del piano non è stata superata.");
                                                    }
                                                }
                                                else {
                                                    System.out.println("Il piano del giorno attuale copre un orario differente");
                                                }
                                            }
                                            else {
                                                System.out.println("Non e' presente nessun piano per questo giorno");
                                            }
                                        }
                                    }
                                } else {
                                    System.out.println("\nL'attuatore e' in modalita' manuale\n");
                                }
                            }
                        }
                    }
                    if(!presente)
                    {
                        System.out.println("Non è presente nel campo "+sensTemp.getIdCampo()+" nessun attuatore di riscaldamento.");
                    }
                }



                //Acquisisico i dati dei sensori di Umidità se presenti
                for (SensoreUmidita sensUmid : sensoriUmid) {
                    sensUmid.rilevaMisura(data, ora);
                    misuraUmidita = sensUmid.getPercUmid().getValore();

                    for (Campo campo : campi) {
                        if (campo.getId() == sensUmid.getIdCampo()) {

                            if(campo.getUmiditaIdeale() > misuraUmidita)
                            {
                                //Devo attivare l'attuatore di irrigazione per quel campo (devo irrigare)
                                for (AttuatoreIrrigazione irr : attuatoriIrrig)
                                    if (irr.getIdCampo() == campo.getId()) {
                                        acquaTotUtilizzata += irriga(campo, irr, misuraUmidita);
                                        System.out.println("Acqua tot utilizzata = " + acquaTotUtilizzata);
                                    }


                            }

                        }
                    }

                    String topic = idAzienda + "/" + sensUmid.getIdCampo() + "/sensori/sensoreUmid";
                    //System.out.println(topic);
                    String json = new Gson().toJson(sensUmid.getPercUmid());

                    System.out.println(json);

                    publisher.publishUmidita(json, topic);

                    List<Piano> pianiS = subscriber.getPiani();
                    List<ModalitaSubscribe> modalitaS = subscriber.getModalitaList();
                    List<AttivoSubscribe> statoS = subscriber.getStatoList();

                    for(Piano ps : pianiS) {
                        boolean presenteP = false;
                        for(Piano p : piani) {
                            if(p.equals(ps))
                                presenteP = true;
                        }
                        if(!presenteP)
                            piani.add(ps);
                    }

                    boolean modTrovato;
                    for(ModalitaSubscribe m : modalitaS)
                    {
                        modTrovato = false;
                        for(AttuatoreIrrigazione irr: attuatoriIrrig) {
                            if (!modTrovato && irr.getId() == m.getIdAttuatore()) {
                                irr.setModalita(m.getModalita());
                                modTrovato = true;
                            }
                        }
                        if(!modTrovato) {
                            for(AttuatoreRiscaldamento r: attuatoriRisc) {
                                if (!modTrovato && r.getId() == m.getIdAttuatore()) {
                                    r.setModalita(m.getModalita());
                                    modTrovato = true;
                                }
                            }
                        }
                    }

                    boolean statoTrovato;
                    for(AttivoSubscribe s : statoS)
                    {
                        statoTrovato = false;
                        for (AttuatoreIrrigazione irr : attuatoriIrrig) {
                            if (!statoTrovato && irr.getId() == s.getIdAttuatore()) {
                                irr.setAttivo(s.getAttivo(), idAzienda);
                                statoTrovato = true;
                            }
                        }
                        if(!statoTrovato) {
                            for (AttuatoreRiscaldamento r : attuatoriRisc) {
                                if (!statoTrovato && r.getId() == s.getIdAttuatore()) {
                                    r.setAttivo(s.getAttivo(), idAzienda);
                                    statoTrovato = true;
                                }
                            }
                        }
                    }

                    boolean presente = false;
                    for (AttuatoreIrrigazione attIrrig : attuatoriIrrig)
                    {
                        if(attIrrig.getIdCampo()==sensUmid.getIdCampo())
                        {
                            presente= true;
                            if(attIrrig.getAttivo()!=0) // se non è spento
                            {
                                if(attIrrig.getModalita().equals("a")) // se in modalita auto
                                {
                                    for (Piano pianiAct : piani)
                                    {
                                        if(pianiAct.getIdAttuatore()==attIrrig.getId())
                                        {
                                            LocalDate dt = LocalDate.parse(sensUmid.getPercUmid().getData());

                                            if(dt.getDayOfWeek().getValue()==pianiAct.getGiorno())
                                            {
                                                LocalTime timeMisura = LocalTime.parse(sensUmid.getPercUmid().getOra());
                                                LocalTime inizioPiano = LocalTime.parse(pianiAct.getOra_inizio());
                                                LocalTime finePiano = LocalTime.parse(pianiAct.getOra_fine());
                                                if(timeMisura.isAfter(inizioPiano) && timeMisura.isBefore(finePiano))
                                                {
                                                    if(sensUmid.getPercUmid().getValore() > pianiAct.getCondizione())
                                                    {
                                                        if(attIrrig.getAttivo() == 1) {

                                                            attIrrig.setAttivo(-1, idAzienda);  //STAND-BY perchè è stata superata la condizione
                                                            System.out.println("La condizione del piano è stata superata. L'attuatore è andato in stand-by");
                                                        }
                                                        else {
                                                            System.out.println("L'attuatore e' gia' in stand-by");
                                                        }
                                                    }
                                                    else {
                                                        if(attIrrig.getAttivo()==-1) {
                                                            System.out.println("L'attuatore si e' attivato in quanto la condizione non e' stata superata");
                                                            attIrrig.setAttivo(1, idAzienda);
                                                        }
                                                        else
                                                            System.out.println("La condizione del piano non è stata superata.");
                                                    }
                                                }
                                                else {
                                                    System.out.println("Il piano del giorno attuale copre un orario differente");
                                                }
                                            }
                                            else {
                                                System.out.println("Non e' presente nessun piano per questo giorno");
                                            }
                                        }
                                    }
                                } else {
                                    System.out.println("\nL'attuatore e' in modalita' manuale\n");
                                }
                            }
                        }
                    }
                    if(!presente)
                    {
                        System.out.println("Non è presente nel campo "+sensUmid.getIdCampo()+" nessun attuatore di irrigazione.");
                    }


                }

                Thread.sleep(1500);
                // Aggiorno l'ora (plusHours)
                ora = ora.plusHours(plusHours);

                // Se è arrivata la fine della giornata esco dal ciclo interno
                if(ora.equals(LocalTime.of(0, 0)))
                {
                    salvaDatiGiornalieri(data, acquaTotUtilizzata, campi);
                    break;
                }

            }// Fine while interno (ore)

            //Resetto l'acqua consumata alla fine della giornata
            acquaTotUtilizzata = 0;
            for (Campo campo : campi)
                campo.setAcquaConsumata(0);
            data = data.plusDays(plusDay);

        }// Fine while esterno (giorni)


    }



}