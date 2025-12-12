'use client'

import { useState } from 'react'
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner } from 'react-bootstrap'
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
    TbCamera,
    TbMoodSmile,
    TbSend,
} from 'react-icons/tb'
import { PostType } from './FeedsNew'
import MediaGallery from './MediaGallery'
import { CommentItem, formatTime, ReplyItem, TreeConnector } from './FeedComponents'

import defaultAvatar from '@/assets/images/users/user-1.jpg'

type PostCardProps = {
    post: PostType
    currentUserId?: string
    onLike: (postId: string) => void
    onComment: (postId: string, content: string, parentId?: string) => Promise<void> | void
    onDelete: (postId: string) => void
}



const PostCard = ({ post, currentUserId, onLike, onComment, onDelete }: PostCardProps) => {
    const [commentText, setCommentText] = useState('')
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [showAllComments, setShowAllComments] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isLiked = post.likes.some(like => like.userId === currentUserId)
    const isOwner = post.author.id === currentUserId

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

                {/* Media Gallery - Facebook style */}
                {post.media.length > 0 && (
                    <div className="mb-2 mx-n3">
                        <MediaGallery
                            media={post.media}
                            post={post}
                            onComment={onComment}
                            onLike={onLike}
                            currentUserId={currentUserId}
                        />
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

                        {/* Add Comment Input - always show when comments are displayed */}
                        <form onSubmit={handleCommentSubmit} className="d-flex align-items-center mt-3">
                            <Link className="pe-2" href="">
                                <Image
                                    src={defaultAvatar}
                                    className="rounded-circle"
                                    alt="user"
                                    height={31}
                                    width={31}
                                />
                            </Link>
                            <div className="w-100 position-relative">
                                <input
                                    type="text"
                                    className="form-control rounded-pill pe-5"
                                    placeholder="Viết bình luận..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
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
                        <form onSubmit={handleCommentSubmit} className="d-flex align-items-center">
                            <Link className="pe-2" href="">
                                <Image
                                    src={defaultAvatar}
                                    className="rounded-circle"
                                    alt="user"
                                    height={31}
                                    width={31}
                                />
                            </Link>
                            <div className="w-100 position-relative">
                                <input
                                    type="text"
                                    className="form-control rounded-pill pe-5"
                                    placeholder="Viết bình luận..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
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
                    </div>
                )}
            </CardBody>
        </Card>
    )
}

export default PostCard

