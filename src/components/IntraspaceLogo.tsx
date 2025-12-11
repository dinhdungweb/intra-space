import React from 'react'

type LogoProps = {
    className?: string
    size?: number
    color?: string
}

export const LogoIcon = ({ className, size = 32, color = 'currentColor' }: LogoProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path d="M16 2L4 9V23L16 30L28 23V9L16 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 12L4 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 12L28 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 12V25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 23L16 25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 23L16 25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="12" r="3" fill={color} />
        </svg>
    )
}

type LogoFullProps = {
    className?: string
    iconSize?: number
    textSize?: string
    mode?: 'light' | 'dark' // light mode = dark text, dark mode = light text
    height?: number
}

export const LogoFull = ({ className, iconSize = 32, mode = 'light', height }: LogoFullProps) => {
    const textColor = mode === 'light' ? 'text-dark' : 'text-white'
    const primaryColor = 'text-primary'

    return (
        <div
            className={`d-inline-flex align-items-center justify-content-center gap-2 ${className || ''}`}
            style={height ? { height: `${height}px` } : undefined}
        >
            <LogoIcon size={iconSize} className="text-primary" />
            <span className={`fw-bold ${textColor}`} style={{ fontSize: '22px', letterSpacing: '-0.5px', lineHeight: 1 }}>
                Intra<span className={primaryColor}>space</span>
            </span>
        </div>
    )
}

