class TrackerAgent {
  async run(context) {
    return {
      ...context,
      log: {
        total: context.tasks.length,
        completed: 0
      }
    };
  }
}

module.exports = new TrackerAgent();
