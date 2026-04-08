"use client";

import { useEffect } from "react";
import UserLayout from "../../layout/userLayout/index";
import DashboardLayout from "../../layout/dashboardLayout/index";
import { useDispatch, useSelector } from "react-redux";
import { getMyAcceptedConnections } from "../../config/redux/action/authAction/index";
import Image from "next/image";
import { useRouter } from "next/router";
import { BASE_URL } from "../../config/index.js";
import styles from "./styles.module.css"

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function MyConnections() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const connections = authState.acceptedConnections || [];

  useEffect(() => {
    dispatch(getMyAcceptedConnections());
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h2 className={styles.title}>My Connections</h2>
            <p className={styles.subtitle}>
              {connections.length} connection{connections.length !== 1 ? "s" : ""}
            </p>
          </div>

          {connections.length === 0 ? (
            <div className={styles.empty}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" width={48} height={48}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <p>No connections yet.</p>
              <button className={styles.discoverBtn} onClick={() => router.push("/discover")}>
                Discover People
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {connections.map((item) => {
                const person = item.connectedUser;
                const pfp = person?.profilePicture;
                const showRealPfp = pfp && pfp !== "default.jpg";

                return (
                  <div key={item._id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <div className={styles.avatarWrapper}>
                        {showRealPfp ? (
                          <Image
                            className={styles.avatar}
                            src={`${BASE_URL}/uploads/${pfp}`}
                            alt={person?.name}
                            width={56}
                            height={56}
                          />
                        ) : (
                          <div className={styles.avatarFallback}>
                            {getInitials(person?.name)}
                          </div>
                        )}
                        <div className={styles.onlineDot} />
                      </div>
                    </div>

                    <div className={styles.cardInfo}>
                      <span className={styles.name}>{person?.name}</span>
                      <span className={styles.handle}>@{person?.username}</span>
                      {person?.email && (
                        <span className={styles.email}>{person.email}</span>
                      )}
                    </div>

                    <button
                      className={styles.viewBtn}
                      onClick={() => router.push(`/view_profile/${person?.username}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={13} height={13}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
