const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { username: "admin" }
  });

  if (user) {
    console.log("Admin user found:");
    console.log("ID:", user.id);
    console.log("Username:", user.username);
    console.log("Email:", user.email);
    console.log("isAdmin:", user.isAdmin);
    console.log("Has Password:", !!user.password);
  } else {
    console.log("Admin user NOT found.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
