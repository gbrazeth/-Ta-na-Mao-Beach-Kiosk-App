import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

// Middlewares
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sem origin (mobile apps, curl, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissivo por enquanto (MVP)
    }
  }
}));
app.use(express.json());

// Rota de Healthcheck (Teste simples pra ver se a API está online)
app.get('/', (req, res) => {
  res.json({ status: 'API Online', message: 'Tá na Mão Backend Funcionando!' });
});

// ==========================================
// 🔐 AUTH (Autenticação)
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET não definido. Configure a variável de ambiente.');
}

// Registro de novo cliente
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || (!user.password)) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// ==========================================
// 🏖️ PUBLIC ROUTES
// ==========================================

// 1. Rota: Listar todos os Quiosques (Para a tela de seleção inicial do cliente)
app.get('/kiosks', async (req, res) => {
  try {
    const kiosks = await prisma.kiosk.findMany({
      include: {
        tables: true, // Traz as mesas junto para o frontend saber se estão ocupadas
      },
    });
    res.json(kiosks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar quiosques.' });
  }
});

// 2. Rota: Listar Cardápio de um Quiosque Específico
app.get('/kiosks/:kioskId/menu', async (req, res) => {
  const { kioskId } = req.params;

  try {
    const categories = await prisma.category.findMany({
      where: {
        kioskId: kioskId,
      },
      include: {
        products: true, // Já traz os produtos arrumadinhos dentro de cada categoria!
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o cardápio.' });
  }
});

// ==========================================
// 🛒 PRIVATE ROUTES (Protegidas)
// ==========================================

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// 3. Rota: Criar um Pedido (e abrir a comanda se não existir)
app.post('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tableId, cart } = req.body;
  const userId = req.user.id;

  try {
    // 1. Achar ou Criar Comanda Aberta (Tab)
    let tab = await prisma.tab.findFirst({
      where: { userId, tableId, status: 'OPEN' }
    });

    if (!tab) {
      tab = await prisma.tab.create({
        data: { userId, tableId, status: 'OPEN', totalAmount: 0 }
      });
      // Marcar mesa como ocupada
      await prisma.table.update({ where: { id: tableId }, data: { status: 'OCCUPIED' } });
    }

    // 2. Calcular o total com base nos preços reais do banco
    const productIds = Object.keys(cart);
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });
    
    let orderTotal = 0;
    const orderItemsData = dbProducts.map(p => {
      const qty = cart[p.id];
      orderTotal += p.price * qty;
      return { productId: p.id, quantity: qty, unitPrice: p.price };
    });

    // 3. Criar o Pedido atrelado à comanda e salvar os itens
    const order = await prisma.order.create({
      data: {
        tabId: tab.id,
        status: 'AWAITING',
        total: orderTotal,
        items: {
          create: orderItemsData
        }
      },
      include: { items: true }
    });

    // 4. Atualizar o total da comanda
    await prisma.tab.update({
      where: { id: tab.id },
      data: { totalAmount: tab.totalAmount + orderTotal }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar o pedido.' });
  }
});

// 4. Rota: Obter Status de um Pedido Específico
app.get('/orders/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string }
    });
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedido.' });
  }
});

// ==========================================
// 👔 OWNER ROUTES (Dashboard)
// ==========================================

// Listar todos os pedidos ao vivo
app.get('/owner/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
    return res.status(403).json({ error: 'Acesso negado. Apenas funcionários.' });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        tab: { include: { user: true, table: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
});

// Atualizar status do pedido (AWAITING -> PREPARING -> READY -> DELIVERING -> COMPLETED)
app.put('/orders/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role === 'CUSTOMER') {
    // Clientes só podem confirmar recebimento (COMPLETED)
    if (status !== 'COMPLETED' && status !== 'completed') {
      return res.status(403).json({ error: 'Clientes só podem confirmar o recebimento (COMPLETED).' });
    }
  } else if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
    return res.status(403).json({ error: 'Acesso negado. Apenas funcionários.' });
  }

  try {
    const order = await prisma.order.update({
      where: { id: id as string },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido.' });
  }
});

// ==========================================
// 📢 PROMOTIONS (Promoções)
// ==========================================

// Público: Listar promoções ativas
app.get('/promotions', async (req: Request, res: Response) => {
  try {
    const promotions = await prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar promoções.' });
  }
});

// Admin: Criar promoção
app.post('/owner/promotions', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  const { title, description, icon, screenTarget, kioskId } = req.body;
  try {
    const promo = await prisma.promotion.create({
      data: { title, description, icon, screenTarget, kioskId }
    });
    res.status(201).json(promo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar promoção.' });
  }
});

// Admin: Listar todas (ativas e inativas)
app.get('/owner/promotions', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  try {
    const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar promoções.' });
  }
});

// Admin: Atualizar promoção
app.put('/owner/promotions/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  try {
    const promo = await prisma.promotion.update({
      where: { id: req.params.id as string },
      data: req.body
    });
    res.json(promo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar promoção.' });
  }
});

// Admin: Deletar promoção
app.delete('/owner/promotions/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  try {
    await prisma.promotion.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Promoção removida.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover promoção.' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
