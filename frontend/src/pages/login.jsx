"use client"

import UserLayout from "../layout/userLayout/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../config/redux/action/authAction/index";
import { resetAuth } from "../config/redux/reducer/authReducer/index";



export default function LoginPage() {
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loading = authState.isLoading;

useEffect(() => {
    dispatch(resetAuth()); 
}, []);

  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  }, [])

useEffect(() => {
  if (authState.isError) {
    const errMsg = 
      authState.message?.message ||
      authState.message ||
      "Something went wrong!";
    setError(errMsg);
  }
  if (authState.loggedIn) {
    router.push("/dashboard");
  }
}, [authState.isError, authState.loggedIn, authState.message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();       
    setError("");
    setSuccess("");

    dispatch(loginUser({ email: form.email, password: form.password })); 
  };

  return (
    <UserLayout>
      <div className={styles.page}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />

        <div className={`${styles.card} mt-15`}>

          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.subheading}>
            Don't have an account? &nbsp;
            <Link href="/register">Sign up for free</Link>
          </p>

          {error   && <div className={`${styles.error} mb-3`}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <form className={styles.form} onSubmit={handleLogin}> 

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Link href="/forgot-password" className={styles.forgot}>
              Forgot password?
            </Link>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    </UserLayout>
  );
}