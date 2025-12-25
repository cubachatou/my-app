'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}

export default function StaggerContainer({
  children,
  className = '',
  delay = 0,
  stagger = 0.1,
  duration = 0.6,
}: StaggerContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;

    const container = containerRef.current;
    const items = container.children;

    // Set initial state
    gsap.set(items, {
      opacity: 0,
      y: 40,
      scale: 0.95,
    });

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            gsap.to(items, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration,
              stagger,
              delay,
              ease: 'power3.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(items);
    };
  }, [delay, stagger, duration]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
