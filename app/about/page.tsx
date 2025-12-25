'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        const elements = heroRef.current.querySelectorAll('.hero-animate');
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

        // Background orb
        const orb = heroRef.current.querySelector('.hero-orb');
        if (orb) {
          gsap.fromTo(orb, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' });
          gsap.to(orb, {
            y: -30,
            x: 20,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      }

      // Story sections with scroll trigger
      if (storyRef.current) {
        const sections = storyRef.current.querySelectorAll('.story-block');
        sections.forEach((section, idx) => {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const content = section.querySelector('.story-content');
                  const image = section.querySelector('.story-image');
                  
                  gsap.fromTo(
                    content,
                    { opacity: 0, x: idx % 2 === 0 ? -50 : 50 },
                    { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
                  );
                  
                  gsap.fromTo(
                    image,
                    { opacity: 0, x: idx % 2 === 0 ? 50 : -50, scale: 0.9 },
                    { opacity: 1, x: 0, scale: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
                  );
                  
                  observer.disconnect();
                }
              });
            },
            { threshold: 0.2 }
          );
          observer.observe(section);
        });
      }

      // Values animation
      if (valuesRef.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const header = valuesRef.current?.querySelector('.values-header');
                const cards = valuesRef.current?.querySelectorAll('.value-card');
                
                if (header) {
                  gsap.fromTo(
                    header.children,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                  );
                }
                
                if (cards) {
                  gsap.fromTo(
                    cards,
                    { opacity: 0, y: 40, rotationX: -15 },
                    { opacity: 1, y: 0, rotationX: 0, duration: 0.7, stagger: 0.15, delay: 0.3, ease: 'power3.out' }
                  );
                }
                
                observer.disconnect();
              }
            });
          },
          { threshold: 0.15 }
        );
        observer.observe(valuesRef.current);
      }

      // CTA animation
      if (ctaRef.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                gsap.fromTo(
                  ctaRef.current,
                  { opacity: 0, y: 50, scale: 0.95 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
                );
                
                const elements = ctaRef.current?.querySelectorAll('.cta-animate');
                if (elements) {
                  gsap.fromTo(
                    elements,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power3.out' }
                  );
                }
                
                observer.disconnect();
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(ctaRef.current);
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="noise-overlay">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-stone-950 to-stone-950" />
        <div className="hero-orb absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="hero-animate text-xs uppercase tracking-[0.3em] text-amber-500 mb-4 block opacity-0">
            Наша історія
          </span>
          <h1 className="hero-animate text-4xl md:text-6xl font-bold text-amber-50 mb-6 font-[family-name:var(--font-display)] opacity-0">
            Про нас
          </h1>
          <p className="hero-animate text-lg text-amber-100/60 max-w-2xl mx-auto opacity-0">
            Ми поєднуємо багатовікові традиції українського музичного 
            мистецтва з інноваційними технологіями 3D-друку
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="story-block grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="story-content opacity-0">
              <h2 className="text-2xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)]">
                Як все почалось
              </h2>
              <div className="space-y-4 text-amber-100/60">
                <p>
                  Ідея створення 3D-друкованих українських інструментів народилася 
                  з любові до народної музики та захоплення сучасними технологіями.
                </p>
                <p>
                  Ми зрозуміли, що традиційні дерев'яні інструменти мають свої 
                  недоліки: вони чутливі до вологості, потребують особливого догляду, 
                  а їх виготовлення — довгий і дорогий процес.
                </p>
                <p>
                  3D-друк дозволив нам створювати інструменти з ідеальною точністю 
                  звучання, зберігаючи при цьому автентичний тембр.
                </p>
              </div>
            </div>
            <div className="story-image bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl aspect-square flex items-center justify-center border border-amber-900/10 opacity-0">
              <div className="w-32 h-32 rounded-full bg-amber-500/10 flex items-center justify-center">
                <svg className="w-16 h-16 text-amber-500/50" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="story-block grid md:grid-cols-2 gap-12 items-center">
            <div className="story-image order-2 md:order-1 bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl aspect-square flex items-center justify-center border border-amber-900/10 opacity-0">
              <div className="w-32 h-32 rounded-full bg-amber-500/10 flex items-center justify-center">
                <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <div className="story-content order-1 md:order-2 opacity-0">
              <h2 className="text-2xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)]">
                Технологія виробництва
              </h2>
              <div className="space-y-4 text-amber-100/60">
                <p>
                  Ми використовуємо професійні 3D-принтери та екологічно 
                  безпечні біопластики (PLA, PETG), які не містять токсичних 
                  речовин і безпечні для здоров'я.
                </p>
                <p>
                  Кожна модель проходить багатогодинне акустичне моделювання 
                  в спеціалізованому програмному забезпеченні для досягнення 
                  ідеального звучання.
                </p>
                <p>
                  Після друку кожен інструмент проходить ручну обробку 
                  та налаштування для забезпечення найвищої якості.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-16 px-6 bg-stone-900/50" style={{ perspective: '1000px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="values-header text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-4 block opacity-0">
              Наші принципи
            </span>
            <h2 className="text-3xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)] opacity-0">
              Наші цінності
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Любов до традицій',
                description: 'Ми поважаємо культурну спадщину України і прагнемо зберегти її для майбутніх поколінь через музику.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'Інновації',
                description: 'Ми постійно вдосконалюємо наші технології та експериментуємо з новими матеріалами для найкращого результату.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Екологічність',
                description: 'Використовуємо тільки екологічно безпечні матеріали та мінімізуємо відходи виробництва.'
              }
            ].map((value, idx) => (
              <div 
                key={idx} 
                className="value-card text-center p-8 bg-stone-800/30 rounded-2xl border border-amber-900/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 opacity-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-16 h-16 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-amber-50 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-amber-100/50">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div ref={ctaRef} className="max-w-2xl mx-auto text-center opacity-0">
          <h2 className="cta-animate text-3xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)]">
            Готові почати свою музичну подорож?
          </h2>
          <p className="cta-animate text-amber-100/60 mb-8">
            Перегляньте наш каталог і оберіть свій перший інструмент
          </p>
          <Link 
            href="/#catalog"
            className="cta-animate inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-1"
          >
            Переглянути каталог
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
