import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/features/home/components/hero";
import { Button } from "@/components/ui/button";
import { SkillsMarquee } from "@/features/skill/components/public/skills.marquee";
import { FeaturedProjects } from "@/features/project/components/public/featured-projects";
import { WorkProcess } from "@/features/home/components/work-process";
import { AboutTeaser } from "@/features/home/components/about-teaser";
import { EducationTimeline } from "@/features/education/components/public/education-timeline";
import { ExperienceTimeline } from "@/features/experience/components/public/experience-timeline";
import { BlogTeaser } from "@/features/blog/components/public/blog-teaser";
import { ContactCta } from "@/features/home/components/contact-cta";
import { serverListBlogs } from "@/features/blog/api/server";
import { serverListEducation } from "@/features/education/api/server";
import { serverListExperience } from "@/features/experience/api/server";
import { serverListProjects } from "@/features/project/api/server";
import { serverListSkills } from "@/features/skill/api/server";
import { createPageMetadata, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = createPageMetadata({
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  keywords: [
    "Monir Hossain",
    "Monir Hossain Developer",
    "Full Stack Developer Bangladesh",
    "Next.js Developer Bangladesh",
    "React Developer Bangladesh",
    "Node.js Developer Bangladesh",
  ],
});

async function HomeContent() {
  const [
    projectsResult,
    blogsResult,
    skillsResult,
    experienceResult,
    educationResult,
  ] = await Promise.all([
    serverListProjects({ limit: 9, featured: "true" }),
    serverListBlogs({ limit: 9 }),
    serverListSkills({ limit: 50 }),
    serverListExperience({ limit: 4 }),
    serverListEducation({ limit: 4 }),
  ]);

  return (
    <>
      <SkillsMarquee skills={skillsResult.data} />
      <FeaturedProjects projects={projectsResult.data} />
      <WorkProcess />
      <AboutTeaser />
      <ExperienceTimeline
        items={experienceResult.data}
        compact
        action={
          <Button asChild variant="outline" className="mb-6 shrink-0 lg:mb-12">
            <Link href="/about">
              View full profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />
      <EducationTimeline items={educationResult.data} compact />
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
