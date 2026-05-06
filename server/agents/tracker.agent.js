function levelFromXp(totalXp) {
  return Math.floor(totalXp / 300) + 1;
}

class TrackerAgent {
  async run(context) {
    const currentXp = Math.max(Number(context.currentXp) || 0, 0);
    const earnedXp = context.session.totalXp;
    const nextTotalXp = currentXp + earnedXp;
    const level = levelFromXp(nextTotalXp);
    const xpIntoLevel = nextTotalXp % 300;
    const completedSessions = Math.max(Number(context.completedSessions) || 0, 0) + 1;
    const streakDays = Math.max(Number(context.streakDays) || 0, 0) + 1;

    return {
      ...context,
      progress: {
        earnedXp,
        totalXp: nextTotalXp,
        level,
        xpToNextLevel: 300 - xpIntoLevel,
        streakDays,
        completedSessions,
        unlockedSkill: streakDays >= 7 ? "高强度日" : streakDays >= 3 ? "微习惯连击" : null
      },
      log: {
        total: context.tasks.length,
        completed: 0,
        pending: context.tasks.length,
        dashboard: {
          weightTrend: context.weight ? "继续记录 7 天后生成趋势" : "未记录体重",
          sleep: context.sleepHours ? `${context.sleepHours} 小时` : "未记录睡眠",
          calories: context.calories ? `${context.calories} kcal` : "未记录摄入热量"
        }
      }
    };
  }
}

module.exports = new TrackerAgent();
