'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ModalNota from '../components/ModalNota';
import ModalLancamento from '../components/ModalLancamento';
import TabelaNotas from '../components/TabelaNotas';
import TabelaFinanceiro from '../components/TabelaFinanceiro';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProtocoloPage() {
  const [modalNotaAberto, setModalNotaAberto] = useState(false);
  const [modalLancamentoAberto, setModalLancamentoAberto] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [dadosFinanceiro, setDadosFinanceiro] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('notas');

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro(null);
      const { data: notas, error: erroNotas } = await supabase.from('notas').select('*').order('data_emissao', { ascending: false });
      if (erroNotas) throw erroNotas;
      setDadosTabela(notas || []);
      const { data: financeiro, error: erroFinanceiro } = await supabase.from('financeiro').select('*').order('data_lancamento', { ascending: false });
      if (erroFinanceiro) throw erroFinanceiro;
      setDadosFinanceiro(financeiro || []);
    } catch (err) {
      console.error('Erro:', err);
      setErro('Erro ao carregar.');
    } finally {
      setCarregando(false);
    }
  }

  function abrirModalNota(nota = null) { setNotaSelecionada(nota); setModalNotaAberto(true); }
  function fecharModalNota() { setModalNotaAberto(false); setNotaSelecionada(null); carregarDados(); }
  function abrirModalLancamento() { setModalLancamentoAberto(true); }
  function fecharModalLancamento() { setModalLancamentoAberto(false); carregarDados(); }

  async function salvarNota(novaNota) {
    try {
      const { error } = await supabase.from('notas').upsert(novaNota);
      if (error) throw error;
      alert('Nota salva!');
      fecharModalNota();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  }

  async function salvarLancamento(novoLancamento) {
    try {
      const { error } = await supabase.from('financeiro').insert(novoLancamento);
      if (error) throw error;
      alert('Lancamento salvo!');
      fecharModalLancamento();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Protocolo - Porto Mais</h1>
            <nav className="flex gap-2 flex-wrap">
              <button onClick={() => setAbaAtiva('notas')} className={`px-4 py-2 rounded ${abaAtiva === 'notas' ? 'bg-white text-blue-600' : 'bg-blue-700'}`}>Notas</button>
              <button onClick={() => setAbaAtiva('financeiro')} className={`px-4 py-2 rounded ${abaAtiva === 'financeiro' ? 'bg-white text-blue-600' : 'bg-blue-700'}`}>Financeiro</button>
              <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-blue-700 rounded">Voltar</button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{erro}</div>}
        {carregando ? <div className="text-center py-8">Carregando...</div> : (
          <>
            {abaAtiva === 'notas' && (
              <div>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h2 className="text-xl font-semibold">Notas</h2>
                  <button onClick={() => abrirModalNota()} className="bg-green-600 text-white px-4 py-2 rounded">+ Nova</button>
                </div>
                <TabelaNotas dados={dadosTabela} onEditar={abrirModalNota} />
              </div>
            )}
            {abaAtiva === 'financeiro' && (
              <div>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h2 className="text-xl font-semibold">Lancamentos</h2>
                  <button onClick={abrirModalLancamento} className="bg-green-600 text-white px-4 py-2 rounded">+ Novo</button>
                </div>
                <TabelaFinanceiro dados={dadosFinanceiro} />
              </div>
            )}
          </>
        )}
      </main>
      {modalNotaAberto && <ModalNota isOpen={modalNotaAberto} onClose={fecharModalNota} nota={notaSelecionada} onSave={salvarNota} />}
      {modalLancamentoAberto && <ModalLancamento isOpen={modalLancamentoAberto} onClose={fecharModalLancamento} onSave={salvarLancamento} />}
    </div>
  );
}
