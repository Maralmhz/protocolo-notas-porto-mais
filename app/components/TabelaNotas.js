"use client";

export default function TabelaNotas({ notas = [], onAssinar, onEditar, onExcluir }) {
  const actionCellStyle = {
    position: "sticky",
    right: 0,
    minWidth: "150px",
    backgroundColor: "#fff",
    boxShadow: "-3px 0 6px rgba(0,0,0,0.06)",
    textAlign: "center",
  };

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <table style={{ width: "100%", minWidth: "1150px" }}>
        <thead>
          <tr>
            <th>Protocolo</th>
            <th>Nota</th>
            <th>Associado</th>
            <th>Oficina</th>
            <th>Valor</th>
            <th>Status</th>
            <th
              style={{
                position: "sticky",
                right: 0,
                zIndex: 2,
                minWidth: "150px",
                backgroundColor: "#f8f9fa",
                boxShadow: "-3px 0 6px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td>{nota.protocolo}</td>
              <td>{nota.numeroNota}</td>
              <td>{nota.associado}</td>
              <td>{nota.oficina}</td>
              <td>{nota.valor}</td>
              <td>{nota.status}</td>
              <td style={{ ...actionCellStyle, zIndex: 1 }}>
                <button type="button" onClick={() => onAssinar?.(nota)}>Assinar</button>{" "}
                <button type="button" onClick={() => onEditar?.(nota)}>Editar</button>{" "}
                <button type="button" onClick={() => onExcluir?.(nota)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
