"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaFire, FaStar } from "react-icons/fa";
import UserLayout from "../layout/userLayout/index";
import Image from "next/image";

const stats = [
  { value: "2.4M+", label: "Professionals" },
  { value: "18K+",  label: "Companies" },
  { value: "94%",   label: "Placed" },
  { value: "48h",   label: "Response" },
];

const roles = [
  "Software Engineers",
  "Product Managers",
  "Data Scientists",
  "UX Designers",
  "Growth Leaders",
  "Finance Experts",
];

const logos = [
  "/logos/google.png",
  "/logos/ibm.png",
  "/logos/meta.png",
  "/logos/microsoft.png",
  "/logos/netflix.png",
  "/logos/social.png",
  "/logos/paypal.png",
  "/logos/airbnb.png",
  "/logos/github-sign.png",
  "/logos/hp.png",
]

const jobMatches = [
  { title: "Sr. Engineer",   company: "Stripe · Remote",    pct: "98%" },
  { title: "Product Lead",   company: "Notion · Bangalore", pct: "94%" },
  { title: "Tech Architect", company: "Google · Hyderabad", pct: "91%" },
];

export default function Home() {


  const router = useRouter();

  const [roleIndex, setRoleIndex] = useState(0);
  const [mousePos,  setMousePos]  = useState({ x: 50, y: 50 });
  const heroRef = useRef(null);


  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - r.left)  / r.width)  * 100,
        y: ((e.clientY - r.top)   / r.height) * 100,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <UserLayout>
      
    

       <div className="min-h-screen bg-[#0f1117] text-white overflow-x-hidden">

      <div ref={heroRef} className="relative min-h-screen pt-24 pb-12 px-4 md:px-12">

   
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 45% at ${mousePos.x}% ${mousePos.y}%, rgba(124,58,237,0.11) 0%, transparent 70%)`,
            transition: "background 0.5s ease",
          }}
        />

        
        <div className="absolute top-10 left-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 right-[-40px] w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(192,38,211,0.08) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center min-h-[calc(100vh-96px)]">

   
          <div>
            <div className="anim-fadeup mb-5" style={{ animationDelay: "0.1s", opacity: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-outfit tracking-wide"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 anim-blink" />
                Live in 40+ countries · 18K companies hiring
              </div>
            </div>

            <div className="anim-fadeup" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <h1 className="font-grotesk font-bold text-5xl md:text-[68px] leading-[1.06] tracking-[-2px] text-slate-100 mb-3">
                Navigate Your<br />
                <span className="anim-shimmer">Dream Career.</span>
              </h1>
            </div>

            <div className="anim-fadeup overflow-hidden h-7 mt-2 mb-5" style={{ animationDelay: "0.32s", opacity: 0 }}>
              <p className="font-outfit text-slate-500 text-[13px]">
                Built for &nbsp;
                <span key={roleIndex} className="anim-role inline-block text-violet-400 font-medium">
                  {roles[roleIndex]}
                </span>
              </p>
            </div>

            <p className="anim-fadeup font-outfit text-slate-500 text-[13px] leading-[1.8] mb-8 max-w-[360px]"
              style={{ animationDelay: "0.42s", opacity: 0 }}>
              AI-powered job matching, warm intros, and real-time market signals -
              everything you need to land your next role faster.
            </p>

            <div className="anim-fadeup flex flex-wrap gap-3 mb-9" style={{ animationDelay: "0.52s", opacity: 0 }}>
              <button onClick={() => router.push("/login")} className="btn-primary cursor-pointer font-outfit text-white px-6 py-2.5 rounded-lg font-medium text-sm">
                 Start for Free
              </button>
              <button className="btn-ghost cursor-pointer font-outfit px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                </svg>
                Watch Demo
              </button>
            </div>

            <div className="anim-fadeup grid grid-cols-2 gap-2.5 max-w-[280px]" style={{ animationDelay: "0.65s", opacity: 0 }}>
              {stats.map((s) => (
                <div key={s.label} className="stat-card rounded-[10px] p-3.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="font-grotesk font-bold text-xl text-slate-100">{s.value}</div>
                  <div className="font-outfit text-[10px] text-slate-600 mt-1 uppercase tracking-[0.4px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="anim-fadeup hidden md:flex justify-center items-center" style={{ animationDelay: "0.58s", opacity: 0 }}>
            <div className="relative w-full max-w-[300px]">

              <div className="chip absolute -top-3.5 right-2 z-10 anim-float"><FaStar className="text-yellow-400 w-5 h-5" /> 3 new matches today</div>

              <div className="mockup-card p-5">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(124,58,237,0.12) 0%, transparent 60%)" }} />

                <div className="flex items-center gap-3 mb-4 relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-grotesk font-bold text-base text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}>
                    RS
                  </div>
                  <div>
                    <div className="font-grotesk font-semibold text-slate-100 text-[13px]">Rahul Sharma</div>
                    <div className="font-outfit text-[10px] text-slate-500">Full Stack Dev · Mumbai</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-[5px] mb-4 font-outfit tracking-wide"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 anim-blink" />
                  Open to Opportunities
                </div>

                <div className="match-box mb-3">
                  <div className="font-outfit text-[10px] text-amber-400 font-medium mb-3 uppercase tracking-[0.5px]">⚡ AI Job Matches</div>
                  {jobMatches.map((job) => (
                    <div key={job.title} className="flex items-center justify-between mb-2.5 last:mb-0">
                      <div>
                        <div className="font-outfit text-[11px] text-slate-300 font-medium">{job.title}</div>
                        <div className="font-outfit text-[10px] text-slate-600">{job.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-grotesk font-bold text-[12px] text-amber-400">{job.pct}</div>
                        <div className="w-12 h-[3px] rounded-full bg-white/10 mt-1 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: job.pct, background: "linear-gradient(90deg,#f59e0b,#fbbf24)" }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["React","Node.js","AWS","System Design"].map((sk) => (
                    <span key={sk} className="tag-skill">{sk}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 anim-blink flex-shrink-0" />
                  <p className="font-outfit text-[10px] text-slate-600">
                    Viewed by <span className="text-slate-400">Figma HR</span> · 2 mins ago
                  </p>
                </div>
              </div>

              <div className="chip absolute -bottom-3.5 -left-3 z-10 anim-float2"> <FaFire className="text-red-500 w-5 h-5" /> Profile 3x more visible</div>
            </div>
          </div>

        </div>
      </div>

    </div>
    
    </UserLayout> 
  );
}