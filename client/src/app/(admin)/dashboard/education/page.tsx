import { EducationClient } from "@/features/education/components/admin/education.client";
import { serverListEducation } from "@/features/education/api/server";

export default async function AdminEducationPage() {
  const response = await serverListEducation({
    limit: 100,
  });
  return <EducationClient initialItems={response.data} />;
}
