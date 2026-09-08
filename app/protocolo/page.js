'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import AuthGate from '../components/AuthGate';
import TabelaNotas from '../components/TabelaNotas';
import ModalNota from '../components/ModalNota';
import MenuPrincipal from '../components/MenuPrincipal';
export default function ProtocoloPage() {
  const setor = 'Geral';
  const [notas, setNotas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  useEffect(() => {
    carregar();
  }, []);
  async function carregar() {
    const res = await fetch('/api/notas');
    const data = await res.json();
    setNotas(data);
  }
  async function salvar(form) {
    if (form.id) {
      await fetch(`/api/notas/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...form, setor }),
      });
    } else {
      await fetch('/api/notas', {
        method: 'POST',
        body: JSON.stringify({ ...form, setor }),
      });
    }
    setModalAberto(false);
    setNotaEditando(null);
    carregar();
  }
  async function assinar(id) {
    await fetch(`/api/notas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ acao: 'assinar', setor }),
    });
    carregar();
  }
  function editar(nota) {
    setNotaEditando(nota);
    setModalAberto(true);
  }
  function novaNota() {
    setNotaEditando(null);
    setModalAberto(true);
  }
  function exportarCSV() {
    const linhas = [
      ['Entrega', 'Vencimento', 'NF', 'Fornecedor', 'Observacao', 'Valor', 'Parcelas', 'Status', 'Lancado por', 'Assinado por'],
      ...notas.map((n) => [
        n.data_entrega, n.data_vencimento, n.numero_nf, n.fornecedor, n.observacao, n.valor, n.parcelas, n.status, n.criado_por, n.assinado_por,
      ]),
    ];
    const csv = linhas.map((l) => l.map((c) => `"${c ?? ''}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas_fiscais.csv';
    a.click();
  }
  const notasFiltradas = notas.filter((n) =>
    (n.numero_nf || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (n.fornecedor || '').toLowerCase().includes(filtro.toLowerCase())
  );
  return (
    <AuthGate>
      <div>
        <MenuPrincipal />
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/pmais.jpeg"
                  alt="Porto Mais"
                  width={140}
                  height={70}
                  style={{ objectFit: 'contain', width: 'auto', height: 48 }}
                />
              </div>
              <div>
                <h1 style={{ color: '#0B3D91', margin: 0, fontSize: 26 }}>Protocolo de Notas</h1>
                <span style={{ color: '#666', fontSize: 14 }}>Porto Mais</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              placeholder="Buscar por NF ou fornecedor"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
            />
            <button onClick={novaNota} style={{ background: '#0B3D91', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>+ Nova nota</button>
            <button onClick={exportarCSV} style={{ background: '#C8102E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>Exportar CSV</button>
          </div>
          <TabelaNotas notas={notasFiltradas} setor={setor} onAssinar={assinar} onEditar={editar} onExcluir={carregar} />
          {modalAberto && (
            <ModalNota
              nota={notaEditando}
              setor={setor}
              onSalvar={salvar}
              onFechar={() => { setModalAberto(false); setNotaEditando(null); }}
            />
          )}
        </div>
      </div>
    </AuthGate>
  );
}
