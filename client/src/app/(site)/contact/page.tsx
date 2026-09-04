import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { ContactCta } from '@/components/home/contact-cta';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Monir Hossain for freelance projects, collaborations, or just to say hello.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact',
    description:
      'Get in touch with Monir Hossain for freelance projects, collaborations, or just to say hello.',
    images: [{ url: '/images/seo-image.PNG' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact',
    description:
      'Get in touch with Monir Hossain for freelance projects, collaborations, or just to say hello.',
    images: ['/images/seo-image.PNG'],
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's work together"
        description="Have a project in mind? Reach out and let's build something great."
      />
      <ContactCta />
    </>
  );
}
