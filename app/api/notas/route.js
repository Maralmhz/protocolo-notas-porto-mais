import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  const rows = await sql`SELECT * FROM notas_fiscais ORDER BY data_vencimento ASC`;
  return Response.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { data_entrega, data_vencimento, numero_nf, fornecedor, observacao, valor, parcelas, setor } = body;
  const [row] = await sql`
    INSERT INTO notas_fiscais (data_entrega, data_vencimento, numero_nf, fornecedor, observacao, valor, parcelas, criado_por, status)
    VALUES (${data_entrega}, ${data_vencimento}, ${numero_nf}, ${fornecedor}, ${observacao}, ${valor}, ${parcelas}, ${setor}, 'Entregue')
    RETURNING *`;
  await sql`INSERT INTO historico_acoes (nota_id, acao, setor) VALUES (${row.id}, 'Criado', ${setor})`;
  return Response.json(row);
}
