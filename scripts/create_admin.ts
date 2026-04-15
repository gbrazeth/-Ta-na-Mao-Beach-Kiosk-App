import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@tanao.com' } });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await prisma.user.create({
      data: {
        name: 'Proprietário',
        email: 'admin@tanao.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Administrador admin@tanao.com criado!');
  } else {
    console.log('Administrador já existe!');
  }
}
main().finally(() => prisma.$disconnect());
