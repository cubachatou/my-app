'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Точність звучання',
    description: "Комп'ютерне моделювання забезпечує ідеальний строй кожної ноти",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    title: 'Стійкість до вологи',
    description: 'На відміну від дерева, пластик не реагує на зміни вологості',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
    title: 'Різноманіття кольорів',
    description: 'Оберіть колір, що відповідає вашому стилю та настрою',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Доступна ціна',
    description: 'Якість ручної роботи за доступною ціною завдяки технологіям',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            // Animate header
            if (headerRef.current) {
              const elements = headerRef.current.children;
              gsap.fromTo(
                elements,
                { opacity: 0, y: 50 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  stagger: 0.15,
                  ease: 'power3.out',
                }
              );
            }

            // Animate cards with 3D effect
            if (cardsRef.current) {
              const cards = cardsRef.current.children;
              gsap.fromTo(
                cards,
                {
                  opacity: 0,
                  y: 80,
                  rotationX: -15,
                  scale: 0.9,
                },
                {
                  opacity: 1,
                  y: 0,
                  rotationX: 0,
                  scale: 1,
                  duration: 0.8,
                  stagger: 0.12,
                  delay: 0.3,
                  ease: 'power3.out',
                }
              );
            }

            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-b from-stone-950 to-stone-900"
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-4 block opacity-0">
            Чому ми
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)] opacity-0">
            Переваги 3D-друку
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 bg-stone-800/30 border border-amber-900/10 rounded-2xl hover:border-amber-500/30 transition-all duration-500 hover:bg-stone-800/50 hover:-translate-y-2 opacity-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-amber-50 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-amber-100/50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
