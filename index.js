const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

// Username= dbuser
// password= gYKkyJDGQNJqA3U7

// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cje0k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('Fruits Warehouse DB Connected');
  // perform actions on the collection object
  client.close();
});


// 
app.get('/', (req, res) => {
    res.send('Hello Fruits Warehouse');
});

// 
app.listen(port, () => {
    console.log('Running my-assignment-11-server', port);
})