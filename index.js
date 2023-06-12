const express = require('express');
const app = express();
require('dotenv').config()
var cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tz9vtk4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        const msgFromManufacturer = client.db("Manufacturer-Transporter").collection("msgFromManufacturer");

        const userInfo = client.db("Manufacturer-Transporter").collection("userInfo");

        app.post('/fromManufacturer', async (req, res) => {
            const doc = req.body;
            const result = await msgFromManufacturer.insertOne(doc);
            res.send(result);
        })

        app.post('/user', async (req, res) => {
            const doc = req.body;
            const result = await userInfo.insertOne(doc);
            res.send(result);
        })

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email : email };
            const data = await userInfo.findOne(query);
            // console.log(data);
            res.send(data);
        })

        app.get('/fromManufacturer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { to: email };
            const data = msgFromManufacturer.find(query);
            const result = await data.toArray();
            res.send(result);
        })

        app.get('/manufacturer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { from: email };
            const data = msgFromManufacturer.find(query);
            const result = await data.toArray();
            res.send(result);
        })

        app.put('/fromManufacturer', async (req, res) => {
            const doc = req.body;
            const filter = { _id: new ObjectId(doc.id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    charge: doc.charge
                },
            };
            const result = await msgFromManufacturer.updateOne(filter, updateDoc, options);

            res.send(result);
        })
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('BISMILLAH')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})