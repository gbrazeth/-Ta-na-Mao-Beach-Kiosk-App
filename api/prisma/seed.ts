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
            { name: 'Antártica 600 ml', price: 10.0, description: 'Cerveja tradicional de garrafa', imageUrl: 'https://images.unsplash.com/photo-1614316041695-88bf1059f315?q=80&w=400&fit=crop' },
            { name: 'Brahma 600 ml', price: 10.0, description: 'Cerveja de garrafa', imageUrl: 'https://images.unsplash.com/photo-1614316041695-88bf1059f315?q=80&w=400&fit=crop' },
            { name: 'Original 600 ml', price: 12.0, description: 'Cerveja Original gelada', imageUrl: 'https://images.unsplash.com/photo-1614316041695-88bf1059f315?q=80&w=400&fit=crop' },
            { name: 'Skol 600 ml', price: 10.0, description: 'A que desce redondo', imageUrl: 'https://images.unsplash.com/photo-1614316041695-88bf1059f315?q=80&w=400&fit=crop' },
            { name: 'Stella 600 ml', price: 12.0, description: 'Premium lager Stella Artois', imageUrl: 'https://images.unsplash.com/photo-1657223062319-35cbcd1d5565?q=80&w=400&fit=crop' },
            { name: 'Stella sem Glúten', price: 10.0, description: 'Stella Artois sem glúten', imageUrl: 'https://images.unsplash.com/photo-1615332579037-3c44b3660b53?q=80&w=400&fit=crop' },
            { name: 'Brahma Latão', price: 7.0, description: 'Cerveja Brahma lata grande', imageUrl: 'https://images.unsplash.com/photo-1575037614876-c38db0cdff9b?q=80&w=400&fit=crop' },
            { name: 'Original Latão', price: 7.0, description: 'Cerveja Original lata grande', imageUrl: 'https://images.unsplash.com/photo-1575037614876-c38db0cdff9b?q=80&w=400&fit=crop' },
            { name: 'Skol Latão', price: 7.0, description: 'Cerveja Skol lata grande', imageUrl: 'https://images.unsplash.com/photo-1575037614876-c38db0cdff9b?q=80&w=400&fit=crop' },
            { name: 'Brahma 300 ml', price: 5.0, description: 'Cerveja Brahma lata palito 300ml', imageUrl: 'https://images.unsplash.com/photo-1620138402488-8b5e6fb4e460?q=80&w=400&fit=crop' },
            { name: 'Original 300 ml', price: 6.0, description: 'Cerveja Original lata palito 300ml', imageUrl: 'https://images.unsplash.com/photo-1620138402488-8b5e6fb4e460?q=80&w=400&fit=crop' },
            { name: 'Skol Beats', price: 10.0, description: 'Bebida mista Skol Beats lata', imageUrl: 'https://images.unsplash.com/photo-1563223771-3f044bb713eb?q=80&w=400&fit=crop' },
        ],
        'Refrigerantes': [
            { name: 'Coca lata', price: 6.0, description: 'Lata 350ml', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&fit=crop' },
            { name: 'Coca Zero lata', price: 6.0, description: 'Lata 350ml sem açúcar', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&fit=crop' },
            { name: 'Guaraná Lata', price: 6.0, description: 'Antarctica Lata 350ml', imageUrl: 'https://images.unsplash.com/photo-1581008064436-b63690d7f2da?q=80&w=400&fit=crop' },
            { name: 'Coca KS', price: 6.0, description: 'Garrafinha de vidro clássica', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=400&fit=crop' },
            { name: 'Coca Zero KS', price: 6.0, description: 'Garrafinha de vidro sem açúcar', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=400&fit=crop' },
        ],
        'Outras Bebidas': [
            { name: 'Agua Mineral', price: 4.0, description: 'Sem gás', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=400&fit=crop' },
            { name: 'Agua Mineral com Gás', price: 4.0, description: 'Com gás', imageUrl: 'https://images.unsplash.com/photo-1550505096-724ee6dd6873?q=80&w=400&fit=crop' },
            { name: 'Gatorade', price: 8.0, description: 'Isotônico refrescante', imageUrl: 'https://images.unsplash.com/photo-1622666579201-140cf88c9df0?q=80&w=400&fit=crop' },
            { name: 'Suco de Uva Tial', price: 7.0, description: 'Suco de caixinha Tial', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=400&fit=crop' },
            { name: 'Cachaça', price: 4.0, description: 'Dose', imageUrl: 'https://images.unsplash.com/photo-1595168051740-fa9dc1ef710a?q=80&w=400&fit=crop' },
            { name: 'Campari', price: 20.0, description: 'Aperitivo clássico (Dose)', imageUrl: 'https://images.unsplash.com/photo-1579761922338-7fd80b91e5cf?q=80&w=400&fit=crop' },
            { name: 'Red Bull', price: 15.0, description: 'Energético lata', imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=400&fit=crop' },
            { name: 'Vodka Orloff', price: 15.0, description: 'Dose', imageUrl: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?q=80&w=400&fit=crop' },
        ],
        'Doces': [
            { name: 'Palha Italiana', price: 7.0, description: 'Doce tradicional cremoso', imageUrl: 'https://images.unsplash.com/photo-1603503362141-5a507aeb7ff3?q=80&w=400&fit=crop' },
            { name: 'Halls', price: 4.0, description: 'Bala refrescante', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400&fit=crop' },
            { name: 'Trident', price: 4.0, description: 'Goma de mascar', imageUrl: 'https://images.unsplash.com/photo-1510427306232-026c2acb4010?q=80&w=400&fit=crop' },
        ],
        'Salgados': [
            { name: 'Mini Pizza', price: 8.0, description: 'Mini pizza de sabor variado', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&fit=crop' },
            { name: 'Sanduiche Natural', price: 10.0, description: 'Lanche saudável e leve', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&fit=crop' },
        ],
        'Porções': [
            { name: 'Batata Frita Completa', price: 30.0, description: 'Porção com queijo derretido e bacon crocante', imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=400&fit=crop' },
            { name: 'Batata Frita Simples', price: 25.0, description: 'Porção clássica e crocante', imageUrl: 'https://images.unsplash.com/photo-1605333396914-2314dce2762a?q=80&w=400&fit=crop' },
            { name: 'Filé com Fritas', price: 60.0, description: 'Iscas de carne aceboladas acompanhadas de fritas', imageUrl: 'https://images.unsplash.com/photo-1574503761805-f481c60b5de8?q=80&w=400&fit=crop' },
            { name: 'Frango a Passarinho', price: 35.0, description: 'Pedaços desossados, bem fritos com alho', imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=400&fit=crop' },
            { name: 'Isca de Tilápia', price: 50.0, description: 'Porção empanada de peixe fresco', imageUrl: 'https://images.unsplash.com/photo-1596403064095-2baea35e5d16?q=80&w=400&fit=crop' },
        ],
        'Espetinhos': [
            { name: 'Espeto de Boi', price: 15.0, description: 'Tradicional churrasquinho bovino', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&fit=crop' },
            { name: 'Espeto de Coração', price: 12.0, description: 'Coração de frango grelhado', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&fit=crop' },
            { name: 'Espeto de Medalhão de Frango', price: 12.0, description: 'Frango enrolado no bacon', imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400&fit=crop' },
            { name: 'Espeto de Medalhão de Queijo', price: 12.0, description: 'Queijo enrolado no bacon', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&fit=crop' },
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
                        imageUrl: prod.imageUrl || '', 
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
