const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server test is running");
});

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.get("/snapshot", (req, res) => {
  res.json({
    ok: true,
    tick: 1,
    gameDay: 1,
    gameHour: 12,
    message: "hello from render"
  });
});

app.post("/echo-command", (req, res) => {
  res.json({
    ok: true,
    received: req.body
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});