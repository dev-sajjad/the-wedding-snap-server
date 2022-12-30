const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())


const uri =
    `mongodb+srv://${process.env.WEDDING_SNAP_USER}:${process.env.WEDDING_SNAP_PASS}@cluster0.ozga6sm.mongodb.net/?retryWrites=true&w=majority`;
  
const client = new MongoClient(uri);


async function dbConnect() {
    try {
        await client.connect();
        console.log('Database connected')
    } catch (error) {
        console.log(error)
    }
}
dbConnect();

const serviceConnection = client.db('weddingSnap').collection('services')


// get limited services from database
app.get('/', async(req, res) => {
    try {
        const query = {};
        const cursor = serviceConnection.find(query).limit(3)
        const services = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully got the data.",
            data: services
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// get all services data
app.get('/services', async(req, res) => {
    try {
        const cursor = serviceConnection.find({});
        const services = await cursor.toArray();
        res.send({
            success: true,
            message: 'Successfully got the data.',
            data: services
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})






app.listen(port, (req, res) => {
    console.log(`Wedding snap server is running on port: ${port}`)
})