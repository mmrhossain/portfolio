import { SettingsClient } from "@/features/settings/components/admin/settings.client";
import { serverGetSettings } from "@/features/settings/api/server";

export default async function AdminSettingsPage() {
  const settings = await serverGetSettings();

  return <SettingsClient initialSettings={settings} />;
}
