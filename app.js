require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const Person = require('./models/Person');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Personas',
            version: '1.0.0',
            description: 'API para gestionar personas con sus datos'
        },
        servers: [
            {
                url: 'http://localhost:4610',
            },
            // Puedes agregar aquí tu URL en Railway u otro hosting
        ],
    },
    apis: ['./app.js'], // Aquí le dices que lea los comentarios en este archivo
};

const specs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Se conectó exitosamente a MongoDB');
})
.catch((err) => {
    console.error('Error encontrado', err);
});

/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Agrega una nueva persona con sus datos completos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 example: "12345678"
 *               celular:
 *                 type: string
 *                 example: "987654321"
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellidos:
 *                 type: string
 *                 example: "Pérez Gómez"
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-21"
 *               departamento:
 *                 type: string
 *                 example: "Lima"
 *               distrito:
 *                 type: string
 *                 example: "Miraflores"
 *               observaciones:
 *                 type: string
 *                 example: "Paciente con alergias"
 *             required:
 *               - dni
 *               - celular
 *               - nombre
 *               - apellidos
 *               - fechaNacimiento
 *               - departamento
 *               - distrito
 *     responses:
 *       200:
 *         description: Persona guardada correctamente
 *       500:
 *         description: Error al guardar persona
 */
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
    console.log('Servidor corriendo en el puerto 4610');
});