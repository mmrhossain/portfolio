import { PageHeader } from "@/components/shared/page-header";
import { ContactCta } from "@/features/home/components/contact-cta";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Monir Hossain, a freelance full stack developer in Bangladesh, about web applications, e-commerce, and product collaborations.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's work together"
        description="Have a project in mind? Reach out to discuss a Next.js, React, or Node.js build."
      />
      <ContactCta />
    </>
  );
}
