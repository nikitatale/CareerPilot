"use client";
import UserLayout from '../../layout/userLayout/index';
import { getAboutUser, getAllUsers } from '../../config/redux/action/authAction/index';
import { createPost, deletePost, getAllComments, getAllPosts, incrementPostLike, postComment, deleteComment } from '../../config/redux/action/postAction/index';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import styles from "./styles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../layout/dashboardLayout/index';
import Image from 'next/image';
import { resetPostId } from '../../config/redux/reducer/postReducer/index'
import { BASE_URL } from '../../config/index.js';

const EMOJI_DATA = {
  "😀": ["😀","😂","😍","🥰","😎","🤩","😭","😤","🥺","😴","🤔","😏","🙄","😬","🤯","🥳","😇","🤗","😑","😶"],
  "👍": ["👍","👎","👏","🙌","🤝","✌️","🤞","👌","🤌","💪","🦾","🖐️","👋","🤙","💅","🫶","❤️","🔥","✨","💯"],
  "🐶": ["🐶","🐱","🐭","🐸","🦊","🐼","🐨","🦁","🐯","🐮","🐷","🐙","🦋","🐝","🦄","🐲","🦖","🐳","🦈","🦜"],
  "🍕": ["🍕","🍔","🍟","🌮","🌯","🍜","🍣","🍩","🍪","🎂","🍫","🍿","☕","🧋","🍺","🥂","🍷","🥃","🧃","🍹"],
  "⚽": ["⚽","🏀","🏈","⚾","🎾","🏐","🎱","🏓","🎮","🎯","🎳","♟️","🎪","🎭","🎨","🎸","🎹","🎤","🎧","🎬"],
  "✈️": ["✈️","🚀","🛸","🚂","🚢","🏝️","🏔️","🌋","🗼","🏰","🎡","🌃","🌉","🌌","🌅","🌄","🏕️","⛺","🗺️","🧭"],
  "❤️": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️"],
};
const EMOJI_CATS = Object.keys(EMOJI_DATA);

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [postContent, setPostContent] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [activeCat, setActiveCat] = useState(EMOJI_CATS[0]);
  const [linkInput, setLinkInput] = useState('');
  const [attachedLink, setAttachedLink] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());

  const emojiRef = useRef(null);
  const linkRef = useRef(null);

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
      if (!authState.all_profiles_fetched) dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
      if (linkRef.current && !linkRef.current.contains(e.target)) setShowLink(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const insertEmoji = (emoji) => setPostContent((prev) => prev + emoji);

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const url = linkInput.startsWith('http') ? linkInput : `https://${linkInput}`;
    setAttachedLink(url);
    setLinkInput('');
    setShowLink(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileContent(file);
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFileContent(null);
    setFilePreview(null);
  };

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent('');
    setFileContent(null);
    setFilePreview(null);
    setAttachedLink('');
    dispatch(getAllPosts());
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    await dispatch(postComment({
      post_id: postState.postId,
      body: commentText,
    }));
    setCommentText('');
    dispatch(getAllComments({ post_id: postState.postId }));
  };

  const handleDeleteComment = async (comment_id) => {
    await dispatch(deleteComment({ comment_id }));
    dispatch(getAllComments({ post_id: postState.postId }));
  };

  const profilePicture = authState.user?.userId?.profilePicture;
  const canPost = postContent.trim() || attachedLink || fileContent;

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollWrapper}>
            <div className={styles.createPostContainer}>
              <div className={styles.loadingContainer}>
                <div className={styles.skeletonAvatar} />
                <div className={styles.skeletonLines}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                </div>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.postCardSkeleton}>
                <div className={styles.skeletonHeader}>
                  <div className={styles.skeletonAvatar} />
                  <div className={styles.skeletonLines}>
                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                    <div className={styles.skeletonLine} style={{ width: '25%' }} />
                  </div>
                </div>
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} style={{ width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollWrapper}>
          <div className={styles.createPostContainer}>
            <div className={styles.postRow}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarRing} />
                <Image
                  className={styles.avatarImage}
                  src={`${BASE_URL}/uploads/${profilePicture}`}
                  alt="profile picture"
                  width={48}
                  height={48}
                />
              </div>
              <div className={styles.textareaBlock}>
                <textarea
                  className={styles.postTextarea}
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                />
                {filePreview && (
                  <div className={styles.filePreviewWrap}>
                    <img src={filePreview} alt="preview" className={styles.filePreviewImg} />
                    <button className={styles.filePreviewRemove} onClick={handleRemoveFile}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                {attachedLink && (
                  <div className={styles.attachedLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 1 1.242 7.244" />
                    </svg>
                    <span className={styles.attachedLinkText}>{attachedLink}</span>
                    <button className={styles.attachedLinkRemove} onClick={() => setAttachedLink('')}>×</button>
                  </div>
                )}
                <div className={styles.toolbar}>
                  <div className={styles.toolbarLeft}>
                    <label htmlFor="fileUpload" className={styles.iconBtn} title="Add photo">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      <input onChange={handleFileChange} type="file" hidden id="fileUpload" accept="image/*" />
                    </label>
                    <div className={styles.popoverAnchor} ref={emojiRef}>
                      <button
                        className={`${styles.iconBtn} ${showEmoji ? styles.iconBtnActive : ''}`}
                        title="Add emoji"
                        onClick={() => { setShowEmoji(p => !p); setShowLink(false); }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                        </svg>
                      </button>
                      {showEmoji && (
                        <div className={styles.emojiPickerWrapper}>
                          <div className={styles.emojiCategories}>
                            {EMOJI_CATS.map((cat) => (
                              <button
                                key={cat}
                                className={`${styles.emojiCatBtn} ${activeCat === cat ? styles.emojiCatBtnActive : ''}`}
                                onClick={() => setActiveCat(cat)}
                              >{cat}</button>
                            ))}
                          </div>
                          <div className={styles.emojiGrid}>
                            {EMOJI_DATA[activeCat].map((emoji) => (
                              <button key={emoji} className={styles.emojiBtn} onClick={() => insertEmoji(emoji)}>{emoji}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={styles.popoverAnchor} ref={linkRef}>
                      <button
                        className={`${styles.iconBtn} ${showLink || attachedLink ? styles.iconBtnActive : ''}`}
                        title="Add link"
                        onClick={() => { setShowLink(p => !p); setShowEmoji(false); }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 1 1.242 7.244" />
                        </svg>
                      </button>
                      {showLink && (
                        <div className={styles.linkPopover}>
                          <div className={styles.linkPopoverTitle}>Attach Link</div>
                          <div className={styles.linkInputRow}>
                            <input
                              className={styles.linkInput}
                              type="text"
                              placeholder="https://example.com"
                              value={linkInput}
                              onChange={(e) => setLinkInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                              autoFocus
                            />
                            <button className={styles.linkAddBtn} onClick={handleAddLink}>Add</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {canPost && (
                    <button onClick={handleUpload} className={styles.postBtn}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={14} height={14}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                      Post
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.feedWrapper}>
            {postState?.posts?.length === 0 && (
              <div className={styles.emptyFeed}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" width={40} height={40}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
                <p>No posts yet. Be the first to post!</p>
              </div>
            )}
            {postState?.posts?.map((post) => {
              const hasImage = ['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(post.fileType?.toLowerCase());
              const isLiked = likedPosts.has(post._id);
              const pfp = post.userId?.profilePicture;
              const showRealPfp = pfp && pfp !== 'default.jpg';
              return (
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.postCardHeader}>
                    <div className={styles.postAvatarWrapper}>
                      <div className={styles.postAvatarRing} />
                      {showRealPfp ? (
                        <Image
                          className={styles.postAvatarImage}
                          src={`${BASE_URL}/uploads/${pfp}`}
                          alt={post.userId?.name}
                          width={42}
                          height={42}
                        />
                      ) : (
                        <div className={styles.postAvatarFallback}>
                          {getInitials(post.userId?.name)}
                        </div>
                      )}
                    </div>
                    <div className={styles.postMeta}>
                      <span className={styles.postAuthorName}>{post.userId?.name}</span>
                      <span className={styles.postAuthorHandle}>@{post.userId?.username?.replace(/\s+/g, '_').toLowerCase()}</span>
                    </div>
                    <span className={styles.postTimestamp}>{timeAgo(post.createdAt)}</span>
                  </div>
                  {post.body && (
                    <div className={styles.postCardBody}>
                      <p className={styles.postBodyText}>{post.body}</p>
                    </div>
                  )}
                  {hasImage && post.media && (
                    <div className={styles.postMediaWrap}>
                      <Image
                        className={styles.postMediaImage}
                        src={`${BASE_URL}/uploads/${post.media}`}
                        alt="post media"
                        width={600}
                        height={400}
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                      />
                    </div>
                  )}
                  <div className={styles.postCardFooter}>
                    <button
                      className={`${styles.postActionBtn} ${isLiked ? styles.postActionBtnLiked : ''}`}
                      onClick={async () => {
                        await dispatch(incrementPostLike({ post_id: post._id }));
                        setLikedPosts(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(post._id)) {
                            newSet.delete(post._id);
                          } else {
                            newSet.add(post._id);
                          }
                          return newSet;
                        });
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                      <span>{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button onClick={() => { dispatch(getAllComments({ post_id: post._id })); }} className={styles.postActionBtn}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                      </svg>
                      <span>Comment</span>
                    </button>
                    <button onClick={() => {
                      const text = encodeURIComponent(post.body);
                      const url = encodeURIComponent(window.location.href);
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                      window.open(twitterUrl, "_blank");
                    }} className={styles.postActionBtn}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                      <span>Share</span>
                    </button>
                    {post.userId?._id === authState.user?.userId?._id && (
                      <button className={styles.postActionBtn} onClick={async () => {
                        await dispatch(deletePost({ post_id: post._id }));
                        await dispatch(getAllPosts());
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {postState.postId !== "" && (
          <div className={styles.commentOverlay} onClick={() => dispatch(resetPostId())}>
            <div className={styles.commentCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.commentCardHeader}>
                <span className={styles.commentCardTitle}>Comments</span>
                <button className={styles.commentCardClose} onClick={() => dispatch(resetPostId())}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className={styles.commentList}>
                {postState.comments?.length === 0 && (
                  <p className={styles.noComments}>No comments yet. Be the first!</p>
                )}
                {postState.comments?.map((comment, i) => (
                  <div key={i} className={styles.commentItem}>
                    <div className={styles.commentItemAvatar}>
                      {getInitials(comment.userId?.name || "U")}
                    </div>
                    <div className={styles.commentItemContent}>
                      <span className={styles.commentItemName}>{comment.userId?.name || "User"}</span>
                      <p className={styles.commentItemText}>{comment.body}</p>
                    </div>
                    {comment.userId?._id === authState.user?.userId?._id && (
                      <button className={styles.commentDeleteBtn} onClick={() => handleDeleteComment(comment._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.commentInputRow}>
                <div className={styles.commentInputAvatar}>
                  {getInitials(authState.user?.userId?.name || "U")}
                </div>
                <input
                  className={styles.commentInput}
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <button className={styles.commentSendBtn} onClick={handleSendComment}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={16} height={16}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}