import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const nav = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.4 + 0.1,
      c: Math.random() > 0.5 ? '#6C63FF' : '#00C896'
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', overflow: 'hidden', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(108,99,255,0.1)'
      }}>
        <div style={{
          fontSize: '22px', fontWeight: 800,
          background: 'linear-gradient(135deg,#6C63FF,#00C896)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>💳 CREDIS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
            background: 'rgba(108,99,255,0.1)', color: '#6C63FF',
            border: '1px solid rgba(108,99,255,0.25)'
          }}>Powered by ASI-1</span>
          <button onClick={() => nav('/login')} style={{
            padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            background: 'linear-gradient(135deg,#6C63FF,#4A42D4)',
            color: '#fff', border: 'none', cursor: 'pointer'
          }}>Login</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', minHeight: '100vh',
        padding: '100px 24px 40px'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
          background: 'rgba(255,179,71,0.1)', color: '#FFB347',
          border: '1px solid rgba(255,179,71,0.25)', marginBottom: '28px'
        }}>🏆 API Innovate 2026 — Fetch.ai</div>

        <h1 style={{
          fontSize: 'clamp(36px,6vw,70px)', fontWeight: 900,
          lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px'
        }}>
          <span style={{
            background: 'linear-gradient(135deg,#6C63FF,#00C896)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Credit Intelligence</span>
          <br />for India's Invisible Workforce
        </h1>

        <p style={{
          fontSize: '18px', color: '#A0A0B0', maxWidth: '560px',
          lineHeight: 1.65, marginBottom: '36px'
        }}>
          450M+ gig workers earn real money. Banks reject them —
          no salary slip, no ITR. CREDIS scores them on behavioral data.
        </p>

        <div style={{ display: 'flex', gap: '14px', marginBottom: '64px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => nav('/login')} style={{
            padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
            background: 'linear-gradient(135deg,#6C63FF,#4A42D4)', color: '#fff',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(108,99,255,0.35)'
          }}>See Live Demo →</button>
          <button onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })} style={{
            padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600,
            background: 'transparent', color: '#A0A0B0',
            border: '1px solid rgba(108,99,255,0.25)', cursor: 'pointer'
          }}>How it Works ↓</button>
        </div>

        {/* STATS */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: '16px', maxWidth: '860px', width: '100%', marginBottom: '80px'
        }}>
          {[
            { num: '450M+', label: 'Gig Workers in India' },
            { num: '6', label: 'ASI-1 Powered Agents' },
            { num: '98.8', label: 'Highest CREDIS Score' },
            { num: '1 Day', label: 'Loan Approval Time' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(108,99,255,0.15)',
              borderRadius: '14px', padding: '20px 16px', textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px', fontWeight: 800,
                background: 'linear-gradient(135deg,#6C63FF,#00C896)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: '#555566', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <div style={{ position: 'relative', zIndex: 1, padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px',
          background: 'linear-gradient(135deg,#6C63FF,#00C896)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>The Problem We Solve</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {[
            { icon: '👻', title: 'The Ghost Economy', text: 'Ravi Kumar delivers 4,200 orders/year. Earns Rs.30,000/month. Pays rent on time. Has savings. Banks still say NO — no salary slip.' },
            { icon: '🧠', title: 'The CREDIS Solution', text: '6 autonomous ASI-1 agents analyze behavioral signals — UPI transactions, platform earnings, savings patterns. Score generated in 60 seconds.' },
            { icon: '🎯', title: 'The Impact', text: 'Same-day loan approval. No documents. Built on ReBIT Account Aggregator — RBI regulated, bank-grade security.' },
          ].map(c => (
            <div key={c.title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(108,99,255,0.12)',
              borderRadius: '16px', padding: '28px'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{c.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{c.title}</div>
              <div style={{ fontSize: '14px', color: '#777788', lineHeight: 1.65 }}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ position: 'relative', zIndex: 1, padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px',
          background: 'linear-gradient(135deg,#6C63FF,#00C896)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>How CREDIS Works</div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { name: 'DataWeaver', desc: 'Collects behavioral data via Account Aggregator' },
            { name: 'PatternMind', desc: 'Finds 12-month income and spending patterns' },
            { name: 'IdentityForge', desc: 'Calculates CREDIS Score 0–100' },
            { name: 'RiskGuard', desc: 'Classifies risk band and loan decision' },
            { name: 'OpportunityScout', desc: 'Matches best government and private lenders' },
            { name: 'GrowthCoach', desc: 'Generates personalized 12-month financial roadmap' },
          ].map((a, i) => (
            <div key={a.name} style={{
              display: 'flex', gap: '20px', alignItems: 'flex-start',
              padding: '20px 0', borderBottom: '1px solid #1E1E2E'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#6C63FF,#4A42D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700, color: '#fff'
              }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{a.name}</div>
                <div style={{ fontSize: '13px', color: '#666677' }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(0,200,150,0.12))',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '20px', padding: '48px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            Ready to See CREDIS in Action?
          </div>
          <div style={{ fontSize: '15px', color: '#666677', marginBottom: '28px' }}>
            Built on ReBIT Account Aggregator · Powered by Fetch.ai ASI-1
          </div>
          <button onClick={() => nav('/login')} style={{
            padding: '16px 40px', borderRadius: '10px', fontSize: '16px', fontWeight: 700,
            background: 'linear-gradient(135deg,#6C63FF,#4A42D4)', color: '#fff',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(108,99,255,0.35)'
          }}>Run Live Demo →</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        padding: '40px', color: '#333344', fontSize: '13px',
        borderTop: '1px solid #1E1E2E'
      }}>
        CREDIS — Behavioral Credit Intelligence · API Innovate 2026 · Fetch.ai ASI-1
      </div>
    </div>
  );
}