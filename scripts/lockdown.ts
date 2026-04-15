import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const tables = [
  'Kiosk',
  'Category',
  'Product',
  'Table',
  'User',
  'Tab',
  'Order',
  'OrderItem',
  '_prisma_migrations'
];

async function main() {
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS Ativado: ${table}`);
    } catch (e) {
      console.error(`Erro na tabela ${table}:`, e);
    }
  }
  console.log('Blindagem RLS aplicada em todas as tabelas!');
}

main().finally(() => prisma.$disconnect());
