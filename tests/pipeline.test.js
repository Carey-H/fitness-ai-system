const assert = require("assert");
const agentManager = require("../server/core/agentManager");
const planner = require("../server/agents/planner.agent");
const executor = require("../server/agents/executor.agent");
const tracker = require("../server/agents/tracker.agent");
const analyst = require("../server/agents/analyst.agent");

agentManager.register("planner", planner);
agentManager.register("executor", executor);
agentManager.register("tracker", tracker);
agentManager.register("analyst", analyst);

async function testBossQuest() {
  const result = await agentManager.runPipeline({
    time: 30,
    goal: "fat_loss",
    energy: "high",
    equipment: "bodyweight",
    level: 4,
    streakDays: 7,
    currentXp: 850,
    sleepHours: 7
  });

  assert.strictEqual(result.plan.isBossDay, true);
  assert.ok(result.tasks.some(task => task.type === "boss"));
  assert.ok(result.progress.earnedXp > 0);
  assert.ok(result.progress.level >= 4);
  assert.ok(result.aiCoach.summary.includes("30 分钟"));
}

async function testLowEnergyAdjustment() {
  const result = await agentManager.runPipeline({
    time: 12,
    goal: "mobility",
    energy: "low",
    equipment: "band",
    sleepHours: 5,
    restDays: 3
  });

  assert.strictEqual(result.plan.goal, "久坐修复");
  assert.ok(result.tasks.length >= 3);
  assert.ok(result.reminders.length >= 2);
  assert.ok(result.suggestion.includes("3 天没练"));
}

(async () => {
  await testBossQuest();
  await testLowEnergyAdjustment();
  console.log("All pipeline tests passed.");
})();
