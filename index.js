const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skzs4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("todo-app").collection("task");
    const completeTaskCollection = client.db("todo-app").collection("complete");



    // Get All Task
    app.get("/task", async (req, res) => {
      const query = req.body;
      const task = await taskCollection.find(query).toArray();
      res.send(task);
    });

    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const productId = await taskCollection.findOne(query);
      res.send(productId);
    });

    // PUT for updated tasks

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          task: updatedUser.task,
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Submit Task From tasks Collection
    app.post("/task", async (req, res) => {
      const query = req.body;
      const tasks = await taskCollection.insertOne(query);
      res.send(tasks);
    });

    // Get All Task
    app.get("/complete", async (req, res) => {
      const query = req.body;
      const task = await completeTaskCollection.find(query).toArray();
      res.send(task);
    });


    // Submit Task From tasks Collection
    app.post("/complete", async (req, res) => {
      const query = req.body;
      const tasks = await completeTaskCollection.insertOne(query);
      res.send(tasks);
    });
  }
    
    finally {

    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running todo app Server");
});


app.listen(port, () => {
  console.log("Hello I'm Listening to port", port);
});


