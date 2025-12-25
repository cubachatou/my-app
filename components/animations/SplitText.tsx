'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

interface SplitTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  yOffset?: number;
  splitBy?: 'chars' | 'words' | 'lines';
}

export default function SplitText({
  children,
  className = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.8,
  yOffset = 100,
  splitBy = 'chars',
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const container = containerRef.current;
    const text = container.textContent || '';
    container.innerHTML = '';

    const elements: HTMLSpanElement[] = [];

    if (splitBy === 'chars') {
      // Split into words first to handle spacing
      const words = text.split(' ');
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        word.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          charSpan.style.opacity = '0';
          charSpan.style.transform = `translateY(${yOffset}px) rotate(10deg)`;
          elements.push(charSpan);
          wordSpan.appendChild(charSpan);
        });

        container.appendChild(wordSpan);

        // Add space between words
        if (wordIndex < words.length - 1) {
          const space = document.createTextNode(' ');
          container.appendChild(space);
        }
      });
    } else if (splitBy === 'words') {
      const words = text.split(' ');
      words.forEach((word, idx) => {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        wordSpan.style.display = 'inline-block';
        wordSpan.style.opacity = '0';
        wordSpan.style.transform = `translateY(${yOffset}px)`;
        elements.push(wordSpan);
        container.appendChild(wordSpan);

        if (idx < words.length - 1) {
          const space = document.createTextNode(' ');
          container.appendChild(space);
        }
      });
    } else {
      // lines - treat as single line
      const lineSpan = document.createElement('span');
      lineSpan.textContent = text;
      lineSpan.style.display = 'inline-block';
      lineSpan.style.opacity = '0';
      lineSpan.style.transform = `translateY(${yOffset}px)`;
      elements.push(lineSpan);
      container.appendChild(lineSpan);
    }

    // Animate with GSAP
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration,
      stagger,
      delay,
      ease: 'power4.out',
    });

    return () => {
      gsap.killTweensOf(elements);
    };
  }, [delay, stagger, duration, yOffset, splitBy]);

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
      {children}
    </div>
  );
}
