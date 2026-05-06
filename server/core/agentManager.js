class AgentManager {
  constructor() {
    this.agents = {};
  }

  register(name, agent) {
    this.agents[name] = agent;
  }

  async runPipeline(context) {
    context = await this.agents.planner.run(context);
    context = await this.agents.executor.run(context);
    context = await this.agents.tracker.run(context);
    context = await this.agents.analyst.run(context);
    return context;
  }
}

module.exports = new AgentManager();
