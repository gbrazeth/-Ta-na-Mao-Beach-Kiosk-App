import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando o Seed do Banco de Dados para Arena Zero 1...');

    // Limpando dados antigos (cuidado se houver produção real já rodando de outro quiosque!)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.tab.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.table.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.kiosk.deleteMany();

    // 1. Criar o Dono/Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const owner = await prisma.user.upsert({
        where: { email: 'admin@tanao.com' }, // Deixando o email original intacto se for o caso
        update: {
            name: 'Administrador Arena Zero 1',
        },
        create: {
            email: 'admin@tanao.com',
            name: 'Administrador Arena Zero 1',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log(`✅ Admin verificado: ${owner.email}`);

    // 2. Criar o Quiosque (Kiosk)
    const kiosk = await prisma.kiosk.create({
        data: {
            name: 'Arena Zero 1',
            description: 'Seu oásis na praia!',
            // We use the uploaded Logo filename, ideally this would be hosted publicly, 
            // but we'll use a placeholder or null here since it's local assets.
            // A publicly accessible URL is needed for Expo.
            logoUrl: 'https://images.unsplash.com/photo-1540206351-d43501a3bbb9?w=400&h=400&fit=crop', 
        },
    });
    console.log(`✅ Quiosque criado: ${kiosk.name}`);

    // 3. Criar Mesas (8 altas + 14 normais = 22 mesas)
    for (let num = 1; num <= 22; num++) {
        await prisma.table.create({
            data: {
                kioskId: kiosk.id,
                number: num,
                status: 'AVAILABLE',
                qrCode: `qrcodes/kiosk_${kiosk.id}_table_${num}.png`,
            },
        });
    }
    console.log(`✅ 22 Mesas criadas`);

    // 4. Categorias e Produtos
    const categoriesList = [
        { name: 'Cervejas', icon: '🍺' },
        { name: 'Refrigerantes', icon: '🥤' },
        { name: 'Outras Bebidas', icon: '🍹' },
        { name: 'Porções', icon: '🍤' },
        { name: 'Espetinhos', icon: '🍢' },
        { name: 'Salgados', icon: '🥪' },
        { name: 'Doces', icon: '🍫' },
    ];

    const productsMap: Record<string, any[]> = {
        'Cervejas': [
            { name: 'Antártica 600 ml', price: 10.0, description: 'Cerveja tradicional de garrafa grande' },
            { name: 'Brahma 600 ml', price: 10.0, description: 'Cerveja de garrafa grande' },
            { name: 'Original 600 ml', price: 12.0, description: 'Cerveja Original gelada 600ml' },
            { name: 'Skol 600 ml', price: 10.0, description: 'A que desce redondo. 600ml' },
            { name: 'Stella 600 ml', price: 12.0, description: 'Premium lager Stella Artois 600ml' },
            { name: 'Stella sem Glúten', price: 10.0, description: 'Stella Artois Long neck sem glúten' },
            { name: 'Brahma Latão', price: 7.0, description: 'Cerveja Brahma lata grande' },
            { name: 'Original Latão', price: 7.0, description: 'Cerveja Original lata grande' },
            { name: 'Skol Latão', price: 7.0, description: 'Cerveja Skol lata grande' },
            { name: 'Brahma 300 ml', price: 5.0, description: 'Cerveja Brahma lata palito 300ml' },
            { name: 'Original 300 ml', price: 6.0, description: 'Cerveja Original lata palito 300ml' },
            { name: 'Skol Beats', price: 10.0, description: 'Bebida mista Skol Beats lata' },
        ],
        'Refrigerantes': [
            { name: 'Coca lata', price: 6.0, description: 'Lata 350ml' },
            { name: 'Coca Zero lata', price: 6.0, description: 'Lata 350ml sem açúcar' },
            { name: 'Guaraná Lata', price: 6.0, description: 'Antarctica Lata 350ml' },
            { name: 'Coca KS', price: 6.0, description: 'Garrafinha de vidro clássica' },
            { name: 'Coca Zero KS', price: 6.0, description: 'Garrafinha de vidro sem açúcar' },
        ],
        'Outras Bebidas': [
            { name: 'Agua Mineral', price: 4.0, description: 'Sem gás' },
            { name: 'Agua Mineral com Gás', price: 4.0, description: 'Com gás' },
            { name: 'Gatorade', price: 8.0, description: 'Isotônico refrescante' },
            { name: 'Suco de Uva Tial', price: 7.0, description: 'Suco de caixinha Tial' },
            { name: 'Cachaça', price: 4.0, description: 'Dose' },
            { name: 'Campari', price: 20.0, description: 'Aperitivo clássico (Dose)' },
            { name: 'Red Bull', price: 15.0, description: 'Energético lata' },
            { name: 'Vodka Orloff', price: 15.0, description: 'Dose' },
        ],
        'Doces': [
            { name: 'Palha Italiana', price: 7.0, description: 'Doce tradicional cremoso' },
            { name: 'Halls', price: 4.0, description: 'Bala refrescante' },
            { name: 'Trident', price: 4.0, description: 'Goma de mascar' },
        ],
        'Salgados': [
            { name: 'Mini Pizza', price: 8.0, description: 'Mini pizza de sabor variado' },
            { name: 'Sanduiche Natural', price: 10.0, description: 'Lanche saudável e leve' },
        ],
        'Porções': [
            { name: 'Batata Frita Completa', price: 30.0, description: 'Porção com queijo derretido e bacon crocante' },
            { name: 'Batata Frita Simples', price: 25.0, description: 'Porção clássica e crocante' },
            { name: 'Filé com Fritas', price: 60.0, description: 'Iscas de carne aceboladas acompanhadas de fritas' },
            { name: 'Frango a Passarinho', price: 35.0, description: 'Pedaços desossados, bem fritos com alho' },
            { name: 'Isca de Tilápia', price: 50.0, description: 'Porção empanada de peixe fresco' },
        ],
        'Espetinhos': [
            { name: 'Espeto de Boi', price: 15.0, description: 'Tradicional churrasquinho bovino' },
            { name: 'Espeto de Coração', price: 12.0, description: 'Coração de frango grelhado' },
            { name: 'Espeto de Medalhão de Frango', price: 12.0, description: 'Frango enrolado no bacon' },
            { name: 'Espeto de Medalhão de Queijo', price: 12.0, description: 'Queijo enrolado no bacon' },
        ]
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
                        imageUrl: '', 
                    },
                });
            }
        }
    }
    console.log(`✅ Categorias e Produtos adicionados!`);

    console.log('🌟 SEED ARENA ZERO 1 FINALIZADO COM SUCESSO! 🌟');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
