import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando o Seed do Banco de Dados...');

    // 1. Criar o Dono/Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const owner = await prisma.user.upsert({
        where: { email: 'admin@praiasol.com' },
        update: {},
        create: {
            email: 'admin@praiasol.com',
            name: 'Administrador do Quiosque',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log(`✅ Admin criado: ${owner.email}`);

    // 2. Criar o Quiosque (Kiosk)
    const kiosk = await prisma.kiosk.create({
        data: {
            name: 'Quiosque Praia Sol',
            description: 'Aberto agora • Especialidade: Frutos do mar',
            logoUrl: 'https://cdn-icons-png.flaticon.com/512/3593/3593881.png', // logo de exemplo de sol/praia
        },
    });
    console.log(`✅ Quiosque criado: ${kiosk.name}`);

    // 3. Criar Mesas
    const tableNumbers = [12, 15, 8];
    for (const num of tableNumbers) {
        await prisma.table.create({
            data: {
                kioskId: kiosk.id,
                number: num,
                status: num === 8 ? 'OCCUPIED' : 'AVAILABLE',
                qrCode: `qrcodes/kiosk_${kiosk.id}_table_${num}.png`,
            },
        });
    }
    console.log(`✅ ${tableNumbers.length} Mesas criadas`);

    // 4. Categorias e Produtos
    const categoriesList = [
        { name: 'Bebidas Tropicais', icon: '🍹' },
        { name: 'Cervejas', icon: '🍺' },
        { name: 'Porções', icon: '🦐' },
        { name: 'Lanches', icon: '🍔' },
        { name: 'Sobremesas', icon: '🍨' },
    ];

    const productsMap: Record<string, any[]> = {
        'Bebidas Tropicais': [
            { name: 'Caipirinha de Limão', price: 25.0, description: 'Cachaça, limão taiti, açúcar e muito gelo.' },
            { name: 'Piña Colada', price: 32.0, description: 'Rum, suco de abacaxi e leite de coco.' },
        ],
        'Cervejas': [
            { name: 'Cerveja Long Neck', price: 15.0, description: 'Heineken ou Stella Artois, bem gelada.' },
            { name: 'Chopp Gelado 300ml', price: 12.0, description: 'Chopp artesanal da casa.' },
        ],
        'Porções': [
            { name: 'Porção de Camarão', price: 85.0, description: 'Camarões selecionados fritos no alho e óleo.' },
            { name: 'Fritas com Cheddar', price: 35.0, description: 'Batata frita crocante com cheddar cremoso e bacon.' },
        ],
        'Lanches': [
            { name: 'Burger Arena', price: 45.0, description: 'Hambúrguer artesanal 200g, queijo coalho e salada.' },
        ],
        'Sobremesas': [
            { name: 'Açaí na Tigela', price: 28.0, description: 'Açaí puro com granola e banana.' },
        ],
    };

    let i = 0;
    for (const catData of categoriesList) {
        const category = await prisma.category.create({
            data: {
                name: catData.name,
                icon: catData.icon,
                sortOrder: i++,
                kioskId: kiosk.id,
            },
        });

        const products = productsMap[catData.name];
        if (products) {
            for (const prod of products) {
                await prisma.product.create({
                    data: {
                        name: prod.name,
                        price: prod.price,
                        description: prod.description,
                        categoryId: category.id,
                        imageUrl: '', // vázio para o placeholder original
                    },
                });
            }
        }
    }
    console.log(`✅ Categorias e Produtos adicionados!`);

    console.log('🌟 SEED FINALIZADO COM SUCESSO! 🌟');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
