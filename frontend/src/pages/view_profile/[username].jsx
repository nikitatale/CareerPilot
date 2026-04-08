"use client"

import DashboardLayout from '../../layout/dashboardLayout/index';
import UserLayout from '../../layout/userLayout/index';
import { useRouter } from 'next/router';
import styles from "./styles.module.css";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser, getConnectionRequest, getUserByUsername, sendConnectionRequest } from '../../config/redux/action/authAction/index';
import { getAllPosts, getUserPosts } from '../../config/redux/action/postAction';
import Image from 'next/image';
import { BASE_URL } from '../../config/index.js';

function getInitials(name = '') {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const ViewProfile = ({ username }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.postReducer);

    const profile = authState.viewed_profile;
    const user = profile?.userId;

    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(false);

    const isOwnProfile = authState.user?.userId?.username === username;

    const handleDownloadResume = async () => {
        if (!profile?.userId?._id) return;
        try {
            const { clientServer, BASE_URL: BU } = await import('../../config/index.js');
            const res = await clientServer.get('/user/download_resume', { params: { id: profile.userId._id } });
            const filename = res.data.message;
            window.open(`${BU}/uploads/${filename}`, '_blank');
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }, []);

    useEffect(() => {
        if (username) {
            dispatch(getUserByUsername(username));
            dispatch(getAllPosts());
            dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
        }
    }, [dispatch, username]);

    useEffect(() => {
        if (user?._id) {
            dispatch(getUserPosts(user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (postState.posts && username) {
            const filtered = postState.posts.filter((post) => post.userId?.username === username);
            setUserPosts(filtered);
        }
    }, [postState.posts, username]);

    useEffect(() => {
        if (authState.connections && user?._id) {
            const isConnected = authState.connections.some(conn =>
                (conn.connectionId?._id === user._id || conn.userId?._id === user._id) && conn.status_accepted
            );

            const isPending = authState.connections.some(conn =>
                (conn.connectionId?._id === user._id || conn.userId?._id === user._id) && !conn.status_accepted
            );

            setIsCurrentUserInConnection(isConnected);
            setIsRequestSent(isPending);
        }
    }, [authState.connections, user]);

    const pfp = user?.profilePicture;
    const showRealPfp = pfp && pfp !== 'default.jpg';

    if (!profile) {
        return (
            <UserLayout>
                <DashboardLayout>
                    <div className={styles.viewProfileWrapper}>
                        <div className={styles.skeletonBanner} />
                        <div className={styles.skeletonProfileSection}>
                            <div className={styles.skeletonAvatarLarge} />
                            <div className={styles.skeletonLines}>
                                <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                <div className={styles.skeletonLine} style={{ width: '25%' }} />
                                <div className={styles.skeletonLine} style={{ width: '60%' }} />
                            </div>
                        </div>
                    </div>
                </DashboardLayout>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.viewProfileWrapper}>
                    <div className={styles.leftSection}>
                        <div className={styles.profileBanner}>
                            <div className={styles.profileBannerGlow} />
                            <div className={styles.profileBannerOrb1} />
                            <div className={styles.profileBannerOrb2} />
                            <div className={styles.profileBannerGrid} />
                        </div>

                        <div className={styles.profileCard}>
                            <div className={styles.profileAvatarSection}>
                                <div className={styles.profileAvatarWrapper}>
                                    <div className={styles.profileAvatarRing} />
                                    {showRealPfp ? (
                                        <Image
                                            className={styles.profileAvatarImage}
                                            src={`${BASE_URL}/uploads/${pfp}`}
                                            alt={user?.name || "Profile"}
                                            width={96}
                                            height={96}
                                        />
                                    ) : (
                                        <div className={styles.profileAvatarFallback}>
                                            {getInitials(user?.name)}
                                        </div>
                                    )}
                                </div>

                                {isOwnProfile ? (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => router.push("/edit_profile")}
                                        className={styles.connectBtn}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleDownloadResume}
                                        className={styles.connectBtn}
                                        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}
                                    >
                                        Download Resume
                                    </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            dispatch(sendConnectionRequest({
                                                token: localStorage.getItem("token"),
                                                user_id: profile.userId._id
                                            }));
                                            setIsRequestSent(true);
                                        }}
                                        className={styles.connectBtn}
                                        disabled={isCurrentUserInConnection || isRequestSent}
                                    >
                                        {isCurrentUserInConnection
                                            ? "Connected"
                                            : isRequestSent
                                            ? "Pending"
                                            : "Connect"}
                                    </button>
                                )}
                            </div>

                            <div className={styles.profileInfo}>
                                <h1 className={styles.profileName}>{user?.name}</h1>
                                <span className={styles.profileHandle}>
                                    @{(user?.username || username)?.replace(/\s+/g, '_').toLowerCase()}
                                </span>

                                {profile.currentPost && (
                                    <span className={styles.profileCurrentPost}>{profile.currentPost}</span>
                                )}

                                {profile.bio && (
                                    <p className={styles.profileBio}>{profile.bio}</p>
                                )}
                            </div>

                            <div className={styles.profileDivider} />

                            {profile.education?.length > 0 && (
                                <div className={styles.profileSection}>
                                    <div className={styles.profileSectionTitle}>Education</div>
                                    {profile.education.map((edu, i) => (
                                        <div key={i} className={styles.profileSectionItem}>
                                            <div className={styles.profileSectionItemDot} />
                                            <div>
                                                <span className={styles.profileSectionItemTitle}>{edu.school}</span>
                                                {edu.degree && (
                                                    <span className={styles.profileSectionItemSub}>
                                                        {edu.degree} {edu.fieldOfStudy && `· ${edu.fieldOfStudy}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {profile.pastWork?.length > 0 && (
                                <div className={styles.profileSection}>
                                    <div className={styles.profileSectionTitle}>Experience</div>
                                    {profile.pastWork.map((work, i) => (
                                        <div key={i} className={styles.profileSectionItem}>
                                            <div className={styles.profileSectionItemDot} />
                                            <div>
                                                <span className={styles.profileSectionItemTitle}>{work.company}</span>
                                                {work.position && (
                                                    <span className={styles.profileSectionItemSub}>
                                                        {work.position} {work.years && `· ${work.years}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.rightSidebar}>
                        <div className={styles.recentActivityCard}>
                            <h3>Recent Activity</h3>
                            {userPosts.length > 0 ? (
                                <div className={styles.activityList}>
                                    {userPosts.slice(0, 5).map((post, idx) => {
                                        const hasImage = ['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(
                                            post.fileType?.toLowerCase()
                                        );
                                        return (
                                            <div key={post._id} className={styles.activityItem}>
                                                {post.body && (
                                                    <p className={styles.activityText}>{post.body}</p>
                                                )}
                                                {hasImage && post.media && (
                                                    <div className={styles.activityImageWrap}>
                                                        <Image
                                                            src={`${BASE_URL}/uploads/${post.media}`}
                                                            alt="post media"
                                                            width={280}
                                                            height={160}
                                                            className={styles.activityImage}
                                                            style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: '8px' }}
                                                        />
                                                    </div>
                                                )}
                                                {idx < Math.min(userPosts.length, 5) - 1 && (
                                                    <div className={styles.activityDivider} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className={styles.noActivity}>No activity yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}

export default ViewProfile;

export async function getServerSideProps(context) {
    const { username } = context.params;
    return {
        props: {
            username
        }
    }
}