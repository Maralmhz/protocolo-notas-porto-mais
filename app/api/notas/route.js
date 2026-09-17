import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM notas_fiscais ORDER BY data_entrega DESC'
    );
    return Response.json(result.rows);
  } finally {
    client.release();
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('POST /api/notas body:', body);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO notas_fiscais (numero_nf, fornecedor, valor) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [body.numero_nf, body.fornecedor, body.valor]
      );
      console.log('Nota criada:', result.rows[0]);
      return Response.json(result.rows[0]);
    } catch (dbError) {
      console.error('Erro no banco:', dbError);
      console.error('Detalhes:', dbError.detail);
      console.error('Hint:', dbError.hint);
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    return Response.json({ 
      error: error.message,
      detail: error.detail,
      hint: error.hint,
      code: error.code 
    }, { status: 500 });
  }
}