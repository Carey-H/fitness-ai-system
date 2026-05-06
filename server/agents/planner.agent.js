const EXERCISE_LIBRARY = {
  bodyweight: {
    warmup: ["肩颈环绕", "猫牛式", "髋部打开"],
    strength: ["俯卧撑", "深蹲", "弓步蹲", "平板支撑"],
    cardio: ["开合跳", "登山跑", "高抬腿"],
    recovery: ["胸椎旋转", "臀桥", "腿后侧拉伸"]
  },
  dumbbell: {
    warmup: ["肩胛激活", "徒手深蹲", "髋部打开"],
    strength: ["哑铃杯式深蹲", "哑铃划船", "哑铃推举", "罗马尼亚硬拉"],
    cardio: ["哑铃摆动", "农夫走", "原地快走"],
    recovery: ["背部拉伸", "髋屈肌拉伸", "肩颈放松"]
  },
  band: {
    warmup: ["弹力带拉伸", "肩胛绕环", "髋部打开"],
    strength: ["弹力带划船", "弹力带深蹲", "侧向行走", "臀桥外展"],
    cardio: ["快节奏深蹲", "原地小跑", "开合跳"],
    recovery: ["胸椎打开", "颈部拉伸", "腘绳肌拉伸"]
  }
};

const GOAL_CONFIG = {
  fat_loss: { label: "减脂", focus: "cardio", intensityBias: 1 },
  muscle_gain: { label: "增肌", focus: "strength", intensityBias: 1 },
  mobility: { label: "久坐修复", focus: "recovery", intensityBias: -1 },
  stamina: { label: "体能", focus: "cardio", intensityBias: 1 }
};

const ENERGY_CONFIG = {
  low: { label: "低能量", multiplier: 0.75, intensity: "轻量" },
  medium: { label: "中等能量", multiplier: 1, intensity: "标准" },
  high: { label: "高能量", multiplier: 1.2, intensity: "挑战" }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pick(list, index) {
  return list[index % list.length];
}

function distributeMinutes(totalMinutes, blockCount) {
  const base = Math.max(2, Math.floor(totalMinutes / blockCount));
  const durations = Array.from({ length: blockCount }, () => base);
  let remainder = totalMinutes - base * blockCount;

  for (let index = 0; remainder > 0; index += 1) {
    durations[index % blockCount] += 1;
    remainder -= 1;
  }

  return durations;
}

class PlannerAgent {
  async run(context) {
    const time = clamp(Number(context.time) || 30, 8, 120);
    const equipment = EXERCISE_LIBRARY[context.equipment] ? context.equipment : "bodyweight";
    const goal = GOAL_CONFIG[context.goal] || GOAL_CONFIG.fat_loss;
    const energy = ENERGY_CONFIG[context.energy] || ENERGY_CONFIG.medium;
    const streakDays = Math.max(Number(context.streakDays) || 0, 0);
    const level = Math.max(Number(context.level) || 1, 1);
    const isBossDay = streakDays > 0 && streakDays % 7 === 0;
    const bossMinutes = isBossDay ? clamp(Math.floor(time * 0.3), 4, 15) : 0;
    const regularMinutes = time - bossMinutes;
    const blockCount = regularMinutes >= 35 ? 5 : regularMinutes >= 18 ? 4 : 3;
    const durations = distributeMinutes(regularMinutes, blockCount);
    const library = EXERCISE_LIBRARY[equipment];

    const exercises = Array.from({ length: blockCount }, (_, index) => {
      const type = index === 0 ? "warmup" : index === blockCount - 1 ? "recovery" : goal.focus;
      const name = pick(library[type], index + level + streakDays);
      const duration = durations[index];
      return {
        name,
        type,
        duration,
        target: type === "strength" ? `${clamp(8 + level + index * 2, 10, 25)} 次 x 3 组` : `${duration} 分钟`,
        note: type === "recovery" ? "动作放慢，专注呼吸和活动度" : "保持可控节奏，最后 30 秒稍微加速"
      };
    });

    if (isBossDay) {
      exercises.splice(1, 0, {
        name: "Boss 战：100 俯卧撑 + 100 深蹲挑战",
        type: "boss",
        duration: bossMinutes,
        target: "分组完成，允许休息，但尽量不中断",
        note: "如果状态不佳，改成 50 + 50，完成比逞强更重要"
      });
    }

    return {
      ...context,
      plan: {
        title: `${goal.label} · Lv${level} ${energy.intensity}训练`,
        time,
        equipment,
        goal: goal.label,
        energy: energy.label,
        isBossDay,
        exercises,
        microHabits: [
          "打开电脑后做 10 个俯卧撑",
          "每完成一个功能做 20 个深蹲",
          "等接口返回时平板支撑 30 秒"
        ]
      }
    };
  }
}

module.exports = new PlannerAgent();
