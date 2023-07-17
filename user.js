'use strict';

class User {

    constructor(nome, cognome, mail, password, tipo, azienda){

        this.nome = nome;
        this.cognome = cognome;
        this.mail = mail;
        this.password = password;
        this.tipo = tipo;
        this.azienda = azienda;
    }
}

module.exports = User;