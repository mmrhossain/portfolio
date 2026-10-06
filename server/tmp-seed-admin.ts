import bcrypt from "bcryptjs";
import { prisma } from "./src/lib/prisma.ts";

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@devmonir.com" },
    update: { passwordHash, role: "ADMIN", isActive: true, name: "Admin" },
    create: {
      name: "Admin",
      email: "admin@devmonir.com",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(user.email, user.role);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
