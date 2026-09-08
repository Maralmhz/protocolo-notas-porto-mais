'use client';
import { useEffect, useState } from 'react';
import AuthGate from '../components/AuthGate';
import MenuPrincipal from '../components/MenuPrincipal';
function moeda(v) {
  return (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
const vazio = {
  evento: '', placa: '', veiculo: '', ano: '', data_indenizacao: '',
  valor_indenizacao: '', valor_venda: '', despesas: '', comprador: '',
  data_venda: '', observacoes: '',
};
export default function SalvadosPage() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vazio);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  useEffect(() => { carregar(); }, []);
  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch('/api/salvados');
      const data = await res.json();
      setLista(Array.isArray(data) ? data : []);
    } catch (e) {
      setLista([]);
    }
    setCarregando(false);
  }
  async function salvar(e) {
    e.preventDefault();
    await fetch('/api/salvados', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setForm(vazio);
    carregar();
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
  const pctRecuperacao = totalIndenizado > 0 ? (liquido / totalIndenizado) * 100 : 0;
  return (
    <AuthGate>
      <div>
        <MenuPrincipal />
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#0B3D91' }}>Controle de Salvados</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, margin: '20px 0' }}>
            <Kpi titulo="Total indenizado" valor={moeda(totalIndenizado)} />
            <Kpi titulo="Total vendido" valor={moeda(totalVendido)} />
            <Kpi titulo="Despesas" valor={moeda(totalDespesas)} />
            <Kpi titulo="Recuperação líquida" valor={moeda(liquido)} />
            <Kpi titulo="% recuperação" valor={pctRecuperacao.toFixed(2) + '%'} />
          </div>
          <form onSubmit={salvar} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24, background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
            <input placeholder="Nº Evento" value={form.evento} onChange={(e) => campo('evento', e.target.value)} />
            <input placeholder="Placa" value={form.placa} onChange={(e) => campo('placa', e.target.value)} />
            <input placeholder="Veículo" value={form.veiculo} onChange={(e) => campo('veiculo', e.target.value)} />
            <input placeholder="Ano" value={form.ano} onChange={(e) => campo('ano', e.target.value)} />
            <input type="date" placeholder="Data indenização" value={form.data_indenizacao} onChange={(e) => campo('data_indenizacao', e.target.value)} />
            <input type="number" placeholder="Valor indenização" value={form.valor_indenizacao} onChange={(e) => campo('valor_indenizacao', e.target.value)} />
            <input type="number" placeholder="Valor venda" value={form.valor_venda} onChange={(e) => campo('valor_venda', e.target.value)} />
            <input type="number" placeholder="Despesas" value={form.despesas} onChange={(e) => campo('despesas', e.target.value)} />
            <input placeholder="Comprador" value={form.comprador} onChange={(e) => campo('comprador', e.target.value)} />
            <input type="date" placeholder="Data venda" value={form.data_venda} onChange={(e) => campo('data_venda', e.target.value)} />
            <input placeholder="Observações" value={form.observacoes} onChange={(e) => campo('observacoes', e.target.value)} style={{ gridColumn: 'span 2' }} />
            <button type="submit" style={{ background: '#0B3D91', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>Salvar</button>
          </form>
          <input
            placeholder="Buscar por placa, veículo ou evento"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
          />
          {carregando ? <p>Carregando...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0B3D91', color: '#fff' }}>
                  <th>Evento</th><th>Placa</th><th>Veículo</th><th>Indenização</th>
                  <th>Venda</th><th>Despesas</th><th>Líquido</th><th>Resultado</th>
                  <th>% Recup.</th><th>Comprador</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((v) => {
                  const liq = Number(v.valor_venda || 0) - Number(v.despesas || 0);
                  const resultado = liq - Number(v.valor_indenizacao || 0);
                  const pct = v.valor_indenizacao > 0 ? (liq / v.valor_indenizacao) * 100 : 0;
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td>{v.evento}</td>
                      <td>{v.placa}</td>
                      <td>{v.veiculo}</td>
                      <td>{moeda(v.valor_indenizacao)}</td>
                      <td>{moeda(v.valor_venda)}</td>
                      <td>{moeda(v.despesas)}</td>
                      <td>{moeda(liq)}</td>
                      <td style={{ color: resultado < 0 ? '#C8102E' : 'green' }}>{moeda(resultado)}</td>
                      <td>{pct.toFixed(1)}%</td>
                      <td>{v.comprador}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
