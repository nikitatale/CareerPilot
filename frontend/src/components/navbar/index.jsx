"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from "next/router"
import { useSelector, useDispatch } from 'react-redux';
import { reset } from '../../config/redux/reducer/authReducer/index'; 
import Image from 'next/image';
import { getMyConnectionRequest } from '../../config/redux/action/authAction';
import { BASE_URL } from '../../config/index';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const incomingRequests = useSelector((state) => state.auth.incomingRequests);

  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const authState = useSelector((state) => state.auth);
  const isLoggedIn = authState.profileFetched;
  const userName = authState.user?.userId?.name;
  const userPic = authState.user?.userId?.profilePicture;

  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    setDropdownOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getMyConnectionRequest({ token }));
    }
  }, [dispatch]);

  const requestCount = incomingRequests?.length || 0;
  const username = authState.user?.userId?.username;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 glass"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease" }}
    >
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#c026d3)",
            boxShadow: "0 0 14px rgba(192,38,211,.35)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 9.5H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-grotesk font-bold text-[15px] text-slate-100 tracking-tight">
          CareerPilot
        </span>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {requestCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] px-3 rounded-full">
                  {requestCount}
                </span>
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                {userPic ? (
                  <Image
                    width={100}
                    height={100}
                    src={`${BASE_URL}/uploads/${userPic}`}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}
                  >
                    {userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden md:block text-sm text-slate-200 font-outfit">
                  {userName || "User"}
                </span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 py-1 shadow-xl"
                  style={{ background: "rgba(15,10,30,0.95)", backdropFilter: "blur(16px)" }}
                >
                  <button
                    onClick={() => { router.push(`/view_profile/${username}`); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all font-outfit cursor-pointer"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => { router.push("/dashboard"); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all font-outfit cursor-pointer"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => { router.push("/settings"); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all font-outfit cursor-pointer"
                  >
                    Settings
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-outfit cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
           

       
<div className="flex items-center gap-8">
  
  <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
    <Link href="/about" className="nav-link font-outfit hover:text-white transition">
      About Us
    </Link> &nbsp; &nbsp; &nbsp;
    <Link href="/features" className="nav-link font-outfit hover:text-white transition">
      Features
    </Link> &nbsp; &nbsp; &nbsp;
  </div>

 

  <button
    onClick={() => router.push("/register")}
    className="btn-primary cursor-pointer font-outfit text-sm text-white px-5 py-2 rounded-lg font-medium"
  >
    Sign In
  </button>

</div>
          </>
        )}
      </div>
    </nav>
  );
}