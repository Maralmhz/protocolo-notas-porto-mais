-- Modulo Financeiro - Porto Mais
-- Tabelas novas, isoladas do modulo de Protocolo de Notas.
-- Nao altera nem remove nenhuma tabela existente.

CREATE TABLE IF NOT EXISTS financeiro_lancamentos (
  id SERIAL PRIMARY KEY,
  credor TEXT NOT NULL,
  tipo_credor TEXT NOT NULL, -- fornecedor | prestador | associado | indenizacao | acordo | oficina | outros
  categoria TEXT,
  descricao TEXT,
  valor NUMERIC(12,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  prioridade TEXT NOT NULL DEFAULT 'normal', -- maxima | alta | normal
  parcela_atual INTEGER NOT NULL DEFAULT 1,
  total_parcelas INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pendente', -- pendente | autorizado | agendado | pago | bloqueado | cancelado
  data_agendada DATE,
  data_pagamento DATE,
  forma_pagamento TEXT,
  comprovante_url TEXT,
  motivo_bloqueio TEXT,
  autorizado_por TEXT,
  data_autorizacao TIMESTAMP,
  pago_por TEXT,
  criado_por TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financeiro_historico (
  id SERIAL PRIMARY KEY,
  lancamento_id INTEGER NOT NULL REFERENCES financeiro_lancamentos(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  setor TEXT,
  observacao TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financeiro_credores (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo_credor TEXT NOT NULL,
  documento TEXT,
  telefone TEXT,
  chave_pix TEXT,
  forma_pagamento_preferida TEXT,
  observacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financeiro_status ON financeiro_lancamentos(status);
CREATE INDEX IF NOT EXISTS idx_financeiro_tipo_credor ON financeiro_lancamentos(tipo_credor);
CREATE INDEX IF NOT EXISTS idx_financeiro_prioridade ON financeiro_lancamentos(prioridade);
CREATE INDEX IF NOT EXISTS idx_financeiro_vencimento ON financeiro_lancamentos(data_vencimento);
