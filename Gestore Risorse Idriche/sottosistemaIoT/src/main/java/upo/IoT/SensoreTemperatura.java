package upo.IoT;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;


public class SensoreTemperatura extends Sensore {

    //non serve
    private Misura<Integer> tempCelsius;

    public SensoreTemperatura(int id, int idCampo) {
        super(id, idCampo);

    }

    public Misura<Integer> getTempCelsius() {
        return tempCelsius;
    }

    public void setTempCelsius(Misura<Integer> tempCelsius) {
        this.tempCelsius = tempCelsius;
    }

    @Override
    protected void rilevaMisura(LocalDate data, LocalTime ora) {

        //valore,data,ora
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm");

        Misura<Integer> mis_temp = new Misura<Integer>( data.toString(), ora.format(dtf).toString(), (int) (((Math.random() * 5) + 1) + 30));
        this.tempCelsius = mis_temp;

    }

    @Override
    public String toString() {
        return super.toString() + " tipo = temperatura";
    }
}
