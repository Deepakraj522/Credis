import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentPipeline from '../components/AgentPipeline';
import { WORKERS } from '../data/mockData';

function scoreColor(s) {
  if (s >= 75) return '#00C896';
  if (s >= 50) return '#FFB347';
  return '#FF6584';
}

function decisionColor(d) {
  if (d === 'APPROVE_FAST') return '#00C896';
  if (d === 'APPROVE_STANDARD') return '#6C63FF';
  if (d === 'APPROVE_CAPPED') return '#FFB347';
  return '#FF6584';
}

function lenderStyle(type) {
  const t = type.toLowerCase();
  if (t.includes('gov')) return { bg: 'rgba(0,200,150,0.1)', color: '#00C896', border: 'rgba(0,200,150,0.25)' };
  if (t.includes('mfi') || t.includes('micro')) return { bg: 'rgba(255,179,71,0.1)', color: '#FFB347', border: 'rgba(255,179,71,0.25)' };
  return { bg: 'rgba(108,99,255,0.1)', color: '#6C63FF', border: 'rgba(108,99,255,0.25)' };
}

function FadeSection({ children, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay || 0);
    return () => clearTimeout(t);
  }, [delay]);
  return <div ref={ref} style={{ marginBottom: '24px' }}>{children}</div>;
}

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState('');
  const [phase, setPhase] = useState('idle');
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('credis_user');
    if (!stored) { nav('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    if (u.workerAccess && u.workerAccess.length === 1) {
      setSelected(u.workerAccess[0]);
    }
  }, [nav]);

  function handleRun() {
    if (!selected) return;
    setPhase('running');
    setShowResults(false);
  }

  function handleComplete() {
    setPhase('done');
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }

  function handleLogout() {
    localStorage.removeItem('credis_user');
    nav('/login');
  }

  const worker = selected ? WORKERS[selected] : null;
  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#0A0A0F', overflow: 'hidden' }}>
      <style>{`
        .hover-lift:hover { transform: translateY(-4px) !important; box-shadow: 0 8px 28px rgba(108,99,255,0.15) !important; }
        .run-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108,99,255,0.4) !important; }
        .run-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: '220px', minWidth: '220px', height: '100vh',
        background: '#0E0E18', borderRight: '1px solid #1E1E2E',
        display: 'flex', flexDirection: 'column',
        padding: '20px 14px', gap: '12px',
        overflowY: 'auto', position: 'sticky', top: 0
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '20px', fontWeight: 800, paddingBottom: '14px',
          borderBottom: '1px solid #1E1E2E',
          background: 'linear-gradient(135deg,#6C63FF,#00C896)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>💳 CREDIS</div>

        {/* User card */}
        {user && (
          <div style={{
            background: 'rgba(108,99,255,0.07)',
            border: '1px solid rgba(108,99,255,0.15)',
            borderRadius: '10px', padding: '12px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '6px'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#6C63FF,#00C896)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '15px', color: '#fff'
            }}>{initials}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', textAlign: 'center' }}>
              {user.name}
            </div>
            <div style={{
              fontSize: '10px', color: '#6C63FF',
              background: 'rgba(108,99,255,0.1)',
              padding: '2px 8px', borderRadius: '20px',
              border: '1px solid rgba(108,99,255,0.2)'
            }}>{user.role}</div>
          </div>
        )}

        {/* Worker select */}
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#2A2A3A', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Select Worker
        </div>
        <select
          value={selected}
          onChange={e => {
            setSelected(e.target.value);
            setPhase('idle');
            setShowResults(false);
          }}
          style={{
            width: '100%', background: '#12121A',
            border: '1px solid #1E1E2E', borderRadius: '8px',
            color: '#fff', padding: '9px 10px',
            fontSize: '12px', cursor: 'pointer', outline: 'none'
          }}
        >
          <option value="">— Choose Worker —</option>
          {user?.workerAccess?.map(id => (
            <option key={id} value={id}>
              {WORKERS[id]?.name} ({id})
            </option>
          ))}
        </select>

        {/* Worker preview */}
        {worker && (
          <div style={{
            background: '#12121A', borderRadius: '8px',
            padding: '8px 10px', display: 'flex', gap: '8px', alignItems: 'center'
          }}>
            <span style={{
              fontSize: '11px', color: '#6C63FF',
              background: 'rgba(108,99,255,0.1)',
              padding: '2px 8px', borderRadius: '20px',
              border: '1px solid rgba(108,99,255,0.2)'
            }}>{worker.platform}</span>
            <span style={{ fontSize: '11px', color: '#555566' }}>{worker.city}</span>
          </div>
        )}

        {/* Run button */}
        <button
          className="run-btn"
          onClick={handleRun}
          disabled={!selected || phase === 'running'}
          style={{
            width: '100%', padding: '11px', borderRadius: '9px',
            background: 'linear-gradient(135deg,#6C63FF,#4A42D4)',
            border: 'none', color: '#fff', fontWeight: 600,
            fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(108,99,255,0.25)',
            transition: 'all 0.3s'
          }}
        >
          {phase === 'running' ? ' Running...' : ' Run Analysis'}
        </button>

        {/* Status */}
        {phase === 'running' && (
          <div style={{
            padding: '7px 10px', borderRadius: '8px', fontSize: '11px',
            fontWeight: 500, textAlign: 'center',
            background: 'rgba(108,99,255,0.1)', color: '#6C63FF',
            border: '1px solid rgba(108,99,255,0.2)'
          }}>🔄 Pipeline active</div>
        )}
        {phase === 'done' && (
          <div style={{
            padding: '7px 10px', borderRadius: '8px', fontSize: '11px',
            fontWeight: 500, textAlign: 'center',
            background: 'rgba(0,200,150,0.1)', color: '#00C896',
            border: '1px solid rgba(0,200,150,0.2)'
          }}>✅ Analysis complete</div>
        )}

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width: '100%', padding: '9px', background: 'transparent',
          border: '1px solid rgba(255,101,132,0.2)', borderRadius: '8px',
          color: '#FF6584', fontSize: '12px', cursor: 'pointer',
          marginTop: 'auto'
        }}> Logout</button>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '24px' }}>

        {/* Page title */}
        <div style={{
          fontSize: '22px', fontWeight: 700, marginBottom: '4px',
          background: 'linear-gradient(135deg,#6C63FF,#00C896)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>CREDIS Analysis Dashboard</div>
        <div style={{ fontSize: '13px', color: '#555566', marginBottom: '24px' }}>
          {worker ? `${worker.name} · ${worker.platform} · ${worker.city}` : 'Select a worker to begin'}
        </div>

        {/* WELCOME */}
        {phase === 'idle' && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '65vh', textAlign: 'center', gap: '14px'
          }}>
            <div style={{ fontSize: '52px' }}>💳</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>
              Welcome to CREDIS
            </div>
            <div style={{ fontSize: '14px', color: '#555566', maxWidth: '360px', lineHeight: 1.6 }}>
              Select a worker from the sidebar and click Run Analysis
              to start the AI-powered behavioral credit scoring pipeline
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {(phase === 'running' || phase === 'done') && worker && (
          <AgentPipeline
            workerId={selected}
            workerData={worker}
            onComplete={handleComplete}
          />
        )}

        {/* RESULTS */}
        {showResults && worker && (
          <div ref={resultsRef}>

            {/* SCORE HERO */}
           

            {/* SCORE HERO */}
            <FadeSection delay={0}>
              <div style={{
                background: 'linear-gradient(135deg, #0D0B1F, #0A1A14)',
                border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: '20px', padding: '32px',
                display: 'grid', gridTemplateColumns: '220px 1fr',
                gap: '40px', alignItems: 'center'
              }}>
                {/* Score Ring */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                    <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1A1A2E" strokeWidth="6"/>
                      <circle cx="60" cy="60" r="50" fill="none"
                        stroke={scoreColor(worker.credisScore)}
                        strokeWidth="6"
                        strokeDasharray={`${(worker.credisScore / 100) * 314} 314`}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 8px ${scoreColor(worker.credisScore)})`, transition: 'stroke-dasharray 1s ease' }}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '48px', fontWeight: 900, color: scoreColor(worker.credisScore), lineHeight: 1 }}>
                        {worker.credisScore}
                      </span>
                      <span style={{ fontSize: '12px', color: '#333344', marginTop: '2px' }}>/100</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                    background: `${scoreColor(worker.credisScore)}15`,
                    color: scoreColor(worker.credisScore),
                    border: `1px solid ${scoreColor(worker.credisScore)}40`,
                    letterSpacing: '0.5px'
                  }}>{worker.riskBand}</div>
                </div>

                {/* Details Grid */}
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                    {worker.name}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                      background: 'rgba(108,99,255,0.12)', color: '#6C63FF',
                      border: '1px solid rgba(108,99,255,0.2)', letterSpacing: '0.3px'
                    }}>{worker.platform}</span>
                    <span style={{
                      padding: '4px 12px', borderRadius: '6px', fontSize: '11px',
                      background: '#12121A', color: '#444455', border: '1px solid #1E1E2E'
                    }}>{worker.city}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { label: 'Loan Decision', value: worker.loanDecision.replace('_', ' '), color: decisionColor(worker.loanDecision) },
                      { label: 'Max Loan', value: `Rs.${(worker.maxLoan/100000).toFixed(1)}L`, color: '#00C896' },
                      { label: 'Approval', value: `${worker.approvalDays} Day`, color: '#fff' },
                      { label: 'Monthly Income', value: `Rs.${(worker.avgMonthlyIncome/1000).toFixed(1)}K`, color: '#fff' },
                      { label: 'Platform Rating', value: `${worker.rating} / 5.0`, color: '#FFB347' },
                      { label: 'Active Months', value: `${worker.activeMonths} / 12`, color: '#fff' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px', padding: '14px'
                      }}>
                        <div style={{ fontSize: '10px', color: '#666677', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                          {label}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* SIGNAL BREAKDOWN */}
           <FadeSection delay={300}>
  <div style={{ fontSize: '13px', fontWeight: 600, color: '#555566', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
    Score Breakdown
  </div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
    {[
      { label: 'Income Stability', score: worker.scoreBreakdown.incomeStability, weight: 30 },
      { label: 'Platform Reliability', score: worker.scoreBreakdown.platformReliability, weight: 25 },
      { label: 'Work Consistency', score: worker.scoreBreakdown.workConsistency, weight: 20 },
      { label: 'Spending Discipline', score: worker.scoreBreakdown.spendingDiscipline, weight: 15 },
      { label: 'Income Growth', score: worker.scoreBreakdown.incomeGrowth, weight: 10 },
    ].map(({ label, score, weight }) => {
      const color = score >= 75 ? '#00C896' : score >= 50 ? '#FFB347' : '#FF6584';
      const circumference = 2 * Math.PI * 28;
      const dashArray = (score / 100) * circumference;
      return (
        <div key={label} style={{
          background: '#0E0E18',
          border: `1px solid ${color}20`,
          borderRadius: '16px',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`
          }}/>

          {/* Circular progress */}
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <svg viewBox="0 0 70 70" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="35" cy="35" r="28" fill="none" stroke="#1A1A2E" strokeWidth="4"/>
              <circle cx="35" cy="35" r="28" fill="none"
                stroke={color}
                strokeWidth="4"
                strokeDasharray={`${dashArray} ${circumference}`}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 4px ${color})`,
                  transition: 'stroke-dasharray 1.5s ease'
                }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
            </div>
          </div>

          {/* Label */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#A0A0B0', marginBottom: '4px', lineHeight: 1.3 }}>
              {label}
            </div>
            <div style={{
              fontSize: '10px', fontWeight: 600,
              color, background: `${color}12`,
              padding: '2px 8px', borderRadius: '20px',
              border: `1px solid ${color}25`
            }}>
              {weight}% weight
            </div>
          </div>
        </div>
      );
    })}
  </div>
            </FadeSection>

            {/* LENDERS */}
            <FadeSection delay={600}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#555566', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Matched Lenders
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                {worker.topLenders.map((lender, i) => {
                  const ts = lenderStyle(lender.type);
                  return (
                    <div key={i} className="hover-lift" style={{
                      background: i === 0
                        ? 'linear-gradient(135deg, #081512, #0A0A0F)'
                        : '#0E0E18',
                      border: `1px solid ${i === 0 ? 'rgba(0,200,150,0.25)' : '#1E1E2E'}`,
                      borderRadius: '16px', padding: '24px', position: 'relative',
                      transition: 'all 0.25s ease'
                    }}>
                      {i === 0 && (
                        <div style={{
                          position: 'absolute', top: '16px', right: '16px',
                          background: 'rgba(0,200,150,0.1)',
                          color: '#00C896', fontSize: '10px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '6px',
                          border: '1px solid rgba(0,200,150,0.2)',
                          letterSpacing: '0.5px'
                        }}>BEST MATCH</div>
                      )}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                          {lender.name}
                        </div>
                        <div style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: '6px',
                          fontSize: '10px', fontWeight: 600,
                          background: ts.bg, color: ts.color,
                          border: `1px solid ${ts.border}`,
                          letterSpacing: '0.5px'
                        }}>{lender.type.toUpperCase()}</div>
                      </div>

                      <div style={{
                        display: 'flex', alignItems: 'baseline', gap: '4px',
                        marginBottom: '20px'
                      }}>
                        <span style={{ fontSize: '44px', fontWeight: 900, color: '#00C896', lineHeight: 1 }}>
                          {lender.rate}
                        </span>
                        <span style={{ fontSize: '16px', color: '#333344' }}>% p.a.</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          ['Max Loan', `Rs.${(lender.maxLoan/100000).toFixed(1)}L`],
                          ['Approval Time', `${lender.days} day(s)`]
                        ].map(([l, v]) => (
                          <div key={l} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '8px 0', borderTop: '1px solid #1A1A2E'
                          }}>
                            <span style={{ fontSize: '12px', color: '#333344' }}>{l}</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeSection>

            {/* GROWTH ROADMAP */}
            <FadeSection delay={900}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#555566', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                12-Month Growth Roadmap
              </div>

             {/* Phase indicator */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '20px' }}>
  {[
    { label: 'Foundation', months: 'Months 1–3', color: '#6C63FF', num: '01' },
    { label: 'Growth', months: 'Months 4–6', color: '#4A9EFF', num: '02' },
    { label: 'Expansion', months: 'Months 7–9', color: '#00C896', num: '03' },
    { label: 'Consolidation', months: 'Months 10–12', color: '#FFB347', num: '04' },
  ].map(({ label, months, color, num }) => (
    <div key={label} style={{
      background: `${color}08`,
      border: `1px solid ${color}25`,
      borderRadius: '10px', padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: '12px'
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 800, color
      }}>{num}</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color, marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '10px', color: '#333344' }}>{months}</div>
      </div>
    </div>
  ))}
</div>

{/* Phase cards */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', marginBottom: '16px' }}>
  {[
    { key: 'foundation', label: 'Foundation', months: 'Months 1–3', color: '#6C63FF' },
    { key: 'growth', label: 'Growth', months: 'Months 4–6', color: '#4A9EFF' },
    { key: 'expansion', label: 'Expansion', months: 'Months 7–9', color: '#00C896' },
    { key: 'consolidation', label: 'Consolidation', months: 'Months 10–12', color: '#FFB347' },
  ].map(({ key, label, months, color }) => (
    <div key={key} style={{
      background: '#0E0E18',
      border: `1px solid #1E1E2E`,
      borderRadius: '14px', padding: '22px',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '60px', height: '60px',
        background: `radial-gradient(circle at top left, ${color}15, transparent 70%)`,
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '3px', background: `linear-gradient(180deg, ${color}, ${color}20)`
      }}/>
      <div style={{ paddingLeft: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{label}</span>
          <span style={{
            fontSize: '10px', color, fontWeight: 600,
            background: `${color}10`, padding: '4px 10px',
            borderRadius: '20px', border: `1px solid ${color}25`,
            letterSpacing: '0.5px'
          }}>{months}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {worker.roadmap[key].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                background: `${color}12`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '1px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}/>
              </div>
              <span style={{ fontSize: '13px', color: '#777788', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>  
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', marginBottom: '16px' }}>
  {[
    { key: 'foundation', label: 'Foundation', months: 'Months 1–3', color: '#6C63FF' },
    { key: 'growth', label: 'Growth', months: 'Months 4–6', color: '#4A9EFF' },
    { key: 'expansion', label: 'Expansion', months: 'Months 7–9', color: '#00C896' },
    { key: 'consolidation', label: 'Consolidation', months: 'Months 10–12', color: '#FFB347' },
  ].map(({ key, label, months, color }) => (
    <div key={key} style={{
      background: '#0E0E18', border: '1px solid #1E1E2E',
      borderRadius: '14px', padding: '22px',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '60px', height: '60px',
        background: `radial-gradient(circle at top left, ${color}15, transparent 70%)`,
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '3px', background: `linear-gradient(180deg, ${color}, ${color}20)`
      }}/>
      <div style={{ paddingLeft: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{label}</span>
          <span style={{
            fontSize: '10px', color, fontWeight: 600,
            background: `${color}10`, padding: '4px 10px',
            borderRadius: '20px', border: `1px solid ${color}25`, letterSpacing: '0.5px'
          }}>{months}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {worker.roadmap[key].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                background: `${color}12`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}/>
              </div>
              <span style={{ fontSize: '13px', color: '#A0A0B0', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>

              {/* Year end targets */}
              <div style={{
                background: '#0E0E18',
                border: '1px solid rgba(108,99,255,0.15)',
                borderRadius: '14px', padding: '24px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#555566', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                  Year End Targets
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                  {[
                    { label: 'Expected Income', value: worker.roadmap.yearEnd.expectedIncome, color: '#00C896' },
                    { label: 'Savings Target', value: worker.roadmap.yearEnd.savingsTarget, color: '#6C63FF' },
                    { label: 'CREDIS Score Target', value: worker.roadmap.yearEnd.credisTarget, color: '#FFB347' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      background: `${color}08`,
                      border: `1px solid ${color}20`,
                      borderRadius: '10px', padding: '16px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '10px', color: '#333344', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>

            {/* WORKER PROFILE */}
            <FadeSection delay={1200}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#555566', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Worker Profile
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                {[
                  { label: 'Monthly Income', value: `Rs.${worker.avgMonthlyIncome.toLocaleString()}`, type: 'pos' },
                  { label: 'Platform Rating', value: `${worker.rating} / 5.0`, type: 'pos' },
                  { label: 'Active Days', value: `${worker.activeDays} / month`, type: 'neu' },
                  { label: 'Total Deliveries', value: worker.totalDeliveries.toLocaleString(), type: 'neu' },
                  { label: 'Cancellation Rate', value: `${(worker.cancellationRate * 100).toFixed(1)}%`, type: worker.cancellationRate < 0.05 ? 'pos' : 'neg' },
                  { label: 'Active Months', value: `${worker.activeMonths} / 12`, type: 'pos' },
                  { label: 'Recurring Deposit', value: worker.hasRD ? `Rs.${worker.rdAmount}/mo` : 'Not active', type: worker.hasRD ? 'pos' : 'neg' },
                  { label: 'Insurance', value: worker.hasInsurance ? 'Active' : 'Not active', type: worker.hasInsurance ? 'pos' : 'neg' },
                  { label: 'CKYC Status', value: worker.ckyc ? 'Verified' : 'Pending', type: worker.ckyc ? 'pos' : 'neg' },
                  { label: 'Current Balance', value: `Rs.${worker.currentBalance.toLocaleString()}`, type: 'neu' },
                  { label: 'Income Growth', value: `${worker.growthPct > 0 ? '+' : ''}${worker.growthPct}%`, type: worker.growthPct >= 0 ? 'pos' : 'neg' },
                  { label: 'Platform', value: worker.platform, type: 'neu' },
                ].map(({ label, value, type }) => {
                  const color = type === 'pos' ? '#00C896' : type === 'neg' ? '#FF6584' : '#fff';
                  return (
                    <div key={label} style={{
                      background: '#0E0E18',
                      border: `1px solid ${type === 'pos' ? 'rgba(0,200,150,0.1)' : type === 'neg' ? 'rgba(255,101,132,0.1)' : '#1E1E2E'}`,
                      borderRadius: '10px', padding: '16px'
                    }}>
                      <div style={{ fontSize: '10px', color: '#555566', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color }}>{value}</div>
                    </div>
                  );
                })}
              </div>
            </FadeSection>

          </div>
        )}
      </div>
    </div>
  );
}
