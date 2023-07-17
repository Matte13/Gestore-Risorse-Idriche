package upo.IoT;

public class Campo {
    private int id;
    private String coltura ;
    private int idAzienda;

    private int ettari;

    private String tipoIrrigazione;

    private String qtaAcqua;

    private int acquaAssegnata;

    private int acquaConsumata;

    private int umiditaIdeale;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getColtura() {
        return coltura;
    }

    public void setColtura(String coltura) {
        this.coltura = coltura;
    }

    public int getIdAzienda() {
        return idAzienda;
    }

    public void setIdAzienda(int idAzienda) {
        this.idAzienda = idAzienda;
    }

    public int getEttari() {
        return ettari;
    }

    public void setEttari(int ettari) {
        this.ettari = ettari;
    }

    public String getTipoIrrigazione() {
        return tipoIrrigazione;
    }

    public void setTipoIrrigazione(String tipoIrrigazione) {
        this.tipoIrrigazione = tipoIrrigazione;
    }

    public String getQtaAcqua() {
        return qtaAcqua;
    }

    public void setQtaAcqua(String qtaAcqua) {
        this.qtaAcqua = qtaAcqua;
    }

    public int getAcquaAssegnata() {
        return acquaAssegnata;
    }

    public void setAcquaAssegnata(int acquaAssegnata) {
        this.acquaAssegnata = acquaAssegnata;
    }

    public int getUmiditaIdeale() {
        return umiditaIdeale;
    }

    public void setUmiditaIdeale(int umiditaIdeale) {
        this.umiditaIdeale = umiditaIdeale;
    }

    public int getAcquaConsumata() {
        return acquaConsumata;
    }

    public void setAcquaConsumata(int acquaConsumata) {
        this.acquaConsumata = acquaConsumata;
    }

    @Override
    public String toString() {
        return "Campo{" +
                "id=" + id +
                ", coltura='" + coltura + '\'' +
                ", idAzienda=" + idAzienda +
                ", ettari=" + ettari +
                ", tipoIrrigazione='" + tipoIrrigazione + '\'' +
                ", qtaAcqua='" + qtaAcqua + '\'' +
                ", acquaAssegnata=" + acquaAssegnata +
                ", acquaConsumata=" + acquaConsumata +
                ", umiditaIdeale=" + umiditaIdeale +
                '}';
    }
}
