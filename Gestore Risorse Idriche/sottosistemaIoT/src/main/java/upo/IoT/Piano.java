package upo.IoT;

public class Piano {

    private int id;
    private int giorno;
    private int condizione;
    private String descrizione;
    private String ora_inizio;
    private String ora_fine;
    private int idAttuatore;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getGiorno() {
        return giorno;
    }

    public void setGiorno(int giorno) {
        this.giorno = giorno;
    }

    public int getCondizione() {
        return condizione;
    }

    public void setCondizione(int condizione) {
        this.condizione = condizione;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getOra_inizio() {
        return ora_inizio;
    }

    public void setOra_inizio(String ora_inizio) {
        this.ora_inizio = ora_inizio;
    }

    public String getOra_fine() {
        return ora_fine;
    }

    public void setOra_fine(String ora_fine) {
        this.ora_fine = ora_fine;
    }

    public int getIdAttuatore() {
        return idAttuatore;
    }

    public void setIdAttuatore(int idAttuatore) {
        this.idAttuatore = idAttuatore;
    }

    @Override
    public String toString() {
        return "Piano{" +
                "id=" + id +
                ", giorno=" + giorno +
                ", condizione=" + condizione +
                ", descrizione='" + descrizione + '\'' +
                ", ora_inizio='" + ora_inizio + '\'' +
                ", ora_fine='" + ora_fine + '\'' +
                ", idAttuatore=" + idAttuatore +
                '}';
    }
}
