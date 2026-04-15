import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.product.findMany().then(products => {
  products.forEach(p => console.log(p.name, p.imageUrl));
}).finally(() => prisma.$disconnect());
