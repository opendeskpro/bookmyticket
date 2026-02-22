import React, { useRef, useLayoutEffect, useState } from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from 'motion/react';
import './ScrollVelocity.css';

interface VelocityMapping {
    input: [number, number];
    output: [number, number];
}

interface ScrollVelocityProps {
    children: React.ReactNode;
    velocity?: number;
    className?: string;
    damping?: number;
    stiffness?: number;
    numCopies?: number;
    velocityMapping?: VelocityMapping;
    parallaxClassName?: string;
    scrollerClassName?: string;
    parallaxStyle?: React.CSSProperties;
    scrollerStyle?: React.CSSProperties;
    scrollContainerRef?: React.RefObject<HTMLElement>;
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        function updateWidth() {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        }
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [ref]);

    return width;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
    children,
    velocity = 5,
    className = '',
    damping = 50,
    stiffness = 400,
    numCopies = 4,
    velocityMapping = { input: [0, 1000], output: [0, 5] },
    parallaxClassName = 'parallax',
    scrollerClassName = 'scroller',
    parallaxStyle,
    scrollerStyle,
    scrollContainerRef
}) => {
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: damping ?? 50,
        stiffness: stiffness ?? 400
    });
    const velocityFactor = useTransform(
        smoothVelocity,
        velocityMapping?.input || [0, 1000],
        velocityMapping?.output || [0, 5],
        { clamp: false }
    );

    const copyRef = useRef<HTMLDivElement>(null);
    const copyWidth = useElementWidth(copyRef);

    function wrap(min: number, max: number, v: number): number {
        const range = max - min;
        const mod = (((v - min) % range) + range) % range;
        return mod + min;
    }

    // Calculate generic wrapping logic
    // We move baseX based on velocity. 
    // We wrap it between -copyWidth and 0.
    // This ensures that as soon as one full copy scrolls out, it resets.
    const x = useTransform(baseX, v => {
        if (copyWidth === 0) return '0%';
        return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * velocity * (delta / 1000);

        // Change direction if scrolling happens
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        // Apply scroll velocity effect
        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    const copies = [];
    for (let i = 0; i < numCopies; i++) {
        copies.push(
            <div className={className} key={i} ref={i === 0 ? copyRef : null}>
                {children}
            </div>
        );
    }

    return (
        <div className={parallaxClassName} style={parallaxStyle}>
            <motion.div className={scrollerClassName} style={{ x, ...scrollerStyle }}>
                {copies}
            </motion.div>
        </div>
    );
};

export default ScrollVelocity;
