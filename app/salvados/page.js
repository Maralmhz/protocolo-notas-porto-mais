'use client';
import { useEffect, useState } from 'react';
import AuthGate from '../components/AuthGate';
import MenuPrincipal from '../components/MenuPrincipal';

function moeda(v) {
  return (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(d) {
  if (!d) return '-';
  const s = String(d).slice(0, 10);
  const [y, m, dia] = s.split('-');
  return `${dia}/${m}/${y}`;
}

const vazio = {
  evento: '', placa: '', veiculo: '', ano: '', data_indenizacao: '',
  valor_indenizacao: '', valor_venda: '', despesas: '', comprador: '',
  data_venda: '', observacoes: '',
};

export default function SalvadosPage() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vazio);
  const [editId, setEditId] = useState(null);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch('/api/salvados');
      const data = await res.json();
      setLista(Array.isArray(data) ? data : []);
    } catch (e) { setLista([]); }
    setCarregando(false);
  }

  async function salvar(e) {
    e.preventDefault();
    if (editId) {
      await fetch('/api/salvados', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editId }),
      });
      setEditId(null);
    } else {
      await fetch('/api/salvados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(vazio);
    carregar();
  }

  function editar(v) {
    setEditId(v.id);
    setForm({
      evento: v.evento || '',
      placa: v.placa || '',
      veiculo: v.veiculo || '',
      ano: v.ano || '',
      data_indenizacao: v.data_indenizacao ? String(v.data_indenizacao).slice(0, 10) : '',
      valor_indenizacao: v.valor_indenizacao || '',
      valor_venda: v.valor_venda || '',
      despesas: v.despesas || '',
      comprador: v.comprador || '',
      data_venda: v.data_venda ? String(v.data_venda).slice(0, 10) : '',
      observacoes: v.observacoes || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function excluir(id) {
    if (!confirm('Confirma exclusao deste registro?')) return;
    await fetch(`/api/salvados?id=${id}`, { method: 'DELETE' });
    carregar();
  }

  function cancelarEdicao() {
    setEditId(null);
    setForm(vazio);
  }

  function campo(nome, valor) {
    setForm((f) => ({ ...f, [nome]: valor }));
  }

  const filtrados = lista.filter((v) =>
    (v.placa || '').toLowerCase().includes(busca.toLowerCase()) ||
    (v.veiculo || '').toLowerCase().includes(busca.toLowerCase()) ||
    (v.evento || '').toLowerCase().includes(busca.toLowerCase())
  );

  const totalIndenizado = lista.reduce((s, v) => s + Number(v.valor_indenizacao || 0), 0);
  const totalVendido = lista.reduce((s, v) => s + Number(v.valor_venda || 0), 0);
  const totalDespesas = lista.reduce((s, v) => s + Number(v.despesas || 0), 0);
  const liquido = totalVendido - totalDespesas;
  const pct = totalIndenizado > 0 ? (liquido / totalIndenizado) * 100 : 0;

  const btn = (cor) => ({ background: cor, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, marginRight: 4 });
  const inp = { padding: 8, borderRadius: 6, border: '1px solid #ccc' };

  return (
    <AuthGate>
      <div>
        <MenuPrincipal />
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#0B3D91' }}>Controle de Salvados</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, margin: '20px 0' }}>
            <Kpi titulo="Total indenizado" valor={moeda(totalIndenizado)} />
            <Kpi titulo="Total vendido" valor={moeda(totalVendido)} />
            <Kpi titulo="Despesas" valor={moeda(totalDespesas)} />
            <Kpi titulo="Recuperacao liquida" valor={moeda(liquido)} />
            <Kpi titulo="% recuperacao" valor={pct.toFixed(2) + '%'} />
          </div>
          <form onSubmit={salvar} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24, background: editId ? '#fff8e1' : '#f5f5f5', padding: 16, borderRadius: 8, border: editId ? '2px solid #f0a500' : '1px solid #ddd' }}>
            {editId && <div style={{ gridColumn: 'span 4', fontWeight: 'bold', color: '#f0a500' }}>Editando registro ID {editId}</div>}
            <input aria-label="No Evento" placeholder="No Evento" value={form.evento} onChange={(e) => campo('evento', e.target.value)} style={inp} />
            <input aria-label="Placa" placeholder="Placa" value={form.placa} onChange={(e) => campo('placa', e.target.value)} style={inp} />
            <input aria-label="Veiculo" placeholder="Veiculo" value={form.veiculo} onChange={(e) => campo('veiculo', e.target.value)} style={inp} />
            <input aria-label="Ano" placeholder="Ano" value={form.ano} onChange={(e) => campo('ano', e.target.value)} style={inp} />
            <input aria-label="Data indenizacao" type="date" value={form.data_indenizacao} onChange={(e) => campo('data_indenizacao', e.target.value)} style={inp} />
            <input aria-label="Valor indenizacao" type="number" placeholder="Valor indenizacao" value={form.valor_indenizacao} onChange={(e) => campo('valor_indenizacao', e.target.value)} style={inp} />
            <input aria-label="Valor venda" type="number" placeholder="Valor venda" value={form.valor_venda} onChange={(e) => campo('valor_venda', e.target.value)} style={inp} />
            <input aria-label="Despesas" type="number" placeholder="Despesas" value={form.despesas} onChange={(e) => campo('despesas', e.target.value)} style={inp} />
            <input aria-label="Comprador" placeholder="Comprador" value={form.comprador} onChange={(e) => campo('comprador', e.target.value)} style={inp} />
            <input aria-label="Data venda" type="date" value={form.data_venda} onChange={(e) => campo('data_venda', e.target.value)} style={inp} />
            <input aria-label="Observacoes" placeholder="Observacoes" value={form.observacoes} onChange={(e) => campo('observacoes', e.target.value)} style={{ ...inp, gridColumn: 'span 2' }} />
            <div style={{ gridColumn: 'span 4', display: 'flex', gap: 8 }}>
              <button type="submit" style={{ background: '#0B3D91', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 'bold' }}>
                {editId ? 'Salvar edicao' : 'Salvar'}
              </button>
              {editId && <button type="button" onClick={cancelarEdicao} style={{ background: '#999', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer' }}>Cancelar</button>}
            </div>
          </form>
          <input aria-label="Buscar" placeholder="Buscar por placa, veiculo ou evento" value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }} />
          {carregando ? <p>Carregando...</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                <thead>
                  <tr style={{ background: '#0B3D91', color: '#fff' }}>
                    <th style={{ padding: '8px 6px' }}>Evento</th>
                    <th>Placa</th><th>Veiculo</th><th>Indenizacao</th>
                    <th>Venda</th><th>Data Venda</th><th>Despesas</th>
                    <th>Liquido</th><th>Resultado</th><th>% Recup.</th>
                    <th>Comprador</th><th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((v) => {
                    const liq = Number(v.valor_venda || 0) - Number(v.despesas || 0);
                    const resultado = liq - Number(v.valor_indenizacao || 0);
                    const p = v.valor_indenizacao > 0 ? (liq / v.valor_indenizacao) * 100 : 0;
                    return (
                      <tr key={v.id} style={{ borderBottom: '1px solid #ddd', background: editId === v.id ? '#fff8e1' : 'white' }}>
                        <td style={{ padding: '6px 8px' }}>{v.evento}</td>
                        <td>{v.placa}</td><td>{v.veiculo}</td>
                        <td>{moeda(v.valor_indenizacao)}</td>
                        <td>{moeda(v.valor_venda)}</td>
                        <td>{fmtData(v.data_venda)}</td>
                        <td>{moeda(v.despesas)}</td>
                        <td>{moeda(liq)}</td>
                        <td style={{ color: resultado < 0 ? '#C8102E' : 'green' }}>{moeda(resultado)}</td>
                        <td>{p.toFixed(1)}%</td>
                        <td>{v.comprador}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <button onClick={() => editar(v)} style={btn('#0B3D91')}>Editar</button>
                          <button onClick={() => excluir(v.id)} style={btn('#C8102E')}>Excluir</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}

function Kpi({ titulo, valor }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#666' }}>{titulo}</div>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0B3D91' }}>{valor}</div>
    </div>
  );
}
