CREATE TABLE notas_fiscais (
  id SERIAL PRIMARY KEY,
  data_entrega DATE,
  data_vencimento DATE,
  numero_nf TEXT NOT NULL,
  fornecedor TEXT,
  observacao TEXT,
  valor NUMERIC(12,2),
  parcelas TEXT,
  status TEXT DEFAULT 'Pendente',
  criado_por TEXT,
  assinado_por TEXT,
  data_assinatura TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE historico_acoes (
  id SERIAL PRIMARY KEY,
  nota_id INTEGER REFERENCES notas_fiscais(id) ON DELETE CASCADE,
  acao TEXT,
  setor TEXT,
  data_hora TIMESTAMP DEFAULT NOW()
);
