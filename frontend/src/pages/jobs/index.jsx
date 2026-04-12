'use client';

import Navbar from '../../components/navbar/index';
import { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '../../config/index';
import Image from 'next/image';


async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('Non-JSON from:', url, text.slice(0, 200));
    throw new Error('Server error. Make sure backend is running and /api/jobs/search is registered.');
  }
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const daysAgo = (iso) => {
  if (!iso) return null;
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
};

const TYPE_LABELS = {
  fulltime: 'Full-time', parttime: 'Part-time',
  contract: 'Contract', internship: 'Internship', freelance: 'Freelance',
};

const SUGGESTIONS = [
  'MERN stack developer fresher',
  'React developer 2 years remote',
  'Python backend engineer Bangalore',
  'Full stack internship Mumbai',
  'Node.js junior developer',
];

function JobCard({ job, index }) {
  const [saved, setSaved] = useState(false);
  return (
    <article style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
      opacity: 0, animation: 'cardIn 0.35s ease forwards', animationDelay: `${index * 60}ms`,
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {job.company?.logo
            ? <Image src={job.company.logo} alt={job.company.name || 'logo'} width={36} height={36} style={{ objectFit: 'contain', width: 36, height: 36 }} unoptimized />
            : <span style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa' }}>{job.company?.name?.[0] || '?'}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e2d9f3', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</h3>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{job.company?.name}</p>
        </div>
        <button onClick={() => setSaved(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? '#a78bfa' : '#4b5563', padding: 4, borderRadius: 6, flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {job.location?.displayText && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 500 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location.displayText}
          </span>
        )}
        {job.employmentType && <span style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 500 }}>{TYPE_LABELS[job.employmentType] || job.employmentType}</span>}
        {job.salary?.displayText && <span style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 600 }}>{job.salary.displayText}</span>}
      </div>
      {job.skills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {job.skills.slice(0, 5).map(skill => <span key={skill} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 9px', fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{skill}</span>)}
          {job.skills.length > 5 && <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 9px', fontSize: 12, color: '#6b7280' }}>+{job.skills.length - 5}</span>}
        </div>
      )}
      {job.description && <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{daysAgo(job.postedAt)}</span>
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Apply now
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </article>
  );
}

function SkeletonCard() {
  const sh = { background: 'rgba(255,255,255,0.06)', borderRadius: 6, animation: 'shimmer 1.4s ease-in-out infinite' };
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ ...sh, width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
          <div style={{ ...sh, height: 14, width: '65%' }} />
          <div style={{ ...sh, height: 12, width: '40%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>{[80, 72, 88].map((w, i) => <div key={i} style={{ ...sh, height: 24, width: w }} />)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ ...sh, height: 12, width: '100%' }} />
        <div style={{ ...sh, height: 12, width: '80%' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ ...sh, height: 12, width: 50 }} />
        <div style={{ ...sh, height: 34, width: 88, borderRadius: 8 }} />
      </div>
    </div>
  );
}

function FilterPill({ label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(124,58,237,0.15)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '4px 11px', fontSize: 12, fontWeight: 500 }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.7 }}><polyline points="20 6 9 17 4 12"/></svg>
      {label}
    </span>
  );
}

