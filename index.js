const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// 
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {

        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }

        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    });


};


// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cje0k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const fruitsCollection = client.db('fruitsWarehouse').collection('fruit');
        const usersCollection = client.db('fruitsWarehouse').collection('user');

        // Auth
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            });

            res.send({ accessToken });
        });


        // fruits collection API

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

        app.get('/user', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;

            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = usersCollection.find(query);
                const users = await cursor.toArray();
                res.send(users);
            } else {
                res.status(403).send({ message: 'Forbidden access' });
            }

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
});