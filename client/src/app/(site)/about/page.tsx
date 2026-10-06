import { EducationTimeline } from "@/features/education/components/public/education-timeline";
import { ExperienceTimeline } from "@/features/experience/components/public/experience-timeline";
import { AboutTeaser } from "@/features/home/components/about-teaser";
import { WorkProcess } from "@/features/home/components/work-process";
import { PageHeader } from "@/components/shared/page-header";
import { serverListEducation } from "@/features/education/api/server";
import { serverListExperience } from "@/features/experience/api/server";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Meet Monir Hossain, a full stack developer in Bangladesh working with React, Next.js, Node.js, Express.js, TypeScript, PostgreSQL, and Prisma.",
  path: "/about",
});

export default async function AboutPage() {
  const [experienceResult, educationResult] = await Promise.all([
    serverListExperience({ limit: 50 }),
    serverListEducation({ limit: 50 }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About Me"
        title="About Monir Hossain"
        description="A full stack developer in Bangladesh who turns complex product problems into simple, reliable web applications."
      />
      <AboutTeaser />
      <ExperienceTimeline items={experienceResult.data} />
      <EducationTimeline items={educationResult.data} />
      <WorkProcess />
    </>
  );
}