export default function JobsPage() {
  
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const [query,    setQuery]    = useState('');
  const [jobs,     setJobs]     = useState([]);
  const [filters,  setFilters]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;


    const t = token || localStorage.getItem('token');
    if (!t) { setError('Please log in to search jobs.'); return; }

    setQuery(q); setLoading(true); setError(null);
    setSearched(true); setJobs([]); setFilters(null);

    try {
      const data = await safeFetch(`${BASE_URL}/api/jobs/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ query: q }),
      });
      setJobs(data.jobs || []);
      setFilters(data.filters || null);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes cardIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        * { box-sizing: border-box;}
        input, button, a { font-family: inherit; }
        .search-input-el { flex:1; background:transparent; border:none; outline:none; font-size:15px; color:#e5e7eb; min-width:0; }
        .search-input-el::placeholder { color:#4b5563; }
        .search-btn-el { background:linear-gradient(135deg,#7c3aed,#a855f7); color:#fff; border:none; border-radius:10px; padding:10px 20px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap; transition:opacity 0.15s; flex-shrink:0; }
        .search-btn-el:hover { opacity:0.85; }
        .search-btn-el:disabled { background:#374151; color:#6b7280; cursor:not-allowed; }
        .chip-btn { background:none; border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:5px 14px; font-size:12px; color:#9ca3af; cursor:pointer; transition:all 0.15s; }
        .chip-btn:hover { border-color:#a78bfa; color:#a78bfa; }
        .jobs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:16px; }
        .label {margin: 30px;}
        @media(max-width:600px) {
          .jobs-grid { grid-template-columns:1fr; }
          .hero-sec { padding:72px 16px 36px !important;}
          .label {margin: 30px;}
          .results-sec { padding:16px 16px 48px !important; }
        }
      `}</style>

      <Navbar />
      <div style={{ minHeight: '100vh', background: '#080612', fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>

        <section className="hero-sec" style={{ padding: '82px 24px 44px', textAlign: 'center' }}>
          <div className='label' style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 18 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulseDot 2s ease-in-out infinite', display: 'inline-block' }} />
            AI-powered job search
          </div>
          <h1 style={{ fontSize: 'clamp(24px,5vw,44px)', fontWeight: 700, color: '#e2d9f3', letterSpacing: '-0.03em', margin: '0 0 10px', lineHeight: 1.1 }}>
            Find your next <span style={{ color: '#a78bfa' }}>opportunity</span>
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px' }}>Type naturally — our AI understands what you&apos;re looking for</p>

          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '6px 6px 6px 18px', gap: 8, transition: 'border-color 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input ref={inputRef} type="text" className="search-input-el" placeholder="e.g. MERN developer fresher remote"
                value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} autoFocus />
              <button className="search-btn-el" onClick={() => handleSearch()} disabled={loading || !query.trim()}>
                {loading ? 'Searching…' : 'Search jobs'}
              </button>
            </div>
            {!searched && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 14 }}>
                {SUGGESTIONS.map(s => <button key={s} className="chip-btn" onClick={() => handleSearch(s)}>{s}</button>)}
              </div>
            )}
          </div>
        </section>

        <div className="results-sec" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 64px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 18px', fontSize: 14, color: '#f87171', marginBottom: 24, lineHeight: 1.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {filters && !loading && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>AI found:</span>
              {filters.title           && <FilterPill label={filters.title} />}
              {filters.experienceLevel && <FilterPill label={filters.experienceLevel} />}
              {filters.isRemote        && <FilterPill label="Remote" />}
              {filters.location        && <FilterPill label={filters.location} />}
              {filters.employmentType  && <FilterPill label={TYPE_LABELS[filters.employmentType] || filters.employmentType} />}
              {filters.skills?.map(s   => <FilterPill key={s} label={s} />)}
            </div>
          )}
          {!loading && jobs.length > 0 && (
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
              Showing <strong style={{ color: '#e2d9f3' }}>{jobs.length} jobs</strong> for &quot;{query}&quot;
            </p>
          )}
          {loading && <div className="jobs-grid">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>}
          {!loading && jobs.length > 0 && (
            <div className="jobs-grid">{jobs.map((job, i) => <JobCard key={job.id || i} job={job} index={i} />)}</div>
          )}
          {!loading && searched && jobs.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '56px 24px' }}>
              <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.4 }}>🔍</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#e2d9f3', margin: '0 0 6px' }}>No jobs found</p>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Try different keywords or remove location filters</p>
            </div>
          )}
          {!searched && !loading && (
            <div style={{ textAlign: 'center', padding: '56px 24px' }}>
              <div style={{ fontSize: 32, marginBottom: 14, opacity: 0.25 }}>✦</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#e2d9f3', margin: '0 0 6px' }}>What are you looking for?</p>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Type a role, skill, location, or experience level above</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}