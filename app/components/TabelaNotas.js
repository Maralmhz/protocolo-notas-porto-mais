'use client';

function formatarData(data) {
  if (!data) return '-';
  const str = String(data).slice(0, 10);
  const [ano, mes, dia] = str.split('-');
  if (!ano || !mes || !dia) return '-';
  return `${dia}/${mes}/${ano}`;
}

export default function TabelaNotas({ notas, setor, onAssinar, onEditar }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead style={{ background: '#0B3D91', color: '#fff' }}>
          <tr>
            <th>Entrega</th>
            <th>Vencimento</th>
            <th>NF</th>
            <th>Fornecedor</th>
            <th>Observacao</th>
            <th>Valor</th>
            <th>Parcelas</th>
            <th>Status</th>
            <th>Lancado por</th>
            <th>Assinado por</th>
            <th>Acao</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((n) => (
            <tr
              key={n.id}
              style={{
                borderBottom: '1px solid #eee',
                background: n.status === 'Assinado' ? '#eafbe7' : '#fff',
              }}
            >
              <td>{formatarData(n.data_entrega)}</td>
              <td>{formatarData(n.data_vencimento)}</td>
              <td>{n.numero_nf}</td>
              <td>{n.fornecedor}</td>
              <td>{n.observacao}</td>
              <td>R$ {n.valor}</td>
              <td>{n.parcelas}</td>
              <td>{n.status}</td>
              <td>{n.criado_por}</td>
              <td>{n.assinado_por || '-'}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                {setor === 'Financeiro' && n.status !== 'Assinado' && (
                  <button
                    onClick={() => onAssinar(n.id)}
                    style={{ background: '#C8102E', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
                  >
                    Assinar
                  </button>
                )}
                <button
                  onClick={() => onEditar(n)}
                  style={{ background: '#0B3D91', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
