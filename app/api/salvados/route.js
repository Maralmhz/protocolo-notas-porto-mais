import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  await sql`
    CREATE TABLE IF NOT EXISTS salvados (
      id SERIAL PRIMARY KEY,
      evento TEXT,
      placa TEXT,
      veiculo TEXT,
      ano TEXT,
      data_indenizacao DATE,
      valor_indenizacao NUMERIC DEFAULT 0,
      valor_venda NUMERIC DEFAULT 0,
      despesas NUMERIC DEFAULT 0,
      comprador TEXT,
      data_venda DATE,
      observacoes TEXT,
      criado_em TIMESTAMP DEFAULT now()
    )
  `;
  const rows = await sql`SELECT * FROM salvados ORDER BY criado_em DESC`;
  return Response.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const {
    evento, placa, veiculo, ano, data_indenizacao, valor_indenizacao,
    valor_venda, despesas, comprador, data_venda, observacoes,
  } = body;
  const [row] = await sql`
    INSERT INTO salvados (
      evento, placa, veiculo, ano, data_indenizacao, valor_indenizacao,
      valor_venda, despesas, comprador, data_venda, observacoes
    ) VALUES (
      ${evento}, ${placa}, ${veiculo}, ${ano}, ${data_indenizacao || null}, ${valor_indenizacao || 0},
      ${valor_venda || 0}, ${despesas || 0}, ${comprador}, ${data_venda || null}, ${observacoes}
    )
    RETURNING *`;
  return Response.json(row);
}

export async function PUT(req) {
  const body = await req.json();
  const {
    id, evento, placa, veiculo, ano, data_indenizacao, valor_indenizacao,
    valor_venda, despesas, comprador, data_venda, observacoes,
  } = body;
  const [row] = await sql`
    UPDATE salvados SET
      evento = ${evento},
      placa = ${placa},
      veiculo = ${veiculo},
      ano = ${ano},
      data_indenizacao = ${data_indenizacao || null},
      valor_indenizacao = ${valor_indenizacao || 0},
      valor_venda = ${valor_venda || 0},
      despesas = ${despesas || 0},
      comprador = ${comprador},
      data_venda = ${data_venda || null},
      observacoes = ${observacoes}
    WHERE id = ${id}
    RETURNING *`;
  return Response.json(row);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await sql`DELETE FROM salvados WHERE id = ${id}`;
  return Response.json({ ok: true });
}
