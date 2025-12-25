'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: number;
  rotate?: number;
  once?: boolean;
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 1,
  direction = 'up',
  distance = 60,
  scale = 1,
  rotate = 0,
  once = true,
}: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (once && hasAnimated.current) return;

    const element = containerRef.current;

    // Set initial state
    const initialState: gsap.TweenVars = {
      opacity: 0,
      scale: scale !== 1 ? scale : 1,
      rotation: rotate,
    };

    switch (direction) {
      case 'up':
        initialState.y = distance;
        break;
      case 'down':
        initialState.y = -distance;
        break;
      case 'left':
        initialState.x = distance;
        break;
      case 'right':
        initialState.x = -distance;
        break;
    }

    gsap.set(element, initialState);

    // Intersection Observer for scroll-triggered animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasAnimated.current = true;
            gsap.to(element, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration,
              delay,
              ease: 'power3.out',
            });

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            gsap.set(element, initialState);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(element);
    };
  }, [delay, duration, direction, distance, scale, rotate, once]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
