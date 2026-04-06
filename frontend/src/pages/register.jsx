"use client";

import UserLayout from "../layout/userLayout/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../config/redux/action/authAction/index";


export default function RegisterPage() {
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loading = authState.isLoading;


  useEffect(() => {
  if(localStorage.getItem("token")){
    router.push("/dashboard")
  }
}, [])


useEffect(() => {
  if (authState.isError) {
    setError(authState.message?.message || authState.message); 
  }
  if (authState.isSuccess) {  
    setSuccess("Account created! Redirecting...");
    router.push("/login");
  }
}, [authState.isError, authState.isSuccess]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };
  

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    dispatch(registerUser({ name: form.name, username: form.username, email: form.email, password: form.password }));
  };

  return (
    <UserLayout>
      <div className={styles.page}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />

        <div className={`${styles.card} mt-22`}>

          <h1 className={styles.heading}>Create account</h1>
          <p className={styles.subheading}>
            Already have an account? &nbsp;
            <Link href="/login">Sign in</Link>
          </p>

          {error   && <div className={`${styles.error} mb-3`}>{error}</div>}
          {success && <div className={`${styles.success} mb-3`}>{success}</div>}

          <form className={styles.form} onSubmit={handleRegister}>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Username</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M16 15H8c-2.2 0-4 1.8-4 4v1h16v-1c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <input
                    className={styles.input}
                    type="text"
                    name="username"
                    placeholder="rahul_s"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

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
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} /> : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>
        </div>
      </div>
    </UserLayout>
  );
}