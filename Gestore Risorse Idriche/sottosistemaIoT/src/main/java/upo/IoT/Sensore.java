package upo.IoT;

import java.time.LocalDate;
import java.time.LocalTime;

public abstract class Sensore {

    private int id;
    private int idCampo;

    public Sensore(int id, int idCampo) {
        this.id = id;
        this.idCampo = idCampo;
    }

    public int getId() {
        return id;
    }


    public int getIdCampo() {
        return idCampo;
    }

    public void setId(int id) {
        this.id = id;
    }


    public void setIdCampo(int idCampo) {
        this.idCampo = idCampo;
    }

    /**
     * metodo astratto che rileva le misure nei vari sensori
     */
    protected abstract void rilevaMisura(LocalDate data, LocalTime ora);


    @Override
    public String toString() {
        return "Sensore{" +
                "id=" + id +
                ", idCampo=" + idCampo +
                '}';
    }
}
