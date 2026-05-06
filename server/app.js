const path = require("path");
const express = require("express");
const fitnessRoute = require("./routes/fitness.route");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "web")));
app.use("/api", fitnessRoute);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "AI 健身系统暂时开小差了，请稍后再试。" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
