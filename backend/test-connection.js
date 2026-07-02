const mongoose = require('mongoose');

const uri = "mongodb+srv://amanap:FSgvh4WkZ6TBeqgg@cluster0.niaxfsm.mongodb.net/taskmate?appName=Cluster0";

console.log("Testing connection to MongoDB Atlas...");
mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE: Could not connect to MongoDB Atlas:", err.message);
    process.exit(1);
  });
