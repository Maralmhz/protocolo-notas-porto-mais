'use client';
import { useState, useEffect } from 'react';

export default function ModalNota({ nota, setor, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    data_entrega: '',
    data_vencimento: '',
    numero_nf: '',
    fornecedor: '',
    observacao: '',
    valor: '',
    parcelas: '',
    status: 'Pendente',
  });

  useEffect(() => {
    if (nota) setForm(nota);
  }, [nota]);

  function campo(nome, valor) {
    setForm((f) => ({ ...f, [nome]: valor }));
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: 420, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ color: '#0B3D91' }}>{nota ? 'Editar nota' : 'Nova nota fiscal'}</h3>

        <label>Data de entrega</label>
        <input type="date" value={form.data_entrega || ''} onChange={(e) => campo('data_entrega', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />

        <label>Vencimento</label>
        <input type="date" value={form.data_vencimento || ''} onChange={(e) => campo('data_vencimento', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />

        <label>Numero da NF</label>
        <input value={form.numero_nf || ''} onChange={(e) => campo('numero_nf', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />

        <label>Fornecedor</label>
        <input value={form.fornecedor || ''} onChange={(e) => campo('fornecedor', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />

        <label>Observacao</label>
        <input value={form.observacao || ''} onChange={(e) => campo('observacao', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />

        <label>Valor</label>
        <input type="number" value={form.valor || ''} onChange={(e) => campo('valor', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />

        <label>Parcelas</label>
        <input value={form.parcelas || ''} onChange={(e) => campo('parcelas', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />

        {nota && (
          <>
            <label>Status</label>
            <select value={form.status || 'Pendente'} onChange={(e) => campo('status', e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }}>
              <option>Pendente</option>
              <option>Entregue</option>
              <option>Conferido</option>
              <option>Assinado</option>
              <option>Com pendencia</option>
            </select>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => onSalvar(form)} style={{ background: '#C8102E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', flex: 1 }}>
            Salvar
          </button>
          <button onClick={onFechar} style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', flex: 1 }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
