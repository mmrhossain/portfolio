import { ExperienceClient } from "@/components/admin/experience/experience.client";
import { experienceApi } from "@/lib/api/experience";

export default async function AdminExperiencePage() {
  const response = await experienceApi.list({
    limit: 100,
  });
  return <ExperienceClient initialItems={response.data} />;
}
