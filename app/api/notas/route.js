import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  const rows = await sql`SELECT * FROM notas_fiscais ORDER BY data_entrega ASC`;
  return Response.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { data_entrega, data_vencimento, numero_nf, fornecedor, observacao, valor, parcelas, setor } = body;
  const [row] = await sql`
    INSERT INTO notas_fiscais (data_entrega, data_vencimento, numero_nf, fornecedor, observacao, valor, parcelas, setor)
    VALUES (${data_entrega}, ${data_vencimento}, ${numero_nf}, ${fornecedor}, ${observacao}, ${valor}, ${parcelas}, ${setor})
    RETURNING *
  `;
  return Response.json(row);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, data_entrega, data_vencimento, numero_nf, fornecedor, observacao, valor, parcelas, status, data_assinatura, assinado_por } = body;
  const [row] = await sql`
    UPDATE notas_fiscais
    SET data_entrega=${data_entrega}, data_vencimento=${data_vencimento}, numero_nf=${numero_nf},
        fornecedor=${fornecedor}, observacao=${observacao}, valor=${valor}, parcelas=${parcelas},
        status=${status}, data_assinatura=${data_assinatura}, assinado_por=${assinado_por}
    WHERE id=${id}
    RETURNING *
  `;
  return Response.json(row);
}

export async function DELETE(req) {
  const { id } = await req.json();
  await sql`DELETE FROM notas_fiscais WHERE id=${id}`;
  return Response.json({ ok: true });
}
