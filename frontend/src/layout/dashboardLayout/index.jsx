"use client"

import { useRouter } from "next/router";
import styles from "./dashboardLayout.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setTokenIsThere, reset } from "../../config/redux/reducer/authReducer";
import { acceptConnection, getMyConnectionRequest, logoutUser } from "../../config/redux/action/authAction";
import Image from "next/image";
import { BASE_URL } from "../../config/index.js";

const NAV_ITEMS = [
  {
    label: "Scroll",
    route: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Discover",
    route: "/discover",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    label: "My Connections",
    route: "/my_connections",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
];

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { incomingRequests, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(setTokenIsThere());
      dispatch(getMyConnectionRequest({ token }));

      const interval = setInterval(() => {
        dispatch(getMyConnectionRequest({ token }));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [dispatch]);

  const isActive = (route) => router.pathname === route;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(reset());
    router.push("/login");
  };

  const pfp = user?.userId?.profilePicture;
  const showRealPfp = pfp && pfp !== "default.jpg";

  return (
    <div className={styles.wrapper}>
      
      <div className={styles.mobileTopBar}>
        <button className={styles.menuBtn} onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          {mobileNavOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <span className={styles.mobileLogo}>CareerPilot</span>
      </div>

      {mobileNavOpen && (
        <div className={styles.mobileDrawer}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.route}
              className={`${styles.drawerItem} ${isActive(item.route) ? styles.drawerItemActive : ""}`}
              onClick={() => { router.push(item.route); setMobileNavOpen(false); }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className={styles.drawerItem} onClick={handleLogout}>
            <span className={styles.navIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
              </svg>
            </span>
            Logout
          </button>
        </div>
      )}

      <div className={styles.layout}>
     
        <aside className={styles.sidebar}>
          <div className={styles.sidebarOrb} />
          <div className={styles.sidebarInner}>
            <p className={styles.sidebarHeading}>Menu</p>
            <nav className={styles.nav}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.route}
                  className={`${styles.navItem} ${isActive(item.route) ? styles.navItemActive : ""}`}
                  onClick={() => router.push(item.route)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {isActive(item.route) && <span className={styles.activePill} />}
                </button>
              ))}
            </nav>

            <div className={styles.divider} />

          
            {user?.userId && (
              <button
                className={styles.navItem}
                onClick={() => router.push(`/view_profile/${user.userId.username}`)}
              >
                <span className={styles.navIcon}>
                  {showRealPfp ? (
                    <Image
                      src={`${BASE_URL}/uploads/${pfp}`} 
                      alt="me"
                      width={20}
                      height={20}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  )}
                </span>
                <span className={styles.navLabel}>My Profile</span>
              </button>
            )}

           
            {user?.userId && (
              <button
                className={styles.navItem}
                onClick={() => router.push("/edit_profile")}
              >
                <span className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </span>
                <span className={styles.navLabel}>Edit Profile</span>
              </button>
            )}

            
            <button className={styles.navItem} onClick={handleLogout} style={{ marginTop: "auto" }}>
              <span className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                </svg>
              </span>
              <span className={styles.navLabel}>Logout</span>
            </button>
          </div>
        </aside>

        <main className={styles.feed}>{children}</main>

       
        <aside className={styles.rightPanel}>
          <div className={styles.rightPanelCard}>
            <p className={styles.rightPanelHeading}>
              Connection Requests
              {incomingRequests?.length > 0 && (
                <span style={{
                  marginLeft: "8px",
                  background: "#7c3aed",
                  color: "white",
                  borderRadius: "999px",
                  padding: "1px 7px",
                  fontSize: "11px"
                }}>
                  {incomingRequests.length}
                </span>
              )}
            </p>

            {incomingRequests && incomingRequests.length > 0 ? (
              incomingRequests.map((req) => {
                const reqPfp = req.userId?.profilePicture;
                const showReqPfp = reqPfp && reqPfp !== "default.jpg";
                return (
                  <div key={req._id} className={styles.connectionRequestItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      {showReqPfp ? (
                        <Image
                          src={`${BASE_URL}/uploads/${reqPfp}`}
                          alt={req.userId?.name}
                          width={32}
                          height={32}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: "600", color: "white", flexShrink: 0
                        }}>
                          {getInitials(req.userId?.name || "U")}
                        </div>
                      )}
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>
                          {req.userId?.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                          @{req.userId?.username}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className={styles.acceptBtn}
                        onClick={() =>
                          dispatch(acceptConnection({
                            token: localStorage.getItem("token"),
                            requestId: req._id,
                            action: "accept",
                          }))
                        }
                      >
                        Accept
                      </button>
                      <button
                        className={styles.rejectBtn}
                        onClick={() =>
                          dispatch(acceptConnection({
                            token: localStorage.getItem("token"),
                            requestId: req._id,
                            action: "reject",
                          }))
                        }
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: "12px", color: "#6b7280" }}>No pending requests</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
