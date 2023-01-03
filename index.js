const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const reviewCollection = client.db('weddingSnap').collection('reviews')

//services
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

// get specific service data 
app.get('/services/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: ObjectId(id) };
        const service = await serviceConnection.findOne(query);
        res.send({
            success: true,
            message: `Successfully get the service ${service.service_name}`,
            data: service
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})



// reviews
// get specific service related reviews
app.get('/reviews/:id', async(req, res) => {
    try {
        const {id } = req.params;
        const filter= { service_id:id }
        const cursor = reviewCollection.find(filter).limit(4)
        const reviews = await cursor.toArray();
        res.send({
            success: true,
            message: 'Successfully get customer reviews!',
            data: reviews
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

// post service related review
app.post('/reviews', async(req, res) => {
    try {
        const review = req.body;
        const result = await reviewCollection.insertOne(review)
        res.send({
            success: true,
            message: 'Successfully add a review!',
            data: result
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})



app.listen(port, () => {
    console.log(`Wedding snap server is running on port: ${port}`)
})