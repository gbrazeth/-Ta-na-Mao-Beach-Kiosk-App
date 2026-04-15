import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const images: Record<string, string> = {
  'Burger Arena': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500',
  'Fritas com Cheddar': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500',
  'Caipirinha de Limão': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500',
  'Piña Colada': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500',
  'Cerveja Long Neck': 'https://images.unsplash.com/photo-1538481199005-411bdc753b81?auto=format&fit=crop&w=500',
  'Chopp Gelado 300ml': 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=500',
  'Porção de Camarão': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500',
  'Açaí na Tigela': 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=500'
};

async function main() {
  for (const [name, imageUrl] of Object.entries(images)) {
    await prisma.product.updateMany({
      where: { name },
      data: { imageUrl }
    });
  }
  console.log("Imagens consertadas!");
}

main().finally(() => prisma.$disconnect());
