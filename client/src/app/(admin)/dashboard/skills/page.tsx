import { SkillsClient } from "@/features/skill/components/admin/skills.client";
import { serverListSkills } from "@/features/skill/api/server";

export default async function AdminSkillsPage() {
  const response = await serverListSkills({
    limit: 100,
  });
  return <SkillsClient initialSkills={response.data} />;
}
