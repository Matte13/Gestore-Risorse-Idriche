package upo.IoT;

public class AttuatoreConfig {
    private int id;
    private String modalita;
    private int attivo;
    private String tipo;
    private int idCampo;

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

    public void setAttivo(int attivo) {
        this.attivo = attivo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
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
                ", tipo='" + tipo + '\'' +
                ", idCampo=" + idCampo +
                '}';
    }
}
