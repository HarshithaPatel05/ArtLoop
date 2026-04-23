const express = require('express');

const app = express();

app.get('/', (req, res) => {
  console.log("🔥 WORKING");
  res.send("SERVER OK");
});

app.listen(5002, () => {
  console.log("🚀 Running on 5002");
});