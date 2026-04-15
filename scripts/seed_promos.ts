import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.promotion.createMany({
    data: [
      { title: 'Cadastre-se e ganhe uma Long Neck!', description: 'Oferta válida para o primeiro cadastro', icon: '🍺', screenTarget: 'welcome' },
      { title: '2 Caipirinhas por R$35!', description: 'Aproveite em qualquer quiosque parceiro', icon: '🎁', screenTarget: 'kiosk_selection' },
      { title: 'Happy Hour até 18h!', description: 'Chopp e Long Neck com 20% OFF', icon: '🍺', screenTarget: 'table_selection' },
    ],
    skipDuplicates: true
  });
  console.log('✅ Promoções decorativas criadas!');
}
main().finally(() => prisma.$disconnect());
