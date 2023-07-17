package upo.IoT;

public class AttivoSubscribe {

    private int attivo;
    private int IdAttuatore;

    public int getAttivo() {
        return attivo;
    }

    public void setAttivo(int attivo) {
        this.attivo = attivo;
    }

    public int getIdAttuatore() {
        return IdAttuatore;
    }

    public void setIdAttuatore(int idAttuatore) {
        IdAttuatore = idAttuatore;
    }

    @Override
    public String toString() {
        return "AttivoSubscribe{" +
                "attivo=" + attivo +
                ", IdAttuatore=" + IdAttuatore +
                '}';
    }
}
