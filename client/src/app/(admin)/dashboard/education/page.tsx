import { EducationClient } from "@/components/admin/education/education.client";
import { educationApi } from "@/lib/api/education";

export default async function AdminEducationPage() {
  const response = await educationApi.list({
    limit: 100,
  });
  return <EducationClient initialItems={response.data} />;
}
