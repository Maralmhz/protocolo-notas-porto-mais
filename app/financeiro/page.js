'use client';
import { useEffect, useState, useMemo } from 'react';
import LoginPin from '../components/LoginPin';
import TabelaFinanceiro from '../components/TabelaFinanceiro';
import ModalLancamento from '../components/ModalLancamento';

const TIPOS_CREDOR = ['fornecedor', 'prestador', 'associado', 'indenizacao', 'acordo', 'oficina', 'outros'];

export default function FinanceiroPage() {
  const [setor, setSetor] = useState(null);
  const [lancamentos, setLancamentos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (setor) carregar();
  }, [setor]);

  async function carregar() {
    const res = await fetch('/api/financeiro');
    const data = await res.json();
    setLancamentos(data);
  }

  async function salvar(form) {
    if (form.id) {
      await fetch(`/api/financeiro/${form.id}`, { method: 'PUT', body: JSON.stringify({ ...form, setor }) });
    } else {
      await fetch('/api/financeiro', { method: 'POST', body: JSON.stringify({ ...form, setor }) });
    }
    setModalAberto(false);
    setEditando(null);
    carregar();
  }

  async function marcarPago(id, dados) {
    await fetch(`/api/financeiro/${id}`, { method: 'PUT', body: JSON.stringify({ acao: 'pagar', setor, ...dados }) });
    carregar();
  }

  async function agendar(id, data_agendada) {
    await fetch(`/api/financeiro/${id}`, { method: 'PUT', body: JSON.stringify({ acao: 'agendar', setor, data_agendada }) });
    carregar();
  }

  function editar(item) {
    setEditando(item);
    setModalAberto(true);
  }

  function novo() {
    setEditando(null);
    setModalAberto(true);
  }

  const filtrados = useMemo(() => {
    return lancamentos.filter((l) => {
      if (filtroTipo !== 'todos' && l.tipo_credor !== filtroTipo) return false;
      if (filtroPrioridade !== 'todas' && l.prioridade !== filtroPrioridade) return false;
      if (filtroStatus !== 'todos' && l.status !== filtroStatus) return false;
      if (busca && !(l.credor || '').toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [lancamentos, filtroTipo, filtroPrioridade, filtroStatus, busca]);

  const hoje = new Date().toISOString().slice(0, 10);
  const vencidos = lancamentos.filter((l) => l.status !== 'pago' && l.data_vencimento < hoje);
  const venceHoje = lancamentos.filter((l) => l.status !== 'pago' && l.data_vencimento === hoje);
  const maxima = lancamentos.filter((l) => l.status !== 'pago' && l.prioridade === 'maxima');
  const totalAberto = lancamentos.filter((l) => l.status !== 'pago').reduce((s, l) => s + Number(l.valor), 0);

  if (!setor) return <LoginPin onLogin={setSetor} />;

  return (
    <div style={{ padding: 24, maxWidth: 1300, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '2px solid #0B3D91',
        }}
      >
        <div>
          <h1 style={{ color: '#0B3D91', margin: 0, fontSize: 26 }}>Financeiro - Urgencias</h1>
          <span style={{ color: '#666', fontSize: 14 }}>Porto Mais</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ color: '#0B3D91', textDecoration: 'none', fontWeight: 'bold' }}>Protocolos</a>
          <span style={{ marginRight: 4 }}>Setor: <b>{setor}</b></span>
          <button onClick={() => setSetor(null)} style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <Cartao titulo="Vencidos" valor={vencidos.length} cor="#C8102E" />
        <Cartao titulo="Vencem hoje" valor={venceHoje.length} cor="#E08E00" />
        <Cartao titulo="Prioridade maxima" valor={maxima.length} cor="#C8102E" />
        <Cartao titulo="Total em aberto" valor={totalAberto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cor="#0B3D91" />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por credor"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}>
          <option value="todos">Todos os tipos</option>
          {TIPOS_CREDOR.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filtroPrioridade} onChange={(e) => setFiltroPrioridade(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}>
          <option value="todas">Todas prioridades</option>
          <option value="maxima">Maxima</option>
          <option value="alta">Alta</option>
          <option value="normal">Normal</option>
        </select>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}>
          <option value="todos">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="agendado">Agendado</option>
          <option value="pago">Pago</option>
        </select>
        <button onClick={novo} style={{ background: '#0B3D91', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>+ Novo lancamento</button>
      </div>
      <TabelaFinanceiro
        itens={filtrados}
        onEditar={editar}
        onPagar={marcarPago}
        onAgendar={agendar}
      />
      {modalAberto && (
        <ModalLancamento
          item={editando}
          tiposCredor={TIPOS_CREDOR}
          onSalvar={salvar}
          onFechar={() => { setModalAberto(false); setEditando(null); }}
        />
      )}
    </div>
  );
}
function Cartao({ titulo, valor, cor }) {
  return (
    <div style={{ background: '#fff', border: `2px solid ${cor}`, borderRadius: 12, padding: 16 }}>
      <div style={{ color: '#666', fontSize: 13 }}>{titulo}</div>
      <div style={{ color: cor, fontSize: 24, fontWeight: 'bold' }}>{valor}</div>
    </div>
  );
}
