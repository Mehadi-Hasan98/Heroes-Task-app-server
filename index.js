const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://todo-app:<8lIeyGOCKhaRxSs9>@cluster0.skzs4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todo").collection("task");

        // GET
         
        app.get("/task", async (req, res) => {
            const query = req.body;
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
          });

          
        // POST

        app.post('/task', async(req, res) =>{
            const newItem = req.body;
            const result = await taskCollection.insertOne(newItem);
            res.send(result);
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
