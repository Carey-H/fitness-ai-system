const express = require("express");
const router = express.Router();

const agentManager = require("../core/agentManager");

const planner = require("../agents/planner.agent");
const executor = require("../agents/executor.agent");
const tracker = require("../agents/tracker.agent");
const analyst = require("../agents/analyst.agent");

agentManager.register("planner", planner);
agentManager.register("executor", executor);
agentManager.register("tracker", tracker);
agentManager.register("analyst", analyst);

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "fitness-ai-system" });
});

router.post("/run", async (req, res, next) => {
  try {
    const result = await agentManager.runPipeline(req.body || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
