import { products } from '@/lib/data';
import HeroSection from '@/components/HeroSection';
import CatalogSection from '@/components/CatalogSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import MarqueeSection from '@/components/MarqueeSection';

export default function HomePage() {
  return (
    <div className="noise-overlay animate-[page-enter_0.4s_ease-out]">
      {/* Hero Section with GSAP animations */}
      <HeroSection />

      {/* Features Marquee */}
      <MarqueeSection />

      {/* Catalog Section with working filters */}
      <CatalogSection products={products} />

      {/* Why Choose Us Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
