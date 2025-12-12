'use client'

import { useState, useCallback, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { TbX, TbChevronLeft, TbChevronRight } from 'react-icons/tb'

type MediaGalleryProps = {
    media: string[]
    className?: string
}

// Component hiển thị media theo phong cách Facebook
const MediaGallery = ({ media, className = '' }: MediaGalleryProps) => {
    const [showLightbox, setShowLightbox] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

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

            {/* Lightbox Modal */}
            <Modal
                show={showLightbox}
                onHide={() => setShowLightbox(false)}
                centered
                size="xl"
                contentClassName="bg-transparent border-0"
                dialogClassName="media-lightbox-dialog"
            >
                <div className="position-relative" style={{ minHeight: '80vh' }}>
                    {/* Close button */}
                    <button
                        className="btn btn-dark btn-icon position-absolute top-0 end-0 m-3 rounded-circle"
                        style={{ zIndex: 10, width: '40px', height: '40px' }}
                        onClick={() => setShowLightbox(false)}
                    >
                        <TbX size={24} />
                    </button>

                    {/* Navigation - Previous */}
                    {media.length > 1 && (
                        <button
                            className="btn btn-dark btn-icon position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle"
                            style={{ zIndex: 10, width: '48px', height: '48px' }}
                            onClick={navigatePrev}
                        >
                            <TbChevronLeft size={28} />
                        </button>
                    )}

                    {/* Image */}
                    <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: '80vh' }}>
                        <img
                            src={media[currentIndex]}
                            alt={`Post media ${currentIndex + 1}`}
                            className="img-fluid rounded"
                            style={{
                                maxHeight: '85vh',
                                maxWidth: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>

                    {/* Navigation - Next */}
                    {media.length > 1 && (
                        <button
                            className="btn btn-dark btn-icon position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle"
                            style={{ zIndex: 10, width: '48px', height: '48px' }}
                            onClick={navigateNext}
                        >
                            <TbChevronRight size={28} />
                        </button>
                    )}

                    {/* Image counter */}
                    {media.length > 1 && (
                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                            <span className="badge bg-dark bg-opacity-75 px-3 py-2 fs-6">
                                {currentIndex + 1} / {media.length}
                            </span>
                        </div>
                    )}

                    {/* Thumbnail strip for 5+ images */}
                    {media.length > 4 && (
                        <div
                            className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center gap-2"
                            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
                        >
                            {media.map((url, idx) => (
                                <div
                                    key={idx}
                                    className={`cursor-pointer rounded overflow-hidden ${idx === currentIndex ? 'border border-2 border-white' : 'opacity-75'}`}
                                    onClick={() => setCurrentIndex(idx)}
                                    style={{ width: '50px', height: '50px' }}
                                >
                                    <img
                                        src={url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
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
                    max-width: 95vw !important;
                }
                .media-lightbox-dialog .modal-content {
                    background: transparent !important;
                    box-shadow: none !important;
                }
            `}</style>
        </>
    )
}

export default MediaGallery
