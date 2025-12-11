'use client'

import { useState } from 'react'
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import {
    TbArrowBackUp,
    TbDotsVertical,
    TbEdit,
    TbFlag,
    TbHeart,
    TbHeartFilled,
    TbPin,
    TbShare,
    TbShare3,
    TbTrash,
} from 'react-icons/tb'
import { PostType } from './FeedsNew'

import defaultAvatar from '@/assets/images/users/user-1.jpg'

type PostCardProps = {
    post: PostType
    currentUserId?: string
    onLike: (postId: string) => void
    onComment: (postId: string, content: string, parentId?: string) => void
    onDelete: (postId: string) => void
}

const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    if (days < 7) return `${days} days ago`

    return date.toLocaleDateString('en-US')
}

// ReplyItem component for individual reply with reply functionality
type ReplyItemProps = {
    reply: import('./FeedsNew').CommentType
    parentCommentId: string
    postId: string
    onComment: (postId: string, content: string, parentId?: string) => void
    formatTime: (dateString: string) => string
    parentAuthorName: string
}

const ReplyItem = ({ reply, parentCommentId, postId, onComment, formatTime, parentAuthorName }: ReplyItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState('')

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim()) return

        // Reply to this reply (creates nested level 3 comment)
        onComment(postId, replyText, reply.id)
        setReplyText('')
        setShowReplyForm(false)
    }

    return (
        <div className="d-flex align-items-start py-1 position-relative">
            {/* Vertical line for nested replies */}
            {reply.replies && reply.replies.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        left: '11px',
                        top: '34px',
                        bottom: '100px',
                        width: '2px',
                        backgroundColor: '#ddd'
                    }}
                />
            )}
            <Image
                src={reply.author.avatar || defaultAvatar.src}
                className="me-2 avatar-xs rounded-circle flex-shrink-0"
                width={24}
                height={24}
                alt={reply.author.name}
                style={{ position: 'relative', zIndex: 1 }}
            />
            <div className="w-100">
                {/* Reply bubble */}
                <div className="bg-light rounded-3 px-3 py-2" style={{ display: 'inline-block', maxWidth: '100%' }}>
                    <Link href="/users/profile" className="link-reset fw-semibold fs-13">
                        {reply.author.name}
                    </Link>
                    <p className="mb-0 mt-1 fs-13" style={{ whiteSpace: 'pre-wrap' }}>{reply.content}</p>
                </div>

                {/* Action row */}
                <div className="d-flex align-items-center gap-3 mt-1 ps-2">
                    <small className="text-muted fs-12">{formatTime(reply.createdAt)}</small>
                    <span className="text-muted fs-12 fw-medium" style={{ cursor: 'pointer' }}>Thích</span>
                    <span
                        className="text-muted fs-12 fw-medium"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                        Trả lời
                    </span>
                </div>

                {/* Reply form for this reply */}
                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="d-flex align-items-center mt-2">
                        <Image
                            src={defaultAvatar}
                            className="me-2 avatar-xs rounded-circle flex-shrink-0"
                            width={20}
                            height={20}
                            alt="user"
                        />
                        <div className="w-100">
                            <input
                                type="text"
                                className="form-control form-control-sm rounded-pill"
                                placeholder={`Trả lời ${reply.author.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </form>
                )}

                {/* Nested replies (level 3) */}
                {reply.replies && reply.replies.length > 0 && (
                    <div>
                        {reply.replies.map((nestedReply) => (
                            <div key={nestedReply.id} className="position-relative">
                                {/* Curved connector */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '-25px',
                                        top: '0px',
                                        width: '16px',
                                        height: '18px',
                                        borderLeft: '2px solid #ddd',
                                        borderBottom: '2px solid #ddd',
                                        borderBottomLeftRadius: '6px'
                                    }}
                                />
                                <ReplyItem
                                    reply={nestedReply}
                                    parentCommentId={parentCommentId}
                                    postId={postId}
                                    onComment={onComment}
                                    formatTime={formatTime}
                                    parentAuthorName={reply.author.name}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// CommentItem component for nested replies
type CommentItemProps = {
    comment: import('./FeedsNew').CommentType
    postId: string
    onComment: (postId: string, content: string, parentId?: string) => void
    formatTime: (dateString: string) => string
}

const CommentItem = ({ comment, postId, onComment, formatTime }: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState('')

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim()) return

        onComment(postId, replyText, comment.id)
        setReplyText('')
        setShowReplyForm(false)
    }

    return (
        <div className="mb-3 position-relative">
            {/* Single continuous vertical line from avatar through all replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div
                    className="position-absolute"
                    style={{
                        left: '15px',
                        top: '36px',
                        bottom: '100px',
                        width: '2px',
                        backgroundColor: '#ddd'
                    }}
                />
            )}

            {/* Main comment row */}
            <div className="d-flex align-items-start">
                <Image
                    className="avatar-sm rounded-circle flex-shrink-0"
                    src={comment.author.avatar || defaultAvatar.src}
                    width={32}
                    height={32}
                    alt={comment.author.name}
                    style={{ position: 'relative', zIndex: 1 }}
                />
                <div className="ms-2 w-100">
                    {/* Comment bubble */}
                    <div className="bg-light rounded-3 px-3 py-2" style={{ display: 'inline-block', maxWidth: '100%' }}>
                        <Link href="/users/profile" className="link-reset fw-semibold fs-14">
                            {comment.author.name}
                        </Link>
                        <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                    </div>

                    {/* Action row: time, Like, Reply, Share */}
                    <div className="d-flex align-items-center gap-3 mt-1 ps-2">
                        <small className="text-muted">{formatTime(comment.createdAt)}</small>
                        <span className="text-muted fs-13 fw-medium" style={{ cursor: 'pointer' }}>Thích</span>
                        <span
                            className="text-muted fs-13 fw-medium"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                            Trả lời
                        </span>
                        <span className="text-muted fs-13 fw-medium" style={{ cursor: 'pointer' }}>Chia sẻ</span>
                    </div>

                    {/* Reply form */}
                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="d-flex align-items-center mt-2">
                            <Image
                                src={defaultAvatar}
                                className="me-2 avatar-xs rounded-circle flex-shrink-0"
                                width={24}
                                height={24}
                                alt="user"
                            />
                            <div className="w-100">
                                <input
                                    type="text"
                                    className="form-control form-control-sm rounded-pill"
                                    placeholder={`Trả lời ${comment.author.name}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Display replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: '36px', marginTop: '4px' }}>
                    {comment.replies.map((reply, index) => {
                        const isLast = index === comment.replies!.length - 1
                        return (
                            <div key={reply.id} className="position-relative">
                                {/* Curved connector from vertical line to reply avatar */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '-21px',
                                        top: '0',
                                        width: '16px',
                                        height: '18px',
                                        borderLeft: '2px solid #ddd',
                                        borderBottom: '2px solid #ddd',
                                        borderBottomLeftRadius: '8px'
                                    }}
                                />
                                <ReplyItem
                                    reply={reply}
                                    parentCommentId={comment.id}
                                    postId={postId}
                                    onComment={onComment}
                                    formatTime={formatTime}
                                    parentAuthorName={comment.author.name}
                                />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const PostCard = ({ post, currentUserId, onLike, onComment, onDelete }: PostCardProps) => {
    const [commentText, setCommentText] = useState('')
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [showAllComments, setShowAllComments] = useState(false)

    const isLiked = post.likes.some(like => like.userId === currentUserId)
    const isOwner = post.author.id === currentUserId

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentText.trim()) return

        onComment(post.id, commentText)
        setCommentText('')
    }

    return (
        <Card>
            <CardBody className="pb-2">
                <div className="d-flex align-items-center mb-2">
                    <Image
                        className="me-2 avatar-md rounded-circle"
                        src={post.author.avatar || defaultAvatar.src}
                        width={48}
                        height={48}
                        alt={post.author.name}
                    />
                    <div className="w-100">
                        <h5 className="m-0">
                            <Link href="/users/profile" className="link-reset">
                                {post.author.name}
                            </Link>
                        </h5>
                        <p className="text-muted mb-0">
                            <small>{formatTime(post.createdAt)}</small>
                        </p>
                    </div>
                    <Dropdown className="ms-auto">
                        <DropdownToggle as={'button'} className="bg-transparent border-0 text-muted drop-arrow-none card-drop p-0">
                            <TbDotsVertical className="fs-lg" />
                        </DropdownToggle>
                        <DropdownMenu align="end" className="dropdown-menu-end">
                            {isOwner && (
                                <>
                                    <DropdownItem>
                                        <TbEdit className="me-2" />
                                        Edit Post
                                    </DropdownItem>
                                    <DropdownItem onClick={() => onDelete(post.id)}>
                                        <TbTrash className="me-2" />
                                        Delete Post
                                    </DropdownItem>
                                </>
                            )}
                            <DropdownItem>
                                <TbShare className="me-2" />
                                Share
                            </DropdownItem>
                            <DropdownItem>
                                <TbPin className="me-2" />
                                Pin to Top
                            </DropdownItem>
                            <DropdownItem>
                                <TbFlag className="me-2" />
                                Report Post
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                {/* Media Gallery - matching original template layout */}
                {post.media.length > 0 && (
                    <div className="mb-2">
                        {post.media.length === 1 && (
                            <img
                                src={post.media[0]}
                                alt=""
                                className="img-fluid w-100 rounded"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        )}
                        {post.media.length === 2 && (
                            <div className="row g-1">
                                {post.media.map((url, idx) => (
                                    <div key={idx} className="col-6">
                                        <img
                                            src={url}
                                            alt=""
                                            className="img-fluid w-100 rounded"
                                            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {post.media.length === 3 && (
                            <div className="row g-1">
                                <div className="col-md-6">
                                    <img
                                        src={post.media[0]}
                                        alt=""
                                        className="img-fluid w-100 h-100 rounded"
                                        style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-6 d-flex flex-column gap-1">
                                    <img
                                        src={post.media[1]}
                                        alt=""
                                        className="img-fluid w-100 rounded"
                                        style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                                    />
                                    <img
                                        src={post.media[2]}
                                        alt=""
                                        className="img-fluid w-100 rounded"
                                        style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        )}
                        {post.media.length >= 4 && (
                            <div className="row g-1">
                                {post.media.slice(0, 4).map((url, idx) => (
                                    <div key={idx} className="col-6">
                                        <div className="position-relative">
                                            <img
                                                src={url}
                                                alt=""
                                                className="img-fluid w-100 rounded"
                                                style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                                            />
                                            {idx === 3 && post.media.length > 4 && (
                                                <div
                                                    className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded d-flex align-items-center justify-content-center"
                                                >
                                                    <span className="text-white fs-4 fw-bold">+{post.media.length - 4}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Comments Section - matching original template */}
                {post.comments.length > 0 && (
                    <div className="bg-light-subtle mx-n3 p-3 border-top border-bottom border-dashed">
                        {(() => {
                            // Logic: Show max 2 comments OR 1 comment + 1 reply (unless showAllComments is true)
                            const firstComment = post.comments[0]
                            const hasReplies = firstComment?.replies && firstComment.replies.length > 0
                            const totalComments = post.comments.length
                            const totalReplies = post.comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)
                            const showViewMore = !showAllComments && (totalComments > 1 || totalReplies > 0)

                            // Prepare comments to display
                            let displayComments = post.comments
                            if (!showAllComments) {
                                // Show only 1 comment without replies
                                displayComments = [{
                                    ...firstComment,
                                    replies: []
                                }]
                            }

                            const hiddenCount = totalComments + totalReplies - displayComments.length - (displayComments[0]?.replies?.length || 0)

                            return (
                                <>
                                    {showViewMore && hiddenCount > 0 && (
                                        <div className="mb-2">
                                            <span
                                                className="text-primary fs-13 fw-medium"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setShowAllComments(true)}
                                            >
                                                Xem thêm {hiddenCount} bình luận
                                            </span>
                                        </div>
                                    )}
                                    {displayComments.map(comment => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            postId={post.id}
                                            onComment={onComment}
                                            formatTime={formatTime}
                                        />
                                    ))}
                                </>
                            )
                        })()}

                        {/* Add Comment Input - always show in comments section */}
                        <form onSubmit={handleCommentSubmit} className="d-flex align-items-start mt-3">
                            <Link className="pe-2" href="">
                                <Image
                                    src={defaultAvatar}
                                    className="rounded-circle"
                                    alt="user"
                                    height={31}
                                    width={31}
                                />
                            </Link>
                            <div className="w-100">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {/* Action Buttons - matching original template */}
                <div className="mt-2">
                    <span
                        className="btn btn-sm fs-sm btn-link text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowCommentForm(!showCommentForm)}
                    >
                        <TbArrowBackUp className="me-1" /> Reply
                    </span>
                    <span
                        className={`btn btn-sm fs-sm btn-link ${isLiked ? '' : 'text-muted'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => onLike(post.id)}
                    >
                        <span className="align-middle">
                            {isLiked ? <><TbHeartFilled className="text-danger" /> Liked!</> : <><TbHeart className="text-muted" /> Like</>}
                        </span>
                    </span>
                    <Link href="" className="btn btn-sm fs-sm btn-link text-muted">
                        <TbShare3 className="me-1" /> Share
                    </Link>
                </div>

                {/* Comment form - show when Reply is clicked and no comments yet */}
                {showCommentForm && post.comments.length === 0 && (
                    <div className="bg-light-subtle mx-n3 p-3 border-top border-dashed">
                        <form onSubmit={handleCommentSubmit} className="d-flex align-items-start">
                            <Link className="pe-2" href="">
                                <Image
                                    src={defaultAvatar}
                                    className="rounded-circle"
                                    alt="user"
                                    height={31}
                                    width={31}
                                />
                            </Link>
                            <div className="w-100">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </form>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}

export default PostCard

