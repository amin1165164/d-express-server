const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = 5000;

require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzd39.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("dExpress").collection("Services");
  const reviewCollection = client.db("dExpress").collection("Reviews");
  const adminCollection = client.db("dExpress").collection("Admins");
  const bookingCollection = client.db("dExpress").collection("Bookings");

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addServices", (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service, (err, result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review, (err, result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/service/:id", (req, res) => {
    const id = req.params.id;
    serviceCollection.find({ _id: ObjectId(id) }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin, (err, result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/admins", (req, res) => {
    adminCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/serviceBook", (req, res) => {
    const serviceBook = req.body;
    bookingCollection.insertOne(serviceBook, (err, result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/bookings", (req, res) => {
    bookingCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/bookings/:email", (req, res) => {
    const email = req.params.email;
    bookingCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/removeService/:id", (req, res) => {
    const id = req.params.id;
    serviceCollection.deleteOne({ _id: ObjectId(id) }, (err, result) => {
      if (!err) {
        res.send({ count: result.insertedCount });
      }
    });
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
});
app.listen(process.env.PORT || port);
