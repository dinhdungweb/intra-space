'use client'

import { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import { TbCamera, TbMoodSmile, TbSend } from 'react-icons/tb'
import defaultAvatar from '@/assets/images/users/user-1.jpg'
import { CommentType } from './FeedsNew'

export const formatTime = (dateString: string) => {
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

// Helper for rendering tree lines
export const TreeConnector = ({ isLast, isFirst, leftOffset = '-21px' }: { isLast: boolean, isFirst: boolean, leftOffset?: string }) => {
    return (
        <>
            {/* 1. Line from top to avatar anchor (curve start) */}
            <div
                style={{
                    position: 'absolute',
                    left: leftOffset, // Align with avatar center
                    top: isFirst ? '-4px' : '0', // If first, go up a bit more to meet parent line
                    height: isFirst ? '22px' : '18px', // Reach the curve point (approx 18px down)
                    width: '2px',
                    backgroundColor: '#ddd'
                }}
            />

            {/* 2. The Curve */}
            <div
                style={{
                    position: 'absolute',
                    left: leftOffset,
                    top: '10px', // Anchor point
                    width: '16px',
                    height: '12px',
                    borderLeft: '2px solid #ddd',
                    borderBottom: '2px solid #ddd',
                    borderBottomLeftRadius: '8px'
                }}
            />

            {/* 3. Line to next sibling (only if not last) */}
            {!isLast && (
                <div
                    style={{
                        position: 'absolute',
                        left: leftOffset,
                        top: '18px', // Start after the curve anchor
                        bottom: '0', // Go all the way down to connect to next sibling
                        width: '2px',
                        backgroundColor: '#ddd'
                    }}
                />
            )}
        </>
    )
}

type ReplyItemProps = {
    reply: CommentType
    parentCommentId: string
    postId: string
    onComment: (postId: string, content: string, parentId?: string) => Promise<void> | void
    formatTime: (dateString: string) => string
    parentAuthorName: string
}

export const ReplyItem = ({ reply, parentCommentId, postId, onComment, formatTime, parentAuthorName }: ReplyItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await onComment(postId, replyText, reply.id)
            setReplyText('')
            setShowReplyForm(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="position-relative">
            <div className="d-flex align-items-start py-1 position-relative">
                {/* Bridge Line - connects Avatar to bottom of content area (start of nested replies) */}
                {reply.replies && reply.replies.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            left: '11px', // Center of 24px avatar (item start at 0, avatar center ~12px => 11px for 2px line)
                            top: '28px', // Below avatar (24px + 4px padding-top)
                            bottom: '0', // To bottom of content row
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

                    {/* Reply form */}
                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="d-flex align-items-center mt-2">
                            <Image
                                src={defaultAvatar}
                                className="me-2 avatar-xs rounded-circle flex-shrink-0"
                                width={20}
                                height={20}
                                alt="user"
                            />
                            <div className="w-100 position-relative">
                                <input
                                    type="text"
                                    className="form-control rounded-pill pe-5"
                                    placeholder={`Trả lời ${reply.author.name}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    style={{ paddingRight: '120px' }}
                                    autoFocus
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
                    )}
                </div>
            </div>

            {/* Nested replies (level 3+) */}
            {reply.replies && reply.replies.length > 0 && (
                <div style={{ marginLeft: '36px' }}>
                    {reply.replies.map((nestedReply, index) => {
                        const isLast = index === reply.replies!.length - 1
                        return (
                            <div key={nestedReply.id} className="position-relative">
                                {/* Tree Lines for Level 3 - use -25px offset to align with parent's Bridge Line at 11px (36-25=11) */}
                                <TreeConnector isLast={isLast} isFirst={index === 0} leftOffset="-25px" />
                                <ReplyItem
                                    reply={nestedReply}
                                    parentCommentId={parentCommentId}
                                    postId={postId}
                                    onComment={onComment}
                                    formatTime={formatTime}
                                    parentAuthorName={reply.author.name}
                                />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

type CommentItemProps = {
    comment: CommentType
    postId: string
    onComment: (postId: string, content: string, parentId?: string) => Promise<void> | void
    formatTime: (dateString: string) => string
}

export const CommentItem = ({ comment, postId, onComment, formatTime }: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await onComment(postId, replyText, comment.id)
            setReplyText('')
            setShowReplyForm(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mb-3 position-relative">
            {/* Main comment row */}
            <div className="d-flex align-items-start position-relative">
                {/* Bridge Line - connects Avatar to bottom of content area (start of replies) */}
                {comment.replies && comment.replies.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            left: '15px', // Center of 32px avatar
                            top: '36px', // Below avatar
                            bottom: '0', // To bottom of content row
                            width: '2px',
                            backgroundColor: '#ddd'
                        }}
                    />
                )}
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

                    {/* Action row */}
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
                    </div>

                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="d-flex align-items-center mt-2">
                            <Image
                                src={defaultAvatar}
                                className="me-2 avatar-xs rounded-circle flex-shrink-0"
                                width={24}
                                height={24}
                                alt="user"
                            />
                            <div className="w-100 position-relative">
                                <input
                                    type="text"
                                    className="form-control rounded-pill pe-5"
                                    placeholder={`Trả lời ${comment.author.name}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    style={{ paddingRight: '120px' }}
                                    autoFocus
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
                    )}
                </div>
            </div>

            {/* Display replies (Level 2) */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: '36px', marginTop: '4px' }}>
                    {comment.replies.map((reply, index) => {
                        const isLast = index === comment.replies!.length - 1
                        return (
                            <div key={reply.id} className="position-relative">
                                {/* Tree Lines for Level 2 */}
                                <TreeConnector isLast={isLast} isFirst={index === 0} />
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
