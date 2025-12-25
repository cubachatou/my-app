'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ContactsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

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
      }

      // Contact cards animation
      if (contactsRef.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const cards = contactsRef.current?.querySelectorAll('.contact-card');
                if (cards) {
                  gsap.fromTo(
                    cards,
                    { opacity: 0, y: 40, scale: 0.95 },
                    { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1, 
                      duration: 0.6, 
                      stagger: 0.1, 
                      ease: 'back.out(1.7)' 
                    }
                  );
                }
                observer.disconnect();
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(contactsRef.current);
      }

      // FAQ animation
      if (faqRef.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const header = faqRef.current?.querySelector('.faq-header');
                const items = faqRef.current?.querySelectorAll('.faq-item');
                
                if (header) {
                  gsap.fromTo(
                    header,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
                  );
                }
                
                if (items) {
                  gsap.fromTo(
                    items,
                    { opacity: 0, x: -30 },
                    { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power3.out' }
                  );
                }
                
                observer.disconnect();
              }
            });
          },
          { threshold: 0.15 }
        );
        observer.observe(faqRef.current);
      }
    });

    return () => ctx.revert();
  }, []);

  const contactMethods = [
    {
      href: 'https://t.me/sopilka_shop',
      external: true,
      icon: (
        <svg className="w-7 h-7 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      iconBg: 'bg-[#0088cc]/20',
      iconHoverBg: 'group-hover:bg-[#0088cc]/30',
      title: 'Telegram',
      description: 'Найшвидший спосіб зв\'язку. Відповідаємо протягом години.',
      link: '@sopilka_shop →',
    },
    {
      href: 'tel:+380991234567',
      external: false,
      icon: (
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      iconBg: 'bg-green-500/20',
      iconHoverBg: 'group-hover:bg-green-500/30',
      title: 'Телефон',
      description: 'Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00',
      link: '+38 (099) 123-45-67 →',
    },
    {
      href: 'mailto:info@sopilka.ua',
      external: false,
      icon: (
        <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      iconBg: 'bg-amber-500/20',
      iconHoverBg: 'group-hover:bg-amber-500/30',
      title: 'Email',
      description: 'Для детальних запитів та співпраці',
      link: 'info@sopilka.ua →',
    },
    {
      href: 'https://instagram.com/sopilka_ua',
      external: true,
      icon: (
        <svg className="w-7 h-7 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      iconBg: 'bg-pink-500/20',
      iconHoverBg: 'group-hover:bg-pink-500/30',
      title: 'Instagram',
      description: 'Фото, відео та новини від нашої студії',
      link: '@sopilka_ua →',
    },
  ];

  const faqs = [
    {
      q: 'Скільки часу займає виготовлення?',
      a: 'Зазвичай виготовлення займає 2-5 робочих днів залежно від складності інструменту та завантаженості виробництва.'
    },
    {
      q: 'Чи можна замовити інструмент кастомного кольору?',
      a: 'Так! Напишіть нам, і ми обговоримо можливі варіанти. Кастомні кольори доступні за додаткову плату.'
    },
    {
      q: 'Як доглядати за 3D-друкованим інструментом?',
      a: 'PLA пластик не потребує особливого догляду. Достатньо протирати інструмент вологою серветкою. Уникайте тривалого перебування на прямому сонці та в гарячому середовищі (вище 50°C).'
    },
    {
      q: 'Чи є гарантія на інструменти?',
      a: 'Так, ми надаємо гарантію 6 місяців на всі наші інструменти. У разі виявлення дефектів виготовлення — замінимо безкоштовно.'
    },
    {
      q: 'Чи підходять інструменти для початківців?',
      a: 'Абсолютно! Всі наші інструменти підходять як для початківців, так і для досвідчених музикантів. До кожного замовлення додаємо базову інструкцію з грою.'
    }
  ];

  return (
    <div className="noise-overlay">
      {/* Hero */}
      <section ref={heroRef} className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-stone-950 to-stone-950" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="hero-animate text-xs uppercase tracking-[0.3em] text-amber-500 mb-4 block opacity-0">
            Зв'язок
          </span>
          <h1 className="hero-animate text-4xl md:text-6xl font-bold text-amber-50 mb-6 font-[family-name:var(--font-display)] opacity-0">
            Контакти
          </h1>
          <p className="hero-animate text-lg text-amber-100/60 max-w-2xl mx-auto opacity-0">
            Маєте питання? Ми завжди раді допомогти!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section ref={contactsRef} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {contactMethods.map((contact, idx) => (
              <a 
                key={idx}
                href={contact.href}
                target={contact.external ? '_blank' : undefined}
                rel={contact.external ? 'noopener noreferrer' : undefined}
                className="contact-card group p-8 bg-stone-900/50 border border-amber-900/10 rounded-2xl hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2 opacity-0"
              >
                <div className={`w-14 h-14 rounded-xl ${contact.iconBg} flex items-center justify-center mb-6 ${contact.iconHoverBg} transition-colors`}>
                  {contact.icon}
                </div>
                <h3 className="text-lg font-semibold text-amber-50 mb-2">{contact.title}</h3>
                <p className="text-amber-100/50 text-sm mb-4">
                  {contact.description}
                </p>
                <span className="text-amber-400 text-sm group-hover:underline">
                  {contact.link}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-16 px-6 bg-stone-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="faq-header text-2xl font-bold text-amber-50 mb-8 text-center font-[family-name:var(--font-display)] opacity-0">
            Часті питання
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details 
                key={idx}
                className="faq-item group bg-stone-800/30 border border-amber-900/10 rounded-xl overflow-hidden opacity-0 hover:border-amber-500/20 transition-colors"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer text-amber-50 font-medium hover:text-amber-400 transition-colors">
                  {faq.q}
                  <svg className="w-5 h-5 text-amber-500 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-amber-100/60 text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
