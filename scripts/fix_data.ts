import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Liberando mesas...');
  await prisma.table.updateMany({ data: { status: 'AVAILABLE' } });

  console.log('Adicionando mais mesas...');
  const kiosk = await prisma.kiosk.findFirst();
  if (kiosk) {
    const existingTables = await prisma.table.findMany({ where: { kioskId: kiosk.id } });
    const maxTable = existingTables.reduce((max, t) => Math.max(max, t.number), 0);
    for (let i = maxTable + 1; i <= maxTable + 10; i++) {
        await prisma.table.create({
            data: { kioskId: kiosk.id, number: i, status: 'AVAILABLE', qrCode: `MESA_${i}` }
        });
    }
  }

  console.log('Atualizando imagens...');
  const products = await prisma.product.findMany();
  for (const p of products) {
    let img = 'https://images.unsplash.com/photo-1590846406792-0adc7f928f1d?auto=format&fit=crop&w=500';
    if (p.name.toLowerCase().includes('cerveja')) img = 'https://images.unsplash.com/photo-1605389643447-bfffbcbd3135?auto=format&fit=crop&w=500';
    else if (p.name.toLowerCase().includes('porção') || p.name.toLowerCase().includes('camarão') || p.name.toLowerCase().includes('peixe') || p.name.toLowerCase().includes('fritas')) img = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500';
    else if (p.name.toLowerCase().includes('água') || p.name.toLowerCase().includes('coco')) img = 'https://images.unsplash.com/photo-1522012188892-24beb1025586?auto=format&fit=crop&w=500';

    await prisma.product.update({ where: { id: p.id }, data: { imageUrl: img } });
  }
  console.log('Concluído!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
