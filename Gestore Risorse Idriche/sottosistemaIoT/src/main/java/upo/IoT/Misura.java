package upo.IoT;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class Misura<T> {
    private T valore;
    private String data;
    private String ora ;


    public Misura(String data, String ora, T valore) {
        this.data = data;
        this.ora = ora;
        this.valore = valore;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getOra() {
        return ora;
    }

    public void setOra(String ora) {
        this.ora = ora;
    }

    public T getValore() {
        return valore;
    }

    public void setValore(T valore) {
        this.valore = valore;
    }
}
