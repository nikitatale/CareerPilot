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





function useDebounce(value, delay = 800) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}


async function patchSettings(endpoint, body, token) {
  const res = await fetch(`${BASE_URL}/api/settings/${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data;
}


function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`toggle-track ${checked ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`}
    >
      <span className="toggle-thumb" />
    </button>
  );
}


function SettingRow({ icon, label, description, children, saving }) {
  return (
    <div className={`setting-row ${saving ? 'saving' : ''}`}>
      <div className="row-left">
        <span className="row-icon">{icon}</span>
        <div className="row-text">
          <span className="row-label">{label}</span>
          {description && <span className="row-desc">{description}</span>}
        </div>
      </div>
      <div className="row-right">
        {saving && <span className="saving-dot" />}
        {children}
      </div>
    </div>
  );
}


function Section({ title, subtitle, children }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-sub">{subtitle}</p>}
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}


function VisibilityPicker({ value, onChange }) {
  const options = [
    { id: 'public',      label: 'Everyone ',         desc: 'Visible to all CareerPilot users' },
    { id: 'connections', label: 'Connections only',  desc: ' people you are connected with' },
    { id: 'recruiters',  label: 'Recruiters only',   desc: ' verified recruiters can view' },
  ];
  return (
    <div className="vis-options">
      {options.map(opt => (
        <label key={opt.id} className={`vis-option ${value === opt.id ? 'selected' : ''}`}>
          <input
            type="radio"
            name="visibility"
            value={opt.id}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
          <span className="vis-radio" />
          <div>
            <span className="vis-label">{opt.label}</span>
            <span className="vis-desc">{opt.desc}</span>
          </div>
        </label>
      ))}
    </div>
  );
}


const NOTIF_EVENTS = [
  { key: 'connectionRequests', label: 'Connection requests', icon: <HiUserAdd style={{ color: "limegreen", fontSize: "15px" }} />  },
  { key: 'connectionAccepted', label: 'Connection accepted', icon: <HiCheckCircle style={{ color: "limegreen", fontSize: "15px" }} />},
  { key: 'jobAlerts',          label: 'Job alerts', icon: <HiBriefcase style={{ color: "limegreen", fontSize: "15px" }} />},
  { key: 'profileViews',       label: 'Profile views', icon: <HiEye style={{ color: "limegreen", fontSize: "15px" }} />},
  { key: 'postLikes',          label: 'Post likes', icon: <HiHeart style={{ color: "limegreen", fontSize: "15px" }} />},
  { key: 'postComments',       label: 'Post comments', icon: <HiChatAlt2 style={{ color: "limegreen", fontSize: "15px" }} />},
  { key: 'messages',           label: 'Messages', icon: <HiMail style={{ color: "limegreen", fontSize: "15px" }} />},
  { key: 'systemUpdates',      label: 'System updates', icon: <HiBell style={{ color: "limegreen", fontSize: "15px" }} />},
];

function NotifGrid({ prefs, onChange }) {
  return (
    <div className="notif-grid">
      <div className="notif-header-row">
        <span />
        <span className="notif-col-label">Email</span>
        <span className="notif-col-label">In-app</span>
      </div>
      {NOTIF_EVENTS.map(ev => (
        <div key={ev.key} className="notif-row">
          <span className="notif-event-label flex gap-2">
            <span className="notif-event-icon ">{ev.icon}</span>
            {ev.label}
          </span>
          <Toggle
            checked={prefs.email?.[ev.key] ?? true}
            onChange={val => onChange('email', ev.key, val)}
          />
          <Toggle
            checked={prefs.inApp?.[ev.key] ?? true}
            onChange={val => onChange('inApp', ev.key, val)}
          />
        </div>
      ))}
    </div>
  );
}


function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === 'success'
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      }
      {message}
    </div>
  );
}


export default function SettingsPage() {
const { user } = useSelector((state) => state.auth);
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const currentUser = user?.userId;


  const [loading, setLoading]   = useState(true);
  const [toast,   setToast]     = useState({ message: '', type: 'success' });
  const [saving,  setSaving]    = useState({});

 
  const [visibility,    setVisibility]    = useState('public');
  const [browseMode,    setBrowseMode]    = useState(false);
  const [openToWork,    setOpenToWork]    = useState(false);
  const [otwVis,        setOtwVis]        = useState('recruiters');
  const [notifPrefs,    setNotifPrefs]    = useState({ email: {}, inApp: {} });


  const [name,     setName]     = useState('');
  const [headline, setHeadline] = useState('');
  const [email,    setEmail]    = useState('');
  const [acctMsg,  setAcctMsg]  = useState('');

 
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  }, []);

 
  const markSaving = (key) => setSaving(s => ({ ...s, [key]: true }));
  const markDone   = (key) => setSaving(s => ({ ...s, [key]: false }));

  
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${BASE_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const s = data.settings || {};
        setVisibility(s.profileVisibility || 'public');
        setBrowseMode(s.browseMode        || false);
        setOpenToWork(s.isOpenToWork      || false);
        setOtwVis(s.openToWorkVisibility  || 'recruiters');
        setNotifPrefs({
          email: s.notifications?.email || {},
          inApp: s.notifications?.inApp || {},
        });
       setName(user?.userId?.name || '');
       setHeadline(user?.userId?.headline || '');
      setEmail(user?.userId?.email || '');
      } catch (err) {
        showToast(err.message || 'Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user, showToast]);


  const saveVisibility = async (val) => {
    markSaving('visibility');
    try {
      await patchSettings('visibility', { profileVisibility: val }, token);
      showToast('Visibility updated');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      markDone('visibility');
    }
  };

 
  const saveBrowseMode = async (val) => {
    markSaving('browseMode');
    try {
      await patchSettings('visibility', { browseMode: val }, token);
      showToast(val ? 'Private browsing on' : 'Private browsing off');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      markDone('browseMode');
    }
  };


  const saveOpenToWork = async (val, visibilityVal) => {
    markSaving('openToWork');
    try {
      await patchSettings('open-to-work ', {
        isOpenToWork: val,
        openToWorkVisibility: visibilityVal || otwVis,
      }, token);
      showToast(val ? "You are now open to work 🎉" : 'Open to work turned off');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      markDone('openToWork');
    }
  };


  const saveNotifPref = async (channel, event, val) => {
    const key = `notif_${channel}_${event}`;
    markSaving(key);
    try {
      await patchSettings('notifications', { [channel]: { [event]: val } }, token);
    } catch (err) {
      showToast(err.message, 'error');
     
      setNotifPrefs(p => ({
        ...p,
        [channel]: { ...p[channel], [event]: !val },
      }));
    } finally {
      markDone(key);
    }
  };

  const handleNotifChange = (channel, event, val) => {
  
    setNotifPrefs(p => ({
      ...p,
      [channel]: { ...p[channel], [event]: val },
    }));
    saveNotifPref(channel, event, val);
  };

 
  const saveAccount = async (e) => {
    e.preventDefault();
    markSaving('account');
    setAcctMsg('');
    try {
      await patchSettings('account', { name, headline, email }, token);
      showToast('Account updated');
      setAcctMsg('Saved');
    } catch (err) {
      showToast(err.message, 'error');
      setAcctMsg(err.message);
    } finally {
      markDone('account');
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <style>{styles}</style>
        <div className="loading-wrap">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-section pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
      <style>{styles}</style>
      <div className="settings-page">

        <Toast message={toast.message} type={toast.type} />

   
        <div className="page-header">
          <h1 className="page-title text-center">Settings</h1>
          <p className="page-sub text-center">Manage your privacy, preferences and account</p>
        </div>

        <div className="settings-layout">

    
          <nav className="sidebar">
            {[
              { href: '#privacy',       label: 'Privacy', icon: <FiLock style={{ color: "limegreen", fontSize: "15px" }} /> },
              { href: '#open-to-work',  label: 'Open to work', icon: <BsCircleFill style={{ color: "limegreen", fontSize: "10px" }} />},
              { href: '#notifications', label: 'Notifications', icon: <IoNotificationsOutline style={{ color: "limegreen", fontSize: "15px" }} />},
              { href: '#account',       label: 'Account', icon: <FiUser style={{ color: "limegreen", fontSize: "15px" }} />},
            ].map(item => (
              <a key={item.href} href={item.href} className="sidebar-link">
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

         
          <main className="settings-main">

          
            <div id="privacy">
              <Section
                title="Privacy"
                subtitle="Control who can see your profile and how you appear to others"
              >
                <div className="vis-section">
                  <p className="vis-heading">Who can see your profile?</p>
                  <VisibilityPicker
                    value={visibility}
                    onChange={(val) => {
                      setVisibility(val);
                      saveVisibility(val);
                    }}
                  />
                </div>

                <div className="divider" />

                <SettingRow
                
                  label="Private browse mode "
                  description="Browse profiles without appearing in their 'who viewed your profile' list"
                  saving={saving.browseMode}
                >
                  <Toggle
                    checked={browseMode}
                    onChange={(val) => {
                      setBrowseMode(val);
                      saveBrowseMode(val);
                    }}
                    disabled={saving.browseMode}
                  />
                </SettingRow>
              </Section>
            </div>

      
            <div id="open-to-work">
              <Section
                title="Open to work"
                subtitle="Let recruiters and your network know you're looking for opportunities"
              >
                <SettingRow
                  icon= {<BsCircleFill style={{ color: "limegreen", fontSize: "15px" }} />}
                  label="Open to work"
                  description={openToWork ? " Your profile shows an open-to-work signal" : " Hidden — you are not showing as open to work"}
                  saving={saving.openToWork}
                >
                  <Toggle
                    checked={openToWork}
                    onChange={(val) => {
                      setOpenToWork(val);
                      saveOpenToWork(val);
                    }}
                    disabled={saving.openToWork}
                  />
                </SettingRow>

                {openToWork && (
                  <div className="otw-details">
                    <div className="divider" />
                    <p className="otw-vis-label">Who can see your open-to-work status?</p>
                    <div className="otw-vis-options">
                      {[
                        { id: 'recruiters', label: 'Recruiters only ', desc: 'Less visible, more privacy' },
                        { id: 'everyone',   label: 'Everyone ',         desc: 'More visible, faster response' },
                      ].map(opt => (
                        <label key={opt.id} className={`otw-option ${otwVis === opt.id ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="otwVis"
                            value={opt.id}
                            checked={otwVis === opt.id}
                            onChange={() => {
                              setOtwVis(opt.id);
                              saveOpenToWork(true, opt.id);
                            }}
                            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                          />
                          <span className="otw-radio" />
                          <div>
                            <span className="otw-option-label">{opt.label}</span>
                            <span className="otw-option-desc">{opt.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            </div>

            
            <div id="notifications">
              <Section
                title="Notifications"
                subtitle="Choose which updates you receive and how"
              >
                <NotifGrid
                  prefs={notifPrefs}
                  onChange={handleNotifChange}
                />
              </Section>
            </div>

         
            <div id="account">
              <Section
                title="Account"
                subtitle="Update your name, headline, and email address"
              >
                <form className="account-form" onSubmit={saveAccount}>
                  <div className="field-group">
                    <label className="field-label">Full name</label> &nbsp;
                    <input
                      className="field-input"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Headline</label>  &nbsp;
                    <input
                      className="field-input"
                      type="text"
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      placeholder="e.g. Full Stack Developer at Startup"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Email</label>  &nbsp;
                    <input
                      className="field-input"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="account-footer">
                    {acctMsg && (
                      <span className={`acct-msg ${acctMsg === 'Saved' ? 'ok' : 'err'}`}>
                        {acctMsg}
                      </span>
                    )}
                    <button
                      type="submit"
                      className="save-acct-btn"
                      disabled={saving.account}
                    >
                      {saving.account ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </form>

                <div className="divider" />

               
                <div className="danger-zone">
                  <div className="danger-text">
                    <span className="danger-label">Deactivate Account</span>  &nbsp;
                    <span className="danger-desc">Your profile will be hidden. You can reactivate by logging in again.</span>
                  </div>
                  <button
                    className="deactivate-btn cursor-pointer"
                    onClick={async () => {
                      if (!confirm('Are you sure you want to deactivate your account?')) return;
                      try {
                        await patchSettings('deactivate', {}, token);
                        showToast('Account deactivated');
                      } catch (err) {
                        showToast(err.message, 'error');
                      }
                    }}
                  >
                    Deactivate
                  </button>
                </div>
              </Section>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}

const styles = `
.settings-page {
min-height: 100vh;
background: #080612;
color: #e2d9f3;
}

.page-header {
background: rgba(255,255,255,0.012);
padding: 40px 48px 36px;
border-bottom: 1px solid rgba(255,255,255,0.05);
}
.page-title {
font-family: 'Syne', sans-serif;
font-size: 28px;
margin-top: 57px;
font-weight: 700;
color: #e2d9f3;
margin-bottom: 4px;
}
.page-sub {
font-size: 14px;
color: #6b7280;
}

.settings-layout {
display: grid;
grid-template-columns: 220px 1fr;
max-width: 1100px;
margin: 0 auto;
padding: 40px 24px;
gap: 28px;
}

.sidebar {
display: flex;
flex-direction: column;
gap: 6px;
position: sticky;
top: 20px;
height: fit-content;
}

.sidebar-link {
display: flex;
align-items: center;
gap: 10px;
padding: 10px 14px;
border-radius: 10px;
font-size: 14px;
color: #6b7280;
text-decoration: none;
transition: all 0.15s ease;
}
.sidebar-link:hover {
background: rgba(255,255,255,0.04);
color: #a78bfa;
}

.settings-main {
display: flex;
flex-direction: column;
gap: 20px;
}

.section-card {
background: rgba(255,255,255,0.018);
border: 1px solid rgba(255,255,255,0.06);
border-radius: 16px;
overflow: hidden;
}

.section-header {
padding: 20px 22px 16px;
border-bottom: 1px solid rgba(255,255,255,0.05);
}
.section-title {
font-size: 16px;
font-weight: 700;
color: #e2d9f3;
}
.section-sub {
font-size: 13px;
color: #9ca3af;
}

.section-body {
padding: 6px 0;
}

.setting-row {
display: flex;
justify-content: space-between;
align-items: center;
padding: 14px 22px;
gap: 14px;
transition: background 0.15s;
}
.setting-row:hover {
background: rgba(255,255,255,0.04);
}

.row-left {
display: flex;
align-items: center;
gap: 12px;
}
.row-label {
color: #e2d9f3;
font-size: 14px;
}
.row-desc {
color: #9ca3af;
font-size: 12px;
}

.row-right {
display: flex;
align-items: center;
gap: 8px;
}

.saving-dot {
width: 6px;
height: 6px;
border-radius: 50%;
background: #7c3aed;
animation: blink 0.8s infinite;
}
@keyframes blink {
0%,100% { opacity:1 }
50% { opacity:0.3 }
}

.toggle-track {
width: 42px;
height: 22px;
border-radius: 20px;
border: none;
cursor: pointer;
position: relative;
}
.toggle-track.on {
background: #7c3aed;
}
.toggle-track.off {
background: #374151;
}
.toggle-thumb {
position: absolute;
top: 2px;
left: 3px;
width: 18px;
height: 18px;
border-radius: 50%;
background: #ffffff;
transition: transform 0.2s;
}
.toggle-track.on .toggle-thumb {
transform: translateX(18px);
}

.vis-section {
padding: 16px 22px;
}
.vis-options {
display: flex;
flex-direction: column;
gap: 8px;
}
.vis-option {
display: flex;
align-items: center;
gap: 12px;
padding: 12px 14px;
border-radius: 10px;
border: 1px solid rgba(255,255,255,0.06);
cursor: pointer;
transition: all 0.15s;
}
.vis-option:hover {
background: rgba(255,255,255,0.04);
}
.vis-option.selected {
border-color: #7c3aed;
background: rgba(124,58,237,0.15);
}
.vis-radio {
width: 16px;
height: 16px;
border-radius: 50%;
border: 2px solid #4b5563;
}
.vis-option.selected .vis-radio {
background: #7c3aed;
border-color: #7c3aed;
box-shadow: inset 0 0 0 3px #080612;
}

.otw-details {
padding: 0 22px 16px;
}
.otw-option {
display: flex;
align-items: center;
gap: 12px;
padding: 12px 14px;
border-radius: 10px;
border: 1px solid rgba(255,255,255,0.06);
cursor: pointer;
}
.otw-option.selected {
border-color: #7c3aed;
background: rgba(124,58,237,0.15);
}
.otw-radio {
width: 16px;
height: 16px;
border-radius: 50%;
border: 2px solid #4b5563;
}
.otw-option.selected .otw-radio {
background: #7c3aed;
border-color: #7c3aed;
}

.notif-grid {
padding: 8px 22px 16px;
}
.notif-header-row {
display: grid;
grid-template-columns: 1fr 60px 60px;
border-bottom: 1px solid rgba(255,255,255,0.05);
padding-bottom: 6px;
}
.notif-row {
display: grid;
grid-template-columns: 1fr 60px 60px;
align-items: center;
padding: 10px 0;
border-bottom: 1px solid rgba(255,255,255,0.04);
}
.notif-event-label {
color: #d1d5db;
font-size: 13px;
}

.account-form {
padding: 16px 22px;
display: flex;
flex-direction: column;
gap: 14px;
}
.field-label {
font-size: 12px;
color: #6b7280;
}
.field-input {
padding: 10px 14px;
border-radius: 10px;
border: 1px solid rgba(255,255,255,0.08);
background: rgba(255,255,255,0.04);
color: #e2d9f3;
}
.field-input:focus {
border-color: #7c3aed;
}
.field-input::placeholder {
color: #4b5563;
}

.account-footer {
display: flex;
justify-content: flex-end;
gap: 12px;
}

.save-acct-btn {
background: linear-gradient(135deg, #7c3aed, #a855f7);
color: white;
border: none;
border-radius: 10px;
padding: 10px 22px;
font-weight: 600;
cursor: pointer;
}
.save-acct-btn:hover {
background: linear-gradient(135deg, #6d28d9, #9333ea);
}
.save-acct-btn:disabled {
background: #374151;
}

.acct-msg.ok {
color: #4ade80;
}
.acct-msg.err {
color: #f87171;
}

.danger-zone {
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px 22px;
}
.danger-label {
color: #f87171;
}
.danger-desc {
color: #9ca3af;
}
.deactivate-btn {
border: 1px solid rgba(239,68,68,0.3);
color: #f87171;
padding: 8px 16px;
border-radius: 8px;
}
.deactivate-btn:hover {
background: rgba(239,68,68,0.1);
}

.toast {
position: fixed;
bottom: 20px;
right: 20px;
background: rgba(255,255,255,0.04);
color: #e2d9f3;
padding: 10px 16px;
border-radius: 10px;
}
.toast-success {
border: 1px solid rgba(124,58,237,0.4);
}
.toast-error {
background: rgba(239,68,68,0.1);
border: 1px solid rgba(239,68,68,0.3);
color: #f87171;
}

.loading-wrap {
max-width: 700px;
margin: 40px auto;
display: flex;
flex-direction: column;
gap: 20px;
}
.skeleton-section {
height: 180px;
border-radius: 16px;
background: rgba(255,255,255,0.05);
}
.pulse {
animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
0%,100% { opacity:1 }
50% { opacity:0.5 }
}

@media (max-width: 768px) {
.settings-layout {
grid-template-columns: 1fr;
}
}
`;
