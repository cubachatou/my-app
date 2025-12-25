'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Master timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
      });

      // Background orbs
      if (decorRef.current) {
        tl.fromTo(
          decorRef.current.children,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, stagger: 0.2 },
          0
        );
      }

      // Badge animation
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 30, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 },
          0.2
        );
      }

      // Title split animation
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.title-line');
        lines.forEach((line, idx) => {
          const chars = line.querySelectorAll('.title-char');
          tl.fromTo(
            chars,
            {
              opacity: 0,
              y: 120,
              rotationX: -80,
              transformOrigin: 'top center',
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 1,
              stagger: 0.025,
              ease: 'power4.out',
            },
            0.4 + idx * 0.15
          );
        });
      }

      // Subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.9
        );
      }

      // CTA buttons
      if (ctaRef.current) {
        const buttons = ctaRef.current.children;
        tl.fromTo(
          buttons,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          1.1
        );
      }

      // Stats
      if (statsRef.current) {
        const stats = statsRef.current.children;
        tl.fromTo(
          stats,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          1.3
        );

        // Animate stat numbers
        const statNumbers = statsRef.current.querySelectorAll('.stat-number');
        statNumbers.forEach((el) => {
          const target = parseInt(el.getAttribute('data-value') || '0', 10);
          const obj = { value: 0 };
          tl.to(
            obj,
            {
              value: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(obj.value) + (target > 100 ? '+' : '');
              },
            },
            1.5
          );
        });
      }

      // Floating animation for orbs
      if (decorRef.current) {
        gsap.to(decorRef.current.children[0], {
          y: -30,
          x: 20,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to(decorRef.current.children[1], {
          y: 20,
          x: -20,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const splitIntoChars = (text: string, isGradient = false) => {
    return text.split('').map((char, idx) => (
      <span
        key={idx}
        className={`title-char inline-block ${isGradient ? 'gradient-char' : ''}`}
        style={{ 
          perspective: '1000px',
          ...(isGradient && {
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          })
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-stone-950 to-stone-950" />

      {/* Animated Orbs */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8 opacity-0"
        >
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-amber-400">
            Ручна робота • 3D Друк • Україна
          </span>
        </div>

        {/* Main Title with Split Animation */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-[family-name:var(--font-display)]"
          style={{ perspective: '1000px' }}
        >
          <span className="title-line block text-amber-50 overflow-hidden">
            {splitIntoChars('Звук')}
          </span>
          <span className="title-line block overflow-hidden">
            {splitIntoChars('Традицій', true)}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-amber-100/60 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0"
        >
          Виготовляємо автентичні українські духові інструменти 
          за допомогою сучасних технологій 3D-друку. 
          Традиція зустрічається з інновацією.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#catalog"
            className="group px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-1 active:scale-95 flex items-center gap-2 opacity-0"
          >
            Переглянути каталог
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 bg-transparent border border-amber-500/30 hover:border-amber-500/60 text-amber-100 font-medium rounded-full transition-all duration-300 hover:bg-amber-500/10 hover:-translate-y-1 opacity-0"
          >
            Про нас
          </Link>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16"
        >
          <div className="text-center group opacity-0">
            <div
              className="stat-number text-3xl font-bold text-amber-400 mb-1 transition-transform group-hover:scale-110"
              data-value="500"
            >
              0
            </div>
            <div className="text-xs uppercase tracking-wide text-amber-100/40">
              Задоволених клієнтів
            </div>
          </div>
          <div className="text-center border-x border-amber-900/20 group opacity-0">
            <div
              className="stat-number text-3xl font-bold text-amber-400 mb-1 transition-transform group-hover:scale-110"
              data-value="6"
            >
              0
            </div>
            <div className="text-xs uppercase tracking-wide text-amber-100/40">
              Моделей інструментів
            </div>
          </div>
          <div className="text-center group opacity-0">
            <div
              className="stat-number text-3xl font-bold text-amber-400 mb-1 transition-transform group-hover:scale-110"
              data-value="24"
            >
              0
            </div>
            <div className="text-xs uppercase tracking-wide text-amber-100/40">
              Варіанти кольорів
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-amber-500/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
