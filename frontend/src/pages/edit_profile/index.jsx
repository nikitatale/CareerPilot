"use client";

import { useEffect, useState } from "react";
import UserLayout from "../../layout/userLayout/index";
import DashboardLayout from "../../layout/dashboardLayout/index";
import { useDispatch, useSelector } from "react-redux";
import {
  getAboutUser,
  updateUserProfile,
  updateProfileData,
  uploadProfilePicture,
} from "../../config/redux/action/authAction/index";
import Image from "next/image";
import { useRouter } from "next/router";
import { BASE_URL } from "../../config/index.js";
import styles from "./styles.module.css";

export default function EditProfile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const user = authState.user?.userId;
  const profile = authState.user;

  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [currentPost, setCurrentPost] = useState("");
  const [pastWork, setPastWork] = useState([]);
  const [education, setEducation] = useState([]);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [pfpFile, setPfpFile] = useState(null);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
    if (profile) {
      setBio(profile.bio || "");
      setCurrentPost(profile.currentPost || "");
      setPastWork(profile.pastWork?.length > 0 ? profile.pastWork : []);
      setEducation(profile.education?.length > 0 ? profile.education : []);
    }
  }, [authState.user]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg); setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };
  const showError = (msg) => { setErrorMsg(msg); setSuccessMsg(""); };

  const handlePfpChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPfpFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPfpPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePfpUpload = async () => {
    if (!pfpFile) return;
    setSaving(true);
    const result = await dispatch(uploadProfilePicture(pfpFile));
    if (result.error) showError("Failed to upload picture.");
    else { setPfpFile(null); showSuccess("Profile picture updated!"); }
    setSaving(false);
  };

  const handleSaveBasic = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await dispatch(updateUserProfile({ name, username, email }));
    if (result.error) showError(result.payload?.message || "Update failed");
    else {
      await dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      showSuccess("Basic info saved!");
    }
    setSaving(false);
  };

  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    const result = await dispatch(updateProfileData({ bio, currentPost, pastWork, education }));
    if (result.error) showError(result.payload?.message || "Update failed");
    else {
      await dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      showSuccess("Profile saved!");
    }
    setSaving(false);
  };

  const addWork = () => setPastWork([...pastWork, { company: "", position: "", years: "" }]);
  const removeWork = (i) => setPastWork(pastWork.filter((_, idx) => idx !== i));
  const updateWork = (i, field, val) => { const u = [...pastWork]; u[i] = { ...u[i], [field]: val }; setPastWork(u); };

  const addEdu = () => setEducation([...education, { school: "", degree: "", fieldOfStudy: "" }]);
  const removeEdu = (i) => setEducation(education.filter((_, idx) => idx !== i));
  const updateEdu = (i, field, val) => { const u = [...education]; u[i] = { ...u[i], [field]: val }; setEducation(u); };

  const pfpSrc = pfpPreview || (user?.profilePicture && user.profilePicture !== "default.jpg"
    ? `${BASE_URL}/uploads/${user.profilePicture}` : null);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={() => router.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={16} height={16}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
            <h2 className={styles.title}>Edit Profile</h2>
          </div>

          {successMsg && <div className={styles.successAlert}>{successMsg}</div>}
          {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

         
          <div className={styles.pfpSection}>
            <div className={styles.pfpWrapper}>
              {pfpSrc ? (
                <Image src={pfpSrc} alt="Profile" width={80} height={80} className={styles.pfpImage} />
              ) : (
                <div className={styles.pfpFallback}>
                  {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                </div>
              )}
              <label className={styles.pfpEditBtn} htmlFor="pfpInput">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={12} height={12}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </label>
              <input id="pfpInput" type="file" hidden accept="image/*" onChange={handlePfpChange} />
            </div>
            <div>
              <p className={styles.pfpName}>{user?.name}</p>
              <p className={styles.pfpUsername}>@{user?.username}</p>
              {pfpFile && (
                <button className={styles.pfpSaveBtn} onClick={handlePfpUpload} disabled={saving}>
                  {saving ? "Uploading..." : "Save Photo"}
                </button>
              )}
            </div>
          </div>

          
          <div className={styles.tabs}>
            {[["basic","Basic Info"],["profile","Profile"],["work","Work Experience"],["education","Education"]].map(([tab, label]) => (
              <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`} onClick={() => setActiveTab(tab)}>
                {label}
              </button>
            ))}
          </div>

       
          {activeTab === "basic" && (
            <form className={styles.form} onSubmit={handleSaveBasic}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_username" />
                </div>
                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                  <label className={styles.label}>Email</label>
                  <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>
              <button className={styles.saveBtn} type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
            </form>
          )}

    
          {activeTab === "profile" && (
            <form className={styles.form} onSubmit={handleSaveProfile}>
              <div className={styles.field}>
                <label className={styles.label}>Current Position</label>
                <input className={styles.input} value={currentPost} onChange={(e) => setCurrentPost(e.target.value)} placeholder="e.g. Software Engineer at Google" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Bio</label>
                <textarea className={styles.textarea} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about yourself..." rows={4} />
              </div>
              <button className={styles.saveBtn} type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
            </form>
          )}

        
          {activeTab === "work" && (
            <div className={styles.form}>
              {pastWork.map((work, i) => (
                <div key={i} className={styles.entryCard}>
                  <div className={styles.entryHeader}>
                    <span className={styles.entryTitle}>Experience #{i + 1}</span>
                    <button className={styles.removeBtn} type="button" onClick={() => removeWork(i)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>Company</label>
                      <input className={styles.input} value={work.company} onChange={(e) => updateWork(i, "company", e.target.value)} placeholder="Company name" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Position</label>
                      <input className={styles.input} value={work.position} onChange={(e) => updateWork(i, "position", e.target.value)} placeholder="Your role" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Duration</label>
                      <input className={styles.input} value={work.years} onChange={(e) => updateWork(i, "years", e.target.value)} placeholder="e.g. 2021 - 2023" />
                    </div>
                  </div>
                </div>
              ))}
              <button className={styles.addBtn} type="button" onClick={addWork}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add Experience
              </button>
              {pastWork.length > 0 && (
                <button className={styles.saveBtn} type="button" disabled={saving} onClick={handleSaveProfile}>{saving ? "Saving..." : "Save Work Experience"}</button>
              )}
            </div>
          )}

         
          {activeTab === "education" && (
            <div className={styles.form}>
              {education.map((edu, i) => (
                <div key={i} className={styles.entryCard}>
                  <div className={styles.entryHeader}>
                    <span className={styles.entryTitle}>Education #{i + 1}</span>
                    <button className={styles.removeBtn} type="button" onClick={() => removeEdu(i)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>School / University</label>
                      <input className={styles.input} value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} placeholder="Institution name" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Degree</label>
                      <input className={styles.input} value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="e.g. B.Tech, MBA" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Field of Study</label>
                      <input className={styles.input} value={edu.fieldOfStudy} onChange={(e) => updateEdu(i, "fieldOfStudy", e.target.value)} placeholder="e.g. Computer Science" />
                    </div>
                  </div>
                </div>
              ))}
              <button className={styles.addBtn} type="button" onClick={addEdu}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add Education
              </button>
              {education.length > 0 && (
                <button className={styles.saveBtn} type="button" disabled={saving} onClick={handleSaveProfile}>{saving ? "Saving..." : "Save Education"}</button>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
