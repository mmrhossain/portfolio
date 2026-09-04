import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { SkillsMarquee } from "@/components/home/skills.marquee";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { WorkProcess } from "@/components/home/work-process";
import { AboutTeaser } from "@/components/home/about-teaser";
import { BlogTeaser } from "@/components/home/blog-teaser";
import { ContactCta } from "@/components/home/contact-cta";
import {serverListBlogs, serverListProjects, serverListSkills} from "@/app/actions";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home",
  description:
    "Trusted partner for website development. Building modern, scalable, and high-performance web applications with clean architecture and exceptional user experiences.",
  alternates: {
    canonical: "/",
  },
};

async function HomeContent() {
  const [projectsResult, blogsResult, skillsResult] = await Promise.all([
    serverListProjects({ limit: 9, featured: "true" }),
    serverListBlogs({ limit: 9 }),
    serverListSkills({ limit: 50 }),
  ]);

  return (
    <>
      <SkillsMarquee skills={skillsResult.data} />
      <FeaturedProjects projects={projectsResult.data} />
      <WorkProcess />
      <AboutTeaser />
      <BlogTeaser blogs={blogsResult.data} />
      <ContactCta />
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={<div className="py-20 text-center">Loading content...</div>}
      >
        <HomeContent />
      </Suspense>
    </>
  );
}
