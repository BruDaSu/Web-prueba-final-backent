const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    dni: String,
    celular: String,
    nombre: String,
    apellidos: String,
    fechaNacimiento: String,
    departamento: String,
    distrito: String,
    observaciones: String
});

module.exports = mongoose.model('Person', personSchema, 'form_personas');