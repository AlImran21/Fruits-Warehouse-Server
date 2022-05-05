const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cje0k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const fruitsCollection = client.db('fruitsWarehouse').collection('fruit');
        const usersCollection = client.db('fruitsWarehouse').collection('user');

        app.get('/fruit', async (req, res) => {
            const query = {};
            const cursor = fruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        });

        app.get('/fruit/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const fruit = await fruitsCollection.findOne(query);
            res.send(fruit);
        });

        /*  // Clicking on the Ad Item button will add one product managed item to the route and save it to the database.
         app.post('/fruit', async (req, res) => {
             const newFruit = req.body;
             const result = await fruitsCollection.insertOne(newFruit);
             res.send(result);
         }); */

        app.delete('/fruit/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await fruitsCollection.deleteOne(query);
            res.send(result);
        });


        // users collection API

        app.get('/user', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email: email };
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });


    }
    finally {

    }

}

run().catch(console.dir);


// 
app.get('/', (req, res) => {
    res.send('Hello Fruits Warehouse');
});

// 
app.listen(port, () => {
    console.log('Running my-assignment-11-server', port);
})