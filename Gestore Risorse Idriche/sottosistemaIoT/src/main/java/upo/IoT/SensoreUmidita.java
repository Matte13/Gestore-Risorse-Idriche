package upo.IoT;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;


public class SensoreUmidita extends Sensore {

    private Misura<Integer> percUmid;   // lista per memorizzare i valori di umidita' rilevati

    public SensoreUmidita(int id, int idCampo) {
        super(id, idCampo);

    }

    public Misura<Integer> getPercUmid() {
        return percUmid;
    }

    public void setPercUmid(Misura<Integer> percUmid) {
        this.percUmid = percUmid;
    }

    @Override
    protected void rilevaMisura(LocalDate data, LocalTime ora) {

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm");


        Misura<Integer> mis_umid = new Misura<>( data.toString(), ora.format(dtf).toString(), (int)(Math.random() * (90 - 50)) + 50);
        this.percUmid= mis_umid;
    }

    @Override
    public String toString() {
        return super.toString() + " tipo = umidita'";
    }

}

