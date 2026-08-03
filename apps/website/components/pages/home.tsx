'use client';

import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';
import { ServicesSection } from '@/components/sections/services-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { ProcessSection } from '@/components/sections/process-section';
import { ReferencesSection } from '@/components/sections/references-section';
import { FaqSection } from '@/components/sections/faq-section';
import { CtaSection } from '@/components/sections/cta-section';

const ChatWidget = dynamic(() => import('@/components/chat-widget'), {
  ssr: false,
});

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <ProcessSection />
      <ReferencesSection />
      <FaqSection />
      <CtaSection />
      <ChatWidget />
    </>
  );
}
