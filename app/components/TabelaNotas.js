'use client'

import { useState, useEffect } from 'react'
import ModalNota from './ModalNota'

export default function TabelaNotas({ notas, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [notaEditando, setNotaEditando] = useState(null)
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [mesFiltro, setMesFiltro] = useState('todos')
  const [excluindoId, setExcluindoId] = useState(null)
  const [pinExclusao, setPinExclusao] = useState('')
  const [erroExclusao, setErroExclusao] = useState('')

  const meses = [
    { valor: '01', nome: 'Janeiro' },
    { valor: '02', nome: 'Fevereiro' },
    { valor: '03', nome: 'Março' },
    { valor: '04', nome: 'Abril' },
    { valor: '05', nome: 'Maio' },
    { valor: '06', nome: 'Junho' },
    { valor: '07', nome: 'Julho' },
    { valor: '08', nome: 'Agosto' },
    { valor: '09', nome: 'Setembro' },
    { valor: '10', nome: 'Outubro' },
    { valor: '11', nome: 'Novembro' },
    { valor: '12', nome: 'Dezembro' },
  ]

  const notasOrdenadas = [...notas].sort((a, b) => {
    const dataA = new Date(a.data_entrada || a.created_at)
    const dataB = new Date(b.data_entrada || b.created_at)
    return dataB - dataA
  })

  const notasFiltradas = notasOrdenadas.filter(nota => {
    const buscaLower = busca.toLowerCase()
    const matchBusca =
      nota.cnpj?.toLowerCase().includes(buscaLower) ||
      nota.numero_nota?.toLowerCase().includes(buscaLower) ||
      nota.valor?.toString().includes(busca) ||
      nota.fornecedor?.toLowerCase().includes(buscaLower) ||
      nota.observacoes?.toLowerCase().includes(buscaLower)

    const matchStatus = statusFiltro === 'todos' || nota.status === statusFiltro

    let matchMes = true
    if (mesFiltro !== 'todos' && nota.data_vencimento) {
      const mesVencimento = nota.data_vencimento.split('-')[1]
      matchMes = mesVencimento === mesFiltro
    }

    return matchBusca && matchStatus && matchMes
  })

  const handleNovaNota = () => {
    setNotaEditando(null)
    setModalOpen(true)
  }

  const handleEditarNota = (nota) => {
    setNotaEditando(nota)
    setModalOpen(true)
  }

  const confirmarExclusao = async () => {
    if (pinExclusao !== '1010') {
      setErroExclusao('PIN incorreto!')
      return
    }

    try {
      const response = await fetch(`/api/notas/${excluindoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pinExclusao }),
      })

      if (response.ok) {
        setExcluindoId(null)
        setPinExclusao('')
        setErroExclusao('')
        onRefresh()
      } else {
        const data = await response.json()
        setErroExclusao(data.error || 'Erro ao excluir')
      }
    } catch (error) {
      setErroExclusao('Erro ao excluir nota')
    }
  }

  const cancelarExclusao = () => {
    setExcluindoId(null)
    setPinExclusao('')
    setErroExclusao('')
  }

  const exportarCSV = () => {
    const headers = ['ID', 'CNPJ', 'Numero Nota', 'Valor', 'Fornecedor', 'Data Emissao', 'Data Vencimento', 'Data Entrada', 'Status', 'Observacoes']
    const csvData = notasFiltradas.map(nota => [
      nota.id,
      nota.cnpj,
      nota.numero_nota,
      nota.valor,
      nota.fornecedor,
      nota.data_emissao,
      nota.data_vencimento,
      nota.data_entrada,
      nota.status,
      nota.observacoes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `notas_fiscais_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatarData = (data) => {
    if (!data) return '-'
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarValor = (valor) => {
    if (!valor) return 'R$ 0,00'
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`
  }

  const StatusBadge = ({ status }) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status || 'pendente'}
      </span>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Buscar por CNPJ, nota, valor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos status</option>
          <option value="pendente">Pendentes</option>
          <option value="entregue">Entregues</option>
          <option value="cancelado">Cancelados</option>
        </select>

        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos meses</option>
          {meses.map(mes => (
            <option key={mes.valor} value={mes.valor}>
              {mes.nome}
            </option>
          ))}
        </select>

        <button
          onClick={exportarCSV}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Exportar CSV
        </button>

        <button
          onClick={handleNovaNota}
          className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
        >
          Nova Nota
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">CNPJ</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Numero</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Valor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Fornecedor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Emissao</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Vencimento</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Entrada</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {notasFiltradas.map((nota) => (
              <tr key={nota.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{nota.cnpj}</td>
                <td className="px-4 py-2 text-sm">{nota.numero_nota}</td>
                <td className="px-4 py-2 text-sm">{formatarValor(nota.valor)}</td>
                <td className="px-4 py-2 text-sm">{nota.fornecedor}</td>
                <td className="px-4 py-2 text-sm">{formatarData(nota.data_emissao)}</td>
                <td className="px-4 py-2 text-sm">{formatarData(nota.data_vencimento)}</td>
                <td className="px-4 py-2 text-sm">{formatarData(nota.data_entrada)}</td>
                <td className="px-4 py-2 text-sm">
                  <StatusBadge status={nota.status} />
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditarNota(nota)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setExcluindoId(nota.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {notasFiltradas.length} de {notas.length} notas
      </div>

      {modalOpen && (
        <ModalNota
          nota={notaEditando}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false)
            onRefresh()
          }}
        />
      )}

      {excluindoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-4 text-gray-700">
              Tem certeza que deseja excluir esta nota fiscal? Esta ação é definitiva e não pode ser desfeita.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite o PIN para confirmar (1010):
              </label>
              <input
                type="password"
                value={pinExclusao}
                onChange={(e) => setPinExclusao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="****"
                maxLength={4}
              />
              {erroExclusao && (
                <p className="mt-2 text-sm text-red-600">{erroExclusao}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelarExclusao}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
