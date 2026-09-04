import type { Metadata } from "next";
import { AboutTeaser } from "@/components/home/about-teaser";
import { SkillsMarquee } from "@/components/home/skills.marquee";
import { WorkProcess } from "@/components/home/work-process";
import { PageHeader } from "@/components/shared/page-header";
import {serverListSkills} from "@/app/actions";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Monir Hossain, a full-stack developer specializing in Next.js, React, Node.js, and modern web technologies.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About",
    description:
      "Learn about Monir Hossain, a full-stack developer specializing in Next.js, React, Node.js, and modern web technologies.",
    images: [{ url: "/images/seo-image.PNG" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description:
      "Learn about Monir Hossain, a full-stack developer specializing in Next.js, React, Node.js, and modern web technologies.",
    images: ["/images/seo-image.PNG"],
  },
};

export default async function AboutPage() {
  const { data: skills } = await serverListSkills({ limit: 50 });

  return (
    <>
      <PageHeader
        eyebrow="About Me"
        title="About Monir"
        description="A full-stack developer who loves turning complex problems into simple, beautiful, and intuitive products."
      />
      <AboutTeaser />
      <SkillsMarquee skills={skills} />
      <WorkProcess />
    </>
  );
}
