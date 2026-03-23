import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USERS } from '../data/mockData';

const DEMOS = [
  { label: 'Loan Officer', email: 'officer@nbcfdc.gov.in', pass: 'nbcfdc123' },
  { label: 'Gig Worker', email: 'ravi@credis.com', pass: 'ravi123' }
];

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [active, setActive] = useState(-1);

  function fillDemo(i) {
    setActive(i);
    setEmail(DEMOS[i].email);
    setPass(DEMOS[i].pass);
    setErr('');
  }

  function login() {
  console.log('Login attempt:', email, pass);
  setErr('');
  const user = USERS[email];
  console.log('User found:', user);
  if (!user || user.password !== pass) {
    setErr('Invalid email or password');
    return;
  }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('credis_user', JSON.stringify({
        name: user.name,
        role: user.role,
        workerAccess: user.workerAccess
      }));
      nav('/dashboard');
    }, 900);
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(108,99,255,0.2)',
        borderRadius: '20px', padding: '40px 36px', margin: '16px'
      }}>

        {/* LOGO */}
        <div style={{
          fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '6px',
          background: 'linear-gradient(135deg,#6C63FF,#00C896)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>💳 CREDIS</div>
        <div style={{
          textAlign: 'center', color: '#666677',
          fontSize: '14px', marginBottom: '32px'
        }}>Loan Officer Portal</div>

        {/* DEMO PILLS */}
        <div style={{
          fontSize: '11px', color: '#555566',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px'
        }}>Quick Demo Access</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {DEMOS.map((d, i) => (
            <div key={i} onClick={() => fillDemo(i)} style={{
              flex: 1, padding: '10px 12px', borderRadius: '10px',
              cursor: 'pointer', textAlign: 'center', fontSize: '12px',
              transition: 'all 0.2s',
              background: active === i ? 'rgba(108,99,255,0.15)' : 'rgba(108,99,255,0.06)',
              border: active === i ? '1px solid rgba(108,99,255,0.4)' : '1px solid rgba(108,99,255,0.15)',
              color: active === i ? '#6C63FF' : '#A0A0B0'
            }}>{d.label}</div>
          ))}
        </div>

        {/* ERROR */}
        {err && (
          <div style={{
            background: 'rgba(255,101,132,0.1)',
            border: '1px solid rgba(255,101,132,0.25)',
            borderRadius: '8px', padding: '10px 14px',
            fontSize: '13px', color: '#FF6584', marginBottom: '14px'
          }}>⚠ {err}</div>
        )}

        {/* EMAIL */}
        <div style={{
          fontSize: '11px', color: '#666677',
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px'
        }}>Email</div>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '9px',
            background: '#12121A', border: '1px solid #1E1E2E',
            color: '#fff', fontSize: '14px', marginBottom: '14px',
            outline: 'none'
          }}
        />

        {/* PASSWORD */}
        <div style={{
          fontSize: '11px', color: '#666677',
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px'
        }}>Password</div>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Enter password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{
              width: '100%', padding: '12px 40px 12px 14px', borderRadius: '9px',
              background: '#12121A', border: '1px solid #1E1E2E',
              color: '#fff', fontSize: '14px', outline: 'none'
            }}
          />
          <button onClick={() => setShowPass(!showPass)} style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)', background: 'none',
            border: 'none', cursor: 'pointer', fontSize: '16px'
          }}>{showPass ? '🙈' : '👁'}</button>
        </div>

        {/* LOGIN BUTTON */}
        <button onClick={login} disabled={loading} style={{
          width: '100%', padding: '13px', borderRadius: '9px',
          background: 'linear-gradient(135deg,#6C63FF,#4A42D4)',
          color: '#fff', border: 'none', fontSize: '15px',
          fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1, marginBottom: '12px',
          transition: 'all 0.3s'
        }}>
          {loading ? ' Logging in...' : ' Login to CREDIS'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#333344' }}>
          Secured by ReBIT Account Aggregator Standard
        </div>
      </div>
    </div>
  );
}