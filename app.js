require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Person = require('./models/Person');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();


app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(()=>{
    console.log("Se conecto exitosamente");
}).catch((err)=>{
    console.error("Error encontrado", err);
});

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
                url: 'https://web-prueba-final-backent-production.up.railway.app'
            },
            {
                url: 'http://localhost:4610'
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
 *                 
 *               celular:
 *                 type: string
 *                 
 *               nombre:
 *                 type: string
 *                 
 *               apellidos:
 *                 type: string
 *                 
 *               fechaNacimiento:
 *                 type: string
 *                 
 *               departamento:
 *                 type: string
 *                 
 *               distrito:
 *                 type: string
 *                 
 *               observaciones:
 *                 type: string
 *                 
 *     responses:
 *       200:
 *         description: Persona registrada correctamente
 *       500:
 *         description: Error al registrar la persona
 */

app.post('/submit', async (req, res) => {
    try{
        const person = new Person(req.body);
        await person.save();
        res.status(200).json({message: 'Se guardo correctamente'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Error al guardar'});
    }
});
/**
 * @swagger
 * /personas:
 *   get:
 *     summary: Obtiene todas las personas registradas en la agenda
 *     responses:
 *       200:
 *         description: Lista completa de personas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dni:
 *                     type: string
 *                     example: "12345678"
 *                   celular:
 *                     type: string
 *                     example: "987654321"
 *                   nombre:
 *                     type: string
 *                     example: "Juan"
 *                   apellidos:
 *                     type: string
 *                     example: "Pérez Gómez"
 *                   fechaNacimiento:
 *                     type: string
 *                     example: "2000-01-01"
 *                   departamento:
 *                     type: string
 *                     example: "Lima"
 *                   distrito:
 *                     type: string
 *                     example: "Miraflores"
 *                   observaciones:
 *                     type: string
 *                     example: "Cliente frecuente"
 *       400:
 *         description: Error al listar las personas
 */
app.get('/personas', async (req, res) => {
  try {
    const listadoPersonas = await Person.find();
    res.status(200).json(listadoPersonas);
  } catch (err) {
    res.status(400).json({ message: 'Error al listar las personas' });
  }
});
app.listen(4610);
