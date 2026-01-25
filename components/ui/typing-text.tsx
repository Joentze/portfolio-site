"use client"

export const title = "Typing Text"

import { gsap } from "gsap"
import {
    type ElementType,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"

interface TypingTextProps {
    className?: string
    showCursor?: boolean
    hideCursorWhileTyping?: boolean
    cursorCharacter?: string | React.ReactNode
    cursorBlinkDuration?: number
    cursorClassName?: string
    text: string | string[]
    as?: ElementType
    typingSpeed?: number
    initialDelay?: number
    pauseDuration?: number
    deletingSpeed?: number
    loop?: boolean
    textColors?: string[]
    variableSpeed?: { min: number; max: number }
    onSentenceComplete?: (sentence: string, index: number) => void
    startOnVisible?: boolean
    reverseMode?: boolean
    finalText?: string
    onLoopComplete?: () => void
}

const TypingText = ({
    text,
    as: Component = "div",
    typingSpeed = 50,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 30,
    loop = true,
    className = "",
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorCharacter = "|",
    cursorClassName = "",
    cursorBlinkDuration = 0.5,
    textColors = [],
    variableSpeed,
    onSentenceComplete,
    startOnVisible = false,
    reverseMode = false,
    finalText,
    onLoopComplete,
    ...props
}: TypingTextProps & React.HTMLAttributes<HTMLElement>) => {
    const [displayedText, setDisplayedText] = useState("")
    const [currentCharIndex, setCurrentCharIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(!startOnVisible)
    const [loopComplete, setLoopComplete] = useState(false)
    const cursorRef = useRef<HTMLSpanElement>(null)
    const containerRef = useRef<HTMLElement>(null)

    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

    const getRandomSpeed = useCallback(() => {
        if (!variableSpeed) {
            return typingSpeed
        }
        const { min, max } = variableSpeed
        return Math.random() * (max - min) + min
    }, [variableSpeed, typingSpeed])

    const getCurrentTextColor = () => {
        if (textColors.length === 0) {
            return "currentColor"
        }
        return textColors[currentTextIndex % textColors.length]
    }

    useEffect(() => {
        if (!(startOnVisible && containerRef.current)) {
            return
        }

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                    }
                })
            },
            { threshold: 0.1 },
        )

        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [startOnVisible])

    useEffect(() => {
        if (showCursor && cursorRef.current) {
            gsap.set(cursorRef.current, { opacity: 1 })
            gsap.to(cursorRef.current, {
                opacity: 0,
                duration: cursorBlinkDuration,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
            })
        }
    }, [showCursor, cursorBlinkDuration])

    useEffect(() => {
        if (!isVisible) {
            return
        }

        // Handle final text typing
        if (loopComplete && finalText) {
            const timeout = setTimeout(() => {
                if (currentCharIndex < finalText.length) {
                    setDisplayedText(prev => prev + finalText[currentCharIndex])
                    setCurrentCharIndex(prev => prev + 1)
                }
            }, variableSpeed ? getRandomSpeed() : typingSpeed)

            return () => clearTimeout(timeout)
        }

        let timeout: NodeJS.Timeout

        const currentText = textArray[currentTextIndex]
        const processedText = reverseMode ? currentText.split("").reverse().join("") : currentText

        const executeTypingAnimation = () => {
            if (isDeleting) {
                if (displayedText === "") {
                    setIsDeleting(false)
                    if (currentTextIndex === textArray.length - 1 && !loop) {
                        setLoopComplete(true)
                        if (onLoopComplete) {
                            onLoopComplete()
                        }
                        if (finalText) {
                            setCurrentCharIndex(0)
                            timeout = setTimeout(() => {
                                /* intentional pause before final text */
                            }, pauseDuration)
                        }
                        return
                    }

                    if (onSentenceComplete) {
                        onSentenceComplete(textArray[currentTextIndex], currentTextIndex)
                    }

                    setCurrentTextIndex(prev => (prev + 1) % textArray.length)
                    setCurrentCharIndex(0)
                    timeout = setTimeout(() => {
                        /* intentional pause between sentences */
                    }, pauseDuration)
                } else {
                    timeout = setTimeout(() => {
                        setDisplayedText(prev => prev.slice(0, -1))
                    }, deletingSpeed)
                }
            } else if (currentCharIndex < processedText.length) {
                timeout = setTimeout(
                    () => {
                        setDisplayedText(prev => prev + processedText[currentCharIndex])
                        setCurrentCharIndex(prev => prev + 1)
                    },
                    variableSpeed ? getRandomSpeed() : typingSpeed,
                )
            } else if (textArray.length > 1) {
                timeout = setTimeout(() => {
                    setIsDeleting(true)
                }, pauseDuration)
            }
        }

        if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
            timeout = setTimeout(executeTypingAnimation, initialDelay)
        } else {
            executeTypingAnimation()
        }

        return () => clearTimeout(timeout)
    }, [
        currentCharIndex,
        displayedText,
        isDeleting,
        typingSpeed,
        deletingSpeed,
        pauseDuration,
        textArray,
        currentTextIndex,
        loop,
        initialDelay,
        isVisible,
        reverseMode,
        variableSpeed,
        onSentenceComplete,
        getRandomSpeed,
        loopComplete,
        finalText,
        onLoopComplete,
    ])

    const shouldHideCursor =
        hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting)

    // Hide cursor when loop is complete and final text is done (or no final text)
    const isTypingComplete = loopComplete && (!finalText || currentCharIndex >= finalText.length)

    return (
        <Component
            ref={containerRef}
            className={`inline-block whitespace-pre-wrap tracking-tight ${className}`}
            {...props}
        >
            <span className="inline" style={{ color: getCurrentTextColor() }}>
                {displayedText}
            </span>
            {showCursor && !isTypingComplete && (
                <span
                    className={`inline-block opacity-100 ${shouldHideCursor ? "hidden" : ""} ${cursorCharacter === "|"
                        ? `h-5 w-[1px] translate-y-1 bg-foreground ${cursorClassName}`
                        : `ml-1 ${cursorClassName}`
                        }`}
                    ref={cursorRef}
                >
                    {cursorCharacter === "|" ? "" : cursorCharacter}
                </span>
            )}
        </Component>
    )
}

export default TypingText
