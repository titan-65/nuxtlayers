import { gsap } from 'gsap'

/**
 * Composable for GSAP animations
 */
export const useGsapAnimations = () => {
    /**
     * Fade in and slide up animation
     */
    const fadeInUp = (targets: string | Element | Element[], options?: gsap.TweenVars) => {
        return gsap.from(targets, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1,
            ...options
        })
    }

    /**
     * Fade in animation
     */
    const fadeIn = (targets: string | Element | Element[], options?: gsap.TweenVars) => {
        return gsap.from(targets, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.05,
            ...options
        })
    }

    /**
     * Staggered reveal animation for lists/grids
     */
    const staggerReveal = (targets: string | Element | Element[], options?: gsap.TweenVars) => {
        return gsap.from(targets, {
            opacity: 0,
            y: 30,
            scale: 0.95,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            ...options
        })
    }

    /**
     * Terminal typing effect
     */
    const typeIn = (targets: string | Element | Element[], options?: gsap.TweenVars) => {
        return gsap.from(targets, {
            opacity: 0,
            x: -10,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.15,
            ...options
        })
    }

    /**
     * Scale in animation
     */
    const scaleIn = (targets: string | Element | Element[], options?: gsap.TweenVars) => {
        return gsap.from(targets, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: 'back.out(1.7)',
            ...options
        })
    }

    /**
     * Slide in from left
     */
    const slideInLeft = (targets: string | Element | Element[], options?: gsap.TweenVars) => {
        return gsap.from(targets, {
            opacity: 0,
            x: -60,
            duration: 0.8,
            ease: 'power3.out',
            ...options
        })
    }

    /**
     * Slide in from right
     */
    const slideInRight = (targets: string | Element | Element[], options?: gsap.TweenVars) => {
        return gsap.from(targets, {
            opacity: 0,
            x: 60,
            duration: 0.8,
            ease: 'power3.out',
            ...options
        })
    }

    /**
     * Create a timeline for complex animations
     */
    const createTimeline = (options?: gsap.TimelineVars) => {
        return gsap.timeline(options)
    }

    return {
        fadeInUp,
        fadeIn,
        staggerReveal,
        typeIn,
        scaleIn,
        slideInLeft,
        slideInRight,
        createTimeline,
        gsap
    }
}
