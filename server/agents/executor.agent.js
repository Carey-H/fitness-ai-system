class ExecutorAgent {
  async run(context) {
    const tasks = context.plan.exercises.map(e => ({
      ...e,
      status: "pending"
    }));
    return { ...context, tasks };
  }
}

module.exports = new ExecutorAgent();
