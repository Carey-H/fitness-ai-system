class ExecutorAgent {
  async run(context) {
    const tasks = context.plan.exercises.map((exercise, index) => ({
      id: index + 1,
      ...exercise,
      status: "pending",
      rewardXp: exercise.type === "boss" ? 120 : Math.max(20, exercise.duration * 2)
    }));

    const totalMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
    const totalXp = tasks.reduce((sum, task) => sum + task.rewardXp, 0);

    return {
      ...context,
      tasks,
      session: {
        totalMinutes,
        totalXp,
        estimatedCalories: Math.round(totalMinutes * (context.energy === "high" ? 9 : context.energy === "low" ? 5 : 7)),
        mode: context.plan.isBossDay ? "weekly_boss" : "daily_quest"
      }
    };
  }
}

module.exports = new ExecutorAgent();
