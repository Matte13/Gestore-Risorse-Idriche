package upo.IoT;

public class ModalitaSubscribe {

    private String modalita;
    private int IdAttuatore;

    public String getModalita() {
        return modalita;
    }

    public void setModalita(String modalita) {
        this.modalita = modalita;
    }

    public int getIdAttuatore() {
        return IdAttuatore;
    }

    public void setIdAttuatore(int idAttuatore) {
        IdAttuatore = idAttuatore;
    }

    @Override
    public String toString() {
        return "ModalitaSubscribe{" +
                "modalita='" + modalita + '\'' +
                ", IdAttuatore=" + IdAttuatore +
                '}';
    }
}
