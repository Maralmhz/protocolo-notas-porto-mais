import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  const rows = await sql`SELECT * FROM financeiro_lancamentos ORDER BY prioridade ASC, data_vencimento ASC`;
  return Response.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const {
    credor, tipo_credor, categoria, descricao, valor,
    data_vencimento, prioridade, parcela_atual, total_parcelas,
    setor,
  } = body;

  const [row] = await sql`
    INSERT INTO financeiro_lancamentos
      (credor, tipo_credor, categoria, descricao, valor, data_vencimento,
       prioridade, parcela_atual, total_parcelas, status, criado_por)
    VALUES
      (${credor}, ${tipo_credor}, ${categoria || null}, ${descricao || null}, ${valor},
       ${data_vencimento}, ${prioridade || 'normal'}, ${parcela_atual || 1}, ${total_parcelas || 1},
       'pendente', ${setor})
    RETURNING *`;

  await sql`INSERT INTO financeiro_historico (lancamento_id, acao, setor) VALUES (${row.id}, 'Criado', ${setor})`;

  return Response.json(row);
}
