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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{nota ? 'Editar Nota' : 'Nova Nota Fiscal'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Numero NF</label>
              <input
                name="numero_nf"
                value={form.numero_nf}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fornecedor</label>
              <input
                name="fornecedor"
                value={form.fornecedor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor</label>
              <input
                name="valor"
                type="number"
                step="0.01"
                value={form.valor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Entrega</label>
              <input
                name="data_entrega"
                type="date"
                value={form.data_entrega}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Vencimento</label>
              <input
                name="data_vencimento"
                type="date"
                value={form.data_vencimento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parcelas</label>
              <input
                name="parcelas"
                value={form.parcelas}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Ex: 1/3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Observacao</label>
              <textarea
                name="observacao"
                value={form.observacao}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}