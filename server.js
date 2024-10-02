const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const cors = require("cors");

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

require("dotenv").config();
app.use(express.json());

app.use(cors());

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/css"));

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.send({ message: "API Listening!" });
});

app.post("/api/listings", (req, res) => {
  db.addNewListing(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

app.get("/api/listings", (req, res) => {
  db.getAllListings(req.query.page, req.query.perPage, req.query.name)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

app.get("/api/listings/:id", (req, res) => {
  db.getListingById(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: "Listing not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

app.put("/api/listings/:id", (req, res) => {
  db.updateListingById(req.body, req.params.id)
    .then((data) => {
      if (data.nModified === 1) {
        res.status(200).send({ message: "Listing updated successfully" });
      } else {
        res.status(404).send({ message: "Listing not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

app.delete("/api/listings/:id", (req, res) => {
  db.deleteListingById(req.params.id)
    .then((data) => {
      if (data.deletedCount === 1) {
        res.status(200).send({ message: "Listing deleted successfully" });
      } else {
        res.status(404).send({ message: "Listing not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

module.exports = app;
