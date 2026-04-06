import { useEffect } from "react";
import DashboardLayout from "../../layout/dashboardLayout/index";
import UserLayout from "../../layout/userLayout/index";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../config/redux/action/authAction/index";
import Image from "next/image";
import styles from "./styles.module.css";
import { BASE_URL } from "../../config/index.js";
import { useRouter } from "next/navigation";

function getInitials(name = '') {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Discover() {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const router = useRouter();

    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, []);

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.discoverWrapper}>
                    <div className={styles.discoverHeader}>
                        <h2 className={styles.discoverTitle}>Discover People</h2>
                        <p className={styles.discoverSubtitle}>{authState.all_users?.length || 0} members</p>
                    </div>

                    {!authState.all_profiles_fetched ? (
                        <div className={styles.discoverGrid}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className={styles.userCardSkeleton}>
                                    <div className={styles.skeletonAvatar} />
                                    <div className={styles.skeletonLines}>
                                        <div className={styles.skeletonLine} style={{ width: '60%' }} />
                                        <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                        <div className={styles.skeletonLine} style={{ width: '80%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : authState.all_users?.length === 0 ? (
                        <div className={styles.discoverEmpty}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" width={40} height={40}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <p>No users found.</p>
                        </div>
                    ) : (
                        <div className={styles.discoverGrid}>
                            {authState.all_users?.filter(profile => profile.userId != null && profile.userId?._id !== authState.user?.userId?._id).map((profile) => {
                                const user = profile.userId;
                                const pfp = user?.profilePicture;
                                const showRealPfp = pfp && pfp !== 'default.jpg';
                                const isMe = user?._id === authState.user?.userId?._id;

                                return (
                                    <div key={profile._id} className={`${styles.userCard} ${isMe ? styles.userCardMe : ''}`}>
                                        <div className={styles.userCardTop}>
                                            <div className={styles.userCardAvatarWrapper}>
                                                <div className={styles.userCardAvatarRing} />
                                                {showRealPfp ? (
                                                    <Image
                                                        className={styles.userCardAvatar}
                                                        src={`${BASE_URL}/uploads/${pfp}`}
                                                        alt={user?.name}
                                                        width={56}
                                                        height={56}
                                                    />
                                                ) : (
                                                    <div className={styles.userCardAvatarFallback}>
                                                        {getInitials(user?.name)}
                                                    </div>
                                                )}
                                            </div>
                                            {isMe && <span className={styles.userCardMeBadge}>You</span>}
                                        </div>

                                        <div className={styles.userCardInfo}>
                                            <span className={styles.userCardName}>{user?.name}</span>
                                            <span className={styles.userCardHandle}>@{user?.username?.replace(/\s+/g, '_').toLowerCase()}</span>
                                            {profile.currentPost && (
                                                <span className={styles.userCardCurrentPost}>{profile.currentPost}</span>
                                            )}
                                            {profile.bio && (
                                                <p className={styles.userCardBio}>{profile.bio}</p>
                                            )}
                                        </div>

                                        {profile.education?.length > 0 && (
                                            <div className={styles.userCardMeta}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={12} height={12}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                                </svg>
                                                <span>{profile.education[0].school}</span>
                                            </div>
                                        )}

                                        {profile.pastWork?.length > 0 && (
                                            <div className={styles.userCardMeta}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={12} height={12}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                                </svg>
                                                <span>{profile.pastWork[0].company}</span>
                                            </div>
                                        )}

                                        {!isMe && (
                                            <button onClick={() => {
                                                router.push(`/view_profile/${user.username}`)
                                            }} className={styles.userCardConnectBtn}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={13} height={13}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                                </svg>
                                                View Profile
                                            </button>
                                        )}
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