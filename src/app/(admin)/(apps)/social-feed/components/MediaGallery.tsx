'use client'

import { useState, useCallback, useEffect } from 'react'
import { Modal, Spinner, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap'
import { TbX, TbChevronLeft, TbChevronRight, TbHeart, TbHeartFilled, TbShare3, TbDotsVertical, TbTrash, TbEdit, TbPin, TbFlag, TbCamera, TbMoodSmile, TbSend } from 'react-icons/tb'
import Link from 'next/link'
import Image from 'next/image'
import defaultAvatar from '@/assets/images/users/user-1.jpg'
import { PostType } from './FeedsNew'
import { CommentItem, formatTime } from './FeedComponents'

type MediaGalleryProps = {
    media: string[]
    className?: string
    post: PostType
    currentUserId?: string
    onLike: (postId: string) => void
    onComment: (postId: string, content: string, parentId?: string) => Promise<void> | void
}

// Component hiển thị media theo phong cách Facebook
const MediaGallery = ({ media, className = '', post, currentUserId, onLike, onComment }: MediaGalleryProps) => {
    const [showLightbox, setShowLightbox] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [commentText, setCommentText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Ensure post exists before using it to prevent crashes if something changes
    if (!post) return null;

    const isLiked = post.likes.some(like => like.userId === currentUserId)
    const isOwner = post.author.id === currentUserId

    // Keyboard navigation
    useEffect(() => {
        if (!showLightbox) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowLightbox(false)
            if (e.key === 'ArrowLeft') navigatePrev()
            if (e.key === 'ArrowRight') navigateNext()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [showLightbox, currentIndex])

    const openLightbox = (index: number) => {
        setCurrentIndex(index)
        setShowLightbox(true)
    }

    const navigatePrev = useCallback(() => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : media.length - 1))
    }, [media.length])

    const navigateNext = useCallback(() => {
        setCurrentIndex(prev => (prev < media.length - 1 ? prev + 1 : 0))
    }, [media.length])

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentText.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await onComment(post.id, commentText)
            setCommentText('')
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (media.length === 0) return null

    // Layout theo số lượng ảnh (giống Facebook)
    const renderGallery = () => {
        const count = media.length

        // 1 ảnh: Hiển thị full width với tỷ lệ 1.91:1
        if (count === 1) {
            return (
                <div
                    className="media-gallery-single cursor-pointer"
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={media[0]}
                        alt="Post media"
                        className="w-100 rounded"
                        style={{
                            aspectRatio: '1.91 / 1',
                            objectFit: 'cover',
                            maxHeight: '500px'
                        }}
                    />
                </div>
            )
        }

        // 2 ảnh: 2 cột bằng nhau
        if (count === 2) {
            return (
                <div className="row g-1">
                    {media.map((url, idx) => (
                        <div key={idx} className="col-6">
                            <div
                                className="cursor-pointer h-100"
                                onClick={() => openLightbox(idx)}
                            >
                                <img
                                    src={url}
                                    alt={`Post media ${idx + 1}`}
                                    className="w-100 h-100 rounded"
                                    style={{
                                        aspectRatio: '1 / 1',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        // 3 ảnh: 1 ảnh lớn bên trái, 2 ảnh nhỏ bên phải
        if (count === 3) {
            return (
                <div className="row g-1">
                    <div className="col-6">
                        <div
                            className="cursor-pointer h-100"
                            onClick={() => openLightbox(0)}
                        >
                            <img
                                src={media[0]}
                                alt="Post media 1"
                                className="w-100 h-100 rounded"
                                style={{
                                    objectFit: 'cover',
                                    minHeight: '300px'
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-6 d-flex flex-column gap-1">
                        {media.slice(1, 3).map((url, idx) => (
                            <div
                                key={idx}
                                className="cursor-pointer flex-grow-1"
                                onClick={() => openLightbox(idx + 1)}
                            >
                                <img
                                    src={url}
                                    alt={`Post media ${idx + 2}`}
                                    className="w-100 h-100 rounded"
                                    style={{
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        // 4 ảnh: Grid 2x2
        if (count === 4) {
            return (
                <div className="row g-1">
                    {media.map((url, idx) => (
                        <div key={idx} className="col-6">
                            <div
                                className="cursor-pointer"
                                onClick={() => openLightbox(idx)}
                            >
                                <img
                                    src={url}
                                    alt={`Post media ${idx + 1}`}
                                    className="w-100 rounded"
                                    style={{
                                        aspectRatio: '1 / 1',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        // 5+ ảnh: 2 ảnh trên, 3 ảnh dưới (ảnh cuối có overlay +N)
        return (
            <div className="d-flex flex-column gap-1">
                {/* Row 1: 2 ảnh lớn */}
                <div className="row g-1">
                    {media.slice(0, 2).map((url, idx) => (
                        <div key={idx} className="col-6">
                            <div
                                className="cursor-pointer"
                                onClick={() => openLightbox(idx)}
                            >
                                <img
                                    src={url}
                                    alt={`Post media ${idx + 1}`}
                                    className="w-100 rounded"
                                    style={{
                                        aspectRatio: '16 / 9',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 2: 3 ảnh nhỏ */}
                <div className="row g-1">
                    {media.slice(2, 5).map((url, idx) => {
                        const actualIdx = idx + 2
                        const isLast = actualIdx === 4 && count > 5
                        const remaining = count - 5

                        return (
                            <div key={idx} className="col-4">
                                <div
                                    className="cursor-pointer position-relative"
                                    onClick={() => openLightbox(actualIdx)}
                                >
                                    <img
                                        src={url}
                                        alt={`Post media ${actualIdx + 1}`}
                                        className="w-100 rounded"
                                        style={{
                                            aspectRatio: '1 / 1',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {isLast && remaining > 0 && (
                                        <div
                                            className="position-absolute top-0 start-0 w-100 h-100 rounded d-flex align-items-center justify-content-center"
                                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                                        >
                                            <span className="text-white fs-3 fw-bold">+{remaining}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={`media-gallery ${className}`}>
                {renderGallery()}
            </div>

            {/* Split View Modal */}
            <Modal
                show={showLightbox}
                onHide={() => setShowLightbox(false)}
                centered
                fullscreen={true}
                contentClassName="bg-transparent border-0 overflow-hidden"
                dialogClassName="media-lightbox-dialog p-0"
                style={{ paddingRight: 0 }}
            >
                <div className="row m-0" style={{ height: '100vh', backgroundColor: 'white', overflow: 'hidden' }}>
                    {/* Left Side: Media Viewer */}
                    <div className="col-lg-9 col-md-8 p-0 bg-black d-flex align-items-center justify-content-center position-relative h-100 overflow-hidden">
                        {/* Close button (Mobile only or when sidebar hidden?) - Keep main clean */}
                        <button
                            className="btn btn-dark btn-icon position-absolute top-0 start-0 m-3 rounded-circle d-lg-none"
                            style={{ zIndex: 10, width: '40px', height: '40px' }}
                            onClick={() => setShowLightbox(false)}
                        >
                            <TbX size={24} />
                        </button>

                        {/* Navigation - Previous */}
                        {media.length > 1 && (
                            <button
                                className="btn btn-dark btn-icon position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle border-0 bg-opacity-50 hover-bg-opacity-75"
                                style={{ zIndex: 10, width: '48px', height: '48px' }}
                                onClick={navigatePrev}
                            >
                                <TbChevronLeft size={28} />
                            </button>
                        )}

                        {/* Image */}
                        <img
                            src={media[currentIndex]}
                            alt={`Post media ${currentIndex + 1}`}
                            className="d-block"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />

                        {/* Navigation - Next */}
                        {media.length > 1 && (
                            <button
                                className="btn btn-dark btn-icon position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle border-0 bg-opacity-50 hover-bg-opacity-75"
                                style={{ zIndex: 10, width: '48px', height: '48px' }}
                                onClick={navigateNext}
                            >
                                <TbChevronRight size={28} />
                            </button>
                        )}
                    </div>

                    {/* Right Side: Sidebar */}
                    <div className="col-lg-3 col-md-4 bg-white d-flex flex-column h-100 p-0 border-start position-relative">
                        {/* Header */}
                        <div className="p-3 border-bottom d-flex align-items-center">
                            <Image
                                className="me-2 avatar-md rounded-circle"
                                src={post.author.avatar || defaultAvatar.src}
                                width={40}
                                height={40}
                                alt={post.author.name}
                            />
                            <div className="flex-grow-1">
                                <h6 className="m-0 page-title">
                                    <Link href="/users/profile" className="link-reset">
                                        {post.author.name}
                                    </Link>
                                </h6>
                                <p className="text-muted mb-0 fs-12">
                                    {formatTime(post.createdAt)}
                                </p>
                            </div>

                            <Dropdown className="">
                                <DropdownToggle as={'button'} className="bg-transparent border-0 text-muted drop-arrow-none card-drop p-0">
                                    <TbDotsVertical className="fs-lg" />
                                </DropdownToggle>
                                <DropdownMenu align="end" className="dropdown-menu-end">
                                    {isOwner && (
                                        <>
                                            <DropdownItem>
                                                <TbEdit className="me-2" /> Edit Post
                                            </DropdownItem>
                                            <DropdownItem>
                                                <TbTrash className="me-2" /> Delete Post
                                            </DropdownItem>
                                        </>
                                    )}
                                    <DropdownItem>
                                        <TbShare3 className="me-2" /> Share
                                    </DropdownItem>
                                    <DropdownItem>
                                        <TbPin className="me-2" /> Pin to Top
                                    </DropdownItem>
                                    <DropdownItem>
                                        <TbFlag className="me-2" /> Report Post
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <button
                                className="btn btn-link text-muted p-1 ms-2"
                                onClick={() => setShowLightbox(false)}
                            >
                                <TbX size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-grow-1 overflow-auto p-3" style={{ scrollbarWidth: 'thin' }}>
                            {/* Post Content */}
                            <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                            <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                <div className="d-flex align-items-center gap-1">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px' }}>
                                        <TbHeartFilled size={10} className="text-white" />
                                    </div>
                                    <span className="text-muted fs-13">{post.likes.length > 0 ? post.likes.length : ''}</span>
                                </div>
                                <div className="d-flex gap-3">
                                    <span className="text-muted fs-13 hover-underline cursor-pointer">
                                        {post.comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)} bình luận
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="d-flex justify-content-around py-1 border-bottom mb-3">
                                <button className={`btn btn-link btn-sm text-decoration-none ${isLiked ? 'text-primary' : 'text-muted'}`} onClick={() => onLike(post.id)}>
                                    {isLiked ? <TbHeartFilled className="me-1 fs-5" /> : <TbHeart className="me-1 fs-5" />}
                                    Thích
                                </button>
                                <button
                                    className="btn btn-link btn-sm text-decoration-none text-muted"
                                    onClick={() => {
                                        // Focus comment input?
                                        const input = document.getElementById(`media-comment-input-${post.id}`);
                                        if (input) input.focus();
                                    }}
                                >
                                    <i className="ri-chat-3-line me-1"></i>
                                    Bình luận
                                </button>
                                <button className="btn btn-link btn-sm text-decoration-none text-muted">
                                    <TbShare3 className="me-1 fs-5" />
                                    Chia sẻ
                                </button>
                            </div>

                            {/* Comments List */}
                            <div className="comments-list">
                                {post.comments.map(comment => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        postId={post.id}
                                        onComment={onComment}
                                        formatTime={formatTime}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Footer: Comment Input */}
                        <div className="p-3 border-top bg-light-subtle">
                            <form onSubmit={handleCommentSubmit} className="d-flex align-items-center">
                                <Link className="pe-2" href="">
                                    <Image
                                        src={defaultAvatar}
                                        className="rounded-circle"
                                        alt="user"
                                        height={32}
                                        width={32}
                                    />
                                </Link>
                                <div className="w-100 position-relative">
                                    <input
                                        id={`media-comment-input-${post.id}`}
                                        type="text"
                                        className="form-control rounded-pill pe-5"
                                        placeholder="Viết bình luận..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        style={{ paddingRight: '120px' }}
                                        autoFocus={false}
                                        disabled={isSubmitting}
                                    />
                                    <div className="position-absolute top-50 end-0 translate-middle-y me-3 d-flex gap-2">
                                        {!isSubmitting && (
                                            <>
                                                <span style={{ cursor: 'pointer', color: '#65676b' }}><TbCamera size={20} /></span>
                                                <span style={{ cursor: 'pointer', color: '#65676b' }}><TbMoodSmile size={20} /></span>
                                            </>
                                        )}
                                        {isSubmitting ? (
                                            <Spinner animation="border" size="sm" variant="primary" />
                                        ) : (
                                            <button type="submit" className="btn btn-link p-0 border-0 bg-transparent" style={{ color: '#65676b' }} disabled={isSubmitting}>
                                                <TbSend size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Styles */}
            <style jsx global>{`
                .media-gallery .cursor-pointer {
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .media-gallery .cursor-pointer:hover {
                    opacity: 0.9;
                }
                .media-lightbox-dialog {
                    margin: 0;
                    padding: 0;
                    width: 100vw;
                    height: 100vh;
                    max-width: none !important;
                }
                .media-lightbox-dialog .modal-content {
                    background: transparent !important;
                    box-shadow: none !important;
                }
                .hover-bg-opacity-75:hover {
                    background-color: rgba(33, 37, 41, 0.75) !important;
                }
            `}</style>
        </>
    )
}

export default MediaGallery
