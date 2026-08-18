'use client';
import { useState } from 'react';

export default function ModalLancamento({ item, tiposCredor, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    id: item?.id,
    credor: item?.credor || '',
    tipo_credor: item?.tipo_credor || tiposCredor[0],
    categoria: item?.categoria || '',
    descricao: item?.descricao || '',
    valor: item?.valor || '',
    data_vencimento: item?.data_vencimento?.slice(0, 10) || '',
    prioridade: item?.prioridade || 'normal',
    parcela_atual: item?.parcela_atual || 1,
    total_parcelas: item?.total_parcelas || 1,
  });

  function campo(nome, valor) {
    setForm((f) => ({ ...f, [nome]: valor }));
  }

  function confirmar() {
    if (!form.credor || !form.tipo_credor || !form.valor || !form.data_vencimento) {
      alert('Preencha credor, tipo, valor e vencimento.');
      return;
    }
    const totalParcelas = Number(form.total_parcelas) || 1;
    const parcelaAtual = Number(form.parcela_atual) || 1;
    onSalvar({
      ...form,
      total_parcelas: totalParcelas < 1 ? 1 : totalParcelas,
      parcela_atual: parcelaAtual < 1 ? 1 : parcelaAtual,
    });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ color: '#0B3D91', marginTop: 0 }}>{item ? 'Editar lancamento' : 'Novo lancamento'}</h2>

        <Label texto="Credor" />
        <input style={input} value={form.credor} onChange={(e) => campo('credor', e.target.value)} />

        <Label texto="Tipo de credor" />
        <select style={input} value={form.tipo_credor} onChange={(e) => campo('tipo_credor', e.target.value)}>
          {tiposCredor.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <Label texto="Categoria (opcional)" />
        <input style={input} value={form.categoria} onChange={(e) => campo('categoria', e.target.value)} />

        <Label texto="Descricao / observacao" />
        <input style={input} value={form.descricao} onChange={(e) => campo('descricao', e.target.value)} />

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Label texto="Valor (R$)" />
            <input style={input} type="number" step="0.01" value={form.valor} onChange={(e) => campo('valor', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <Label texto="Vencimento" />
            <input style={input} type="date" value={form.data_vencimento} onChange={(e) => campo('data_vencimento', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Label texto="Prioridade" />
            <select style={input} value={form.prioridade} onChange={(e) => campo('prioridade', e.target.value)}>
              <option value="maxima">Maxima</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <Label texto="Parcela atual" />
            <input style={input} type="number" min={1} value={form.parcela_atual} onChange={(e) => campo('parcela_atual', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <Label texto="Total de parcelas" />
            <input style={input} type="number" min={1} value={form.total_parcelas} onChange={(e) => campo('total_parcelas', e.target.value)} />
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
          Exibicao: {form.parcela_atual || 1}/{form.total_parcelas || 1}. Se for pagamento unico, deixe 1/1.
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={onFechar} style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={confirmar} style={{ background: '#0B3D91', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function Label({ texto }) {
  return <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4, marginTop: 8 }}>{texto}</label>;
}

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
};
const modal = {
  background: '#fff', borderRadius: 12, padding: 24, width: 480, maxWidth: '90vw',
  maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,.2)',
};
const input = {
  width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box',
};
