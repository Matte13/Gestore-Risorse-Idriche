package upo.IoT;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import upo.json.JSONObject;

import java.io.IOException;

public abstract class Attuatore {
    private int id;
    private String modalita;
    private int attivo;
    private int idCampo;

    public Attuatore(int id, String modalita, int attivo, int idCampo) {
        this.id = id;
        this.modalita = modalita;
        this.attivo = attivo;
        this.idCampo = idCampo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getModalita() {
        return modalita;
    }

    public void setModalita(String modalita) {
        this.modalita = modalita;
    }

    public int getAttivo() {
        return attivo;
    }

    public void setAttivo(int attivo, int idAzienda) throws IOException {
        this.attivo = attivo;

        System.out.println("Invio cambio modalità, attivo = " + this.attivo);
        //Invia tramite ApiRest la modifica dello stato al backend
        String uri = "http://localhost:3000/aziende/" + idAzienda + "/campi/" + this.idCampo + "/attuatori/" + this.id + "/statoDB";

        JSONObject json = new JSONObject();
        json.put("attivo", this.attivo);

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();

        try {
            HttpPut request = new HttpPut(uri);
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


    public int getIdCampo() {
        return idCampo;
    }

    public void setIdCampo(int idCampo) {
        this.idCampo = idCampo;
    }

    @Override
    public String toString() {
        return "Attuatore{" +
                "id=" + id +
                ", modalita='" + modalita + '\'' +
                ", attivo=" + attivo +
                ", idCampo=" + idCampo +
                '}';
    }
}
