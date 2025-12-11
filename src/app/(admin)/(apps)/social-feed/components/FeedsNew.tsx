'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button, Card, CardBody, Spinner, Alert, Row, Col } from 'react-bootstrap'
import { TbCamera, TbMapPin, TbMoodSmile, TbUser, TbX } from 'react-icons/tb'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import PostCard from './PostCard'

export type PostType = {
    id: string
    content: string
    media: string[]
    createdAt: string
    author: {
        id: string
        name: string
        email: string
        avatar: string | null
    }
    comments: CommentType[]
    likes: { userId: string }[]
    _count: {
        comments: number
        likes: number
    }
}

export type CommentType = {
    id: string
    content: string
    createdAt: string
    parentId?: string | null
    author: {
        id: string
        name: string
        avatar: string | null
    }
    replies?: CommentType[]
}

// Common emojis
const EMOJIS = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👏', '🎉', '🔥', '❤️', '💯', '✨', '🚀', '💪', '🙌']

const CreatePostCard = ({ onPostCreated }: { onPostCreated: () => void }) => {
    const [content, setContent] = useState('')
    const [media, setMedia] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() && media.length === 0) return

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, media }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Lỗi khi đăng bài')
            }

            setContent('')
            setMedia([])
            onPostCreated()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        setError('')

        try {
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i])
            }

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Lỗi khi tải ảnh')
            }

            const data = await res.json()
            setMedia(prev => [...prev, ...data.urls])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const removeMedia = (index: number) => {
        setMedia(prev => prev.filter((_, i) => i !== index))
    }

    const insertEmoji = (emoji: string) => {
        const textarea = textareaRef.current
        if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newContent = content.substring(0, start) + emoji + content.substring(end)
            setContent(newContent)
            // Move cursor after emoji
            setTimeout(() => {
                textarea.setSelectionRange(start + emoji.length, start + emoji.length)
                textarea.focus()
            }, 0)
        } else {
            setContent(prev => prev + emoji)
        }
        setShowEmojiPicker(false)
    }

    return (
        <Card>
            <CardBody>
                <h5 className="mb-2">What's on your mind?</h5>

                {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <textarea
                        ref={textareaRef}
                        rows={3}
                        className="form-control"
                        placeholder="Share your thoughts..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                    />

                    {/* Media Preview */}
                    {media.length > 0 && (
                        <Row className="g-2 mt-2">
                            {media.map((url, idx) => (
                                <Col key={idx} xs={4} md={3}>
                                    <div className="position-relative">
                                        <Image
                                            src={url}
                                            alt={`Upload ${idx + 1}`}
                                            width={100}
                                            height={100}
                                            className="img-fluid rounded"
                                            style={{ objectFit: 'cover', width: '100%', height: '80px' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-0"
                                            style={{ width: '20px', height: '20px', lineHeight: '1' }}
                                            onClick={() => removeMedia(idx)}
                                        >
                                            <TbX size={12} />
                                        </button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}

                    <div className="d-flex pt-2 justify-content-between align-items-center">
                        <div className="d-flex gap-1 position-relative">
                            <Button variant="light" size="sm" className="btn-icon" title="Tag People" type="button">
                                <TbUser className="fs-md" />
                            </Button>
                            <Button variant="light" size="sm" className="btn-icon" title="Add Location" type="button">
                                <TbMapPin className="fs-md" />
                            </Button>

                            {/* Upload Photo Button */}
                            <Button
                                variant="light"
                                size="sm"
                                className="btn-icon"
                                title="Upload Photo"
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? <Spinner size="sm" /> : <TbCamera className="fs-md" />}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                className="d-none"
                                onChange={handleFileSelect}
                            />

                            {/* Emoji Picker Button */}
                            <div className="position-relative">
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="btn-icon"
                                    title="Add Emoji"
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <TbMoodSmile className="fs-md" />
                                </Button>

                                {/* Emoji Picker Dropdown */}
                                {showEmojiPicker && (
                                    <div
                                        className="position-absolute bg-white border rounded shadow-sm p-2"
                                        style={{ bottom: '100%', left: 0, width: '200px', marginBottom: '5px', zIndex: 1000 }}
                                    >
                                        <div className="d-flex flex-wrap gap-1">
                                            {EMOJIS.map((emoji, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="btn btn-light btn-sm p-1"
                                                    style={{ fontSize: '18px', lineHeight: 1 }}
                                                    onClick={() => insertEmoji(emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button type="submit" variant="dark" size="sm" disabled={loading || (!content.trim() && media.length === 0)}>
                            {loading ? <Spinner size="sm" /> : 'Post'}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    )
}

const FeedList = () => {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<PostType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/posts')

            if (!res.ok) {
                throw new Error('Lỗi khi tải bài viết')
            }

            const data = await res.json()
            setPosts(data.posts)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const handleLike = async (postId: string) => {
        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
            })

            if (!res.ok) {
                throw new Error('Lỗi khi thao tác')
            }

            const data = await res.json()

            // Update local state
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    const userId = (session?.user as any)?.id
                    return {
                        ...post,
                        _count: { ...post._count, likes: data.likesCount },
                        likes: data.liked
                            ? [...post.likes, { userId }]
                            : post.likes.filter(l => l.userId !== userId)
                    }
                }
                return post
            }))
        } catch (err) {
            console.error('Like error:', err)
        }
    }

    const handleComment = async (postId: string, content: string, parentId?: string) => {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, parentId }),
            })

            if (!res.ok) {
                throw new Error('Lỗi khi bình luận')
            }

            const data = await res.json()

            // Update local state
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    if (parentId) {
                        // Helper function to add reply to nested structure
                        const addReplyToComment = (comments: CommentType[]): CommentType[] => {
                            return comments.map(comment => {
                                // Check if this comment is the parent
                                if (comment.id === parentId) {
                                    return {
                                        ...comment,
                                        replies: [...(comment.replies || []), data.comment]
                                    }
                                }
                                // Check in nested replies
                                if (comment.replies && comment.replies.length > 0) {
                                    return {
                                        ...comment,
                                        replies: addReplyToComment(comment.replies)
                                    }
                                }
                                return comment
                            })
                        }

                        return {
                            ...post,
                            comments: addReplyToComment(post.comments),
                            _count: { ...post._count, comments: post._count.comments + 1 }
                        }
                    } else {
                        // Add top-level comment
                        return {
                            ...post,
                            comments: [...post.comments, { ...data.comment, replies: [] }],
                            _count: { ...post._count, comments: post._count.comments + 1 }
                        }
                    }
                }
                return post
            }))
        } catch (err) {
            console.error('Comment error:', err)
        }
    }

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Lỗi khi xóa bài viết')
            }

            setPosts(prev => prev.filter(post => post.id !== postId))
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    if (loading) {
        return (
            <Card>
                <CardBody className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 mb-0 text-muted">Loading posts...</p>
                </CardBody>
            </Card>
        )
    }

    if (error) {
        return (
            <Alert variant="danger">{error}</Alert>
        )
    }

    return (
        <>
            {posts.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-5">
                        <p className="mb-0 text-muted">No posts yet. Be the first to share something!</p>
                    </CardBody>
                </Card>
            ) : (
                posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={(session?.user as any)?.id}
                        onLike={handleLike}
                        onComment={handleComment}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </>
    )
}

const Feeds = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    const handlePostCreated = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <>
            <CreatePostCard onPostCreated={handlePostCreated} />
            <FeedList key={refreshKey} />
        </>
    )
}

export default Feeds
