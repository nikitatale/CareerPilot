"use client"

import { useRouter } from "next/router";
import styles from "./dashboardLayout.module.css"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setTokenIsThere } from "../../config/redux/reducer/authReducer";
import { acceptConnection, getMyConnectionRequest } from '../../config/redux/action/authAction';

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

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { incomingRequests } = useSelector((state) => state.auth);


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
  } else {
    dispatch(setTokenIsThere());

    dispatch(getMyConnectionRequest({ token }));

    const interval = setInterval(() => {
      dispatch(getMyConnectionRequest({ token }));
    }, 5000);

    return () => clearInterval(interval);
  }
}, [dispatch]);

  const isActive = (route) => router.pathname === route;

  return (
    <div className={styles.wrapper}>

      <div className={styles.mobileTopBar}>
        <button
          className={styles.menuBtn}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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

          </div>
        </aside>

        <main className={styles.feed}>
          {children}
        </main>

        <aside className={styles.rightPanel}>
          <div className={styles.rightPanelCard}>
            <p className={styles.rightPanelHeading}>Connection Requests</p>

            {incomingRequests && incomingRequests.length > 0 ? (
              incomingRequests.map((req) => (
                <div key={req._id} style={{ marginBottom: "12px" }}>
                  <p>{req.userId?.name}</p>

                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button
                      onClick={() =>
                        dispatch(acceptConnection({
                          token: localStorage.getItem("token"),
                          connectionId: req.userId._id,
                          action: "accepted"
                        }))
                      }
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        dispatch(acceptConnection({
                          token: localStorage.getItem("token"),
                          connectionId: req.userId._id,
                          action: "rejected"
                        }))
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                No requests
              </p>
            )}

            <div className={styles.rightPanelBody} />
          </div>
        </aside>

      </div>
    </div>
  );
}