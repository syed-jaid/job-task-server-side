const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ey7s4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const ProductCollection = client.db("outshade").collection("products");
        const UserCollection = client.db("outshade").collection("users");

        //get all users info
        app.get('/users', async (req, res) => {
            const users = await UserCollection.find().toArray();
            res.send(users)
        });

        //get a specific user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = await UserCollection.findOne({ email: email });
            res.send(user);
        });

        //update  user info
        app.patch('/users/:email', async (req, res) => {
            const email = req.params.email;
            const userInfo = req.body;
            const filter = { email: email };
            const updateDoc = {
                $set: userInfo
            };
            const result = await UserCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        //add a user
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await UserCollection.insertOne(users);
            res.send(result);
        });

        //add a product 
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await ProductCollection.insertOne(product);
            res.send(result);
        });

        //get all products
        app.get('/product', async (req, res) => {
            const products = await ProductCollection.find().toArray();
            res.send(products)
        });

        //get one product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const product = await ProductCollection.findOne(filter);
            res.send(product);
        });

        //update  product info
        app.patch('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const productInfo = req.body;
            const updateDoc = {
                $set: productInfo
            };
            const result = await ProductCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        //delete product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await ProductCollection.deleteOne(filter);
            // console.log(filter);
            res.send(result);
        });

    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);;


app.get('/', (req, res) => {
    res.send('Hello everyone from active builders!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})