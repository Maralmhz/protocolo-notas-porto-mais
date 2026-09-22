'use client';

import { useEffect, useState } from 'react';

const vazio = {
  data_entrega: '',
  data_vencimento: '',
  numero_nf: '',
  fornecedor: '',
  observacao: '',
  valor: '',
  parcelas: '',
};

export default function ModalNota({ aberto, isOpen, onClose, nota, onSave }) {
  const visivel = aberto ?? isOpen ?? false;
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!visivel) return;
    setErro('');
    setForm({
      data_entrega: nota?.data_entrega || '',
      data_vencimento: nota?.data_vencimento || '',
      numero_nf: nota?.numero_nf || nota?.nf || '',
      fornecedor: nota?.fornecedor || '',
      observacao: nota?.observacao || '',
      valor: nota?.valor ?? '',
      parcelas: nota?.parcelas ?? '',
    });
  }, [visivel, nota]);

  if (!visivel) return null;

  function alterar(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro('');
    try {
      await onSave({
        ...form,
        ...(nota?.id ? { id: nota.id } : {}),
        valor: form.valor === '' ? null : Number(form.valor),
        parcelas: form.parcelas === '' ? null : Number(form.parcelas),
      });
    } catch (error) {
      setErro(error.message || 'Erro ao salvar nota.');
    } finally {
      setSalvando(false);
    }
  }

  const campo = (name, label, type = 'text') => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span>{label}</span>
      <input name={name} type={type} value={form[name]} onChange={alterar} required={name === 'numero_nf' || name === 'fornecedor'} />
    </label>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <form onSubmit={enviar} style={{ backgroundColor: 'white', borderRadius: 8, padding: 20, width: '100%', maxWidth: 520, display: 'grid', gap: 12, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{nota ? 'Editar Nota' : 'Nova Nota'}</h2>
          <button type="button" onClick={onClose} disabled={salvando}>✕</button>
        </div>
        {erro && <div style={{ color: '#b00020', fontSize: 13 }}>{erro}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {campo('data_entrega', 'Entrega', 'date')}
          {campo('data_vencimento', 'Vencimento', 'date')}
          {campo('numero_nf', 'NF')}
          {campo('fornecedor', 'Fornecedor')}
          {campo('valor', 'Valor', 'number')}
          {campo('parcelas', 'Parcelas', 'number')}
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Observação</span>
          <textarea name="observacao" value={form.observacao} onChange={alterar} rows={3} />
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" onClick={onClose} disabled={salvando}>Cancelar</button>
          <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  );
}
