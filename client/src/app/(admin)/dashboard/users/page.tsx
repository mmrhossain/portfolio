import { UsersClient } from "@/features/user/components/admin/users.client";
import { serverListUsers } from "@/features/user/api/server";

export default async function AdminUsersPage() {
  const response = await serverListUsers();

  return (
    <UsersClient initialUsers={response.data} initialMeta={response.meta} />
  );
}
