class AnalystAgent {
  async run(context) {
    const reminders = [];

    if ((Number(context.restDays) || 0) >= 3) {
      reminders.push("你已经连续 3 天没练，今天只做 8 分钟修复训练也算赢。");
    }

    if (Number(context.sleepHours) > 0 && Number(context.sleepHours) < 6) {
      reminders.push("睡眠偏少，建议降低强度，优先做拉伸和核心激活。");
    }

    if (context.plan.isBossDay) {
      reminders.push("今天触发 Boss 战，先热身再挑战，不要一上来冲满强度。");
    }

    return {
      ...context,
      suggestion: reminders[0] || "保持今天这一小步，连续性比单次爆发更值钱。",
      reminders,
      contentIdea: `程序员健身挑战 Day ${context.progress.streakDays}: ${context.plan.title}`,
      aiCoach: {
        summary: `根据你的 ${context.plan.time} 分钟时间、${context.plan.energy} 和 ${context.plan.goal} 目标，已生成 ${context.tasks.length} 个训练任务。`,
        nextAdjustment: context.energy === "low" ? "下次如果精神恢复，可以把能量调到 medium 增加训练量。" : "完成后记录体重、睡眠和摄入，系统会更容易给出趋势建议。"
      }
    };
  }
}

module.exports = new AnalystAgent();
