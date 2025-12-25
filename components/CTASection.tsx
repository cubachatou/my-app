'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            if (contentRef.current) {
              // Animate the card container
              gsap.fromTo(
                contentRef.current,
                {
                  opacity: 0,
                  y: 60,
                  scale: 0.95,
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 1,
                  ease: 'power3.out',
                }
              );

              // Animate inner elements
              const innerElements = contentRef.current.querySelectorAll('.cta-animate');
              gsap.fromTo(
                innerElements,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.15,
                  delay: 0.3,
                  ease: 'power3.out',
                }
              );

              // Animate background orbs
              const orbs = contentRef.current.querySelectorAll('.cta-orb');
              gsap.fromTo(
                orbs,
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 1.5,
                  stagger: 0.2,
                  ease: 'power2.out',
                }
              );
            }

            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          ref={contentRef}
          className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/20 overflow-hidden opacity-0"
        >
          {/* Background Effects */}
          <div className="cta-orb absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="cta-orb absolute bottom-0 left-0 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <h2 className="cta-animate text-3xl md:text-4xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)]">
              Маєте питання?
            </h2>
            <p className="cta-animate text-amber-100/60 mb-8 max-w-xl mx-auto">
              Зв'яжіться з нами, і ми допоможемо обрати ідеальний інструмент для
              вас або відповімо на будь-які питання
            </p>
            <div className="cta-animate flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://t.me/sopilka_shop"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-full transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Написати в Telegram
              </a>
              <a
                href="tel:+380991234567"
                className="px-8 py-4 bg-transparent border border-amber-500/30 hover:border-amber-500/60 text-amber-100 font-medium rounded-full transition-all duration-300 hover:bg-amber-500/10 hover:-translate-y-1"
              >
                +38 (099) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
