require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Person = require('./models/Person');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();

// Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Variables de entorno
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 4610;

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Conexión a MongoDB exitosa");
    })
    .catch((err) => {
        console.error("❌ Error conectando a MongoDB:", err);
    });

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Agenda de Llamadas',
            version: '1.0.0',
            description: 'API para registrar personas en la agenda de llamadas'
        },
        servers: [
            {
                url: 'https://web-prueba-final-backent-production.up.railway.app' // Railway
            },
            {
                url: `http://localhost:${PORT}` // Localhost
            }
        ]
    },
    apis: ['./app.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs1', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Registra una nueva persona en la agenda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               celular:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *               departamento:
 *                 type: string
 *               distrito:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Persona registrada correctamente
 *       500:
 *         description: Error al registrar la persona
 */
app.post('/submit', async (req, res) => {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(200).json({ message: '✅ Persona guardada correctamente' });
    } catch (err) {
        console.error('❌ Error al guardar:', err);
        res.status(500).json({ message: 'Error al guardar' });
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
