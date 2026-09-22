import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { acao, setor, ...campos } = body;
  try {
    if (acao === 'assinar') {
      const [row] = await sql`
        UPDATE notas_fiscais
        SET status = 'Assinado', assinado = true, assinado_por = ${setor || 'Porto Mais'}, data_assinatura = NOW()
        WHERE id = ${id} RETURNING *`;
      if (!row) return Response.json({ error: 'Nota não encontrada' }, { status: 404 });
      try { await sql`INSERT INTO historico_acoes (nota_id, acao, setor) VALUES (${id}, 'Assinado', ${setor || 'Porto Mais'})`; } catch (historyError) { console.error('Erro ao registrar histórico:', historyError); }
      return Response.json(row);
    }
    const [row] = await sql`
      UPDATE notas_fiscais SET
        data_entrega=${campos.data_entrega || null}, data_vencimento=${campos.data_vencimento || null},
        numero_nf=${campos.numero_nf || campos.nf || null}, fornecedor=${campos.fornecedor || null},
        observacao=${campos.observacao || null}, valor=${campos.valor === '' ? null : campos.valor ?? null},
        parcelas=${campos.parcelas === '' ? null : campos.parcelas ?? null}, status=${campos.status || 'Pendente'}
      WHERE id = ${id} RETURNING *`;
    if (!row) return Response.json({ error: 'Nota não encontrada' }, { status: 404 });
    try { await sql`INSERT INTO historico_acoes (nota_id, acao, setor) VALUES (${id}, 'Editado', ${setor || 'Porto Mais'})`; } catch (historyError) { console.error('Erro ao registrar histórico:', historyError); }
    return Response.json(row);
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (body.pin !== '1010') return Response.json({ error: 'PIN incorreto' }, { status: 403 });
  try {
    const [row] = await sql`DELETE FROM notas_fiscais WHERE id = ${id} RETURNING id`;
    if (!row) return Response.json({ error: 'Nota não encontrada' }, { status: 404 });
    return Response.json({ ok: true, id: row.id });
  } catch (error) {
    console.error('Erro ao excluir nota:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
