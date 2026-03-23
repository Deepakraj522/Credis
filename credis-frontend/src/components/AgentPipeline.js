import React, { useState, useEffect, useRef } from 'react';
import { AGENT_META } from '../data/mockData';

export default function AgentPipeline({ workerId, workerData, onComplete }) {
  const [states, setStates] = useState(AGENT_META.map(() => 'locked'));
  const [logs, setLogs] = useState([]);
  const [outputs, setOutputs] = useState(AGENT_META.map(() => ''));
  const [progress, setProgress] = useState(0);
  const [connectors, setConnectors] = useState(AGENT_META.map(() => 'off'));
  const [miniProg, setMiniProg] = useState(AGENT_META.map(() => 0));
  const logRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStates(AGENT_META.map(() => 'locked'));
    setLogs([]);
    setOutputs(AGENT_META.map(() => ''));
    setProgress(0);
    setConnectors(AGENT_META.map(() => 'off'));
    setMiniProg(AGENT_META.map(() => 0));
    runPipeline();
    return () => timers.current.forEach(clearTimeout);
  }, [workerId]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  function addTimer(fn, delay) {
    const t = setTimeout(fn, delay);
    timers.current.push(t);
    return t;
  }

  function runPipeline() {
    let elapsed = 0;
    AGENT_META.forEach((agent, idx) => {
      const start = elapsed;
      const dur = agent.dur;
      const agLogs = workerData.agentLogs[idx] || [];
      const agOut = workerData.agentOutputs[idx] || '';

      addTimer(() => {
        setStates(prev => {
          const n = [...prev]; n[idx] = 'running'; return n;
        });
        if (idx > 0) {
          setConnectors(prev => {
            const n = [...prev]; n[idx - 1] = 'done'; return n;
          });
        }

        agLogs.forEach((log, li) => {
          addTimer(() => {
            const sec = Math.floor((start + (li * dur / Math.max(agLogs.length, 1))) / 1000);
            const mm = String(Math.floor(sec / 60)).padStart(2, '0');
            const ss = String(sec % 60).padStart(2, '0');
            setLogs(prev => [...prev, {
              ...log,
              time: `${mm}:${ss}`,
              id: Date.now() + li + Math.random()
            }]);
          }, li * (dur / Math.max(agLogs.length, 1)));
        });

        let mp = 0;
        const iv = setInterval(() => {
          mp = Math.min(mp + 7, 92);
          setMiniProg(prev => {
            const n = [...prev]; n[idx] = mp; return n;
          });
        }, dur / 13);

        addTimer(() => {
          clearInterval(iv);
          setStates(prev => {
            const n = [...prev]; n[idx] = 'done'; return n;
          });
          setMiniProg(prev => {
            const n = [...prev]; n[idx] = 100; return n;
          });
          setOutputs(prev => {
            const n = [...prev]; n[idx] = agOut; return n;
          });
          setProgress(Math.round(((idx + 1) / AGENT_META.length) * 100));
          if (idx < AGENT_META.length - 1) {
            setConnectors(prev => {
              const n = [...prev]; n[idx] = 'flowing'; return n;
            });
          }
          if (idx === AGENT_META.length - 1) {
            addTimer(() => onComplete && onComplete(), 600);
          }
        }, dur);
      }, start);

      elapsed += dur + 150;
    });
  }

  const logColor = {
    success: '#00C896',
    process: '#6C63FF',
    warn: '#FFB347',
    info: '#C0C0D0'
  };

  function cardStyle(state) {
    const base = {
      width: '100%', borderRadius: '11px', padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '13px',
      transition: 'all 0.4s ease', position: 'relative', overflow: 'hidden'
    };
    if (state === 'locked') return { ...base, background: '#0E0E18', border: '1px solid #1A1A2E', opacity: 0.4 };
    if (state === 'running') return { ...base, background: 'rgba(108,99,255,0.06)', border: '2px solid #6C63FF', boxShadow: '0 0 22px rgba(108,99,255,0.18)', opacity: 1 };
    return { ...base, background: 'rgba(0,200,150,0.03)', border: '1px solid rgba(0,200,150,0.35)', boxShadow: '0 0 12px rgba(0,200,150,0.08)', opacity: 1 };
  }

  function numStyle(state) {
    const base = { width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0, transition: 'all 0.4s' };
    if (state === 'locked') return { ...base, background: '#1A1A2E', color: '#333' };
    if (state === 'running') return { ...base, background: '#6C63FF', color: '#fff', boxShadow: '0 0 10px rgba(108,99,255,0.5)' };
    return { ...base, background: '#00C896', color: '#fff', boxShadow: '0 0 8px rgba(0,200,150,0.4)' };
  }

  function badgeStyle(state) {
    const base = { padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, flexShrink: 0, letterSpacing: '0.3px' };
    if (state === 'locked') return { ...base, background: '#1A1A2E', color: '#333', border: '1px solid #222' };
    if (state === 'running') return { ...base, background: 'rgba(108,99,255,0.15)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.3)' };
    return { ...base, background: 'rgba(0,200,150,0.12)', color: '#00C896', border: '1px solid rgba(0,200,150,0.25)' };
  }

  function connectorStyle(state) {
    const base = { width: '2px', height: '16px', borderRadius: '1px', position: 'relative', overflow: 'hidden', transition: 'background 0.5s' };
    if (state === 'done') return { ...base, background: 'rgba(0,200,150,0.3)' };
    return { ...base, background: '#1A1A2E' };
  }

  return (
    <div style={{ width: '100%', marginBottom: '32px' }}>
      <style>{`
        @keyframes runPulse {
          0%,100%{ box-shadow:0 0 16px rgba(108,99,255,0.18) }
          50%{ box-shadow:0 0 30px rgba(108,99,255,0.35) }
        }
        @keyframes flowDown {
          from{ top:-100% } to{ top:100% }
        }
        .flowing-line::after {
          content:'';
          position:absolute;
          top:-100%; left:0;
          width:100%; height:100%;
          background:linear-gradient(180deg,transparent 0%,#6C63FF 40%,#00C896 60%,transparent 100%);
          animation:flowDown 0.8s linear infinite;
        }
        .running-card {
          animation: runPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
            CREDIS Agent Pipeline
          </span>
          <span style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
            background: 'rgba(108,99,255,0.1)', color: '#6C63FF',
            border: '1px solid rgba(108,99,255,0.25)'
          }}>{workerData.name}</span>
          <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 700, color: '#00C896' }}>
            {progress}%
          </span>
        </div>
        <div style={{ width: '100%', height: '3px', background: '#1A1A2E', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg,#6C63FF,#00C896)',
            borderRadius: '2px',
            width: `${progress}%`,
            transition: 'width 0.6s ease'
          }} />
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '16px', alignItems: 'start' }}>

        {/* AGENTS */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {AGENT_META.map((agent, idx) => (
            <div key={agent.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={cardStyle(states[idx])}
                className={states[idx] === 'running' ? 'running-card' : ''}
              >
                <div style={numStyle(states[idx])}>
                  {states[idx] === 'done' ? '✓' : agent.id}
                </div>

                <span style={{ fontSize: '18px', flexShrink: 0 }}>{agent.icon}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                    {agent.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#444455' }}>
                    {agent.desc}
                  </div>
                  {states[idx] === 'running' && (
                    <div style={{ marginTop: '7px', width: '100%', height: '2px', background: 'rgba(108,99,255,0.15)', borderRadius: '1px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#6C63FF', borderRadius: '1px', width: `${miniProg[idx]}%`, transition: 'width 0.4s ease' }} />
                    </div>
                  )}
                  {states[idx] === 'done' && outputs[idx] && (
                    <div style={{ marginTop: '5px', fontSize: '10px', color: '#00C896' }}>
                      {outputs[idx]}
                    </div>
                  )}
                </div>

                <div style={badgeStyle(states[idx])}>
                  {states[idx] === 'locked' && 'Waiting'}
                  {states[idx] === 'running' && 'Processing'}
                  {states[idx] === 'done' && 'Done'}
                </div>
              </div>

              {idx < AGENT_META.length - 1 && (
                <div
                  style={connectorStyle(connectors[idx])}
                  className={connectors[idx] === 'flowing' ? 'flowing-line' : ''}
                />
              )}
            </div>
          ))}
        </div>

        {/* LOG PANEL */}
        <div ref={logRef} style={{
          background: '#060608',
          border: '1px solid #1A1A2E',
          borderRadius: '12px',
          padding: '14px',
          height: '560px',
          overflowY: 'auto',
          fontFamily: "'Courier New', monospace",
          fontSize: '13px',
          lineHeight: '1.6',
          position: 'sticky',
          top: '16px'
        }}>
          <div style={{
            fontSize: '12px', fontWeight: 600, color: '#6C63FF',
            marginBottom: '10px', paddingBottom: '8px',
            borderBottom: '1px solid #1A1A2E',
            fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px'
          }}>
            Live Processing Log
          </div>

          {logs.length === 0 && (
            <div style={{ color: '#222233', fontSize: '11px' }}>
              Starting pipeline...
            </div>
          )}

          {logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '7px', marginBottom: '5px', lineHeight: 1.45 }}>
              <span style={{ color: '#222233', flexShrink: 0, fontSize: '10px', marginTop: '1px' }}>
                [{log.time}]
              </span>
              <span style={{ color: logColor[log.t] || '#B0B0C0' }}>
                {log.m}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}