class AnalystAgent {
  async run(context) {
    return {
      ...context,
      suggestion: "继续保持训练"
    };
  }
}

module.exports = new AnalystAgent();
