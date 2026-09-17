import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM notas_fiscais ORDER BY data_entrega DESC NULLS LAST'
    );
    return Response.json(result.rows);
  } finally {
    client.release();
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO notas_fiscais (numero_nf, fornecedor, valor, data_entrega, data_vencimento, observacao, parcelas) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          body.numero_nf,
          body.fornecedor,
          body.valor,
          body.data_entrega || null,
          body.data_vencimento || null,
          body.observacao || null,
          body.parcelas || null,
        ]
      );
      return Response.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    return Response.json({ error: error.message, detail: error.detail }, { status: 500 });
  }
}