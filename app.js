require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Person = require('./models/Person');

const app = express();

app.use(cors()); // Permite CORS globalmente, sin restricciones
app.use(express.static('public'));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Se conectó exitosamente");
  })
  .catch((err) => {
    console.error("Error encontrado", err);
  });

app.post('/submit', async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.status(200).json({ message: 'Se guardó correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al guardar' });
  }
});

app.listen(4610, () => {
  console.log('Servidor escuchando en puerto 4610');
});