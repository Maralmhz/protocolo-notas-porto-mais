'use client';

import React, { useState, useEffect } from 'react';

export default function ModalNota({ nota, setor, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    numero_nf: '',
    fornecedor: '',
    valor: '',
    data_entrega: '',
    data_vencimento: '',
    observacao: '',
    parcelas: '',
  });

  useEffect(() => {
    if (nota) {
      setForm({
        id: nota.id,
        numero_nf: nota.numero_nf || '',
        fornecedor: nota.fornecedor || '',
        valor: nota.valor || '',
        data_entrega: nota.data_entrega || '',
        data_vencimento: nota.data_vencimento || '',
        observacao: nota.observacao || '',
        parcelas: nota.parcelas || '',
      });
    } else {
      setForm({
        numero_nf: '',
        fornecedor: '',
        valor: '',
        data_entrega: '',
        data_vencimento: '',
        observacao: '',
        parcelas: '',
      });
    }
  }, [nota]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSalvar(form);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '560px',
        width: '100%',
        margin: '16px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          {nota ? 'Editar Nota' : 'Nova Nota Fiscal'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Numero NF</label>
              <input
                name="numero_nf"
                value={form.numero_nf}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Fornecedor</label>
              <input
                name="fornecedor"
                value={form.fornecedor}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Valor</label>
              <input
                name="valor"
                type="number"
                step="0.01"
                value={form.valor}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Data de Entrega</label>
              <input
                name="data_entrega"
                type="date"
                value={form.data_entrega}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Data de Vencimento</label>
              <input
                name="data_vencimento"
                type="date"
                value={form.data_vencimento}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Parcelas</label>
              <input
                name="parcelas"
                value={form.parcelas}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                placeholder="Ex: 1/3"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Observacao</label>
              <textarea
                name="observacao"
                value={form.observacao}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                rows={3}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              style={{ flex: 1, backgroundColor: '#0B3D91', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 16px', cursor: 'pointer', fontWeight: '500' }}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onFechar}
              style={{ flex: 1, backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 16px', cursor: 'pointer', fontWeight: '500' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}