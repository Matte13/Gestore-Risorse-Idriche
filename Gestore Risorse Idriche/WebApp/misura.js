'use strict';
class Misura {
    constructor(id, valore, data, ora, idSensore) {

        this.id = id;
        this.valore = valore;
        this.data = data;
        this.ora = ora;
        this.idSensore = idSensore;
    }
}

module.exports = Misura;