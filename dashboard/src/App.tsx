import { useState, useEffect } from 'react'
import axios from 'axios'
import { Clock, CheckCircle, ChefHat, LogOut, Lock, Megaphone, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('@tanao:admin_token'));
  
  if (!token) {
    return <LoginScreen onLogin={(t) => { setToken(t); localStorage.setItem('@tanao:admin_token', t); }} />
  }

  return <Dashboard token={token} onLogout={() => { setToken(null); localStorage.removeItem('@tanao:admin_token'); }} />
}

function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      if (res.data.user.role !== 'ADMIN' && res.data.user.role !== 'STAFF') {
        setError('Acesso negado. Apenas proprietários ou garçons.')
        return
      }
      onLogin(res.data.token)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleLogin} style={{ background: 'var(--color-surface)', padding: 'var(--spacing-8)', borderRadius: 16, width: 400, border: '1px solid var(--color-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <Lock size={48} color="var(--color-primary)" style={{ margin: '0 auto' }} />
          <h2 style={{ marginTop: 16 }}>Acesso Restrito</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Identifique-se para acessar o KanBan</p>
        </div>
        
        {error && <div style={{ color: '#EF4444', marginBottom: 16, textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: 8, borderRadius: 8 }}>{error}</div>}
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>E-mail da Equipe</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'white', fontSize: 16 }} />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>Senha Intranet</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'white', fontSize: 16 }} />
        </div>
        
        <button type="submit" disabled={isLoading} className="btn btn-prepare" style={{ width: '100%', padding: '16px 12px', fontSize: 16 }}>
          {isLoading ? 'Checando Credenciais...' : 'Acessar Painel de Controle'}
        </button>
      </form>
    </div>
  )
}

function Dashboard({ token, onLogout }: { token: string, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'orders' | 'promos'>('orders')

  return (
    <>
      <nav className="navbar">
        <div className="brand">Tá na Mão - Gestão</div>
        <div className="header-actions">
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-prepare' : ''}`} 
            style={{ marginRight: 8 }}
            onClick={() => setActiveTab('orders')}
          >
            <ChefHat size={16} /> Pedidos
          </button>
          <button 
            className={`btn ${activeTab === 'promos' ? 'btn-prepare' : ''}`}
            style={{ marginRight: 8 }}
            onClick={() => setActiveTab('promos')}
          >
            <Megaphone size={16} /> Promoções
          </button>
          <button className="btn" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} onClick={onLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </nav>

      {activeTab === 'orders' ? (
        <OrdersKanban token={token} onLogout={onLogout} />
      ) : (
        <PromotionsManager token={token} />
      )}
    </>
  )
}

function OrdersKanban({ token, onLogout }: { token: string, onLogout: () => void }) {
  const [orders, setOrders] = useState<any[]>([])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/owner/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data)
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        onLogout()
      }
      console.error('Erro ao buscar pedidos:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 3000)
    return () => clearInterval(interval)
  }, [token])

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOrders()
    } catch(err) {
       console.error(err)
    }
  }

  const awaiting = orders.filter(o => o.status === 'AWAITING')
  const preparing = orders.filter(o => o.status === 'PREPARING')
  const ready = orders.filter(o => o.status === 'READY')

  return (
    <main className="kanban-container">
      <section className="kanban-column">
        <div className="column-header awaiting">
          Novos Pedidos
          <span className="badge">{awaiting.length}</span>
        </div>
        <div className="column-body">
          {awaiting.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              actionLabel="Preparar" 
              actionClass="btn-prepare"
              actionIcon={<ChefHat size={16}/>}
              onAction={() => updateStatus(order.id, 'PREPARING')} 
            />
          ))}
        </div>
      </section>

      <section className="kanban-column">
        <div className="column-header preparing">
          Em Preparo
          <span className="badge">{preparing.length}</span>
        </div>
        <div className="column-body">
          {preparing.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              actionLabel="Pronto" 
              actionClass="btn-ready"
              actionIcon={<CheckCircle size={16}/>}
              onAction={() => updateStatus(order.id, 'READY')} 
            />
          ))}
        </div>
      </section>

      <section className="kanban-column">
        <div className="column-header ready">
          Aguardando Garçom
          <span className="badge">{ready.length}</span>
        </div>
        <div className="column-body">
          {ready.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              actionLabel="Despachar" 
              actionClass="btn-finish"
              onAction={() => updateStatus(order.id, 'DELIVERING')} 
            />
          ))}
        </div>
      </section>
    </main>
  )
}

