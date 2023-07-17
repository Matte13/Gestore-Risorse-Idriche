package upo.IoT;

public class SensoreConfig {

    private int id;
    private String tipo;
    private int idCampo;

    public int getId() {
        return id;
    }

    public String getTipo() {
        return tipo;
    }

    public int getIdCampo() {
        return idCampo;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setIdCampo(int idCampo) {
        this.idCampo = idCampo;
    }

    @Override
    public String toString() {
        return "Sensore{" +
                "id=" + id +
                ", tipo='" + tipo + '\'' +
                ", idCampo=" + idCampo +
                '}';
    }
}
