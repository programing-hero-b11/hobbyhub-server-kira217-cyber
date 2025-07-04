const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// middle were

app.use(cors());
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v36kmoi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Create groupsCollection

    const groupsCollection = client.db("groupsDB").collection("groups");

    // get method

    app.get("/groups", async (req, res) => {
      const result = await groupsCollection.find().toArray();
      res.send(result);
    });

    // get method but findOne

    app.get("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await groupsCollection.findOne(query);
      res.send(result);
    });

    // post method
    app.post("/groups", async (req, res) => {
      const newGroup = req.body;
      const result = await groupsCollection.insertOne(newGroup);
      res.send(result);
    });

    // update method
    app.put('/groups/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateGroup = req.body
      const updateDoc = {
      $set: updateGroup
    };
    const result = await groupsCollection.updateOne(filter,updateDoc
      ,options
    )
    res.send(result)

    })

    // delete method
    app.delete('/groups/:id', async(req,res)=>{
      const id =req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await groupsCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My assignment is running in this server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
