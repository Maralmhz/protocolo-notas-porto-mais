'use client';

import React, { useState } from 'react';

export default function TabelaNotas({ notas, onAssinar, onExcluir }) {
  const [excluindoId, setExcluindoId] = useState(null);
  const [pinExclusao, setPinExclusao] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');

  function confirmarExclusao() {
    if (pinExclusao !== '1010') {
      setErroExclusao('PIN incorreto!');
      return;
    }
    onExcluir(excluindoId);
    setExcluindoId(null);
    setPinExclusao('');
    setErroExclusao('');
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Numero NF</th>
            <th className="py-2 px-4 border-b text-left">Fornecedor</th>
            <th className="py-2 px-4 border-b text-left">Valor</th>
            <th className="py-2 px-4 border-b text-left">Data Entrega</th>
            <th className="py-2 px-4 border-b text-left">Data Vencimento</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Observacao</th>
            <th className="py-2 px-4 border-b text-left">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {notas?.map((n) => (
            <tr key={n.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{n.id}</td>
              <td className="py-2 px-4 border-b">{n.numero_nf}</td>
              <td className="py-2 px-4 border-b">{n.fornecedor}</td>
              <td className="py-2 px-4 border-b">{n.valor != null && n.valor !== '' ? `R$ ${parseFloat(n.valor).toFixed(2)}` : 'R$ 0.00'}</td>
              <td className="py-2 px-4 border-b">{n.data_entrega ? new Date(n.data_entrega).toLocaleDateString('pt-BR') : '-'}</td>
              <td className="py-2 px-4 border-b">{n.data_vencimento ? new Date(n.data_vencimento).toLocaleDateString('pt-BR') : '-'}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded ${n.status === 'Assinado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {n.status || 'Pendente'}
                </span>
              </td>
              <td className="py-2 px-4 border-b max-w-xs truncate">{n.observacao}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onAssinar(n.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                  disabled={n.status === 'Assinado'}
                >
                  Assinar
                </button>
                <button
                  onClick={() => {
                    setExcluindoId(n.id);
                    setPinExclusao('');
                    setErroExclusao('');
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {excluindoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirmar Exclusao</h3>
            <p className="mb-4">Digite o PIN para excluir esta nota:</p>
            <input
              type="password"
              maxLength={4}
              value={pinExclusao}
              onChange={(e) => setPinExclusao(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-lg text-center tracking-widest"
              placeholder="****"
              autoFocus
            />
            {erroExclusao && (
              <p className="text-red-600 mb-4">{erroExclusao}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={confirmarExclusao}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirmar exclusao
              </button>
              <button
                onClick={() => {
                  setExcluindoId(null);
                  setPinExclusao('');
                  setErroExclusao('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}