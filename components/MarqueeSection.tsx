export default function MarqueeSection() {
  const items = [
    'Безкоштовна доставка від 1500₴',
    'Гарантія якості',
    'Екологічні матеріали',
    'Швидка доставка',
    'Ручна робота',
  ];

  return (
    <section className="py-6 border-y border-amber-900/20 bg-stone-900/50 overflow-hidden">
      <div className="animate-marquee flex gap-12 whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-12 items-center">
            {items.map((item, idx) => (
              <span
                key={idx}
                className="text-sm uppercase tracking-widest text-amber-500/70 flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
