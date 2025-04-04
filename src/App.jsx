
import React, { useState, useEffect } from 'react';

const allAchievements = [
  { id: 1, name: "🎯 Pierwsza oszczędność", condition: (data) => data.log.length >= 1 },
  { id: 2, name: "💯 Zaoszczędzono 100 €", condition: (data) => data.saved >= 100 },
  { id: 3, name: "🥉 Poziom 3 zdobyty", condition: (data) => data.level >= 3 },
  { id: 4, name: "📅 Tydzień systematyczności", condition: (data) => {
    const days = new Set(data.log.map(entry => entry.date.split(',')[0]));
    return days.size >= 7;
  }},
  { id: 5, name: "🦾 Jednorazowa wpłata 100 €", condition: (data) =>
    data.log.some(entry => entry.amount >= 100) }
];

function CyberpunkSavingsApp() {
  const [goal, setGoal] = useState(1000);
  const [goalName, setGoalName] = useState("Nowy telefon");
  const [saved, setSaved] = useState(0);
  const [amount, setAmount] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newGoalName, setNewGoalName] = useState('');
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [message, setMessage] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState(50);
  const [startDate, setStartDate] = useState(new Date());
  const [log, setLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    const newXp = saved * 0.1;
    setXp(newXp);
    const newLevel = Math.floor(newXp / 10) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setMessage(`🎉 Awans! Masz teraz poziom ${newLevel}!`);
      setTimeout(() => setMessage(''), 3000);
    }
  }, [saved]);

  useEffect(() => {
    const data = { saved, level, log };
    const earned = allAchievements.filter(a =>
      a.condition(data) && !achievements.includes(a.id)
    );
    if (earned.length > 0) {
      setAchievements([...achievements, ...earned.map(e => e.id)]);
    }
  }, [saved, level, log]);

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setSaved(prev => prev + numericAmount);
      setLog([...log, { amount: numericAmount, date: new Date().toLocaleString() }]);
      setAmount('');
    }
  };

  const handleUpdateGoal = () => {
    const numericGoal = parseFloat(newGoal);
    if (!isNaN(numericGoal) && numericGoal > 0) {
      setGoal(numericGoal);
      setSaved(0);
      setStartDate(new Date());
      setLog([]);
      setAchievements([]);
      setNewGoal('');
    }
    if (newGoalName.trim()) {
      setGoalName(newGoalName.trim());
      setNewGoalName('');
    }
  };

  const progress = Math.min((saved / goal) * 100, 100).toFixed(1);
  const today = new Date();
  const daysPassed = Math.max((today - startDate) / (1000 * 60 * 60 * 24), 1);
  const dailyAvg = saved / daysPassed;
  const weeklyAvg = dailyAvg * 7;
  const monthlyAvg = dailyAvg * 30;
  const yearlyAvg = dailyAvg * 365;

  const remaining = Math.max(goal - saved, 0);
  const projectedDays = dailyAvg > 0 ? Math.ceil(remaining / dailyAvg) : null;
  const projectedDate = projectedDays ? new Date(today.getTime() + projectedDays * 86400000).toLocaleDateString() : "∞";

  const weeklyTargetDays = weeklyTarget > 0 ? Math.ceil(remaining / (weeklyTarget)) : null;
  const weeklyTargetDate = weeklyTargetDays ? new Date(today.getTime() + weeklyTargetDays * 86400000).toLocaleDateString() : "∞";

  return (
    <div style={{
      background: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      minHeight: '100vh',
      padding: '2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto auto',
      gap: '1rem',
      gridTemplateAreas: `
        "main control"
        "logi achvm"
      `
    }}>
      <div style={{ gridArea: 'main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
        😊
      </div>

      <div style={{ gridArea: 'control', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={() => setShowLog(!showLog)} style={{ fontSize: '2rem', background: 'none', border: 'none', color: '#0f0', cursor: 'pointer' }}>
          📜
        </button>
        <button onClick={() => setShowAchievements(!showAchievements)} style={{ fontSize: '2rem', background: 'none', border: 'none', color: '#0f0', cursor: 'pointer' }}>
          🏆
        </button>
      </div>

      {showLog && (
        <div style={{ gridArea: 'logi', maxHeight: '300px', overflowY: 'auto' }}>
          <h4>Dziennik oszczędności</h4>
          <ul>{log.map((entry, index) => (<li key={index}>{entry.date} – {entry.amount} €</li>))}</ul>
        </div>
      )}

      {showAchievements && (
        <div style={{ gridArea: 'achvm' }}>
          <h4>🏆 Twoje osiągnięcia</h4>
          <ul>{allAchievements.map(a => (<li key={a.id}>{achievements.includes(a.id) ? a.name : `🔒 ${a.name}`}</li>))}</ul>
        </div>
      )}
    </div>
  );
}

export default CyberpunkSavingsApp;
