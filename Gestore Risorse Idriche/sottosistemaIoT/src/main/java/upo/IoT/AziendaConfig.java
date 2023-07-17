package upo.IoT;

public class AziendaConfig {
    private int idAzienda;

    public int getIdAzienda() {
        return idAzienda;
    }

    public void setIdAzienda(int idAzienda) {
        this.idAzienda = idAzienda;
    }

    @Override
    public String toString() {
        return "AziendaConfig{" +
                "idAzienda=" + idAzienda +
                '}';
    }
}