function PromotionsManager({ token }: { token: string }) {
  const [promos, setPromos] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🎉')
  const [screenTarget, setScreenTarget] = useState('all')

  const fetchPromos = async () => {
    try {
      const res = await axios.get(`${API_URL}/owner/promotions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPromos(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchPromos() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await axios.post(`${API_URL}/owner/promotions`, { title, description, icon, screenTarget }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTitle(''); setDescription(''); setIcon('🎉'); setScreenTarget('all')
      fetchPromos()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleActive = async (promo: any) => {
    try {
      await axios.put(`${API_URL}/owner/promotions/${promo.id}`, { isActive: !promo.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPromos()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta promoção?')) return
    try {
      await axios.delete(`${API_URL}/owner/promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPromos()
    } catch (err) {
      console.error(err)
    }
  }

  const screens: Record<string, string> = {
    all: 'Todas as Telas',
    welcome: 'Tela Inicial',
    kiosk_selection: 'Seleção de Quiosque',
    table_selection: 'Seleção de Mesa',
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Megaphone size={24} /> Gerenciar Promoções
      </h2>

      {/* Form de criação */}
      <form onSubmit={handleCreate} style={{ background: 'var(--color-surface)', padding: 24, borderRadius: 12, border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Nova Promoção</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>Ícone</label>
            <input value={icon} onChange={e => setIcon(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'white', fontSize: 20, textAlign: 'center' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>Título da Promoção</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: 2 Caipirinhas por R$35!" required style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'white', fontSize: 14 }} />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>Descrição (opcional)</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Aproveite em qualquer quiosque parceiro" style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'white', fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>Exibir em</label>
            <select value={screenTarget} onChange={e => setScreenTarget(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'white', fontSize: 14 }}>
              <option value="all">Todas as Telas</option>
              <option value="welcome">Tela Inicial</option>
              <option value="kiosk_selection">Seleção de Quiosque</option>
              <option value="table_selection">Seleção de Mesa</option>
            </select>
          </div>
          <button type="submit" className="btn btn-prepare" style={{ padding: '10px 24px', whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Criar
          </button>
        </div>
      </form>

      {/* Lista de promoções */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {promos.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 40 }}>
            Nenhuma promoção cadastrada ainda.
          </p>
        ) : promos.map(promo => (
          <div key={promo.id} style={{ background: 'var(--color-surface)', padding: 16, borderRadius: 12, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 16, opacity: promo.isActive ? 1 : 0.5 }}>
            <span style={{ fontSize: 28 }}>{promo.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{promo.title}</div>
              {promo.description && <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{promo.description}</div>}
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
                📍 {screens[promo.screenTarget] || promo.screenTarget} • {promo.isActive ? '✅ Ativa' : '⏸️ Pausada'}
              </div>
            </div>
            <button className="btn" onClick={() => toggleActive(promo)} style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: 8 }} title={promo.isActive ? 'Pausar' : 'Ativar'}>
              {promo.isActive ? <ToggleRight size={20} color="#10B981" /> : <ToggleLeft size={20} color="#6B7280" />}
            </button>
            <button className="btn" onClick={() => handleDelete(promo.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: 8, color: '#EF4444' }} title="Remover">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

function OrderCard({ order, actionLabel, actionClass, actionIcon, onAction }: any) {
  const isOld = new Date().getTime() - new Date(order.createdAt).getTime() > 10 * 60 * 1000;

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="table-badge">Mesa {order.tab.table.number}</span>
        <span className={`time-elapsed ${isOld ? 'warning-pulse' : ''}`}>
          <Clock size={14} /> 
          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <div className="customer-name">
        👤 {order.tab.user.name}
      </div>

      <ul className="order-items">
        {order.items.map((item: any) => (
          <li key={item.id}>
            <span><span className="item-qty">{item.quantity}x</span> {item.product.name}</span>
          </li>
        ))}
      </ul>

      <div className="card-actions">
        <button className={`btn ${actionClass}`} onClick={onAction}>
          {actionIcon} {actionLabel}
        </button>
      </div>
    </div>
  )
}

export default App
