import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

function toDateStr(valor) {
  if (!valor) return null;
  if (typeof valor === 'string') return valor.slice(0, 10);
  if (valor instanceof Date) return valor.toISOString().slice(0, 10);
  return String(valor).slice(0, 10);
}

function proximoVencimento(dataAtual) {
  const dataStr = toDateStr(dataAtual);
  const data = new Date(`${dataStr}T12:00:00`);
  const diaOriginal = data.getDate();
  data.setMonth(data.getMonth() + 1);
  if (data.getDate() !== diaOriginal) {
    data.setDate(0);
  }
  return data.toISOString().slice(0, 10);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { acao, setor, ...campos } = body;

  if (acao === 'pagar') {
    const [row] = await sql`
      UPDATE financeiro_lancamentos
      SET status = 'pago', data_pagamento = ${campos.data_pagamento || new Date().toISOString().slice(0,10)},
      forma_pagamento = ${campos.forma_pagamento || null},
      comprovante_url = ${campos.comprovante_url || null},
      pago_por = ${setor}
      WHERE id = ${id} RETURNING *`;
    await sql`INSERT INTO financeiro_historico (lancamento_id, acao, setor, observacao) VALUES (${id}, 'Pago', ${setor}, ${campos.observacao || null})`;

    if (row && Number(row.parcela_atual) < Number(row.total_parcelas)) {
      try {
        const novoVencimento = proximoVencimento(row.data_vencimento);
        const [novaParcela] = await sql`
          INSERT INTO financeiro_lancamentos (
            credor, tipo_credor, categoria, descricao, valor, data_vencimento,
            prioridade, parcela_atual, total_parcelas, status, criado_por
          ) VALUES (
            ${row.credor}, ${row.tipo_credor}, ${row.categoria}, ${row.descricao}, ${row.valor},
            ${novoVencimento}, ${row.prioridade},
            ${Number(row.parcela_atual) + 1}, ${row.total_parcelas}, 'pendente', ${setor}
          ) RETURNING *`;
        await sql`INSERT INTO financeiro_historico (lancamento_id, acao, setor, observacao) VALUES (${novaParcela.id}, 'Parcela gerada automaticamente', ${setor}, ${'Gerada apos pagamento da parcela ' + row.parcela_atual + '/' + row.total_parcelas})`;
      } catch (err) {
        console.error('Erro ao gerar proxima parcela:', err);
      }
    }

    return Response.json(row);
  }

  if (acao === 'agendar') {
    const [row] = await sql`
      UPDATE financeiro_lancamentos
      SET status = 'agendado', data_agendada = ${campos.data_agendada}
      WHERE id = ${id} RETURNING *`;
    await sql`INSERT INTO financeiro_historico (lancamento_id, acao, setor, observacao) VALUES (${id}, 'Agendado', ${setor}, ${campos.observacao || null})`;
    return Response.json(row);
  }

  if (acao === 'bloquear') {
    const [row] = await sql`
      UPDATE financeiro_lancamentos
      SET status = 'bloqueado', motivo_bloqueio = ${campos.motivo_bloqueio}
      WHERE id = ${id} RETURNING *`;
    await sql`INSERT INTO financeiro_historico (lancamento_id, acao, setor, observacao) VALUES (${id}, 'Bloqueado', ${setor}, ${campos.motivo_bloqueio})`;
    return Response.json(row);
  }

  if (acao === 'autorizar') {
    const [row] = await sql`
      UPDATE financeiro_lancamentos
      SET status = 'autorizado', autorizado_por = ${setor}, data_autorizacao = NOW()
      WHERE id = ${id} RETURNING *`;
    await sql`INSERT INTO financeiro_historico (lancamento_id, acao, setor) VALUES (${id}, 'Autorizado', ${setor})`;
    return Response.json(row);
  }

  const [row] = await sql`
    UPDATE financeiro_lancamentos SET
    credor=${campos.credor}, tipo_credor=${campos.tipo_credor}, categoria=${campos.categoria || null},
    descricao=${campos.descricao || null}, valor=${campos.valor}, data_vencimento=${campos.data_vencimento},
    prioridade=${campos.prioridade}, parcela_atual=${campos.parcela_atual || 1}, total_parcelas=${campos.total_parcelas || 1}
    WHERE id = ${id} RETURNING *`;
  await sql`INSERT INTO financeiro_historico (lancamento_id, acao, setor) VALUES (${id}, 'Editado', ${setor})`;
  return Response.json(row);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (body.pin !== '2020') {
    return Response.json({ error: 'PIN incorreto' }, { status: 403 });
  }
  await sql`DELETE FROM financeiro_lancamentos WHERE id = ${id}`;
  return Response.json({ ok: true });
}
