import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await sql`SELECT * FROM notas_fiscais WHERE id = ${id}`;
    if (rows.length === 0) {
      return Response.json({ error: 'Nota nao encontrada' }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data_entrega, data_vencimento, numero_nf, fornecedor, observacao, valor, parcelas, status } = body;
    const rows = await sql`
      UPDATE notas_fiscais SET
        data_entrega = ${data_entrega},
        data_vencimento = ${data_vencimento},
        numero_nf = ${numero_nf},
        fornecedor = ${fornecedor},
        observacao = ${observacao},
        valor = ${valor},
        parcelas = ${parcelas},
        status = ${status}
      WHERE id = ${id}
      RETURNING *`;
    if (rows.length === 0) {
      return Response.json({ error: 'Nota nao encontrada' }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.pin !== '1010') {
      return Response.json({ error: 'PIN incorreto' }, { status: 403 });
    }
    const rows = await sql`DELETE FROM notas_fiscais WHERE id = ${id} RETURNING *`;
    if (rows.length === 0) {
      return Response.json({ error: 'Nota nao encontrada' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
