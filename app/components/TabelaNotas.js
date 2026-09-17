'use client';

export default function TabelaNotas({ notas, onEditar, onDeletar, onAtualizar }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Açııes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notas.map((nota) => (
              <tr key={nota.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{nota.numeroNota || nota.numero_nf}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{nota.fornecedor}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{nota.evento}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">R$ {Number(nota.valor || 0).toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{nota.dataEntrega ? new Date(nota.dataEntrega).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{nota.vencimento ? new Date(nota.vencimento).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${nota.assinado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {nota.assinado ? 'Assinado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                  <button onClick={() => onEditar(nota)} className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                  <button onClick={() => onDeletar(nota.id)} className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}