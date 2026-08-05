'use client'

import { useState, useEffect } from 'react'
import LoginPin from './components/LoginPin'
import TabelaNotas from './components/TabelaNotas'

export default function Home() {
  const [logado, setLogado] = useState(false)
  const [notas, setNotas] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (logado) {
      buscarNotas()
    }
  }, [logado, refreshKey])

  const buscarNotas = async () => {
    try {
      const response = await fetch('/api/notas')
      const data = await response.json()
      setNotas(data)
    } catch (error) {
      console.error('Erro ao buscar notas:', error)
    }
  }

  const handleLogout = () => {
    setLogado(false)
    setNotas([])
  }

  if (!logado) {
    return <LoginPin onLogin={() => setLogado(true)} />
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Protocolo de Notas Fiscais - Porto Mais</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Sair
          </button>
        </div>

        <TabelaNotas 
          notas={notas} 
          onRefresh={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </main>
  )
}
