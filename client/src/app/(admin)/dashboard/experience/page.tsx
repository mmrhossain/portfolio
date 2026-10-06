import { ExperienceClient } from "@/features/experience/components/admin/experience.client";
import { serverListExperience } from "@/features/experience/api/server";

export default async function AdminExperiencePage() {
  const response = await serverListExperience({
    limit: 100,
  });
  return <ExperienceClient initialItems={response.data} />;
}
