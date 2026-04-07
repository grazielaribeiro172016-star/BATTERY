/* ═══════════════════════════════════════════
   state.js — Gerenciamento de estado e localStorage
═══════════════════════════════════════════ */

let STATE = {
  onboarded: false,
  selectedBatteries: [],
  progress: {},     // { batId: { completed: Set<lessonIdx>, pct: 0-100 } }
  xp: 0,
  streak: 0,
  lastActivity: null,
  badges: [],
  totalLessons: 0,
  userName: null,
};

function saveState() {
  const save = {...STATE};
  save.progress = {};
  for (const [k,v] of Object.entries(STATE.progress)) {
    save.progress[k] = { completed: [...v.completed], pct: v.pct };
  }
  localStorage.setItem('battery_state', JSON.stringify(save));
}

function loadState() {
  try {
    const raw = localStorage.getItem('battery_state');
    if (!raw) return;
    const data = JSON.parse(raw);
    STATE = data;
    STATE.progress = {};
    for (const [k,v] of Object.entries(data.progress || {})) {
      STATE.progress[k] = { completed: new Set(v.completed || []), pct: v.pct || 0 };
    }
    checkStreakDecay();
  } catch(e) { /* fresh start */ }
}

function checkStreakDecay() {
  if (!STATE.lastActivity) return;
  const diffDays = Math.floor((Date.now() - new Date(STATE.lastActivity).getTime()) / 86400000);
  if (diffDays >= 2) STATE.streak = 0;
}

function markActivity() {
  const today = new Date().toDateString();
  const last  = STATE.lastActivity ? new Date(STATE.lastActivity).toDateString() : null;
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (last === yesterday) STATE.streak++;
  else if (last === null)  STATE.streak = 1;
  STATE.lastActivity = new Date().toISOString();
}

function getLevel() {
  let l = LEVELS[0];
  for (const lvl of LEVELS) { if (STATE.xp >= lvl.min) l = lvl; }
  return l;
}

function getNextLevel() {
  return LEVELS.find(lvl => STATE.xp < lvl.min) || null;
}

function getBatState(pct) {
  if (pct >= 70) return 'state-green';
  if (pct >= 35) return 'state-yellow';
  return 'state-red';
}

function getBatColor(pct) {
  if (pct >= 70) return 'var(--green)';
  if (pct >= 35) return 'var(--yellow)';
  return 'var(--red)';
}

function getMyBatteries() {
  return BATTERIES.filter(b => STATE.selectedBatteries.includes(b.id));
}

function getStats() {
  return {
    totalLessons:    STATE.totalLessons,
    fullBatteries:   Object.values(STATE.progress).filter(v => v.pct >= 100).length,
    activeBatteries: STATE.selectedBatteries.length,
    xp:              STATE.xp,
    streak:          STATE.streak,
  };
}

function checkBadges() {
  const stats = getStats();
  let newBadge = null;
  for (const bd of BADGES_DEF) {
    if (!STATE.badges.includes(bd.id) && bd.cond(stats)) {
      STATE.badges.push(bd.id);
      newBadge = bd;
    }
  }
  if (newBadge) showToast('🏆 Conquista: ' + newBadge.name);
  saveState();
}
