"use client"

import Link from "next/link"


export default function Footer() {


  return (
     <div className="bg-[#0f1117] text-white overflow-x-hidden">
        <footer className="px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-grotesk font-semibold text-sm text-slate-500">CareerPilot</span>
        </div>
        <p className="font-outfit text-xs text-slate-600">© 2026 CareerPilot Inc. All rights reserved.</p>
        <div className="flex gap-5 font-outfit text-xs text-slate-500">
          {["Privacy","Terms","Blog","Contact"].map((l) => (
            <Link key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</Link>
          ))}
        </div>
      </footer>
     </div>
 
  )
}
