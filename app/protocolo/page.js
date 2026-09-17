import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import ModalNota from '../components/ModalNota';
import TabelaNotas from '../components/TabelaNotas';
import AuthGate from '../components/AuthGate';

export default function Protocolo() {
  const [notas, setNotas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarNotas();
  }, []);

  async function carregarNotas() {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'notas'));
    const notasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotas(notasData);
    setLoading(false);
  }

  async function atualizarNota(id, dados) {
    await updateDoc(doc(db, 'notas', id), dados);
    carregarNotas();
  }

  async function deletarNota(id) {
    await deleteDoc(doc(db, 'notas', id));
    carregarNotas();
  }

  const notasFiltradas = notas.filter(nota =>
    nota.numeroNota?.toLowerCase().includes(filtro.toLowerCase()) ||
    nota.fornecedor?.toLowerCase().includes(filtro.toLowerCase()) ||
    nota.evento?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <AuthGate>
      <main className="min-h-screen bg-gray-50">
        {/* Full width - sem constraints de largura */}
        <div className="w-full">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Protocolo de Notas</h1>
            <p className="text-sm text-gray-600 mt-1">Controle de notas fiscais entre Eventos e Financeiro</p>
          </header>

          <section className="px-6 py-4">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Filtrar por nota, fornecedor ou evento..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button
                onClick={() => { setNotaEditando(null); setModalOpen(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Nova Nota
              </button>
            </div>
          </section>

          <section className="px-6 pb-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Carregando...</div>
            ) : (
              <TabelaNotas
                notas={notasFiltradas}
                onEditar={(nota) => { setNotaEditando(nota); setModalOpen(true); }}
                onDeletar={deletarNota}
                onAtualizar={atualizarNota}
              />
            )}
          </section>
        </div>

        {modalOpen && (
          <ModalNota
            nota={notaEditando}
            onClose={() => setModalOpen(false)}
            aoSalvar={carregarNotas}
          />
        )}
      </main>
    </AuthGate>
  );
}