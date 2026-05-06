const express = require("express");
const bodyParser = require("body-parser");
const fitnessRoute = require("./routes/fitness.route");

const app = express();
app.use(bodyParser.json());

app.use("/api", fitnessRoute);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
