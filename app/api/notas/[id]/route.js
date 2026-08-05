import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { acao, setor, ...campos } = body;

  if (acao === 'assinar') {
    const [row] = await sql`
      UPDATE notas_fiscais
      SET status = 'Assinado', assinado_por = ${setor}, data_assinatura = NOW()
      WHERE id = ${id} RETURNING *`;
    await sql`INSERT INTO historico_acoes (nota_id, acao, setor) VALUES (${id}, 'Assinado', ${setor})`;
    return Response.json(row);
  }

  const [row] = await sql`
    UPDATE notas_fiscais SET
      data_entrega=${campos.data_entrega}, data_vencimento=${campos.data_vencimento},
      numero_nf=${campos.numero_nf}, fornecedor=${campos.fornecedor},
      observacao=${campos.observacao}, valor=${campos.valor},
      parcelas=${campos.parcelas}, status=${campos.status}
    WHERE id = ${id} RETURNING *`;
  await sql`INSERT INTO historico_acoes (nota_id, acao, setor) VALUES (${id}, 'Editado', ${setor})`;
  return Response.json(row);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (body.pin !== '1010') {
    return Response.json({ error: 'PIN incorreto' }, { status: 403 });
  }

  await sql`DELETE FROM notas_fiscais WHERE id = ${id}`;
  return Response.json({ ok: true });
}
