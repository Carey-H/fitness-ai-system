class PlannerAgent {
  async run(context) {
    return {
      ...context,
      plan: {
        exercises: [
          { name: "俯卧撑", duration: 10 },
          { name: "深蹲", duration: 10 },
          { name: "平板支撑", duration: 10 }
        ]
      }
    };
  }
}

module.exports = new PlannerAgent();
