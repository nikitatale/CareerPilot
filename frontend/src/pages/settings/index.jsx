'use client';

import Navbar from '../../components/navbar/index';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../config/index';
import { BsCircleFill } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";
import { HiCheckCircle } from "react-icons/hi";
import { HiBriefcase } from "react-icons/hi";
import { HiEye } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";
import { HiChatAlt2 } from "react-icons/hi";
import { HiMail } from "react-icons/hi";
import { HiBell } from "react-icons/hi";



async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('Non-JSON from:', url, text.slice(0, 200));
    throw new Error('Server error. Make sure backend is running and routes are registered.');
  }
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function patchSettings(endpoint, body, token) {
  return safeFetch(`${BASE_URL}/api/settings/${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}


function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none',
        background: checked ? '#7c3aed' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative', flexShrink: 0,
        transition: 'background 0.2s', opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'transform 0.2s',
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
      }} />
    </button>
  );
}

function SettingRow({ icon, label, description, children, saving }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 20px', gap: 14, transition: 'background 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        {icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#e2d9f3' }}>{label}</span>
          {description && <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{description}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {saving && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'blink 0.8s infinite', display: 'inline-block' }} />}
        {children}
      </div>
    </div>
  );
}

function SectionCard({ id, title, subtitle, children }) {
  return (
    <div id={id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#e2d9f3', margin: '0 0 3px' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

const Divider = () => <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 20px' }} />;

function VisibilityPicker({ value, onChange }) {
  const options = [
    { id: 'public',      label: 'Everyone',        desc: 'Visible to all CareerPilot users' },
    { id: 'connections', label: 'Connections only', desc: 'Only people you are connected with' },
    { id: 'recruiters',  label: 'Recruiters only',  desc: 'Only verified recruiters can view' },
  ];
  return (
    <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Who can see your profile?
      </p>
      {options.map(opt => (
        <label key={opt.id} onClick={() => onChange(opt.id)} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
          border: `1px solid ${value === opt.id ? '#7c3aed' : 'rgba(255,255,255,0.07)'}`,
          background: value === opt.id ? 'rgba(124,58,237,0.12)' : 'transparent',
          transition: 'all 0.15s',
        }}>
          <span style={{
            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
            border: `2px solid ${value === opt.id ? '#7c3aed' : '#4b5563'}`,
            background: value === opt.id ? '#7c3aed' : 'transparent',
            boxShadow: value === opt.id ? 'inset 0 0 0 3px #080612' : 'none',
            transition: 'all 0.15s',
          }} />
          <div>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#e2d9f3', display: 'block' }}>{opt.label}</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{opt.desc}</span>
          </div>
        </label>
      ))}
    </div>
  );
}

const NOTIF_EVENTS = [
  { key: 'connectionRequests', label: 'Connection requests', emoji: <HiUserAdd style={{ color: "limegreen", fontSize: "15px" }} /> },
  { key: 'connectionAccepted', label: 'Connection accepted', emoji: <HiCheckCircle style={{ color: "limegreen", fontSize: "15px" }} /> },
  { key: 'jobAlerts',          label: 'Job alerts',          emoji: <HiBriefcase style={{ color: "limegreen", fontSize: "15px" }} />  },
  { key: 'profileViews',       label: 'Profile views',       emoji: <HiEye style={{ color: "limegreen", fontSize: "15px" }} /> },
  { key: 'postLikes',          label: 'Post likes',          emoji: <HiHeart style={{ color: "limegreen", fontSize: "15px" }} /> },
  { key: 'postComments',       label: 'Post comments',       emoji: <HiChatAlt2 style={{ color: "limegreen", fontSize: "15px" }} /> },
  { key: 'messages',           label: 'Messages',            emoji: <HiMail style={{ color: "limegreen", fontSize: "15px" }} /> },
  { key: 'systemUpdates',      label: 'System updates',      emoji:   <HiBell style={{ color: "limegreen", fontSize: "15px" }} />},
];

function NotifGrid({ prefs, onChange }) {
  return (
    <div style={{ padding: '8px 20px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 56px', padding: '0 0 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
        <span />
        <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Email</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>In-app</span>
      </div>
      {NOTIF_EVENTS.map((ev, i) => (
        <div key={ev.key} style={{
          display: 'grid', gridTemplateColumns: '1fr 56px 56px',
          alignItems: 'center', padding: '10px 0',
          borderBottom: i < NOTIF_EVENTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#d1d5db', fontWeight: 500 }}>
            <span style={{ fontSize: 14 }}>{ev.emoji}</span>{ev.label}
          </span>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Toggle checked={prefs.email?.[ev.key] ?? true} onChange={val => onChange('email', ev.key, val)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Toggle checked={prefs.inApp?.[ev.key] ?? true} onChange={val => onChange('inApp', ev.key, val)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
      zIndex: 9999,
      background: type === 'success' ? 'rgba(124,58,237,0.9)' : 'rgba(239,68,68,0.15)',
      border: type === 'success' ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(239,68,68,0.3)',
      color: type === 'success' ? '#fff' : '#f87171',
      animation: 'slideUp 0.25s ease',
    }}>
      {type === 'success' ? '✓' : '!'} {message}
    </div>
  );
}


export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);

 
  const [token, setToken] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState({ message: '', type: 'success' });
  const [saving,     setSaving]     = useState({});
  const [visibility, setVisibility] = useState('public');
  const [browseMode, setBrowseMode] = useState(false);
  const [openToWork, setOpenToWork] = useState(false);
  const [otwVis,     setOtwVis]     = useState('recruiters');
  const [notifPrefs, setNotifPrefs] = useState({ email: {}, inApp: {} });
  const [name,       setName]       = useState('');
  const [headline,   setHeadline]   = useState('');
  const [email,      setEmail]      = useState('');
  const [acctMsg,    setAcctMsg]    = useState('');
  const [activeNav,  setActiveNav]  = useState('privacy');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  }, []);

  const markSaving = (key) => setSaving(s => ({ ...s, [key]: true }));
  const markDone   = (key) => setSaving(s => ({ ...s, [key]: false }));


  useEffect(() => {
  
    if (token === null) return;

   
    if (!token) {
      setLoading(false);
      showToast('Please log in to view settings', 'error');
      return;
    }

    (async () => {
      try {
        const data = await safeFetch(`${BASE_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const s = data.settings || {};
        setVisibility(s.profileVisibility  || 'public');
        setBrowseMode(s.browseMode         || false);
        setOpenToWork(s.isOpenToWork       || false);
        setOtwVis(s.openToWorkVisibility   || 'recruiters');
        setNotifPrefs({
          email: s.notifications?.email || {},
          inApp: s.notifications?.inApp || {},
        });
        setName(user?.userId?.name         || '');
        setHeadline(user?.userId?.headline || '');
        setEmail(user?.userId?.email       || '');
      } catch (err) {
        showToast(err.message || 'Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user, showToast]); 

  const saveVisibility = async (val) => {
    markSaving('visibility');
    try { await patchSettings('visibility', { profileVisibility: val }, token); showToast('Visibility updated'); }
    catch (err) { showToast(err.message, 'error'); }
    finally { markDone('visibility'); }
  };

  const saveBrowseMode = async (val) => {
    markSaving('browseMode');
    try { await patchSettings('visibility', { browseMode: val }, token); showToast(val ? 'Private browsing on' : 'Private browsing off'); }
    catch (err) { showToast(err.message, 'error'); }
    finally { markDone('browseMode'); }
  };

  const saveOpenToWork = async (val, visVal) => {
    markSaving('openToWork');
    try {
      await patchSettings('open-to-work', { isOpenToWork: val, openToWorkVisibility: visVal || otwVis }, token);
      showToast(val ? 'You are now open to work 🎉' : 'Open to work turned off');
    }
    catch (err) { showToast(err.message, 'error'); }
    finally { markDone('openToWork'); }
  };

  const saveNotifPref = async (channel, event, val) => {
    const key = `notif_${channel}_${event}`;
    markSaving(key);
    try { await patchSettings('notifications', { [channel]: { [event]: val } }, token); }
    catch (err) {
      showToast(err.message, 'error');
      setNotifPrefs(p => ({ ...p, [channel]: { ...p[channel], [event]: !val } }));
    }
    finally { markDone(key); }
  };

  const handleNotifChange = (channel, event, val) => {
    setNotifPrefs(p => ({ ...p, [channel]: { ...p[channel], [event]: val } }));
    saveNotifPref(channel, event, val);
  };

  const saveAccount = async (e) => {
    e.preventDefault();
    markSaving('account'); setAcctMsg('');
    try { await patchSettings('account', { name, headline, email }, token); showToast('Account updated'); setAcctMsg('Saved'); }
    catch (err) { showToast(err.message, 'error'); setAcctMsg(err.message); }
    finally { markDone('account'); }
  };

  const NAV_ITEMS = [
    { id: 'privacy',       label: 'Privacy',       emoji:<FiLock style={{ color: "limegreen", fontSize: "15px" }} /> },
    { id: 'open-to-work',  label: 'Open to work',  emoji: <BsCircleFill style={{ color: "limegreen", fontSize: "10px" }} />},
    { id: 'notifications', label: 'Notifications', emoji: <IoNotificationsOutline style={{ color: "limegreen", fontSize: "15px" }} /> },
    { id: 'account',       label: 'Account',       emoji: <FiUser style={{ color: "limegreen", fontSize: "15px" }} /> },
  ];

  
  if (loading) {
    return (
      <>
        <Navbar />
        <style>{baseStyles}</style>
        <div style={{ minHeight: '100vh', background: '#080612', paddingTop: 80 }}>
          <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[200, 160, 320, 260].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: 16, background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.4s ease-in-out infinite', animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{baseStyles}</style>
      <Navbar />
      <Toast message={toast.message} type={toast.type} />

      <div style={{ minHeight: '100vh', background: '#080612', color: '#e2d9f3', fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>

        <div style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2d9f3', margin: '0 0 6px' }}>Settings</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Manage your privacy, preferences and account</p>
        </div>

        
        <div className="mobile-nav">
          {NAV_ITEMS.map(item => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setActiveNav(item.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, padding: '10px 8px', textDecoration: 'none',
              fontSize: 11, fontWeight: 500,
              color: activeNav === item.id ? '#a78bfa' : '#6b7280',
              borderBottom: activeNav === item.id ? '2px solid #7c3aed' : '2px solid transparent',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: 16 }}>{item.emoji}</span>
              {item.label}
            </a>
          ))}
        </div>

        <div className="settings-layout">

          
          <nav className="sidebar-nav">
            <p style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px', padding: '0 14px' }}>Menu</p>
            {NAV_ITEMS.map(item => (
              <a key={item.id} href={`#${item.id}`} onClick={() => setActiveNav(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                color: activeNav === item.id ? '#a78bfa' : '#6b7280',
                background: activeNav === item.id ? 'rgba(124,58,237,0.1)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 16 }}>{item.emoji}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <main style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

           
            <SectionCard id="privacy" title="Privacy" subtitle="Control who can see your profile and how you appear">
              <VisibilityPicker value={visibility} onChange={(val) => { setVisibility(val); saveVisibility(val); }} />
              <Divider />
              <SettingRow icon={<HiEye style={{ color: "limegreen", fontSize: "15px" }} />} label="Private browse mode" description="Browse profiles without showing in their 'who viewed' list" saving={saving.browseMode}>
                <Toggle checked={browseMode} disabled={saving.browseMode} onChange={(val) => { setBrowseMode(val); saveBrowseMode(val); }} />
              </SettingRow>
            </SectionCard>

           
            <SectionCard id="open-to-work" title="Open to work" subtitle="Let recruiters know you're looking for opportunities">
              <SettingRow icon= {<BsCircleFill style={{ color: "limegreen", fontSize: "15px" }} />}
                description={openToWork ? 'Your profile shows an open-to-work signal' : 'Hidden — not showing as open to work'}
                saving={saving.openToWork}>
                <Toggle checked={openToWork} disabled={saving.openToWork} onChange={(val) => { setOpenToWork(val); saveOpenToWork(val); }} />
              </SettingRow>
              {openToWork && (
                <>
                  <Divider />
                  <div style={{ padding: '12px 20px 16px' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Who can see this?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { id: 'recruiters', label: 'Recruiters only', desc: 'Less visible, more privacy' },
                        { id: 'everyone',   label: 'Everyone',        desc: 'More visible, faster response' },
                      ].map(opt => (
                        <label key={opt.id} onClick={() => { setOtwVis(opt.id); saveOpenToWork(true, opt.id); }} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                          border: `1px solid ${otwVis === opt.id ? '#7c3aed' : 'rgba(255,255,255,0.07)'}`,
                          background: otwVis === opt.id ? 'rgba(124,58,237,0.12)' : 'transparent',
                          transition: 'all 0.15s',
                        }}>
                          <span style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: `2px solid ${otwVis === opt.id ? '#7c3aed' : '#4b5563'}`, background: otwVis === opt.id ? '#7c3aed' : 'transparent', boxShadow: otwVis === opt.id ? 'inset 0 0 0 3px #080612' : 'none' }} />
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 500, color: '#e2d9f3', display: 'block' }}>{opt.label}</span>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>{opt.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </SectionCard>

           
            <SectionCard id="notifications" title="Notifications" subtitle="Choose which updates you receive and how">
              <NotifGrid prefs={notifPrefs} onChange={handleNotifChange} />
            </SectionCard>

         
            <SectionCard id="account" title="Account" subtitle="Update your name, headline and email">
              <form onSubmit={saveAccount} style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Full name', value: name,     setter: setName,     type: 'text',  ph: 'Your full name' },
                  { label: 'Headline',  value: headline, setter: setHeadline, type: 'text',  ph: 'e.g. Full Stack Developer' },
                  { label: 'Email',     value: email,    setter: setEmail,    type: 'email', ph: 'you@example.com' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.ph}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#e2d9f3', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#7c3aed'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                  {acctMsg && <span style={{ fontSize: 13, color: acctMsg === 'Saved' ? '#4ade80' : '#f87171' }}>{acctMsg}</span>}
                  <button type="submit" disabled={saving.account} style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: saving.account ? 'not-allowed' : 'pointer', opacity: saving.account ? 0.6 : 1, fontFamily: 'inherit' }}>
                    {saving.account ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
              <Divider />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '14px 20px' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#f87171', margin: '0 0 3px' }}>Deactivate account</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Your profile will be hidden. Reactivate by logging in again.</p>
                </div>
                <button onClick={async () => {
                  if (!confirm('Are you sure you want to deactivate your account?')) return;
                  try { await patchSettings('deactivate', {}, token); showToast('Account deactivated'); }
                  catch (err) { showToast(err.message, 'error'); }
                }} style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', background: 'transparent', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Deactivate
                </button>
              </div>
            </SectionCard>

          </main>
        </div>
      </div>
    </>
  );
}

const baseStyles = `
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slideUp { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
  * { box-sizing: border-box; }
  input, button { font-family: inherit; }
  .settings-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px 64px;
    gap: 24px;
    align-items: start;
  }
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: sticky;
    top: 80px;
  }
  .mobile-nav {
    display: none;
    overflow-x: auto;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.01);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .mobile-nav::-webkit-scrollbar { display: none; }
  @media (max-width: 680px) {
    .settings-layout { grid-template-columns: 1fr; padding: 20px 16px 48px; }
    .sidebar-nav { display: none; }
    .mobile-nav { display: flex; justify-content: space-around; }
  }
`;